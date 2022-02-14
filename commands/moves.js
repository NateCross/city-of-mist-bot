const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs');

const filenames = fs.readdirSync('./assets/moves')
                  .filter(n => n.endsWith('.json'));

const moveList = [];

for (const file of filenames) {
  const object = require(`../assets/moves/${file}`);
  moveList.push(object);
}

// Sample code
const row = new MessageActionRow()
            .addComponents(
              new MessageButton()
                  .setCustomId('take-the-risk')
                  .setLabel('Take The Risk')
                  .setStyle('PRIMARY'),
              new MessageButton()
                  .setCustomId('primary')
                  .setLabel('Primary')
                  .setStyle('PRIMARY'),
            );

// Generate an array of buttons from the moves in json files
// const messageButtons = [];
// for (let move of moveList) {
//   console.log(move.name);
//   let button = new MessageButton()
//                .setCustomId(move.id)
//                .setLabel(move.name)
//                .setStyle('PRIMARY');
//   messageButtons.push(button);
//   // console.log();
// }
const messageButtons = moveList.map(
  move => new MessageButton()
          .setCustomId(move.id)
          .setLabel(move.name)
          .setStyle('PRIMARY')
);
console.log(`Message Buttons: ${messageButtons}`);

const buttonRow = [];
let buttonRowCounter = 0;
console.log(`empty buttonrow is: ${buttonRow[buttonRowCounter]}`);
for (const button of messageButtons) {
  if (typeof buttonRow[buttonRowCounter] === 'undefined')
    buttonRow[buttonRowCounter] = new MessageActionRow();
  buttonRow[buttonRowCounter].addComponents(button);
}
console.log(`button row: ${buttonRow}`);
// row[rowCounter] = new MessageActionRow()
//                   .addComponents(
//                     
//                   )

const embed = new MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Basic Moves')
              .setDescription('Click a move\'s name to show its description.');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moves')
    .setDescription('Displays an embed of City of Mist moves.'),
  async execute(interaction) {
    await interaction.reply({ embeds: [embed], components: [buttonRow[0]] });
    const filter = i => i.customId === 'primary';

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
        if (i.customId === 'primary') {
            await i.update({ content: 'A button was clicked!', components: [] });
        }
    });

    collector.on('end', collected => console.log(`Collected ${collected.size} items`));
  }
}
