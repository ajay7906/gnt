// // controllers/example.controller.js
// const executeQuery = async (connection, query, params) => {
//     try {
//       const [results] = await connection.execute(query, params);
//       return results;
//     } catch (err) {
//       console.error('Query execution error:', err);
//       throw err;
//     }
//   };
  
//   const exampleController = {
//     getData: async (req, res) => {
//       const connection = req.dbConnection;
//       try {
//         const results = await executeQuery(connection, 'SELECT * FROM example_table');
//         res.json(results);
//       } catch (err) {
//         res.status(500).json({ error: 'Error fetching data' });
//       } finally {
//         connection.release();
//       }
//     }
//   };
  
//   module.exports = exampleController;























// controllers/user.controller.js
const OtpUtil = require('../utils/utils');

const executeQuery = async (connection, query, params) => {
    try {
        const [results] = await connection.execute(query, params);
        return results;
    } catch (err) {
        console.error('Query execution error:', err);
        throw err;
    }
};

const userController = {
    register: async (req, res) => {
        const connection = req.dbConnection;
        try {
            const { name, email, mobile } = req.body;

            // Validate input
            if (!name || !email || !mobile) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Check if user exists
            const existingUsers = await executeQuery(
                connection,
                'SELECT * FROM users WHERE mobile = ? OR email = ?',
                [mobile, email]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({ 
                    message: 'User with this mobile number or email already exists' 
                });
            }

            // Generate OTP
            const otp = OtpUtil.generateOTP();

            // Create user
            const result = await executeQuery(
                connection,
                'INSERT INTO users (name, email, mobile, otp) VALUES (?, ?, ?, ?)',
                [name, email, mobile, otp]
            );

            // Send OTP
            await OtpUtil.sendOTP(mobile, otp);

            res.status(201).json({
                message: 'User registered successfully. Please verify OTP.',
                mobile,
                userId: result.insertId
            });
        } catch (err) {
            console.error('Registration error:', err);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            connection.release();
        }
    },

    verifyOTP: async (req, res) => {
        const connection = req.dbConnection;
        try {
            const { mobile, otp } = req.body;

            if (!mobile || !otp) {
                return res.status(400).json({ message: 'Mobile and OTP are required' });
            }

            // Find user
            const users = await executeQuery(
                connection,
                'SELECT * FROM users WHERE mobile = ?',
                [mobile]
            );

            const user = users[0];

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.otp !== otp) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }

            // Update verification status
            await executeQuery(
                connection,
                'UPDATE users SET is_verified = true, otp = NULL WHERE mobile = ?',
                [mobile]
            );

            res.json({ 
                message: 'OTP verified successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile
                }
            });
        } catch (err) {
            console.error('OTP verification error:', err);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            connection.release();
        }
    },

    resendOTP: async (req, res) => {
        const connection = req.dbConnection;
        try {
            const { mobile } = req.body;

            if (!mobile) {
                return res.status(400).json({ message: 'Mobile number is required' });
            }

            // Find user
            const users = await executeQuery(
                connection,
                'SELECT * FROM users WHERE mobile = ?',
                [mobile]
            );

            const user = users[0];

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Generate and update new OTP
            const newOtp = OtpUtil.generateOTP();
            await executeQuery(
                connection,
                'UPDATE users SET otp = ? WHERE mobile = ?',
                [newOtp, mobile]
            );

            // Send new OTP
            await OtpUtil.sendOTP(mobile, newOtp);

            res.json({ 
                message: 'OTP resent successfully',
                mobile 
            });
        } catch (err) {
            console.error('OTP resend error:', err);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            connection.release();
        }
    },

    getUserProfile: async (req, res) => {
        const connection = req.dbConnection;
        try {
            const { mobile } = req.params;

            if (!mobile) {
                return res.status(400).json({ message: 'Mobile number is required' });
            }

            // Find user
            const users = await executeQuery(
                connection,
                'SELECT id, name, email, mobile, is_verified, created_at FROM users WHERE mobile = ?',
                [mobile]
            );

            const user = users[0];

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ user });
        } catch (err) {
            console.error('Profile fetch error:', err);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            connection.release();
        }
    }
};

module.exports = userController;

// utils/otp.util.js
class OtpUtil {
    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    static async sendOTP(mobile, otp) {
        // Integrate with SMS service provider here
        // This is a mock implementation
        console.log(`Sending OTP: ${otp} to mobile: ${mobile}`);
        return true;
    }
}

module.exports = OtpUtil;