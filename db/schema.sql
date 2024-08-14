-- Drop the database named 'employee_tracker_db' if it already exists
DROP DATABASE IF EXISTS employee_tracker_db;

-- Create a new database named 'employee_tracker_db'
CREATE DATABASE employee_tracker_db;

-- Switch to the newly created 'employee_tracker_db' database
\c employee_tracker_db

-- Create a table named 'department' to store department information
CREATE TABLE department (
    id SERIAL PRIMARY KEY, -- Automatically incrementing unique identifier for each department
    name VARCHAR(225) UNIQUE NOT NULL -- Department name, must be unique and cannot be null
);

-- Create a table named 'role' to store role information
CREATE TABLE role (
    id SERIAL PRIMARY KEY, -- Automatically incrementing unique identifier for each role
    title VARCHAR(225) UNIQUE NOT NULL, -- Role title, must be unique and cannot be null
    department_id INTEGER NOT NULL, -- Foreign key linking to the department
    salary DECIMAL NOT NULL, -- Salary associated with the role
    -- Foreign key constraint linking 'department_id' to 'department(id)'
    CONSTRAINT fk_department FOREIGN KEY (department_id)
        REFERENCES department(id) ON DELETE CASCADE
);

-- Create a table named 'employee' to store employee information
CREATE TABLE employee (
    id SERIAL PRIMARY KEY, -- Automatically incrementing unique identifier for each employee
    first_name VARCHAR(225) NOT NULL, -- Employee's first name, cannot be null
    last_name VARCHAR(225) NOT NULL, -- Employee's last name, cannot be null
    role_id INTEGER NOT NULL, -- Foreign key linking to the role
    manager_id INTEGER, -- Foreign key linking to the manager (can be null if no manager)
    -- Foreign key constraint linking 'role_id' to 'role(id)'
    CONSTRAINT fk_role FOREIGN KEY (role_id)
        REFERENCES role(id) ON DELETE CASCADE,
    -- Foreign key constraint linking 'manager_id' to 'employee(id)'
    CONSTRAINT fk_manager FOREIGN KEY (manager_id)
        REFERENCES employee(id) ON DELETE SET NULL
);
