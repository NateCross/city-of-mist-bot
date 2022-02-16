const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs');

// NOTE: May not be necessary anymore, but the data structure requires
// some refactoring so this can be taken out
const utils = require('../utils/group-objects-by-property');

const filenames = fs.readdirSync('./assets/moves')
                  .filter(n => n.endsWith('.json'));


// Scanning moves dir for json files of moves, pushed to an array
const moveList = [];
for (const file of filenames) {
  const object = require(`../assets/moves/${file}`);
  moveList.push(object);
}

// We add the page property to moves which don't have them listed
// since we want to group the move buttons by their page, we want to compare
// the listed pages. However, it has proven to be too much of a hassle to
// work with no page property. So for standardization's sake, we do this.
moveList.forEach(x => {
  if (!Object.prototype.hasOwnProperty.call(x, "page"))
    x.page = 1;
  return x;
})

// Not strictly necessary; this grouping was put in place
// so the messageButtons below would be easier to make
// since I could just group the thing by type
// This may not be the best idea in hindsight;
// perhaps I should have attached the buttons as its own property
// on the objects in moveList.
const groupedMoves = utils.groupBy(moveList, 'type');

const moveTypes = Object.keys(groupedMoves);

// Creates the buttons to be placed into ActionRows later below
// The buttons are grouped first by type (e.g. "Basic", "MC"), then by page
const messageButtons = {};
for (const type of moveTypes) {
  messageButtons[type] = [];

  let maxPageNum = groupedMoves[type].reduce((x, xs) =>
    (x.page > xs.page) ? x : xs
  ).page;

  // TODO: The double filter into map is incredibly inefficient
  // needs optimizing with better structured data
  for (let i = 0; i < maxPageNum; i++) {
    messageButtons[type][i] = [];
    messageButtons[type][i] = moveList.filter(move => move.type === type)
      .filter(move => move.page === i + 1)
      .map(move => new MessageButton()
        .setCustomId(move.id)
        .setLabel(move.name)
        .setStyle('PRIMARY')
    );
  }
}

// Adding the created and grouped buttons to rows of 5
// this is because Discord.js only allows 5 buttons per ActionRow
const buttonRow = {};
for (const buttonType of Object.keys(messageButtons)) {
  buttonRow[buttonType] = [];
  let buttonRowCounter = -1;

  for (const page of messageButtons[buttonType]) {
    ++buttonRowCounter;
    let buttonRowTotal = 0;

    for (const button of page) {
      if (typeof buttonRow[buttonType][buttonRowCounter] === 'undefined')
        buttonRow[buttonType][buttonRowCounter] = new MessageActionRow();

      buttonRow[buttonType][buttonRowCounter].addComponents(button);

      if (++buttonRowTotal === 5) {
        buttonRowTotal = 0;
        ++buttonRowCounter;
      }
    } // TODO: Look for a better way to express this loop
  }
}

// TODO: Make the embed change based on what type of move is being looked up
const embed = new MessageEmbed()
              .setColor('#E300D2')
              .setTitle('Basic Moves')
              .setDescription('Click a move\'s name to show its description.');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moves')
    .setDescription('Displays an embed of a City of Mist move.'),

  async execute(interaction) {
    // TODO: Make it allow input for another type of move
    // Then, have it show only that type
    await interaction.reply({ embeds: [embed], components: buttonRow["Basic"] });

    const filter = i => moveList.some(button => {
      return i.customId === button.id;
    });

    // NOTE: Is a time of 100000 still valid? Needs testing
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 100000 });

    collector.on('collect', async i => {
      const moveIndex = Object.keys(moveList).find(move => {
        if (moveList[move].id === i.customId)
          return moveList[move].name;   // TODO: Make it return object
      });

      embed.setTitle(moveList[moveIndex].name);
      embed.setDescription(moveList[moveIndex].desc);
      embed.fields = [];

      if (Object.prototype.hasOwnProperty.call(moveList[moveIndex], "dynamite")) {
        embed.addFields({
          name: 'Dynamite', value: moveList[moveIndex].dynamite
        });
      }

      await i.update({ embeds: [embed] });
    });

    collector.on('end', collected => console.log(`Collected ${collected.size} items`));
  }
}
