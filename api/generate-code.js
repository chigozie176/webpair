// Store in memory (use Redis in production)
const activeCodes = new Map();

// Cleanup expired codes
setInterval(() => {
    const now = Date.now();
    for (const [code, data] of activeCodes.entries()) {
        if (now > data.expiresAt) {
            activeCodes.delete(code);
        }
    }
}, 60000);

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { phone } = req.body;

        // Validate phone number
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

        // Generate 8-digit code (XXXX-XXXX format)
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
            message: '8-digit code generated successfully'
        });

    } catch (error) {
        console.error('Generate Code Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};