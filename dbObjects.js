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

Reflect.defineProperty(Users.prototype, 'createChar', {
  value: async characterName => {
    return Characters.create({
      user_id: this.user_id, name: characterName,
    });
  }
});

Reflect.defineProperty(Users.prototype, 'getChars', {
  value: () => {
    return Characters.findAll({
      where: { user_id: this.user_id },
    });
  }
});

module.exports = { Users, Characters, Statuses, };
