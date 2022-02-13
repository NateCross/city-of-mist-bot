const { Client, Intents } = require('discord.js');
const { token } = require('../config.json');

// fs is used for reading and writing JSONs
// that store user data.
// In particular, it is used for the prefix of commands.
const fs = require("fs");

// This colors library is for prettying console output
// Makes the debug console output more pleasing to read
const colors = require('colors');

// Globally defined, so that fs can interact with it
var prefix = "~";

fs.readFile("./src/variables.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
  try {
    const variablesJSON = JSON.parse(jsonString);
    console.log("Successfully read variables.json");
    prefix = variablesJSON.prefix;
  } catch (err) {
    console.log("Error parsing variables.json:", err);
  }
});

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log(`The prefix is: ${prefix}`);
  console.log(`Ready as ${client.user.username}!`.blue.bold);
});

// Handles messages
client.on("messageCreate", function(message) {
  
});



// Login to Discord with your client's token
client.login(token);


