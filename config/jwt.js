require('dotenv').config();

const jwtConfig = {
    jwt: {
        secret: process.env.JWT_SECRET || 'abc123',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
  
};

module.exports = jwtConfig;