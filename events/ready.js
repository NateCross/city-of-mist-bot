const { Users, Characters, Statuses } = require('../dbObjects.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    const users = await Users.findAll();
    const characters = await Characters.findAll();
    const statuses = await Statuses.findAll();
    console.log('Users');
    console.log(users);
    console.log('Characters');
    console.log(characters);
    console.log('Statuses');
    console.log(statuses);
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
