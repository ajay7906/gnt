const jwtConfig = require('../config/jwt')
const jwt = require('jsonwebtoken')
const employeerAuth = async (req, res, next) => {
    try { 
        //handle the token with bearer
        console.log(jwtConfig.jwt.secret);
        
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