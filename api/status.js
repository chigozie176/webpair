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
    
    res.json({
        status: 'online',
        users: pairedUsers.size,
        serverTime: new Date().toISOString(),
        version: '1.0.0'
    });
};