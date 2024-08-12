const { prompt } = require("inquirer");
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
function loadMainPrompts() {
    // Implement the function to load prompts here
    console.log("Loading main prompts...");
}
