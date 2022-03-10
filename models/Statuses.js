module.exports = (sequelize, DataTypes) => {
  return sequelize.define('statuses', {
    status_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    status_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    character_id: DataTypes.INTEGER,
    // characterCharacterId: DataTypes.INTEGER,
  }, {
    timestamps: false,
  });
};
