module.exports = (sequelize, DataTypes) => {
  return sequelize.define('statuses', {
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    tag_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tag_is_burnt: {
      type: DataTypes.BOOLEAN,
      default_value: false,
    },
    theme_id: DataTypes.INTEGER,
  }, {
    timestamps: false,
  });
};
