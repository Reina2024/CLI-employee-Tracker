-- Use the correct database
\c employee_tracker_db;

-- Insert departments
INSERT INTO department (name)
VALUES 
    ('Teachers'),
    ('Principals'),
    ('Vice Principals'),
    ('Central Board Officer'),
    ('Superintendent'),
    ('Finance'),
    ('Diversity and Equity');

-- Insert roles
INSERT INTO role (title, salary, department_id)
VALUES 
    ('Elementary Teacher', 65000, 2),
    ('Middle School Principal', 102000, 3),
    ('Middle School VP', 100000, 4),
    ('SSO', 95000, 5),
    ('Superintendent of Kinder Programming', 150000, 6),
    ('CFO', 155000, 7),
    ('Director of Diversity and Equity', 203000, 8);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Reina', 'Simms', 1, 3),
    ('Omar', 'Simms', 1, 3),
    ('Crystal', 'Moore', 1, 3),
    ('Melissa', 'Pitts', 2, 6),
    ('Kemi', 'Fergi', 2, 6),
    ('Debra', 'Hagans', 3, 3),
    ('Ray', 'Chambers', 3, 3),
    ('Steve', 'Jones', 4, 8),
    ('Chris', 'Smith', 4, 8),
    ('Marry', 'Dunn', 5, 5),
    ('Jenny', 'Jones', 5, 5),
    ('Mark', 'Marky', 6, 5),
    ('Shandie', 'Rodgers', 7, 5),
    ('Candy', 'Willison', 7, 5);
