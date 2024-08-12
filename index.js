const { prompt } = require("inquirer");
// const logo = require("asciiart-logo");
const figlet = require("figlet");
const db = require("./db");



function printWelcomeScreen() {
    console.log("###############################");
    console.log(
      figlet.textSync("School Booard of Grey Brue Employee Tracker ========>", {
        font: 'Banner3-D',
        horizontalLayout: "full",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
    );
    console.log("###############################");
  }
  
  /**
   *  function printEndingScreen()
   *  Function to print the ending ascii art by node module figlet
   */
  function printEndingScreen() {
    console.log("###############################");
    console.log(
      figlet.textSync("School Booard of Grey Brue Employee Tracker ========>", {
        font: 'Banner3-D',
        horizontalLayout: "full",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
    );
    console.log("###############################");
  }


init();
