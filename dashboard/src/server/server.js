const express = require('express');
const cors = require('cors');
const path = require('path');
const { getFile, getFileByFolderName } = require('./googledrivePipe');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/file', async (req, res) => {
  try {
    const file = await getFile(undefined);
    res.json(file);
  } catch (error) {
    console.error('Error in /api/file endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/file/:fileNumber', async (req, res) => {
  try {
    const fileNumber = parseInt(req.params.fileNumber);
    const file = await getFile(fileNumber);
    res.json(file);
  } catch (error) {
    console.error('Error in /api/file endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/folder/:folderName', async (req, res) => {
  try {
    const folderName = req.params.folderName;
    const file = await getFileByFolderName(folderName);
    res.json(file);
  } catch (error) {
    console.error('Error in /api/folder endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from the React build directory in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build directory
  app.use(express.static(path.join(__dirname, '../../dist')));

  // For any request that doesn't match an API route, serve the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 