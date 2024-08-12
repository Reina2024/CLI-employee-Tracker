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

