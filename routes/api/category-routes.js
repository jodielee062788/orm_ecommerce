const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET all categories with associated products
router.get('/',  async (req, res) => {
  try {
    // Find all categories and include associated products
    const categoryData = await Category.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single category by ID with associated products
router.get('/:id', async (req, res) => {
  try {
    // Find a category by its ID and include associated products
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    });
    // Check if category exists
    if (!categoryData) {
      res.status(404).json({ message: 'Category not found!'});
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    // Handle errors if any
    res.status(500).json(err);
  }
});

// POST create a new category
router.post('/',  async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT update a category by ID
router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    // Check if category exists
    if (categoryData[0] === 0) {
      res.status(404).json({ message: 'Category not found'});
      return;
    }
    res.status(200).json({ message: 'Category updated successfully!'});
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a category by ID
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    // Check if category exists
    if (!categoryData) {
      res.status(404).json({ message: 'Category not found!'});
      return;
    }
    res.status(200).json({ message: 'Category deleted successfully!'});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
