const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// fs is used for reading and writing JSONs
// that store user data.
// In particular, it is used for the prefix of commands.
const fs = require("fs");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Commands are attached to client so
// we can access commands in other files
client.commands = new Collection();

// Accesses all js files in the specified folder
const commandFiles = fs.readdirSync('./commands')
                     .filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events')
                   .filter(file => file.endsWith('.js'));

// Registers each js file in the commands folder as a slash command
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// Registers each js file in the events folder as an event to interact with
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Login to Discord with your client's token
client.login(token);
