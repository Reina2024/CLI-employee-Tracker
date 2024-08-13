const pool = require('./connection');
const inquire = require('inquirer');
const validator = require('validator');

class DB {
  constructor() {}

  async query(sql, args = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release();
    }
  }
}

const db = {
  async showAllDepartments() {
    try {
      const result = await pool.query('SELECT * FROM department');
      console.table(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  },

  async showAllRoles() {
    try {
      const result = await pool.query('SELECT * FROM role');
      console.table(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  },

  async showAllEmployees() {
    try {
      const result = await pool.query('SELECT * FROM employee');
      console.table(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  },

  async addDept(departmentName) {
    try {
      const existingDeptResult = await pool.query('SELECT id FROM department WHERE name = $1', [departmentName]);
      if (existingDeptResult.rows.length > 0) {
        console.log(`Department "${departmentName}" already exists.`);
        return;
      }
      await pool.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
      console.log(`Department "${departmentName}" added successfully.`);
    } catch (error) {
      if (error.code === '23505') {
        console.error(`Error adding department: Department "${departmentName}" already exists.`);
      } else {
        console.error('Error adding department:', error);
      }
    }
  },

  async addRole(role) {
    try {
      await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, (SELECT id FROM department WHERE name = $3))', [role.title, role.salary, role.department]);
    } catch (error) {
      console.error('Error adding role:', error);
    }
  },

  async addEmployee(employee) {
    try {
      await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, (SELECT id FROM role WHERE title = $3), (SELECT id FROM employee WHERE CONCAT(first_name, \' \', last_name) = $4))', [employee.firstName, employee.lastName, employee.role, employee.manager]);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  },

  async updateEmployeeRole(data) {
    try {
      await pool.query('UPDATE employee SET role_id = (SELECT id FROM role WHERE title = $1) WHERE CONCAT(first_name, \' \', last_name) = $2', [data.role, data.name]);
    } catch (error) {
      console.error('Error updating employee role:', error);
    }
  },

  async showEmployeeByManager() {
    try {
      const result = await pool.query(`
        SELECT e1.first_name AS employee_first_name, e1.last_name AS employee_last_name, 
               e2.first_name AS manager_first_name, e2.last_name AS manager_last_name
        FROM employee e1
        LEFT JOIN employee e2 ON e1.manager_id = e2.id
        ORDER BY e2.last_name, e1.last_name;
      `);
      console.table(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error fetching employees by manager:', error);
    }
  },

  async showEmployeeByDept() {
    try {
      const result = await pool.query(`
        SELECT e.first_name, e.last_name, d.name AS department
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        ORDER BY d.name, e.last_name;
      `);
      console.table(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error fetching employees by department:', error);
    }
  },

  async showUtilizedBudgetByDept() {
    try {
      const result = await pool.query(`
        SELECT d.name AS department, SUM(r.salary) AS total_budget
        FROM role r
        JOIN department d ON r.department_id = d.id
        GROUP BY d.name
        ORDER BY d.name;
      `);
      console.table(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error calculating utilized budget by department:', error);
    }
  },

  async getDept() {
    try {
      const result = await pool.query('SELECT name FROM department');
      return result.rows.map(row => row.name);
    } catch (error) {
      console.error('Error fetching departments for role selection:', error);
    }
  },

  async pickEmployeeRole() {
    try {
      const result = await pool.query('SELECT title FROM role');
      return result.rows.map(row => row.title);
    } catch (error) {
      console.error('Error fetching roles for employee creation:', error);
    }
  },

  async getEmployee() {
    try {
      const result = await pool.query('SELECT CONCAT(first_name, \' \', last_name) AS name FROM employee');
      return result.rows.map(row => row.name);
    } catch (error) {
      console.error('Error fetching employees for manager selection:', error);
    }
  },

  async collectNewEmployee() {
    try {
      const roles = await db.pickEmployeeRole(); // Ensure this function is defined and returns a list of roles
      const employees = await db.getEmployee(); 
      const newEmployee = await inquire.prompt([
        {
          type: 'input',
          message: "Enter the first name of the new employee\n",
          name: "firstName",
          validate: checkInputText,
        },
        {
          type: 'input',
          message: "Enter the last name of the new employee\n",
          name: "lastName",
          validate: checkInputText,
        },
        {
          type: 'list',
          message: "Select the role of the new employee\n",
          name: "role",
          choices: roles,
        },
        {
          type: 'list',
          message: "Select the manager of the new employee\n",
          name: "manager",
          choices: employees,
        },
      ]);
      return newEmployee;
    } catch (error) {
      console.error('Error collecting new employee data:', error);
    }
  },

  async removeRole(roleId) {
    try {
      await pool.query('DELETE FROM role WHERE id = $1', [roleId]);
      console.log(`Role with ID ${roleId} has been removed.`);
    } catch (error) {
      console.error('Error deleting role:', error.message);
      throw error;
    }
  }
};

module.exports = db;
