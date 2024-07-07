// queries.js

const mysql = require('mysql2/promise');
const inquirer = require('inquirer');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '4Maxfam5',
    database: 'employee_db'
});

const viewDepartments = async () => {
    const [rows] = await connection.query('SELECT * FROM department');
    console.table(rows);
};

const viewRoles = async () => {
    const [rows] = await connection.query('SELECT * FROM role');
    console.table(rows);
};

const viewEmployees = async () => {
    const [rows] = await connection.query('SELECT * FROM employee');
    console.table(rows);
};

const addDepartment = async () => {
    const { name } = await inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter the name of the department:'
        }
    ]);
    await connection.query('INSERT INTO department (name) VALUES (?)', [name]);
    console.log(`Added department ${name}`);
};

const addRole = async () => {
    const departments = await connection.query('SELECT * FROM department');
    const { title, salary, department_id } = await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the role:'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary of the role:'
        },
        {
            name: 'department_id',
            type: 'list',
            message: 'Select the department:',
            choices: departments[0].map(dept => ({ name: dept.name, value: dept.id }))
        }
    ]);
    await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, department_id]);
    console.log(`Added role ${title}`);
};

const addEmployee = async () => {
    const roles = await connection.query('SELECT * FROM role');
    const employees = await connection.query('SELECT * FROM employee');
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'Enter the first name of the employee:'
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'Enter the last name of the employee:'
        },
        {
            name: 'role_id',
            type: 'list',
            message: 'Select the role:',
            choices: roles[0].map(role => ({ name: role.title, value: role.id }))
        },
        {
            name: 'manager_id',
            type: 'list',
            message: 'Select the manager:',
            choices: [{ name: 'None', value: null }, ...employees[0].map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))]
        }
    ]);
    await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [first_name, last_name, role_id, manager_id]);
    console.log(`Added employee ${first_name} ${last_name}`);
};

const updateEmployeeManager = async () => {
    const employees = await connection.query('SELECT * FROM employee');
    const { employee_id, manager_id } = await inquirer.prompt([
        {
            name: 'employee_id',
            type: 'list',
            message: 'Select the employee:',
            choices: employees[0].map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
        },
        {
            name: 'manager_id',
            type: 'list',
            message: 'Select the new manager:',
            choices: [{ name: 'None', value: null }, ...employees[0].map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))]
        }
    ]);
    await connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [manager_id, employee_id]);
    console.log(`Updated employee's manager`);
};

const viewEmployeesByManager = async () => {
    const managers = await connection.query('SELECT * FROM employee WHERE manager_id IS NULL');
    const { manager_id } = await inquirer.prompt([
        {
            name: 'manager_id',
            type: 'list',
            message: 'Select the manager:',
            choices: managers[0].map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id }))
        }
    ]);
    const [rows] = await connection.query('SELECT * FROM employee WHERE manager_id = ?', [manager_id]);
    console.table(rows);
};

const viewEmployeesByDepartment = async () => {
    const departments = await connection.query('SELECT * FROM department');
    const { department_id } = await inquirer.prompt([
        {
            name: 'department_id',
            type: 'list',
            message: 'Select the department:',
            choices: departments[0].map(dept => ({ name: dept.name, value: dept.id }))
        }
    ]);
    const [rows] = await connection.query(
        `SELECT e.id, e.first_name, e.last_name, r.title
        FROM employee e
        JOIN role r ON e.role_id = r.id
        WHERE r.department_id = ?`,
        [department_id]
    );
    console.table(rows);
};

const deleteDepartment = async () => {
    const departments = await connection.query('SELECT * FROM department');
    const { department_id } = await inquirer.prompt([
        {
            name: 'department_id',
            type: 'list',
            message: 'Select the department to delete:',
            choices: departments[0].map(dept => ({ name: dept.name, value: dept.id }))
        }
    ]);
    await connection.query('DELETE FROM department WHERE id = ?', [department_id]);
    console.log(`Deleted department`);
};

const deleteRole = async () => {
    const roles = await connection.query('SELECT * FROM role');
    const { role_id } = await inquirer.prompt([
        {
            name: 'role_id',
            type: 'list',
            message: 'Select the role to delete:',
            choices: roles[0].map(role => ({ name: role.title, value: role.id }))
        }
    ]);
    await connection.query('DELETE FROM role WHERE id = ?', [role_id]);
    console.log(`Deleted role`);
};

const deleteEmployee = async () => {
    const employees = await connection.query('SELECT * FROM employee');
    const { employee_id } = await inquirer.prompt([
        {
            name: 'employee_id',
            type: 'list',
            message: 'Select the employee to delete:',
            choices: employees[0].map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
        }
    ]);
    await connection.query('DELETE FROM employee WHERE id = ?', [employee_id]);
    console.log(`Deleted employee`);
};

const viewDepartmentBudget = async () => {
    const departments = await connection.query('SELECT * FROM department');
    const { department_id } = await inquirer.prompt([
        {
            name: 'department_id',
            type: 'list',
            message: 'Select the department:',
            choices: departments[0].map(dept => ({ name: dept.name, value: dept.id }))
        }
    ]);
    const [rows] = await connection.query(
        `SELECT SUM(r.salary) AS budget
        FROM employee e
        JOIN role r ON e.role_id = r.id
        WHERE r.department_id = ?`,
        [department_id]
    );
    console.table(rows);
};

module.exports = {
    viewDepartments,
    viewRoles,
    viewEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeManager,
    viewEmployeesByManager,
    viewEmployeesByDepartment,
    deleteDepartment,
    deleteRole,
    deleteEmployee,
    viewDepartmentBudget
};
