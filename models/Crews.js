module.exports = (sequelize, DataTypes) => {
  return sequelize.define('character', {
    crew_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    crew_name: {
      type: DataTypes.STRING,
      unique: true,
    },
    server_id: {
      type: DataTypes.STRING,
    },
    portrait_link: DataTypes.STRING,
  }, {
    timestamps: false,
  });
};

/*
 * Use the Discord server's ID
 * One server has one crew
 * One crew has many themes
 */
