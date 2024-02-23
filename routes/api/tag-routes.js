const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET all tags with associated product data
router.get('/', async (req, res) => {
  try {
    // Find all tags and include associated product data
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: 'products' }]
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single tag by ID with associated product data
router.get('/:id', async (req, res) => {
  try {
    // Find a tag by its ID and include associated product data
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'products' }]
    });
    // Check if tag exists
    if (!tagData) {
      res.status(404).json({ message: 'Tag not found!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST create a new tag
router.post('/', async (req, res) => {
  try {
    // Create a new tag 
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT update a tag's name by ID
router.put('/:id', async (req, res) => {
  try {
    // Update a tag's name by its ID 
    const tagData = await Tag.update(req.body, {
      where: { id: req.params.id }
    });
    // Check if tag exists
    if (tagData[0] === 0) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.status(200).json({ message: 'Tag updated successfully!' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a tag by ID
router.delete('/:id', async (req, res) => {
  try {
    // Delete a tag by its ID
    const tagData = await Tag.destroy({
      where: { id: req.params.id }
    });
    // Check if tag exists
    if (!tagData) {
      res.status(404).json({ message: 'Tag not found!' });
      return;
    }
    res.status(200).json({ message: 'Tag deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
