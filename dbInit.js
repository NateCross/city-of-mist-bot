// Only need to run once the database has been modified
const Sequelize = require('sequelize');
const fs = require('fs');

// Advised in the Discord.js tutorial to not touch unless
// you know what you are doing
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

// Some boilerplate to initialize the thing
require('./models/Characters.js')(sequelize, Sequelize.DataTypes);
require('./models/Users.js')(sequelize, Sequelize.DataTypes);
require('./models/Statuses.js')(sequelize, Sequelize.DataTypes);

sequelize.sync({force: true}).catch(console.error);

console.log('Database reset.');

// sequelize.sync({ force }).then(async () => {
  // Putting this here to test so it's the same as the tutorial
  // const character = [
  //   CharacterTracker.upsert({ name: 'Sophie Hale' }),
  // ];

  // await Promise.all(character);
//   await Promise.all();
//   console.log('Database cleared');
//
//   sequelize.close();
// }).catch(console.error);

