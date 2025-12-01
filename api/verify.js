const codes = new Map();

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { code, userNumber, botNumber = 'DEMO-NXMD' } = req.body;
        
        if (!code || !userNumber) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing parameters' 
            });
        }
        
        console.log(`Verification attempt: ${userNumber} with code ${code}`);
        
        if (!codes.has(code)) {
            return res.json({ 
                success: false, 
                error: 'Invalid pairing code' 
            });
        }
        
        const codeData = codes.get(code);
        
        // Check if code matches user
        if (codeData.phone !== userNumber) {
            return res.json({ 
                success: false, 
                error: 'Code not assigned to this number' 
            });
        }
        
        // Check expiry
        if (Date.now() > codeData.expiresAt) {
            codes.delete(code);
            return res.json({ 
                success: false, 
                error: 'Code expired' 
            });
        }
        
        // SUCCESS - Pairing verified
        codes.delete(code);
        
        console.log(`✅ Paired ${userNumber} with ${botNumber}`);
        
        res.json({
            success: true,
            message: 'WhatsApp paired successfully with DEMO-NXMD',
            userNumber: userNumber,
            botNumber: botNumber,
            pairedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
};