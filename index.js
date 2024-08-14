const { prompt } = require("inquirer"); // Importing the prompt function from the inquirer package for interactive command line prompts
const figlet = require("figlet"); // Importing figlet for generating ASCII art text
const db = require("./db"); // Importing the database module for database operations
const validator = require("validator"); // Importing validator for input validation

// Initialize the application
init();

function init() {
    // Print the welcome screen with ASCII art
    printWelcomeScreen();
  
    // Load the main prompts for user interaction
    loadMainPrompts();
}

// Function to print the welcome screen with ASCII art
function printWelcomeScreen() {
    console.log("###############################");
    console.log(
      figlet.textSync("School Board of Grey Brue Employee Tracker ", {
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
      figlet.textSync("School Board of Grey Brue Employee Tracker", {
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
    // Define the menu options for the user
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
        "REMOVE_ROLE", // Added option for role removal
        "Quit" // Option to quit the application
    ];

    while (true) {
        // Prompt the user with a list of menu options
        const { info } = await prompt([
            {
                type: 'list',
                message: "What Information would you like to see?\n",
                name: "info",
                choices: menu,
            },
        ]);

        // Handle the user's choice
        switch (info) {
            case "Departments":
                await db.showAllDepartments(); // Display all departments
                break;
            case "Roles":
                await db.showAllRoles(); // Display all roles
                break;
            case "List all employees":
                await db.showAllEmployees(); // Display all employees
                break;
            case "New department":
                const newDept = await collectNewDept(); // Collect details for a new department
                await db.addDept(newDept); // Add the new department to the database
                break;
            case "New role":
                const newRole = await collectNewRole(); // Collect details for a new role
                await db.addRole(newRole); // Add the new role to the database
                break;
            case "New employee":
                const newEmployee = await collectNewEmployee(); // Collect details for a new employee
                await db.addEmployee(newEmployee); // Add the new employee to the database
                break;
            case "Update an employee's role":
                const chosenOne = await pickEmployeeRole(); // Select an employee to update their role
                await db.updateEmployeeRole(chosenOne); // Update the employee's role in the database
                break;
            case "View employees by manager":
                await db.showEmployeeByManager(); // Display employees organized by manager
                break;
            case "View employees by department":
                await db.showEmployeeByDept(); // Display employees organized by department
                break;
            case "See Departmental Budget":
                await db.showUtilizedBudgetByDept(); // Display the budget utilized by each department
                break;
            case "REMOVE_ROLE":
                await removeRole(); // Remove a role from the database
                break;
            case "Quit":
                printEndingScreen(); // Print the ending screen
                process.exit(); // Exit the application
            default:
                console.log("Invalid option selected."); // Handle invalid options
                break;
        }
    }
}

// Function to collect details for a new department
async function collectNewDept() {
    // Prompt the user for the name of the new department
    const newDept = await prompt([
      {
        type: 'input',
        message: "Enter the name of the new department\n",
        name: "name",
        validate: checkInputText // Validate the input
      }
    ]);
    return newDept;
}

// Function to remove a role from the database
async function removeRole() {
    // Retrieve all roles from the database
    const roles = await db.showAllRoles(); 

    // Prompt the user to select which role to remove
    const roleToRemove = await prompt([
        {
            type: 'list',
            message: "Which role would you like to remove?\n",
            name: "role",
            choices: roles.map(role => ({ name: role.title, value: role.id })) // Map roles to a list of choices
        }
    ]);

    // Confirm the role removal
    const confirmation = await prompt([
        {
            type: 'confirm',
            message: `Are you sure you want to remove the role "${roleToRemove.role}"?`,
            name: 'confirm',
        }
    ]);

    // If confirmed, remove the role from the database
    if (confirmation.confirm) {
        try {
            await db.removeRole(roleToRemove.role); // Call the removeRole method with the selected role ID
            console.log(`Successfully removed the role.`);
        } catch (err) {
            console.error(`Error removing the role: ${err.message}`); // Handle any errors
        }
    } else {
        console.log("Role removal cancelled."); // Inform the user that the removal was cancelled
    }
}

// Validation functions for user input

// Validate input to ensure it is a number
function checkInputNumber(str) {
    if (!validator.isEmpty(str.trim()) && validator.isNumeric(str.trim())) {
      return true;
    }
    return "Please Enter a Number";
}

// Validate input to ensure it is a non-empty text with a maximum length of 25 characters
function checkInputText(str) {
    if (!validator.isEmpty(str.trim()) && str.trim().length < 25) {
      return true;
    }
    return "Please enter up to 25 Characters";
}

// Validate input to ensure it contains a space (for names with first and last names)
function checkInputName(str) {
    if (!validator.contains(str.trim(), [" "])) {
      return true;
    }
    return "Please enter a name";
}
