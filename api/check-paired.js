const pairedUsers = new Map();

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const phone = req.query.phone || req.query.number;
    
    if (!phone) {
        return res.status(400).json({ error: 'Phone number required' });
    }
    
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
};