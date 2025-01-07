
const employeerAuth = async (req, res, next) => {
    try { 
        //handle the token with bearer
        const token = req.headers.authorization.split(' ')[1]; 
        console.log(token);
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};   


module.export = employeerAuth;