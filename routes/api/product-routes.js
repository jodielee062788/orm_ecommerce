const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products
router.get('/', async (req, res) => {
  try {
    // Fetch all products with associated category and tags
    const productData = await Product.findAll({
      include: [{ model: Category }, {model: Tag, through: ProductTag, as: 'tags'}]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single product by ID
router.get('/:id', async (req, res) => {
  try {
    // Find a product by its ID with associated category and tags
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'tags' }]
    });
    if (!productData) {
      res.status(404).json({ message: 'Product not found!'});
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new product
router.post('/', async (req, res) => {
  try {
    // Create a new product
    const productData = await Product.create(req.body);
    // If tagIds are provided, create associations between product and tags
    if(req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id, // Fixed typo: product.id -> productData.id
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    // Respond with the created product data
    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Failed to create product'});
  }
});

router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
  try {
    // Delete a product by its ID
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    // Check if product was deleted successfully
    if (!productData) {
      res.status(404).json({ message: 'Product not found!'});
      return;
    }
    // Respond with success message
    res.status(200).json(productData);
  } catch (err) {
    // Error handling
    res.status(500).json(err);
  }
});

module.exports = router;
