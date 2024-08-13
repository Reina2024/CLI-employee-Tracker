-- Drop the database named 'employee_tracker_db' if it already exists
DROP DATABASE IF EXISTS employee_tracker_db;

-- Create a new database named 'employee_tracker_db'
CREATE DATABASE employee_tracker_db;

-- Switch to the newly created 'employee_tracker_db' database
\c employee_tracker_db

CREATE TABLE department (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(255) NOT NULL
);

--create job table/columns --
CREATE TABLE role (
  role_id SERIAL PRIMARY KEY,
  title VARCHAR(255) UNIQUE NOT NULL,
  department_id INTEGER NOT NULL,
  salary DECIMAL NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES department(department_id)
        ON DELETE CASCADE
);

--create employee table/columns--
CREATE TABLE employee (
  employee_id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  role_id INTEGER NOT NULL,
    FOREIGN KEY (role_id)
    REFERENCES role(role_id)
    ON DELETE CASCADE,
  manager_id INTEGER,
  CONSTRAINT fk_manager 
    FOREIGN KEY( manager_id) 
    REFERENCES employee(employee_id) 
    ON DELETE SET NULL
);