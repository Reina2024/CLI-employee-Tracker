-- Use the correct database
\c employee_tracker_db;

-- Insert departments
INSERT INTO department (name) VALUES 
    ('Teachers'),
    ('Principals'),
    ('Vice Principals'),
    ('Central Board Officer'),
    ('Superintendent'),
    ('Finance'),
    ('Diversity and Equity');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES 
    ('Elementary Teacher', 65000, (SELECT id FROM department WHERE name = 'Teachers')),
    ('Middle School Principal', 102000, (SELECT id FROM department WHERE name = 'Principals')),
    ('Middle School VP', 100000, (SELECT id FROM department WHERE name = 'Vice Principals')),
    ('SSO', 95000, (SELECT id FROM department WHERE name = 'Central Board Officer')),
    ('Superintendent of Kinder Programming', 150000, (SELECT id FROM department WHERE name = 'Superintendent')),
    ('CFO', 155000, (SELECT id FROM department WHERE name = 'Finance')),
    ('Director of Diversity and Equity', 203000, (SELECT id FROM department WHERE name = 'Diversity and Equity'));

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
    ('Reina', 'Simms', (SELECT id FROM role WHERE title = 'Elementary Teacher'), NULL),
    ('Omar', 'Simms', (SELECT id FROM role WHERE title = 'Elementary Teacher'), (SELECT id FROM employee WHERE first_name = 'Reina' AND last_name = 'Simms')),
    ('Crystal', 'Moore', (SELECT id FROM role WHERE title = 'Elementary Teacher'), (SELECT id FROM employee WHERE first_name = 'Reina' AND last_name = 'Simms')),
    ('Melissa', 'Pitts', (SELECT id FROM role WHERE title = 'Middle School Principal'), NULL),
    ('Kemi', 'Fergi', (SELECT id FROM role WHERE title = 'Middle School Principal'), (SELECT id FROM employee WHERE first_name = 'Melissa' AND last_name = 'Pitts')),
    ('Debra', 'Hagans', (SELECT id FROM role WHERE title = 'Middle School VP'), NULL),
    ('Ray', 'Chambers', (SELECT id FROM role WHERE title = 'Middle School VP'), (SELECT id FROM employee WHERE first_name = 'Debra' AND last_name = 'Hagans')),
    ('Steve', 'Jones', (SELECT id FROM role WHERE title = 'SSO'), NULL),
    ('Chris', 'Smith', (SELECT id FROM role WHERE title = 'SSO'), (SELECT id FROM employee WHERE first_name = 'Steve' AND last_name = 'Jones')),
    ('Marry', 'Dunn', (SELECT id FROM role WHERE title = 'Superintendent of Kinder Programming'), NULL),
    ('Jenny', 'Jones', (SELECT id FROM role WHERE title = 'Superintendent of Kinder Programming'), (SELECT id FROM employee WHERE first_name = 'Marry' AND last_name = 'Dunn')),
    ('Mark', 'Marky', (SELECT id FROM role WHERE title = 'CFO'), NULL),
    ('Shandie', 'Rodgers', (SELECT id FROM role WHERE title = 'Director of Diversity and Equity'), NULL),
    ('Candy', 'Willison', (SELECT id FROM role WHERE title = 'Director of Diversity and Equity'), (SELECT id FROM employee WHERE first_name = 'Shandie' AND last_name = 'Rodgers'));
