// Simple in-memory store (use database in production)
const codes = new Map();

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { phone } = req.body;
        
        if (!phone) {
            return res.status(400).json({ 
                success: false, 
                error: 'Phone number required' 
            });
        }
        
        // Generate 8-digit code
        const code = Math.floor(10000000 + Math.random() * 90000000).toString();
        const expiresAt = Date.now() + 600000; // 10 minutes
        
        // Store code
        codes.set(code, {
            phone: phone,
            expiresAt: expiresAt,
            createdAt: Date.now()
        });
        
        console.log(`Generated code ${code} for ${phone}`);
        
        // Cleanup old codes
        cleanupExpiredCodes();
        
        res.json({
            success: true,
            code: code,
            phone: phone,
            expiresAt: expiresAt,
            bot: 'DEMO-NXMD',
            format: '8-digit'
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
};

// Cleanup expired codes
function cleanupExpiredCodes() {
    const now = Date.now();
    for (const [code, data] of codes.entries()) {
        if (now > data.expiresAt) {
            codes.delete(code);
        }
    }
}