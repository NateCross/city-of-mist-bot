module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    user_id: {
      type: DataTypes.STRING,
      unique: true,
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
