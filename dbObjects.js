const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

const Characters = require('./models/Characters.js')(sequelize, Sequelize.DataTypes);
const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);
const Statuses = require('./models/Statuses.js')(sequelize, Sequelize.DataTypes);

// Defining associations
// These are the ones that seem to work rather consistently
// Do not touch unless there's a very good reason
// and if this is touched, make sure to run
// 'node dbInit.js -f'
Users.hasMany(Characters, { foreignKey: 'user_id'} );
Characters.hasMany(Statuses, { foreignKey: 'character_id'} );

Characters.belongsTo(Users, { foreignKey: 'user_id'} );
Statuses.belongsTo(Characters, { foreignKey: 'character_id'} );

////////////////////////////////////
/// Defining Prototype Functions ///
////////////////////////////////////

// NOTE: Do not use arrow functions for Users
// This is because it uses 'this,' which seems to break when
// arrow functions are used—it doesn't have any value if so
// Using regular functions, however, work as intended

Reflect.defineProperty(Users.prototype, 'getChar', {
  value: async function(characterName) {
    return Characters.findOne({
      where: { name: characterName, user_id: this.user_id },
    });
  }
});


Reflect.defineProperty(Users.prototype, 'getArrOfChars', {
  value: async function() {
    return Characters.findAll({
      where: { user_id: this.user_id },
    });
  }
});

Reflect.defineProperty(Users.prototype, 'setCurrentChar', {
  value: async function(currChar) {
    if (await this.getChar(currChar))
      return Users.update( { current_character: currChar },
        { where: { user_id: this.user_id }});
    else
      return undefined;
  }
});

Reflect.defineProperty(Users.prototype, 'getCurrentChar', {
  value: async function() {
    // return Users.findOne({
    //   attributes: ['current_character'] },
    //   { where: { user_id: this.user_id }});
    return Characters.findOne({
      where: { name: this.current_character }
    });
  }
});

module.exports = { Users, Characters, Statuses, };
