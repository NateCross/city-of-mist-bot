module.exports = (sequelize, DataTypes) => {
  return sequelize.define('statuses', {
    theme_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    theme_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    theme_attention: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    theme_fade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Owner can be either 'player', or 'crew'
    owner_type: {
      type: DataTypes.STRING,
    },
    owner_id: DataTypes.INTEGER,
  }, {
    timestamps: false,
  });
};

/*
 * Database Requirements:
 * One owner (can be player or crew) has one or more themes
 *    Player = 'P', Crew = 'C' in owner type
 * One theme has one or more tags
 * 
 *
 */
