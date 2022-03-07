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
// Characters.hasMany(Statuses, { as: "Statuses", foreignKey: 'status',  });
// Statuses.belongsTo(Characters);

////////////////////////////////////
/// Defining Prototype Functions ///
////////////////////////////////////

Reflect.defineProperty(Users.prototype, 'createChar', {
  value: async (characterName, userId) => {
    return Characters.create({
      user_id: userId, name: characterName,
    });
  }
});

Reflect.defineProperty(Users.prototype, 'getChar', {
  value: async (characterName, userId) => {
    // if (characterName)
      return Characters.findOne({
        where: { name: characterName, user_id: userId },
      });
    // else
    //   return Characters.findOne({
    //     where: { name: Users.getCurrentChar(userId) },
    //   });
  }
});

Reflect.defineProperty(Users.prototype, 'getArrOfChars', {
  value: () => {
    return Characters.findAll({
      where: { user_id: this.user_id },
    });
  }
});

Reflect.defineProperty(Users.prototype, 'setCurrentChar', {
  value: async (currChar, userId) => {
    return Users.update( { current_character: currChar },
      { where: { user_id: userId }} );
  }
});

Reflect.defineProperty(Users.prototype, 'getCurrentChar', {
  value: async userId => {
    // await Users.update({ current_character: })
    return Users.findOne({ attributes: ['current_character'] }, { where: { user_id: userId }});
    // console.log(`charId: ${charId}`);

    // return Characters.findOne({ })
  }
});

Reflect.defineProperty(Characters.prototype, 'createStatus', {
  value: async (characterName, statusName, statusValue) => {
    return Statuses.create({ character_name: characterName, status_name: statusName, status_value: statusValue });
  }
});

Reflect.defineProperty(Characters.prototype, 'getStatuses', {
  value: async (characterName) => {
    return Statuses.findAll({ where: { character_name: characterName } });
  }
});

module.exports = { Users, Characters, Statuses, };
