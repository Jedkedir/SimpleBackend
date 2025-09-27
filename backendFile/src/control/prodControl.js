/*
# get All products
# Add products
# update products
# delete products

 */

/**
 # order placement
 # payment verification
 */

const pool = require('../config/db');

exports.getProducts = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products');
        res.status(201).json({message: "Successfully retrived", rows})
    }
    catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Error occurred while getting product' });
    }
}

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;

    const categoryResult = await pool.query('SELECT category_id FROM categories WHERE name = $1', [category]);

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({
        error: `Category ${category} doesn't exist. Please add it first`
      });
    }

    const cate_id = categoryResult.rows[0].category_id;

    const { rows } = await pool.query(
      'INSERT INTO products (name, description, price, category_id, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, description, price, cate_id, image_url]
    );
    res.status(201).json({ message: "product successfully added", product: rows[0]});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error occurred while adding product' });
  }
};

exports.addVariant = async (req, res) => {
  try {
    const {product_name, color, size, price, stock_quantity, image_url} = req.body;    

    const prodcutResult = await pool.query('SELECT product_id from products WHERE name = $1', [product_name]);

    if (prodcutResult.rows.length === 0) {
      return res.status(400).json({
        error: `Product ${product_name} doesn't exist. Please add the product first`
      });
    }

    const prod_id = prodcutResult.rows[0].product_id;

    const {rows} = await pool.query('INSERT INTO product_variants (product_id, color, size, price, stock_quantity, image_url) VALUES ($1, $2, $3, $4, $5, $6)', [prod_id, color, size, price, stock_quantity, image_url]);
    res.status(201).json({message: 'variant added successfully', variant: rows[0]});    
  }
  catch (err) {
    console.error(err);
    res.status(500).json({error: 'Error occurred while adding variant'});
  }
}
