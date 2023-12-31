const { PRODUCT_STATUS } = require("../constants/constants");

const Product = (sequelize, DataTypes) => {
  const model = sequelize.define("product", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PRODUCT_STATUS)),
      allowNull: false,
      defaultValue: PRODUCT_STATUS.FOR_SALE,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  model.associate = (models) => {
    model.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return model;
};

module.exports = (sequelize, DataTypes) => Product(sequelize, DataTypes);
