const colors = require('colors');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // Fancy console output
    const time = interaction.createdAt;
    console.log(`[${time.toLocaleTimeString()}]`.blue.bold);
    console.log(`${interaction.user.tag} `.green + `in #${interaction.channel.name} executed ` + `${interaction.commandName}`.red);


    if (!interaction.isCommand())
      return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command)
      return;

    // (https://discordjs.guide/creating-your-bot/command-handling.html#individual-command-files)
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};
