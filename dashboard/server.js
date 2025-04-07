const express = require('express');
const path = require('path');
const { getFileByFolderName } = require('./src/server/googledrivePipe.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to get file by folder name
app.get('/api/folder/:folderId', async (req, res) => {
  try {
    const data = await getFileByFolderName(req.params.folderId);
    res.json(data);
  } catch (error) {
    console.error('Error in /api/folder endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// For production, serve static files from the build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 