module.exports = (sequelize, DataTypes) => {
  return sequelize.define('character', {
    character_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    portrait_link: DataTypes.STRING,
  }, {
    timestamps: false,
  });
};
