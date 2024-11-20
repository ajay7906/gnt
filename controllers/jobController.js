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


exports.getJobs = async (req, res) => {

    try {
        const { department, location } = req.query;
        let query = 'SELECT * FROM jobs WHERE 1=1';
        const params = [];

        if (department && department !== 'All') {
            query += ' AND department = ?';
            params.push(department);
        }

        if (location && location !== 'All') {
            query += ' AND location = ?';
            params.push(location);
        }

        const [jobs] = await promisePool.query(query, params);
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }
}



exports.getJobById = async (req, res) => {
    try {
        const [jobs] = await promisePool.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(jobs[0]);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ message: 'Error fetching job', error: error.message });
    }
}