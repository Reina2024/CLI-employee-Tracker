const { prompt } = require("inquirer"); 
const figlet = require("figlet");
const db = require("./db"); 
const validator = require("validator");


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
      figlet.textSync("School Board of Grey Brue Employee Tracker =============>", {
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
      figlet.textSync("School Board of Grey Brue Employee Tracker <==============", {
        font: 'Star Wars', 
        horizontalLayout: "full",
        verticalLayout: "default",
        width: 100,
        whitespaceBreak: true,
      })
    );
    console.log("###############################");
}

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
        "REMOVE_ROLE", // Added option for removal
        "Quit" // Added quit option
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
                const newRole = await collectNewRole();
                await db.addRole(newRole);
                break;
            case "New employee":
                const newEmployee = await collectNewEmployee();
                await db.addEmployee(newEmployee);
                break;
            case "Update an employee's role":
                const chosenOne = await pickEmployeeRole();
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
            case "REMOVE_ROLE":
                await removeRole(); // Ensure this function is defined
                break;
            case "Quit":
                printEndingScreen();
                process.exit(); // Exit the application
            default:
                console.log("Invalid option selected.");
                break;
        }
    }
}

// Function to collect details for a new department
async function collectNewDept() {
    const newDept = await prompt([
      {
        type: 'input',
        message: "Enter the name of the new department\n",
        name: "name",
        validate: checkInputText 
      }
    ]);
    return newDept;
}

async function removeRole() {
  const roles = await db.showAllRoles(); // Retrieve all roles
  
  const roleToRemove = await prompt([
      {
          type: 'list',
          message: "Which role would you like to remove?\n",
          name: "role",
          choices: roles.map(role => ({ name: role.title, value: role.id })) // Pass role ID as the value
      }
  ]);

  // Confirm removal
  const confirmation = await prompt([
      {
          type: 'confirm',
          message: `Are you sure you want to remove the role "${roleToRemove.role}"?`,
          name: 'confirm',
      }
  ]);

  // If confirmed, remove the role
  if (confirmation.confirm) {
      try {
          await db.removeRole(roleToRemove.role); // Call the removeRole method with the role ID
          console.log(`Successfully removed the role.`);
      } catch (err) {
          console.error(`Error removing the role: ${err.message}`);
      }
  } else {
      console.log("Role removal cancelled.");
  }
}


// Validation
function checkInputNumber(str) {
    if (!validator.isEmpty(str.trim()) && validator.isNumeric(str.trim())) {
      return true;
    }
    return "Please Enter a Number";
  }
  
  
  function checkInputText(str) {
    if (!validator.isEmpty(str.trim()) && str.trim().length < 25) {
      return true;
    }
    return "Please enter upto 25 Characters";
  }
  
  
  function checkInputName(str) {
    if (!validator.contains(str.trim(), [" "])) {
      return true;
    }
    return "Please enter a name";
  }
  
  