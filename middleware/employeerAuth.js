const jwtConfig = require('../config/config')
const employeerAuth = async (req, res, next) => {
    try { 
        //handle the token with bearer
        const secret = 'abcd12';
        const token = req.headers.authorization.split(' ')[1]; 
        console.log(token);
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, jwtConfig.jwt.secret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};   


module.exports = employeerAuth;