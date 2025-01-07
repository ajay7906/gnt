const jwt = require('jsonwebtoken')
const promisePool = require('../config/config');
const bcrypt = require('bcrypt') 
const secret = 'abcd12'; 
const config = require('../config/config');
exports.adminEmployeeLogin = async (req, res)=>{
    
    
    try {
        const { email, password } = req.body;
       

        const [users] = await promisePool.execute(
            `SELECT * FROM adminsEmployee WHERE email = ?`,
            [email]
        );
        console.log(users);
        

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials 1' });
        }

        const user = users[0];

        if (password.trim() !== user.password.trim()) {
            return res.status(401).json({ message: 'Invalid credentials 3' });
        }
        

        // Direct comparison (not secure for production)
        // if (password !== user.password) {
        //     return res.status(401).json({ message: 'Invalid credentials 2' });
        // }
       
        const token = jwt.sign(
            { id: user.admin_id }, // Use admin_id as the identifier
            config.jwt.secret,
            { expiresIn: '24h' }  
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }




}

exports.createEmployeeection = async (req, res)=>{
    try {
        const { first_name, last_name, email, password, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await promisePool.execute(
            'INSERT INTO employees (first_name, last_name, email, password, phone, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, phone, req.user.id]
        );

        res.status(201).json({
            message: 'Employee created successfully',
            employee_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}



exports.getAllEmployees  = async (req, res)=>{
    try {
        const [employees] = await promisePool.execute('SELECT * FROM employees');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


exports.getAllTaks = async (req, res)=>{
    try {
        const [tasks] = await promisePool.execute('SELECT * FROM tasks');
        res.json(tasks);
        
    } catch (error) {
        res.status(500).json({message:'Server Error'}) 
    }
}


exports.getEmployeeTask = async (req, res)=>{
    try {
        const [tasks] = await promisePool.execute(
            `SELECT t.*, et.assigned_at 
             FROM tasks t 
             JOIN employee_tasks et ON t.task_id = et.task_id 
             WHERE et.employee_id = ?`,
            [req.user.id]
        );

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' }); 
    }
}


exports.createTask =  async (req, res)=>{
    try {
        const { title, description, priority, deadline } = req.body;

        const [result] = await promisePool.execute(
            'INSERT INTO tasks (title, description, priority, deadline, created_by) VALUES (?, ?, ?, ?, ?)',
            [title, description, priority, deadline, req.user.id]
        );

        res.status(201).json({
            message: 'Task created successfully',
            task_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}



exports.assignTaskEmployee = async (req, res)=>{
    try {
        const { task_id, employee_ids } = req.body;
        console.log(req.user.id, task_id, employee_ids);
        

        const connection = await promisePool.getConnection();
        await connection.beginTransaction();

        try {
            for (const employee_id of employee_ids) {
                await connection.execute(
                    'INSERT INTO employee_tasks (employee_id, task_id, assigned_by) VALUES (?, ?, ?)',
                    [employee_id, task_id, req.user.id]
                );
            }

            await connection.commit();
            res.json({ message: 'Task assigned successfully' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


exports.updateTaskToEmployee = async (req, res)=>{
    try {
        const { task_id, status } = req.body;

        await promisePool.execute(
            'UPDATE tasks SET status = ? WHERE task_id = ?',
            [status, task_id]
        );

        res.json({ message: 'Task status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}