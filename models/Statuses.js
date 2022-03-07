module.exports = (sequelize, DataTypes) => {
  return sequelize.define('statuses', {
    // Links to character
    character_name: DataTypes.STRING,
    status_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
};
