// Import the 'Pool' class from the 'pg' (node-postgres) module for managing PostgreSQL connections
const { Pool } = require("pg");

// Create a new Pool instance for managing a pool of database connections
const pool = new Pool({
  host: "localhost",              // Host where the PostgreSQL server is running (default is 'localhost')
  user: "postgres",               // Username to authenticate with the PostgreSQL server
  password: "rootroot",           // Password for the specified user
  database: "employee_tracker_db", // Name of the database to connect to
  port: 5432,                     // Port number on which the PostgreSQL server is listening (default is 5432)
});

// Export the pool instance so it can be used in other parts of the application
module.exports = pool;
