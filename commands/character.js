const { SlashCommandBuilder } = require('@discordjs/builders');
const { Op } = require('sequelize');
const { Users, Characters, Statuses } = require('../dbObjects.js');
const util = require('util'); // Debugging objects
const { MessageEmbed } = require('discord.js');

////// QUICK UTILITY FUNC //////
// Taken from https://flaviocopes.com/how-to-list-object-methods-javascript/
const getMethods = (obj) => {
  let properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(item => typeof obj[item] === 'function');
};

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
  async execute(interaction) {

    // Create a user if a user entry does not already exist
    // We need to log each user who uses this so that we can
    // track characters
    if (!await Users.findOne({ where: { user_id: interaction.user.id } })) {
      await Users.create({ user_id: interaction.user.id });
    }

    const user = await Users.findOne({ where: { user_id: interaction.user.id } });

    if (interaction.options.get('create')) {
      const createName = interaction.options.get('create').value;

      await user.createCharacter({ name: createName });

      await interaction.reply(`Created character **${createName}**.`);

    } else if (interaction.options.get('view')) {
      const viewName = interaction.options.get('view').value;

      const character = await user.getChar(viewName);

      if (character) {

        const statuses = await character.getStatuses();

        console.log(`Statuses: ${statuses}`);

        const embed = new MessageEmbed()
          .setTitle(character.name)
          .setColor('#E300D2') // Arbitrary but nice color
          .setFooter({ text: interaction.user.username });

        if (character.portrait_link)
          embed.setThumbnail(character.portrait_link);

        if (statuses) {
          const reducedStatuses = statuses.reduce((statusStr, status) => {
            return statusStr += `${status.status_name}: ${status.status_value}\n`;
          }, ``);

          embed.addField('Statuses', reducedStatuses);
        }

          // embed.addField('Statuses', statuses.join('\n'));
        // statuses.forEach(status =>
        //   embed.addField()
        // )

        await interaction.reply({ embeds: [embed] });
        // await interaction.reply(`Character name is **${character.name}**.`);
      }
      else
        await interaction.reply('Unable to view character.');

    } else if (interaction.options.get('set')) {

      const currentCharacter = interaction.options.get('set').value;

      if (await user.setCurrentChar(currentCharacter))
        await interaction.reply(`Set current character as **${currentCharacter}**.`);
      else
        await interaction.reply('Unable to set current character.');

    } else if (interaction.options.get('status')) {

      // const currentUser = await user.getCurrentChar(interaction.user.id);
      const currentCharacterName = user.current_character;
      console.log(`Current Char Name: ${currentCharacterName}`);
      const currentCharacter = await user.getCurrentChar(currentCharacterName);
      const status = interaction.options.get('status').value;

      console.log(`Character name: ${currentCharacter.name}`);
      console.log(util.inspect(currentCharacter, false, null, true /* enable colors */));
      console.log(`Character methods`);
      console.log(getMethods(currentCharacter));

      console.log("Before Creating Status");
      // await currentCharacter.createStatus(currentCharacter.name, status, 1);
      // await Statuses.create({ character_name: currentCharacter.name, status_name: status, status_value: 1});
      await currentCharacter.createStatus({
        status_name: status,
        status_value: 1,
      });

      console.log("After creating status");

      // console.log(currentCharacter.getStatuses(currentCharacter.name));
      const ListOfStatuses = await Statuses.findAll({ where: { character_name: currentCharacter.id }});
      console.log(ListOfStatuses);

      await interaction.reply(`Created status **${status}: 1** on character ${currentCharacter.name}`);
    }
  },
};
