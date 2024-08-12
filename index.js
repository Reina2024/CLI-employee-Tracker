const { prompt } = require("inquirer"); // Fixed: Use 'prompt' from 'inquirer'
const figlet = require("figlet");
const db = require("./db");

// Initialize the application
init();

function init() {
    // Print the welcome screen
    printWelcomeScreen();
  
    // Load the main prompts
    loadMainPrompts();
}

// Function to print the welcome screen with ASCII art
function printWelcomeScreen() {
    console.log("###############################");
    console.log(
      figlet.textSync("School Board of Grey Brue Employee Tracker ========>", {
        font: 'Star Wars', 
        horizontalLayout: "full",
        verticalLayout: "default",
        width: 100,
        whitespaceBreak: true,
      })
    );
    console.log("###############################");
}

// Function to print the ending screen with ASCII art
function printEndingScreen() {
    console.log("###############################");
    console.log(
      figlet.textSync("School Board of Grey Brue Employee Tracker <========", {
        font: 'Star Wars', 
        horizontalLayout: "full",
        verticalLayout: "default",
        width: 100,
        whitespaceBreak: true,
      })
    );
    console.log("###############################");
}

// Placeholder function for loading main prompts
async function loadMainPrompts() {
    const menu = [
        "Departments",
        "Roles",
        "List all employees",
        "New department",
        "New role",
        "New employee",
        "Update an employee's role",
        "View employees by manager",
        "View employees by department",
        "See Departmental Budget",
    ];

    while (true) {
        const { info } = await prompt([
            {
                type: 'list',
                message: "What Information would you like to see?\n",
                name: "info",
                choices: menu,
            },
        ]);

        switch (info) {
            case "Departments":
                await db.showAllDepartments();
                break;
            case "Roles":
                await db.showAllRoles();
                break;
            case "List all employees":
                await db.showAllEmployees();
                break;
            case "New department":
                const newDept = await collectNewDept();
                await db.addDept(newDept);
                break;
            case "New role":
                const newRole = await collectNewRole(db);
                await db.addRole(newRole);
                break;
            case "New employee":
                const newEmployee = await collectNewEmployee(db);
                await db.addEmployee(newEmployee);
                break;
            case "Update an employee's role":
                const chosenOne = await pickEmployeeRole(db);
                await db.updateEmployeeRole(chosenOne);
                break;
            case "View employees by manager":
                await db.showEmployeeByManager();
                break;
            case "View employees by department":
                await db.showEmployeeByDept();
                break;
            case "See Departmental Budget":
                await db.showUtilizedBudgetByDept();
                break;
            default:
                // Handle unknown options or exit
                console.log("Invalid option selected.");
                break;
        }

    }
}

async function collectNewRole(db) {
    const departments = await db.getDept();
  
    const newRole = await inquire.prompt([
      {
        type: 'input',
        message: "Please type the name of the new role\n",
        name: "title",
        validate: checkInputText
      },
      {
        type: 'input',
        message: "Add the salary of the new role\n",
        name: "salary",
        validate: checkInputNumber
      },
      {
        type: 'list',
        message: "Which department will this new role be in?\n",
        name: "department",
        choices: departments
      }
    ]);
    // console.log(newRole);
    return newRole;
  }
  
  /**
   *  @param {object} db The database instance used by this proejct
   *  @returns {object} contains employee info collected from the user { firstName, lastName, role, manager }
   */
  async function collectNewEmployee(db) {
    const roles = await db.getRole();
    const managers = await db.getEmployee();
  
    const newEmployee = await inquire.prompt([
      {
        type: 'input',
        message: "Enter the first name of the new employee?\n",
        name: "firstName",
        validate: checkInputName
      },
      {
        type: 'input',
        message: "Enter the last name of the new employee?\n",
        name: "lastName",
        validate: checkInputName
      },
      {
        type: 'list',
        message: "What is the role of the new employee?\n",
        name: "role",
        choices: roles
      },
      {
        type: 'list',
        message: "Who manages the new employee?\n",
        name: "manager",
        choices: managers
      }
    ]);
    return newEmployee;
  }
  
