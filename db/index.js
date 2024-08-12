const pool = require('./connection');
const inquire = require("inquirer");
const validator = require("validator");

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
      console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  },

  async showAllRoles() {
    try {
      const result = await pool.query('SELECT * FROM role');
      console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  },

  async showAllEmployees() {
    try {
      const result = await pool.query('SELECT * FROM employee');
      console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  },

  async addDept(department) {
    try {
      await pool.query('INSERT INTO department (name) VALUES ($1)', [department.title]);
    } catch (error) {
      console.error('Error adding department:', error);
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
    // Implement as needed
  },

  async showEmployeeByDept() {
    // Implement as needed
  },

  async showUtilizedBudgetByDept() {
    // Implement as needed
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
  }
};

module.exports = db;
