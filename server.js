// Import required modules
const express = require('express');
const { Client } = require('whatsapp-web.js');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

// Setup WhatsApp Client
const client = new Client();
client.on('qr', qr => {
    console.log('QR Code:', qr);
});
client.on('ready', () => {
    console.log('WhatsApp is ready!');
});
client.initialize();

// Endpoint to send video/music on WhatsApp
app.get('/send', (req, res) => {
    const { name, type } = req.query;
    
    if (!name || !type) {
        return res.status(400).send('Please provide name and type.');
    }

    try {
        if (type === 'music') {
            const stream = ytdl(name, { filter: 'audioonly' });
            client.sendMessage('<Your-WhatsApp-Number>', { audio: stream });
        } else if (type === 'video') {
            const stream = ytdl(name, { filter: 'videoandaudio' });
            client.sendMessage('<Your-WhatsApp-Number>', { video: stream });
        }
        res.send('Music/Video sent to WhatsApp!');
    } catch (error) {
        res.status(500).send('Error in processing the request');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
