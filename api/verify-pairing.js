const activeCodes = new Map();
const pairedUsers = new Map();

module.exports = async (req, res) => {
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
        const { code, botNumber, userNumber } = req.body;

        if (!code || !botNumber || !userNumber) {
            return res.status(400).json({
                success: false,
                error: 'Missing parameters'
            });
        }

        console.log(`🔐 Pairing attempt: ${userNumber} with 8-digit code ${code}`);

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
                error: 'Code expired'
            });
        }

        // ✅ Successful pairing
        activeCodes.delete(code);
        
        pairedUsers.set(userNumber, {
            botNumber: botNumber,
            pairedAt: Date.now(),
            codeUsed: code
        });

        console.log(`✅ Paired: ${userNumber} with ${botNumber}`);

        return res.json({
            success: true,
            message: 'Device paired successfully',
            userNumber: userNumber,
            botNumber: botNumber,
            pairedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};