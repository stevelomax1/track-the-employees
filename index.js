// index.js

const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeManager, viewEmployeesByManager, viewEmployeesByDepartment, deleteDepartment, deleteRole, deleteEmployee, viewDepartmentBudget } = require('./queries');

const mainMenu = async () => {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Manager',
                'View Employees By Manager',
                'View Employees By Department',
                'Delete Department',
                'Delete Role',
                'Delete Employee',
                'View Department Budget',
                'Exit'
            ]
        }
    ]);

    switch (action) {
        case 'View All Departments':
            await viewDepartments();
            break;
        case 'View All Roles':
            await viewRoles();
            break;
        case 'View All Employees':
            await viewEmployees();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Employee Manager':
            await updateEmployeeManager();
            break;
        case 'View Employees By Manager':
            await viewEmployeesByManager();
            break;
        case 'View Employees By Department':
            await viewEmployeesByDepartment();
            break;
        case 'Delete Department':
            await deleteDepartment();
            break;
        case 'Delete Role':
            await deleteRole();
            break;
        case 'Delete Employee':
            await deleteEmployee();
            break;
        case 'View Department Budget':
            await viewDepartmentBudget();
            break;
        case 'Exit':
            process.exit();
    }

    mainMenu();
};

mainMenu();
