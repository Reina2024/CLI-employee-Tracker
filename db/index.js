const pool = require('./connection'); // Importing the database connection pool
const inquire = require('inquirer'); // Importing inquirer for command line prompts
const validator = require('validator'); // Importing validator for input validation

// Database class for managing database queries
class DB {
  constructor() {}

  // Method to execute SQL queries
  async query(sql, args = []) {
    const client = await pool.connect(); // Acquire a database client from the pool
    try {
      const result = await client.query(sql, args); // Execute the query
      return result; // Return the result of the query
    } finally {
      client.release(); // Release the client back to the pool
    }
  }
}

// Object containing various database operations
const db = {
  // Fetch and display all departments
  async showAllDepartments() {
    try {
      const result = await pool.query('SELECT * FROM department'); // Query to select all departments
      console.table(result.rows); // Display the results in a table format
      return result.rows; // Return the rows
    } catch (error) {
      console.error('Error fetching departments:', error); // Handle errors
    }
  },

  // Fetch and display all roles
  async showAllRoles() {
    try {
      const result = await pool.query('SELECT * FROM role'); // Query to select all roles
      console.table(result.rows); // Display the results in a table format
      return result.rows; // Return the rows
    } catch (error) {
      console.error('Error fetching roles:', error); // Handle errors
    }
  },

  // Fetch and display all employees
  async showAllEmployees() {
    try {
      const result = await pool.query('SELECT * FROM employee'); // Query to select all employees
      console.table(result.rows); // Display the results in a table format
      return result.rows; // Return the rows
    } catch (error) {
      console.error('Error fetching employees:', error); // Handle errors
    }
  },

  // Add a new department
  async addDept(departmentName) {
    try {
      // Check if the department already exists
      const existingDeptResult = await pool.query('SELECT id FROM department WHERE name = $1', [departmentName]);
      if (existingDeptResult.rows.length > 0) {
        console.log(`Department "${departmentName}" already exists.`); // Inform user if the department exists
        return;
      }
      // Insert the new department into the database
      await pool.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
      console.log(`Department "${departmentName}" added successfully.`);
    } catch (error) {
      if (error.code === '23505') {
        console.error(`Error adding department: Department "${departmentName}" already exists.`); // Handle unique constraint error
      } else {
        console.error('Error adding department:', error); // Handle other errors
      }
    }
  },

  // Add a new role
  async addRole(role) {
    try {
      // Insert the new role into the database, linking it to the appropriate department
      await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, (SELECT id FROM department WHERE name = $3))', [role.title, role.salary, role.department]);
    } catch (error) {
      console.error('Error adding role:', error); // Handle errors
    }
  },

  // Add a new employee
  async addEmployee(employee) {
    try {
      // Insert the new employee into the database, linking them to the appropriate role and manager
      await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, (SELECT id FROM role WHERE title = $3), (SELECT id FROM employee WHERE CONCAT(first_name, \' \', last_name) = $4))', [employee.firstName, employee.lastName, employee.role, employee.manager]);
    } catch (error) {
      console.error('Error adding employee:', error); // Handle errors
    }
  },

  // Update an employee's role
  async updateEmployeeRole(data) {
    try {
      // Update the role of the specified employee
      await pool.query('UPDATE employee SET role_id = (SELECT id FROM role WHERE title = $1) WHERE CONCAT(first_name, \' \', last_name) = $2', [data.role, data.name]);
    } catch (error) {
      console.error('Error updating employee role:', error); // Handle errors
    }
  },

  // Show employees by their manager
  async showEmployeeByManager() {
    try {
      // Query to fetch employees and their managers
      const result = await pool.query(`
        SELECT e1.first_name AS employee_first_name, e1.last_name AS employee_last_name, 
               e2.first_name AS manager_first_name, e2.last_name AS manager_last_name
        FROM employee e1
        LEFT JOIN employee e2 ON e1.manager_id = e2.id
        ORDER BY e2.last_name, e1.last_name;
      `);
      console.table(result.rows); // Display the results in a table format
      return result.rows; // Return the rows
    } catch (error) {
      console.error('Error fetching employees by manager:', error); // Handle errors
    }
  },

  // Show employees by department
  async showEmployeeByDept() {
    try {
      // Query to fetch employees and their associated departments
      const result = await pool.query(`
        SELECT e.first_name, e.last_name, d.name AS department
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        ORDER BY d.name, e.last_name;
      `);
      console.table(result.rows); // Display the results in a table format
      return result.rows; // Return the rows
    } catch (error) {
      console.error('Error fetching employees by department:', error); // Handle errors
    }
  },

  // Show the utilized budget by department
  async showUtilizedBudgetByDept() {
    try {
      // Query to calculate the total salary for each department
      const result = await pool.query(`
        SELECT d.name AS department, SUM(r.salary) AS total_budget
        FROM role r
        JOIN department d ON r.department_id = d.id
        GROUP BY d.name
        ORDER BY d.name;
      `);
      console.table(result.rows); // Display the results in a table format
      return result.rows; // Return the rows
    } catch (error) {
      console.error('Error calculating utilized budget by department:', error); // Handle errors
    }
  },

  // Fetch department names for use in prompts
  async getDept() {
    try {
      const result = await pool.query('SELECT name FROM department'); // Query to fetch department names
      return result.rows.map(row => row.name); // Return an array of department names
    } catch (error) {
      console.error('Error fetching departments for role selection:', error); // Handle errors
    }
  },

  // Fetch role titles for use in prompts
  async pickEmployeeRole() {
    try {
      const result = await pool.query('SELECT title FROM role'); // Query to fetch role titles
      return result.rows.map(row => row.title); // Return an array of role titles
    } catch (error) {
      console.error('Error fetching roles for employee creation:', error); // Handle errors
    }
  },

  // Fetch employee names for use in prompts
  async getEmployee() {
    try {
      const result = await pool.query('SELECT CONCAT(first_name, \' \', last_name) AS name FROM employee'); // Query to fetch employee names
      return result.rows.map(row => row.name); // Return an array of employee names
    } catch (error) {
      console.error('Error fetching employees for manager selection:', error); // Handle errors
    }
  },

  // Collect data for a new employee
  async collectNewEmployee() {
    try {
      const roles = await db.pickEmployeeRole(); // Fetch available roles
      const employees = await db.getEmployee(); // Fetch existing employees (for manager selection)
      // Prompt user for new employee details
      const newEmployee = await inquire.prompt([
        {
          type: 'input',
          message: "Enter the first name of the new employee\n",
          name: "firstName",
          validate: checkInputText, // Validate input for first name
        },
        {
          type: 'input',
          message: "Enter the last name of the new employee\n",
          name: "lastName",
          validate: checkInputText, // Validate input for last name
        },
        {
          type: 'list',
          message: "Select the role of the new employee\n",
          name: "role",
          choices: roles, // Provide role choices
        },
        {
          type: 'list',
          message: "Select the manager of the new employee\n",
          name: "manager",
          choices: employees, // Provide manager choices
        },
      ]);
      return newEmployee; // Return the collected employee data
    } catch (error) {
      console.error('Error collecting new employee data:', error); // Handle errors
    }
  },

  // Remove a role by its ID
  async removeRole(roleId) {
    try {
      await pool.query('DELETE FROM role WHERE id = $1', [roleId]); // Delete the role from the database
      console.log(`Role with ID ${roleId} has been removed.`);
    } catch (error) {
      console.error('Error deleting role:', error.message); // Handle errors
      throw error; // Re-throw error after logging
    }
  }
};

module.exports = db; // Export the db object for use in other modules
