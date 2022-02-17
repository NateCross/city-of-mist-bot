const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } =
  require('discord.js');
const fs = require('fs');

// class ButtonTemplate {
//   
// }

const filenames = fs.readdirSync('./assets/themes')
                  .filter(n => n.endsWith('.json'));

const themeList = [];
for (const file of filenames) {
  const object = require(`../assets/themes/${file}`);
  themeList.push(object);
}

const listOfTypes = themeList.map(theme => theme.type);

console.log(listOfTypes);

const selectMenuOptions = themeList.map(theme => ({
  label: theme.name,
  // description: "",
  value: theme.id,
}));

console.log(selectMenuOptions);

const selectMenu = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
      .setCustomId('theme-name')
      .setPlaceholder('Select a theme to view')
      .addOptions(selectMenuOptions),
  );

module.exports = {
  data: new SlashCommandBuilder()
    .setName('themes')
    .setDescription('Looks up one of the themes.')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Type of theme to lookup')
        .setRequired(true)
        .addChoice('Mythos', 'Mythos')
        .addChoice('Logos', 'Logos')
    ),
  async execute(interaction) {
    console.log(interaction.options.get("type").value);
    const option = interaction.options.get("type").value;
    const filteredMenu = selectMenu.filter(theme =>
      theme.type === option
    )
    await interaction.reply({
      content: `You selected: ${option}`,
      components: [filteredMenu],
    });

    // const filter = i => moveList.some(button => {
    //   return i.customId === button.id;
    // });
    const collector = interaction.channel.createMessageComponentCollector({ time: 100000 });

    collector.on('collect', i => {
      if (i.isSelectMenu()) {
        console.log(`interaction: ${i.values[0]}`);
        const selectedMenuItem = themeList.find(theme =>
          theme.id === i.values[0]
        );
        console.log(selectedMenuItem);
        const updatedEmbed = new MessageEmbed()
          .setColor('#E300D2')
          .setTitle(selectedMenuItem.name)
          // TODO: Fill in the basic info field as description
      }
    });

    collector.on('end', collected => {
      console.log(`Collected ${collected.size} interactions.`);
    });
  },
};
