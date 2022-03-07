const { SlashCommandBuilder } = require('@discordjs/builders');
const { Op } = require('sequelize');
const { Users, Characters, Statuses } = require('../dbObjects.js');
const util = require('util'); // Debugging objects

module.exports = {
  data: new SlashCommandBuilder()
    .setName('character')
    .setDescription('Handles display of characters')
    .addStringOption(option =>
      option.setName('create')
        .setDescription('Input the name of the character to create'))
    .addStringOption(option =>
      option.setName('view')
        .setDescription('Input the name of the character to view'))
    .addStringOption(option =>
      option.setName('set')
        .setDescription('Input the name of the character to set as your current'))
    .addStringOption(option =>
      option.setName('status')
        .setDescription('Test option to add a status')),
    // .addStringOption(option =>
    //   option.setName)
    // .addSubcommand(subcommand =>
    //   subcommand.setName('edit')
    //     .setDescription('Change a character\'s attributes.')
    //     .addStringOption(option =>
    //     option.setName('name')
    //       .setDescription('Change a character\'s name.'))),
    // .addStringOption(option =>
    //   option.setName('edit')
    //     .setDescription('Change a character\'s attributes.')),
  async execute(interaction) {
    // console.log(`Option: ${interaction.options.getSubcommand()}`);

    if (!await Users.findOne({ where: { user_id: interaction.user.id } })) {
      await Users.create({ user_id: interaction.user.id });
    }

    const user = await Users.findOne({ where: { user_id: interaction.user.id } });

    // console.log(`user: ${user.user_id}`);

    if (interaction.options.get("create")) {
      const createName = interaction.options.get("create").value;

      console.log(`createName: ${createName}`);

      await user.createChar(createName, interaction.user.id);

      await interaction.reply(`Created character ${createName}.`);

    } else if (interaction.options.get("view")) {
      const viewName = interaction.options.get("view").value;

      // console.log(`viewName: ${viewName}`);

      const character = await user.getChar(viewName, interaction.user.id);

      if (character)
        await interaction.reply(`Character name is: ${character.name}`);
      else
        await interaction.reply('Unable to view character.');

    } else if (interaction.options.get('set')) {
      const currentCharacter = interaction.options.get('set').value;

      await user.setCurrentChar(currentCharacter, interaction.user.id);
      await interaction.reply(`Set current character as ${currentCharacter}`);

    } else if (interaction.options.get('status')) {
      const currentUser = await user.getCurrentChar(interaction.user.id);
      const currentCharacterName = currentUser.current_character;
      const currentCharacter = await user.getChar(
        currentCharacterName, interaction.user.id);
      const status = interaction.options.get('status').value;

      console.log(`Character name: ${currentCharacter.name}`);
      console.log(util.inspect(currentCharacter, false, null, true /* enable colors */));

      console.log("Before Creating Status");
      // await currentCharacter.createStatus(currentCharacter.name, status, 1);
      await Statuses.create({ character_name: currentCharacter.name, status_name: status, status_value: 1});

      console.log("After creating status");

      // console.log(currentCharacter.getStatuses(currentCharacter.name));
      const ListOfStatuses = await Statuses.findAll({ where: { character_name: currentCharacter.name }});
      console.log(ListOfStatuses);

      await interaction.reply(`Created status **${status}: 1** on character ${currentCharacter.name}`);
    }
  },
};
