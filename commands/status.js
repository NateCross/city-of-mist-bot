const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users, Characters, Statuses } = require('../dbObjects.js');
const { createNewUserIfNoExistingEntry } = require('../utils/database-utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Manage the statuses of your character')
    .addSubcommand(sub =>
      sub
        .setName('add')
        .setDescription('Add a status to your current character')
        .addStringOption(opt =>
          opt
            .setName('name')
            .setDescription('Name of the status')
            .setRequired(true))
        .addIntegerOption(opt =>
          opt
            .setName('value')
            .setDescription('Value of the status')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub
        .setName('delete')
        .setDescription('Delete a status from your current character')
        .addStringOption(opt =>
          opt
            .setName('name')
            .setDescription('Name of the status')
            .setRequired(true)))
      ,
  // TODO: Finish the status commands after setting up the models
  async execute(interaction) {
    createNewUserIfNoExistingEntry(interaction);

    const user = await Users.findOne({ where: { user_id: interaction.user.id } });
    const subcommand = interaction.options.getSubcommand();

    try {
      const currentCharacter = user.current_character;
    } catch (e) {
      console.log(e);
      await interaction.reply('Please set your current character first.');
      return;
    }
    const currentCharacter = await user.getCurrentChar(); // TODO: Maybe use a getter?

    if (subcommand === 'add') {

      const statusName = interaction.options.get('name').value;
      const statusValue = interaction.options.get('value').value;

      await currentCharacter.createStatus({
        status_name: statusName,
        status_value: statusValue,
      });

      await interaction.reply(`Created status **${statusName}: ${statusValue}** on ${currentCharacter.name}`);

    } else if (subcommand === 'delete') {

      const statusName = interaction.options.get('name').value;

      const statusToDelete = await currentCharacter.findStatus(statusName);

      await currentCharacter.removeStatus(statusToDelete);
      await Statuses.destroy({
        where: { status_id: statusToDelete.status_id }
      });

      await interaction.reply(`Deleted status **${statusToDelete.status_name}: ${statusToDelete.status_value}**.`);
    }
  },
};
