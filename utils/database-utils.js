const { Users } = require('../dbObjects.js');

const createNewUserIfNoExistingEntry = async interaction => {
  if (!await Users.findOne({ where: { user_id: interaction.user.id } })) {
    await Users.create({ user_id: interaction.user.id });

    console.log(`Created User: ${interaction.user.username} ID: ${interaction.user.id}`);
  }
};

module.exports = {
  createNewUserIfNoExistingEntry
};
