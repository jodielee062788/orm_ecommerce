// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id'
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id'
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: {
    model: ProductTag, // Specify the through model
    foreignKey: 'product_id', // Foreign key in the through model
    unique: false // Allows multiple associations between Product and Tag
  },
  as: 'tags' // Alias used in the through model
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: {
    model: ProductTag, // Specify the through model
    foreignKey: 'tag_id', // Foreign key in the through model
    unique: false // Allows multiple associations between Tag and Product
  },
  as: 'products' // Alias used in the through model
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
