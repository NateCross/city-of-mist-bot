const { Users, Characters } = require('../dbObjects.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    const users = await Users.findAll();
    const characters = await Characters.findAll();
    console.log('Users');
    console.log(users);
    console.log('Characters');
    console.log(characters);
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
