import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors({ origin: '*' }));   // Allow all origins
app.use(express.json());

const PORT = 3000;

// Simple status page so http://localhost:3000 doesn't show "Cannot GET /"
app.get('/', (req, res) => {
  res.send(`
    <h1>✅ Roblox Dox Backend is Running</h1>
    <p>Go to your roblox-dox.html file and use it.</p>
    <p>Backend ready at http://localhost:3000</p>
  `);
});

// Proxy all Roblox API requests
app.all('/api/*', async (req, res) => {
  try {
    let targetUrl = req.url.replace('/api/', 'https://');
    
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    };

    if (req.method === 'POST' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    const data = await response.text();

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy failed", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Roblox Dox Backend running on http://localhost:${PORT}`);
});