const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs');

const filenames = fs.readdirSync('./assets/moves')
                  .filter(n => n.endsWith('.json'));

const moveList = [];

// Scanning moves dir for json files of moves, pushed to an array
for (const file of filenames) {
  const object = require(`../assets/moves/${file}`);
  moveList.push(object);
}

// Creating buttons from the move array
const messageButtons = moveList.map(
  move => new MessageButton()
          .setCustomId(move.id)
          .setLabel(move.name)
          .setStyle('PRIMARY')
);

// Creating individual rows of 5 from the array of buttons
const buttonRow = [];
let buttonRowCounter = 0;
let buttonRowTotal = 0;

for (const button of messageButtons) {
  if (typeof buttonRow[buttonRowCounter] === 'undefined')
    buttonRow[buttonRowCounter] = new MessageActionRow();

  buttonRow[buttonRowCounter].addComponents(button);

  if (++buttonRowTotal == 5) {
    buttonRowTotal = 0;
    ++buttonRowCounter;
  }

  // console.log(`buttonRowCounter: ${buttonRowCounter}`);
  // console.log(`buttonRowTotal: ${buttonRowTotal}`);
}

const embed = new MessageEmbed()
              .setColor('#E300D2')
              .setTitle('Basic Moves')
              .setDescription('Click a move\'s name to show its description.');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moves')
    .setDescription('Displays an embed of City of Mist moves.'),
  async execute(interaction) {
    await interaction.reply({ embeds: [embed], components: buttonRow });

    const filter = i => messageButtons.some(button => {
      // console.log(`i: ${i.customId} buttonId: ${button.customId}`);
      return i.customId === button.customId;
    });

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      const moveIndex = Object.keys(moveList).find(move => {
        // console.log(`move.id: ${moveList[move].id} i.customId: ${i.customId}`)
        if (moveList[move].id === i.customId)
          return moveList[move].name;   // TODO: Make it return object
      });

      embed.setTitle(moveList[moveIndex].name);
      embed.setDescription(moveList[moveIndex].desc);

      await i.update({ embeds: [embed] });
    });

    collector.on('end', collected => console.log(`Collected ${collected.size} items`));
  }
}
