const promisePool = require('../config/config');

exports.createJob = async (req, res) => {
    try {
        const { title, location, type, experience, department, description, skills } = req.body;
        const [result] = await promisePool.query(
            'INSERT INTO jobs (title, location, type, experience, department, description, skills) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, location, type, experience, department, description, JSON.stringify(skills)]
        );
        res.status(201).json({
            message: 'Job created successfully',
            jobId: result.insertId
        });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Error creating job', error: error.message });
    }
};