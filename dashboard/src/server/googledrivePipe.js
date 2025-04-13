const { google } = require('googleapis');
const { parse } = require('csv-parse/sync');
const fs = require('fs').promises;
const path = require('path');

const cacheFilePath = path.join(__dirname, 'fileCache.json');
const filePath = path.join(__dirname, 'count.json');

// Function to increment the count in the JSON file
async function incrementCount() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    jsonData.count += 1;
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log('Count incremented successfully! New count:', jsonData.count);
    return jsonData.count;
  } catch (err) {
    console.error('Error incrementing count:', err);
    throw err;
  }
}

// Function to read the count from the JSON file
async function readCount() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData.count;
  } catch (err) {
    console.error('Error reading or parsing file:', err);
    throw err;
  }
}

// Function to check if the cache file exists
async function checkCacheFile() {
  try {
    await fs.access(cacheFilePath);
    return true;
  } catch {
    return false;
  }
}

// Load cache from file if it exists
async function loadCache() {
  try {
    const exists = await checkCacheFile();
    if (exists) {
      const data = await fs.readFile(cacheFilePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.error('Error loading cache:', err);
    throw err;
  }
}

// Initialize cache
let cache = [];
loadCache()
  .then(data => {
    cache = data;
  })
  .catch(err => {
    console.error('Error initializing cache:', err);
  });

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'deep-mark-421119-d6b7a348b287.json'),
    scopes: ['https://www.googleapis.com/auth/drive']
});

// Implement retry logic
async function retryRequest(requestFn, maxRetries = 5) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await requestFn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            const waitTime = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}

// Function to get file content from Google Drive
async function getFileContent(fileId) {
    try {
        const authClient = await auth.getClient();
        const drive = google.drive({ version: 'v3', auth: authClient });
        const res = await retryRequest(() => drive.files.get({
            fileId: fileId,
            alt: 'media'
        }, { 
            responseType: 'text',
            timeout: 30000
        }));

        const fileContent = res.data;
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });

        return records;
    } catch (error) {
        console.error(`Error fetching or parsing file content: ${error.message}`);
        throw error;
    }
}

// Updated function to get file content by folder name with recursive search
async function getFileByFolderName(folderName) {
    try {
        const authClient = await auth.getClient();
        const drive = google.drive({ version: 'v3', auth: authClient });
        
        // First, find the folder by name
        const folderRes = await retryRequest(() => drive.files.list({
            q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
            fields: 'files(id, name)',
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
            timeout: 30000
        }));
        
        if (!folderRes.data.files || folderRes.data.files.length === 0) {
            throw new Error(`Folder '${folderName}' not found`);
        }
        
        const folderId = folderRes.data.files[0].id;
        
        // Recursive function to search for the file in a folder and its subfolders
        async function findFileInFolder(currentFolderId, depth = 0, maxDepth = 5) {
            if (depth > maxDepth) return null; // Prevent infinite recursion
            
            // First, try to find the file directly in this folder
            const filesRes = await retryRequest(() => drive.files.list({
                q: `'${currentFolderId}' in parents and name='transcript_backbiter.csv'`,
                fields: 'files(id, name)',
                supportsAllDrives: true,
                includeItemsFromAllDrives: true,
                timeout: 30000
            }));
            
            // If file found, return it
            if (filesRes.data.files && filesRes.data.files.length > 0) {
                return {
                    fileId: filesRes.data.files[0].id,
                    fileName: filesRes.data.files[0].name
                };
            }
            
            // If not found, look for subfolders
            const foldersRes = await retryRequest(() => drive.files.list({
                q: `'${currentFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
                fields: 'files(id, name)',
                supportsAllDrives: true,
                includeItemsFromAllDrives: true,
                timeout: 30000
            }));
            
            // Search in each subfolder
            if (foldersRes.data.files && foldersRes.data.files.length > 0) {
                for (const folder of foldersRes.data.files) {
                    const result = await findFileInFolder(folder.id, depth + 1, maxDepth);
                    if (result) return result;
                }
            }
            
            return null; // File not found in this branch
        }
        
        // Start the recursive search
        const fileInfo = await findFileInFolder(folderId);
        
        if (!fileInfo) {
            throw new Error(`No 'transcript_backbiter.csv' file found in folder '${folderName}' or its subfolders`);
        }
        
        // Get content of the found file
        const content = await getFileContent(fileInfo.fileId);
        
        return {
            folder_name: folderName,
            file_name: fileInfo.fileName,
            file_id: fileInfo.fileId,
            content: content
        };
    } catch (error) {
        console.error(`Error fetching file by folder name: ${error.message}`);
        throw error;
    }
}

// Function to list all files from Google Drive with caching
async function listAllFiles(query) {
    try {
        const authClient = await auth.getClient();
        const drive = google.drive({ version: 'v3', auth: authClient });

        if (cache.length === 0) {
            let files = [];
            let pageToken = null;

            do {
                // Use retry logic for file listing
                const res = await retryRequest(() => drive.files.list({
                    q: query,
                    fields: 'nextPageToken, files(id, name, parents)',
                    supportsAllDrives: true,
                    includeItemsFromAllDrives: true,
                    pageToken: pageToken,
                    timeout: 30000
                }));

                files = files.concat(res.data.files);
                pageToken = res.data.nextPageToken;

            } while (pageToken);
            await fs.writeFile(cacheFilePath, JSON.stringify(files, null, 2));
            return files;
        }

        return cache;
    } catch (error) {
        console.error(`Error listing files: ${error.message}`);
        throw error;
    }
}

  // get conversation id
async function getGrandparentFolderName(folderId) {
    const drive = google.drive({ version: 'v3', auth: await auth.getClient() });
    try {
      // Retry logic for fetching the parent folder
      const parentRes = await retryRequest(() => drive.files.get({
        fileId: folderId,
        fields: 'id, name, parents',
        supportsAllDrives: true,
        timeout: 30000
      }));
  
      const parentFolderId = parentRes.data.parents ? parentRes.data.parents[0] : null;
  
      if (!parentFolderId) {
        throw new Error('No parent folder found for the given folder ID.');
      }
  
      // Retry logic for fetching the grandparent folder
      const grandparentRes = await retryRequest(() => drive.files.get({
        fileId: parentFolderId,
        fields: 'id, name, parents',
        supportsAllDrives: true,
        timeout: 30000
      }));
  
      const grandparentFolderId = grandparentRes.data.parents ? grandparentRes.data.parents[0] : null;
  
      if (!grandparentFolderId) {
        throw new Error('No grandparent folder found for the given parent folder ID.');
      }
  
      // Retry logic for fetching the grandparent folder name
      const grandparentNameRes = await retryRequest(() => drive.files.get({
        fileId: grandparentFolderId,
        fields: 'name',
        supportsAllDrives: true,
        timeout: 30000
      }));
  
      return grandparentNameRes.data.name;
    } catch (error) {
      console.error('Error retrieving grandparent folder name:', error.message);
      throw error;
    }
  }

// Function to get a specific file based on the count
async function getFile(fileNumber) {
    try {
        await auth.getAccessToken();
        const allFiles = await listAllFiles("name = 'transcript_backbiter.csv'");
        if (!allFiles || allFiles.length === 0) {
            throw new Error('No files found with the specified query.');
        }
        let count = await readCount();
        let increment = true;
        if (fileNumber || fileNumber == 0){
          count = fileNumber;
          increment = false
          console.log(`navigate to file[${fileNumber}]`)
        }
        // changed for dense subset
        // allFiles.length
        if (count >= 200) {
            const data = await fs.readFile(filePath, 'utf8');
            const jsonData = JSON.parse(data);
            jsonData.count = 0;
            await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
            // Reset count and start over from beginning
            // count = 0;
            console.log('Count reset to 0 - starting over from beginning');
        }

        const file = {
            count_no: count,
            info: allFiles[count],
            content: await getFileContent(allFiles[count].id),
            file_id: await getGrandparentFolderName(allFiles[count].id)
        };
        if (increment){
          await incrementCount();
        }
        return file;
    } catch (error) {
        console.error(`Error fetching file: ${error.message}`);
        throw error;
    }
}

// Create Express router for Google Drive endpoints
const express = require('express');
const router = express.Router();

// GET endpoint to retrieve a file by count number
router.get('/file/:fileNumber?', async (req, res) => {
    try {
        const fileNumber = req.params.fileNumber ? parseInt(req.params.fileNumber) : undefined;
        const file = await getFile(fileNumber);
        res.json(file);
    } catch (error) {
        console.error('Error in /file endpoint:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET endpoint to retrieve a file by folder name
router.get('/folder/:folderName', async (req, res) => {
    try {
        const folderName = req.params.folderName;
        const file = await getFileByFolderName(folderName);
        res.json(file);
    } catch (error) {
        console.error('Error in /folder endpoint:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    getFile,
    getFileByFolderName,
    router
};