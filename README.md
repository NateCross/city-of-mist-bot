# City ~~of~~ Under Mist Discord Bot

This project uses Discord.js to create a Discord bot to facilitate playing the
[City of Mist](https://cityofmist.co/) TTRPG by Son of Oak Game Studio.

## Usage
- Clone this repo.
- Run `npm install`
- Create a file called `config.json` in the directory.
- Write the Discord Bot token inside it as follows:
  - If you don't have one, get a token at the [Discord Developer Portal](https://discord.com/developers/applications).
```json
{
  "token": "<insert token here>"
  "guildId": "<insert ID of test server here>"
  "clientId": "<insert Discord Dev Portal ID here>"
}
```
- Run `npm deploy-commands` or `node deploy-commands.js` at the root.
  - This is used to register the slash commands.
  - You only need to do this once after you change or add a command.
- Run `npm start`, or `node .` when at the root of the repo.
- The bot should be working now.

## Features
- [x] Display Core Moves
  - [ ] Display the other player moves
- [ ] Show info for each theme

## TODO
- [?] Try to use those fancy Discord features
  - [x] Embeds with buttons for displaying moves
- [ ] Maybe add a dice roller
- [ ] Maybe add a way to track characters
