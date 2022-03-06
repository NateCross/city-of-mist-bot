module.exports = (sequelize, DataTypes) => {
  return sequelize.define('character', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    character_id: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    portrait_link: DataTypes.STRING,
    // Insert custom moves, themes, statuses
  }, {
    timestamps: false,
  });
};
