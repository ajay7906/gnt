const jwt = require('jsonwebtoken')
const promisePool = require('../config/config');
const bcrypt = require('bcrypt') 
const secret = 'abcd12'; 
const jwtConfig = require('../config/jwt')
exports.adminEmployeeLogin = async (req, res)=>{
    
    
    try {
        const { email, password } = req.body;
       console.log(  jwtConfig.jwt.secret);
       

        const [users] = await promisePool.execute(
            `SELECT * FROM adminsEmployee WHERE email = ?`,
            [email]
        );
      
        

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
            jwtConfig.jwt.secret,
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


// exports.getAllTaks = async (req, res)=>{
//     try {
//         const [tasks] = await promisePool.execute('SELECT * FROM tasks');
//         res.json(tasks);
        
//     } catch (error) {
//         res.status(500).json({message:'Server Error'}) 
//     }
// }

exports.getAllTaks = async (req, res)=>{
    try {
        console.log('Query Params:', req.query);

        // Check if 'all' parameter is passed in the query
        const showAll = req.query.all === 'true';

        if (showAll) {
            const [tasks] = await pool.execute('SELECT * FROM tasks');
            return res.json({ tasks, totalTasks: tasks.length });
        }

        // Extract page and limit from query parameters, defaulting to 1 and 7
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 7;

        // Calculate offset for pagination
        const offset = (page - 1) * limit;


        // Use the values directly in the query string instead of prepared statements
        const [tasks] = await pool.execute(
            `SELECT * FROM tasks LIMIT ${limit} OFFSET ${offset}`
        );

        const [[{ count: totalTasks }]] = await pool.execute(
            'SELECT COUNT(*) as count FROM tasks'
        );

        console.log({ tasks, totalTasks });

        // Send response with tasks and pagination metadata
        res.json({
            tasks,
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server Error' });
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


// exports.createTask =  async (req, res)=>{
//     try {
//         const { title, description, priority, deadline } = req.body;

//         const [result] = await promisePool.execute(
//             'INSERT INTO tasks (title, description, priority, deadline, created_by) VALUES (?, ?, ?, ?, ?)',
//             [title, description, priority, deadline, req.user.id]
//         );

//         res.status(201).json({
//             message: 'Task created successfully',
//             task_id: result.insertId
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// } 









exports.createTask = async (req, res) => {
    try {
        const { title, description, priority, deadline } = req.body;
         // Log the destructured values
         console.log('Destructured values:', { title, description, priority, deadline }); // Log the destructured values
        
        
        // Validate required fields
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        // Validate priority enum values
        // const validPriorities = ['low', 'medium', 'high'];
        // if (priority && !validPriorities.includes(priority)) {
        //     return res.status(400).json({ message: 'Invalid priority value' });
        // }
        // Validate and normalize priority case
        const validPriorities = ['low', 'medium', 'high'];
        const normalizedPriority = priority ? priority.toLowerCase() : 'medium';
        
        if (!validPriorities.includes(normalizedPriority)) {
            return res.status(400).json({ message: 'Invalid priority value' });
        }

        // Validate deadline format
        if (deadline && !isValidDate(deadline)) {
            return res.status(400).json({ message: 'Invalid deadline format' });
        }

        // Check if user is authenticated
        // if (!req.user || !req.user.id) {
        //     return res.status(401).json({ message: 'User not authenticated' });
        // }  
        const queryParams = [
            title,
            description || null,  // If description is undefined, use null
            normalizedPriority,
            deadline || null,     // If  is undefined, use null
            req.user.id
        ];

        // Log the final query parameters
        console.log('Query parameters:', queryParams);

        const [result] = await promisePool.execute(
            'INSERT INTO tasks (title, description, priority, deadline, created_by) VALUES (?, ?, ?, ?, ?)',
            // [title, description, priority || 'medium', deadline, req.user.id]
            queryParams
        );

        res.status(201).json({
            message: 'Task created successfully',
            task_id: result.insertId
        });
    } catch (error) {
        console.error('Task creation error:', error);  // Add this line for debugging
        res.status(500).json({ 
            message: 'Server error',
            error: error.message  // Add this in development environment only
        });
    }
};

// Helper function to validate date
function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}





//employee login
// Employee login specific endpoint (alternative approach)
exports.employeeLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get employee from database
        const [employees] = await promisePool.execute(
            `SELECT * FROM employees WHERE email = ?`,
            [email]
        );

        if (employees.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const employee = employees[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(password, employee.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            {
                id: employee.employee_id,
                role: 'employee',
                email: employee.email
            },
            jwtConfig.jwt.secret,
            { expiresIn: '24h' }
        );

        // Send response
        res.json({
            token,
            user: {
                id: employee.employee_id,
                email: employee.email,
                role: 'employee',
                firstName: employee.first_name,
                lastName: employee.last_name
            }
        });

    } catch (error) {
        console.error('Employee login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};














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