// Load environment variable from .env file if not supplied
const path = require('path');
require('dotenv').config({
  path: (typeof process.env.DOTENV_PATH !== 'undefined')
    ? path.resolve(process.cwd(), process.env.DOTENV_PATH)
    : path.resolve(process.cwd(), '.env'),
});

// Load all the stuff we'll need
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Lodash
const _ = require('lodash');

// OIBLIB
const {
  validateOIB,
  validateJMBG,
  generatePossibleOIB,
  generatePossibleJMBG,
} = require('oiblib');

// Misc
/* const colors = */ require('colors');

// Load package.json data (SECURITY WARNING, never use browserify with this)
const pckg = require('./../package.json');

// Load centerText
const centerText = (str) => str;

// Load constants
const {
  ENV_NAME_SERVER_PORT,
  ENV_DEFAULT_SERVER_PORT,
} = {
  ENV_NAME_SERVER_PORT: 'SERVER_PORT',
  ENV_DEFAULT_SERVER_PORT: 8080,
}

// ################################################################################

// A `main` function so that we can use async/await in node ;)
const main = async () => {
  // ################################################################################

  // Clear the console
  console.log(`\x1Bc${Array(80 + 1).join('#').yellow}`);

  // ################################################################################

  const envPath = (typeof process.env.DOTENV_PATH !== 'undefined')
    ? path.resolve(process.cwd(), process.env.DOTENV_PATH)
    : path.resolve(process.cwd(), '.env');

  // Write env state
  console.log(centerText(`Loaded environment state: ${process.env.NODE_ENV}`).bgYellow.black);
  console.log(centerText(`Environment path: ${envPath}`).bgYellow.black);

  console.log(Array(80 + 1).join('#').yellow);

  // ################################################################################

  // Set the port
  const SERVER_PORT = parseInt(_.get(process.env, ENV_NAME_SERVER_PORT, ENV_DEFAULT_SERVER_PORT), 10);

  // Create express app
  const app = express();

  // Disable Express header powered by.
  app.disable('x-powered-by');

  // Cors settings
  app.use(cors());

  // Serve static content
  app.use(express.static(`${__dirname}/../public`));

  // Set the routes
  app.get('/', function (req, res) {

    let outputString = '';
    for (let i = 0; i < 100; i++) {
      const newOIB = generatePossibleOIB();
      outputString += `Generated OIB: ${newOIB}, is valid oib: ${validateOIB(newOIB)}<br/>\n`;
    }

    for (let i = 0; i < 100; i++) {
      const newJMBG = generatePossibleJMBG();
      outputString += `Generated JMBG: ${newJMBG}, is valid jmbg: ${validateJMBG(newJMBG)}<br/>\n`;
    }

    res.send(outputString);
  })

  // Start listening
  app.listen(SERVER_PORT);

  // ################################################################################

  console.log(Array(80 + 1).join('#').yellow);

  // ################################################################################

  console.log(centerText('Everything is up and running! All modules started successfully.').bgGreen.black);

  console.log(Array(80 + 1).join('#').yellow);

  // ################################################################################
};

// Run it!
main()
  .catch((error) => {
    console.log(`Main system error: ${error}`);
  });
