module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    current_character: {
      type: DataTypes.STRING,
    },
    // Place characters here
  }, {
    timestamps: false,
  });
};
