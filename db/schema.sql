-- Drop the database named 'employee_tracker_db' if it already exists
DROP DATABASE IF EXISTS employee_tracker_db;

-- Create a new database named 'employee_tracker_db'
CREATE DATABASE employee_tracker_db;

-- Switch to the newly created 'employee_tracker_db' database
\c employee_tracker_db

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(225) UNIQUE NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(225) UNIQUE NOT NULL,
    department_id INTEGER NOT NULL,
    salary DECIMAL NOT NULL,
    CONSTRAINT fk_department FOREIGN KEY (department_id)
        REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(225) NOT NULL,
    last_name VARCHAR(225) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    CONSTRAINT fk_role FOREIGN KEY (role_id)
        REFERENCES role(id) ON DELETE CASCADE,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id)
        REFERENCES employee(id) ON DELETE SET NULL
);
