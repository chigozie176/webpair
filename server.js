const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// IMPORTANT: Vercel-specific Socket.io config
const io = socketIo(server, {
  cors: {
    origin: function(origin, callback) {
      // Allow all origins in production for now
      callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Store active codes
const activeCodes = new Map();
const pairedUsers = new Map();

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    users: pairedUsers.size,
    activeCodes: activeCodes.size,
    uptime: process.uptime(),
    serverTime: new Date().toISOString()
  });
});

app.get('/api/check-paired/:phone', (req, res) => {
  const phone = req.params.phone;
  const userData = pairedUsers.get(phone);
  
  if (userData) {
    res.json({
      paired: true,
      botNumber: userData.botNumber,
      pairedAt: userData.pairedAt
    });
  } else {
    res.json({ paired: false });
  }
});

// Bot pairing verification endpoint
app.post('/api/verify-pairing', (req, res) => {
  const { code, botNumber, userNumber } = req.body;
  
  console.log(`🔐 Pairing attempt: ${userNumber} with code ${code}`);
  
  if (!code || !botNumber || !userNumber) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing parameters' 
    });
  }
  
  if (!activeCodes.has(code)) {
    return res.json({ 
      success: false, 
      error: 'Invalid pairing code' 
    });
  }
  
  const codeData = activeCodes.get(code);
  
  if (codeData.phone !== userNumber) {
    return res.json({ 
      success: false, 
      error: 'Code not assigned to this number' 
    });
  }
  
  if (Date.now() > codeData.expiresAt) {
    activeCodes.delete(code);
    return res.json({ 
      success: false, 
      error: 'Code expired. Generate new one.' 
    });
  }
  
  // Pairing successful
  activeCodes.delete(code);
  
  pairedUsers.set(userNumber, {
    botNumber: botNumber,
    pairedAt: Date.now(),
    codeUsed: code
  });
  
  // Notify via socket
  io.emit('pairing_success', {
    phone: userNumber,
    botNumber: botNumber,
    timestamp: Date.now()
  });
  
  console.log(`✅ Paired: ${userNumber} with ${botNumber}`);
  
  res.json({
    success: true,
    message: 'Device paired successfully',
    userNumber: userNumber,
    botNumber: botNumber
  });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('🌐 New client connected:', socket.id);
  
  socket.on('generate_code', (data) => {
    const { phone } = data;
    
    if (!phone || !phone.startsWith('234')) {
      socket.emit('error', { message: 'Invalid phone number format' });
      return;
    }
    
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes
    
    activeCodes.set(code, {
      phone: phone,
      expiresAt: expiresAt,
      createdAt: Date.now(),
      socketId: socket.id
    });
    
    socket.emit('code_generated', {
      code: code,
      phone: phone,
      expiresAt: expiresAt
    });
    
    console.log(`📱 Generated code ${code} for ${phone}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Cleanup expired codes
setInterval(() => {
  const now = Date.now();
  for (const [code, data] of activeCodes.entries()) {
    if (now > data.expiresAt) {
      activeCodes.delete(code);
    }
  }
}, 60000);

// Vercel specific: Handle both server and lambda
const PORT = process.env.PORT || 3000;

if (process.env.VERCEL) {
  // Export for Vercel serverless
  module.exports = app;
} else {
  // Local development
  server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║    ALASTOR-MD Server Running           ║
║    Port: ${PORT}                          ║
║    Mode: ${process.env.NODE_ENV || 'development'}                    ║
╚════════════════════════════════════════╝
    `);
  });
}