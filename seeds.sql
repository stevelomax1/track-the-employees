-- seeds.sql

USE employee_db;

INSERT INTO department (name) VALUES ('Engineering'), ('Management'), ('Finance');

INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 80000, 1),
('Project Manager', 90000, 2),
('Accountant', 70000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Steve', 'Lomax', 1, NULL),
('Raven', 'Lomax', 2, NULL),
('Paris', 'Lomax', 3, NULL),
('Aleah', 'Lomax', 1, 1),
('Miles', 'Lomax', 2, 2);
