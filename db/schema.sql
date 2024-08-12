-- Drop the database named 'employee_tracker_db' if it already exists
DROP DATABASE IF EXISTS employee_tracker_db;

-- Create a new database named 'employee_tracker_db'
CREATE DATABASE employee_tracker_db;

-- Switch to the newly created 'employee_tracker_db' database
\c employee_tracker_db

-- Create a table named 'department' to store department information
CREATE TABLE department (
  id SERIAL PRIMARY KEY,          
  name VARCHAR(225) UNIQUE NOT NULL  
);

-- Create a table named 'role' to store role information
CREATE TABLE role (
  id SERIAL PRIMARY KEY,          -- Unique identifier for each role, automatically incremented
  title VARCHAR(225) UNIQUE NOT NULL,  
  department_id INTEGER NOT NULL,  
  salary DECIMAL NOT NULL,         
  CONSTRAINT fk_department         -- Define a foreign key constraint for 'department_id'
    FOREIGN KEY (department_id)
    REFERENCES department(id)      -- References the 'id' column in the 'department' table
    ON DELETE CASCADE              -- If a department is deleted, automatically delete related roles
);

-- Create a table named 'employee' to store employee information
CREATE TABLE employee (
  id SERIAL PRIMARY KEY,          
  first_name VARCHAR(225) NOT NULL,  -- Employee's first name, cannot be null
  last_name VARCHAR(225) NOT NULL,   -- Employee's last name, cannot be null
  role_id INTEGER NOT NULL,         -- Foreign key referencing the role assigned to the employee
  CONSTRAINT fk_role               
    FOREIGN KEY (role_id)
    REFERENCES role(id)            
    ON DELETE CASCADE             
  , manager_id INTEGER,            -- Optional foreign key referencing the manager of the employee
  CONSTRAINT fk_manager           
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)        -- References the 'id' column in the same 'employee' table
    ON DELETE SET NULL             -- If a manager is deleted, set the 'manager_id' to NULL
);
