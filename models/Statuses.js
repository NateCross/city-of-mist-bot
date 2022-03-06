module.exports = (sequelize, DataTypes) => {
  return sequelize.define('status', {
    // Links to character
    character_name: DataTypes.STRING,
    status_name: {
      type: DataTypes.STRING,
      allowNull: false,
      'default': "",
    },
    status_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      'default': 1,
    },
  }, {
    timestamps: false,
  });
};
