\c employee_tracker_db;

INSERT INTO department(id, name)
VALUES (2,'Teachers'),
       (3,'Principals'),
       (4,'Vice Principals'),
       (5,'Central Board Officer'),
       (6,'Superintendent'),
       (7,'Finance'),
       (8,'Diverstiy and Equity'),
      

INSERT INTO role(title, salary, department_id)
VALUES 
('Elementary Teacher', 65000, 2),
('Middle School Principal', 102000, 3),
('Middle School VP', 100000, 4),
('SS0,', 95000, 5),
('Superintendent of Kinder Programming', 150000, 6),
('CFO', 155000, 7),
('Director of Diversity and Equity' 203000, 8),

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES 
('Reina', 'Simms', 2,3),
('Omar','Simms', 2,3),
('Crystal', 'Moore', 2,3),
('Melissa', 'Pitts', 3,6),
('Kemi' , 'Fergi', 3,6),
('Debra', 'Hagans', 4,3),
('Ray', 'Chambers', 4 ,3),
('Steve', 'Jones', 5, 8),
('Chris', 'Smith', 5, 8),
('Marry', 'Dunn', 6, NULL),
('Jenny', 'Jones', 6, NULL),
('Mark', 'Marky', 7 , NULL),
('Shandie', 'Rodgers', 8, NULL),
('Candy', 'Willison', 8, NULL);
