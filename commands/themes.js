const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed, Message } =
  require('discord.js');
const fs = require('fs');

// Setting
const EmbedColor = '#E300D2';

// Declaring buttons to be used
const DescButton = {
  button: new MessageButton()
    .setCustomId('desc')
    .setLabel('Description')
    .setStyle('PRIMARY'),
  execute: (themeObj, embed) => {
    embed.setTitle('Description');
    embed.setDescription(themeObj.desc);
    embed.fields = [];

    embed.addField('Concept', themeObj.concept);
    if (Object.prototype.hasOwnProperty.call(themeObj, 'mystery')) {
      // embed.addField('Mystery',
      //   `Examples\n${themeObj.mystery.examples.join('\n')}
      //   \nQuestions\n${themeObj.mystery.questions.join('\n')}`);
      embed.addField('Mystery', '\u200B');
      embed.addField('Examples', themeObj.mystery.examples.join('\n'), true);
      embed.addField('Questions', themeObj.mystery.questions.join('\n'), true);
    } else {
      embed.addField('Identity',
        `Examples\n${themeObj.identity.examples.join('\n')}
        \nQuestions\n${themeObj.identity.questions.join('\n')}`);

    }
    embed.addField('Crew Relationships',
      themeObj['crew-relationships'].join('\n'));
  }
}

const PowerTagButton = {
  button: new MessageButton()
    .setCustomId('power')
    .setLabel('Power Tags')
    .setStyle('PRIMARY'),
  execute: (themeObj, embed) => {
    embed.setTitle('Power Tags');
    embed.setDescription('');
    embed.fields = [];
    //
    Object.keys(themeObj.power).forEach(key => {
      embed.addField(key, `*${themeObj.power[key].join(', ')}*`);
    })
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

const buttonList = [ DescButton, PowerTagButton ];
const buttonRow = new MessageActionRow();
buttonList.forEach(key => buttonRow.addComponents(key.button));

// let baseEmbed = new MessageEmbed()
//   .setColor(EmbedColor)

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

    // const filter = i => themeList.some(key => i.customId === key.id);

    const collector = interaction.channel.createMessageComponentCollector({ time: 100000 });

    collector.on('collect', async i => {
      if (i.isSelectMenu()) {
        console.log(`interaction: ${i.values[0]}`);
        selectedMenuItem = themeList.find(theme =>
          theme.id === i.values[0]
        );
        console.log(selectedMenuItem);
        // const initialEmbed = baseEmbed
        //   .setTitle(selectedMenuItem.name)
        //   .setDescription(selectedMenuItem.concept);
        const initialEmbed = new MessageEmbed()
          .setTitle(selectedMenuItem.name)
          .setDescription('Select a button to view the theme\'s information.')
          .setColor(EmbedColor);
          // TODO: Fill in the basic info field as description

        // InfoButton.execute(selectedMenuItem, initialEmbed);
        // const selectMenuAndButtons = [selectMenu].concat(buttonList);
        await i.update({
          content: `You selected: ${option}`,
          embeds: [initialEmbed],
          components: [selectMenu, buttonRow],
        });

      } else if (i.isButton()) {
        console.log('You pressed a button');
        // console.log(i);
        // const updatedEmbed = baseEmbed;
        const updatedEmbed = new MessageEmbed()
          .setColor(EmbedColor);
          // .setFooter(selectedMenuItem.name);

        console.log('Updated Embed');
        console.log(updatedEmbed);
        const selectedButton = buttonList.find(key =>
          key.button.customId === i.customId
        );
        // console.log(selectedButton);
        selectedButton.execute(selectedMenuItem, updatedEmbed);

        await i.update({
          content: selectedMenuItem.name,
          embeds: [updatedEmbed],
        });

      }
    });

    collector.on('end', collected => {
      console.log(`Collected ${collected.size} interactions.`);
    });
  },
};
