const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } =
  require('discord.js');
const fs = require('fs');

// Declaring buttons to be used

// class ThemeButton {
//   constructor(id, label) {
//     this.button = new MessageButton()
//       .setCustomId(id)
//       .setLabel(label)
//       .setStyle('PRIMARY');
//   }
// }

const InfoButton = {
  button: new MessageButton()
    .setCustomId('info')
    .setLabel('Info')
    .setStyle('PRIMARY'),
  execute: (themeObj, embed) => {
    console.log(Object.keys(themeObj.power));
    embed.setTitle('Power Tags');

    embed.fields = [];

    Object.keys(themeObj.power).forEach(key => embed.addFields(
      { name: key, value: themeObj.power[key] }
    ));
  }
};

// InfoButton.button.execute = (themeObj, embed) => {
//     console.log(Object.keys(themeObj.power));
//     embed.setTitle('Power Tags');
//
//     embed.fields = [];
//     Object.keys(themeObj.power).forEach(key => embed.addFields(
//       { name: key, value: themeObj.power[key] }
//     ));
// };

const buttonList = [ InfoButton ];
const buttonRow = new MessageActionRow();
buttonList.forEach(key => buttonRow.addComponents(key.button));

let baseEmbed = new MessageEmbed()
  .setColor('#E300D2')

const filenames = fs.readdirSync('./assets/themes')
                  .filter(n => n.endsWith('.json'));

const themeList = [];
for (const file of filenames) {
  const object = require(`../assets/themes/${file}`);
  themeList.push(object);
}

const listOfTypes = themeList.map(theme => theme.type);

console.log(listOfTypes);

const selectMenuOptions = {};
listOfTypes.forEach(type =>
  selectMenuOptions[type] = themeList
    .filter(theme => theme.type === type)
    .map(theme => ({
      label: theme.name,
      value: theme.id,
    }))
)

// console.log(selectMenuOptions);

const selectMenu = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
      .setCustomId('theme-name')
      .setPlaceholder('Select a theme to view')
      // .addOptions(selectMenuOptions),
  );

module.exports = {
  // Setting up command info
  data: new SlashCommandBuilder()
    .setName('themes')
    .setDescription('Looks up one of the themes.')
    .addStringOption(option => {
      option.setName('type')
        .setDescription('Type of theme to lookup')
        .setRequired(true);
      listOfTypes.forEach(type => option.addChoice(type, type));
      return option;
    }),

  //////////////////////////////
  /// Main driver of command ///
  //////////////////////////////
  async execute(interaction) {
    let selectedMenuItem;
    console.log(interaction.options.get("type").value);
    const option = interaction.options.get("type").value;

    selectMenu.components[0].addOptions(selectMenuOptions[option]);

    await interaction.reply({
      content: `You selected: ${option}`,
      components: [selectMenu],
    });

    const collector = interaction.channel.createMessageComponentCollector({ time: 100000 });

    collector.on('collect', async i => {
      if (i.isSelectMenu()) {
        console.log(`interaction: ${i.values[0]}`);
        selectedMenuItem = themeList.find(theme =>
          theme.id === i.values[0]
        );
        console.log(selectedMenuItem);
        const initialEmbed = baseEmbed
          .setTitle(selectedMenuItem.name)
          .setDescription(selectedMenuItem.concept);
          // TODO: Fill in the basic info field as description

        // InfoButton.execute(selectedMenuItem, initialEmbed);
        // const selectMenuAndButtons = [selectMenu].concat(buttonList);
        await i.update({
          embeds: [initialEmbed],
          components: [selectMenu, buttonRow],
        });

      } else if (i.isButton()) {
        console.log('You pressed a button');
        console.log(i);
        const updatedEmbed = baseEmbed;
      }
    });

    collector.on('end', collected => {
      console.log(`Collected ${collected.size} interactions.`);
    });
  },
};
