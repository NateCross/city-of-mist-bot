const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users, Characters, Statuses } = require('../dbObjects.js');

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
    const subcommand = interaction.options.getSubcommand();
    console.log(`Subcommand: ${subcommand}`);
    if (interaction.options.get('name')) {
      console.log(`Name: ${interaction.options.get('name').value}`);
    }
    if (interaction.options.get('value')) {
      console.log(`Value: ${interaction.options.get('value').value}`);
    }
    // if (subcommand === 'add')
    //   console.log(`Name: ${interaction.}`)
    await interaction.reply('Command successful');
  },
};
