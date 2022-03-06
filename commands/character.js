const { SlashCommandBuilder } = require('@discordjs/builders');
const { Op } = require('sequelize');
const { Users, Characters } = require('../dbObjects.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('character')
    .setDescription('Handles display of characters')
    .addStringOption(option =>
      option.setName('create')
        .setDescription('Input the name of the character to create'))
    .addStringOption(option =>
      option.setName('view')
        .setDescription('Input the name of the character to view')),
  async execute(interaction) {

    if (!await Users.findOne({ where: { user_id: interaction.user.id } })) {
      await Users.create({ user_id: interaction.user.id });
    }
    const user = await Users.findOne({ where: { user_id: interaction.user.id } });

    console.log(`user: ${user}`);

    if (interaction.options.get("create")) {
      const createName = interaction.options.get("create").value;

      console.log(`createName: ${createName}`);

      await user.createChar(createName);

      await interaction.reply(`Created character ${createName}.`);
    } else if (interaction.options.get("view")) {
      const viewName = interaction.options.get("view").value || null;

      console.log(`viewName: ${viewName}`);
      await interaction.reply('Pong!');
    }

  },
};
