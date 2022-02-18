const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed, Message } =
  require('discord.js');
const fs = require('fs');

// Setting
const EmbedColor = '#E300D2';

// Declaring buttons to be used
// TODO: Find a way to group these buttons and reduce repetition
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
      embed.addField('Mystery', '\u200B');
      embed.addField('Examples', themeObj.mystery.examples.join('\n\n'), true);
      embed.addField('Questions', themeObj.mystery.questions.join('\n\n'), true);
    } else {
      embed.addField('Identity', '\u200B');
      embed.addField('Examples', themeObj.identity.examples.join('\n\n'), true);
      embed.addField('Questions', themeObj.identity.questions.join('\n\n'), true);
    }

    embed.addField('Crew Relationships',
      themeObj['crew-relationships'].join('\n\n'));
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

const WeaknessTagButton = {
  button: new MessageButton()
    .setCustomId('weakness')
    .setLabel('Weakness Tags')
    .setStyle('PRIMARY'),
  execute: (themeObj, embed) => {
    embed.setTitle('Weakness Tags');
    embed.setDescription('');
    embed.fields = [];

    Object.keys(themeObj.weakness).forEach(key => {
      embed.addField(key, `*${themeObj.weakness[key].join(', ')}*`);
    })
  }
}

const ImprovementsButton = {
  button: new MessageButton()
    .setCustomId('improvements')
    .setLabel('Improvements')
    .setStyle('PRIMARY'),
  execute: (themeObj, embed) => {
    embed.setTitle('Improvements');
    embed.setDescription('');
    embed.fields = [];

    Object.keys(themeObj.improvements).forEach(key => {
      embed.addField(key, `*${themeObj.improvements[key]}*`);
    })
  }
}

const buttonList = [ DescButton, PowerTagButton, WeaknessTagButton, ImprovementsButton ];
const buttonRow = new MessageActionRow();
buttonList.forEach(key => buttonRow.addComponents(key.button));

const filenames = fs.readdirSync('./assets/themes')
                  .filter(n => n.endsWith('.json'));

const themeList = [];
for (const file of filenames) {
  const object = require(`../assets/themes/${file}`);
  themeList.push(object);
}

const listOfTypes = themeList.map(theme => theme.type);

// Populating the list of themes per type
const selectMenuOptions = {};
listOfTypes.forEach(type =>
  selectMenuOptions[type] = themeList
    .filter(theme => theme.type === type)
    .map(theme => ({
      label: theme.name,
      value: theme.id,
    }))
)

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
    const option = interaction.options.get("type").value;

    selectMenu.components[0].addOptions(selectMenuOptions[option]);

    await interaction.reply({
      content: `You selected: ${option}`,
      components: [selectMenu],
    });

    const collector = interaction.channel.createMessageComponentCollector({ time: 100000 });

    collector.on('collect', async i => {
      if (i.isSelectMenu()) {
        selectedMenuItem = themeList.find(theme =>
          theme.id === i.values[0]
        );

        const initialEmbed = new MessageEmbed()
          .setTitle(selectedMenuItem.name)
          .setDescription('Select a button to view the theme\'s information.')
          .setColor(EmbedColor);

        await i.update({
          content: `You selected: ${option}`,
          embeds: [initialEmbed],
          components: [selectMenu, buttonRow],
        });

      } else if (i.isButton()) {
        const updatedEmbed = new MessageEmbed()
          .setColor(EmbedColor);

        const selectedButton = buttonList.find(key =>
          key.button.customId === i.customId
        );

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
