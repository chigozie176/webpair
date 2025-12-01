const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Store active codes
const activeCodes = new Map();
const pairedUsers = new Map();

// Cleanup expired codes every minute
setInterval(() => {
    const now = Date.now();
    for (const [code, data] of activeCodes.entries()) {
        if (now > data.expiresAt) {
            activeCodes.delete(code);
        }
    }
}, 60000);

// API Routes
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        users: pairedUsers.size,
        activeCodes: activeCodes.size,
        serverTime: new Date().toISOString(),
        version: '2.0.0',
        botName: 'DEMO-NXMD'
    });
});

app.get('/api/check-paired/:phone', (req, res) => {
    const phone = req.params.phone;
    const userData = pairedUsers.get(phone);
    
    if (userData) {
        res.json({
            paired: true,
            botNumber: userData.botNumber,
            pairedAt: userData.pairedAt,
            codeUsed: userData.codeUsed
        });
    } else {
        res.json({ paired: false });
    }
});

// Generate 8-digit code
app.post('/api/generate-code', (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone || !/^\d+$/.test(phone)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid phone number format'
            });
        }

        // Check for existing active code
        for (const [code, codeData] of activeCodes.entries()) {
            if (codeData.phone === phone && Date.now() < codeData.expiresAt) {
                return res.json({
                    success: true,
                    code: code,
                    phone: phone,
                    expiresAt: codeData.expiresAt,
                    message: 'Using existing active code'
                });
            }
        }

        // Generate 8-digit code
        const code = Math.floor(10000000 + Math.random() * 90000000).toString();
        const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

        // Store code
        activeCodes.set(code, {
            phone: phone,
            expiresAt: expiresAt,
            createdAt: Date.now()
        });

        console.log(`📱 Generated 8-digit code ${code} for ${phone}`);

        res.json({
            success: true,
            code: code,
            phone: phone,
            expiresAt: expiresAt,
            message: '8-digit code generated for DEMO-NXMD'
        });

    } catch (error) {
        console.error('Generate Code Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Verify pairing code
app.post('/api/verify-pairing', (req, res) => {
    try {
        const { code, botNumber, userNumber } = req.body;

        if (!code || !botNumber || !userNumber) {
            return res.status(400).json({
                success: false,
                error: 'Missing parameters'
            });
        }

        console.log(`🔐 Pairing attempt from ${userNumber} with code ${code}`);

        if (!activeCodes.has(code)) {
            return res.json({
                success: false,
                error: 'Invalid 8-digit pairing code'
            });
        }

        const codeData = activeCodes.get(code);

        if (codeData.phone !== userNumber) {
            return res.json({
                success: false,
                error: 'This code was not generated for your number'
            });
        }

        if (Date.now() > codeData.expiresAt) {
            activeCodes.delete(code);
            return res.json({
                success: false,
                error: 'Pairing code has expired'
            });
        }

        // ✅ Successful pairing
        activeCodes.delete(code);
        
        pairedUsers.set(userNumber, {
            botNumber: botNumber,
            pairedAt: Date.now(),
            codeUsed: code,
            pairedWith: 'DEMO-NXMD'
        });

        console.log(`✅ Paired ${userNumber} with ${botNumber}`);

        res.json({
            success: true,
            message: 'Device paired successfully with DEMO-NXMD',
            userNumber: userNumber,
            botNumber: botNumber,
            pairedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Verify Pairing Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║     🚀 ALASTOR-MD PAIRING SERVER                ║
║                                                  ║
║     📡 Port: ${PORT}                              ║
║     🤖 Bot: DEMO-NXMD                           ║
║     🔢 Codes: 8-digit                           ║
║     🌐 URL: http://localhost:${PORT}              ║
║                                                  ║
║     ✅ API Endpoints:                            ║
║     • POST /api/generate-code                    ║
║     • POST /api/verify-pairing                   ║
║     • GET  /api/status                           ║
║     • GET  /api/check-paired/:phone              ║
║                                                  ║
╚══════════════════════════════════════════════════╝
    `);
});