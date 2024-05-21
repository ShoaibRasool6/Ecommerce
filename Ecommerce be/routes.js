const express = require('express');
const connection = require('./db');
const router = express.Router();

// Get all products
router.get('/getAll', (request, response) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            response.status(500).json({ error: 'Database error' });
            return;
        }
        response.json(results);
    });
});

// Get a single product by ID
router.get('/:id', (request, response) => {
    const productId = request.params.id;
    connection.query('SELECT * FROM products WHERE product_id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            response.status(500).json({ error: 'Database error' });
            return;
        }
        if (results.length === 0) {
            response.status(404).json({ message: 'Product not found' });
            return;
        }
        response.json(results[0]);
    });
});

// Add a new product
router.post('/post', (request, response) => {
    console.log(response.body,"ccc")
    const { name, description, price, category_id, brand_id } = request.body;

    if (!name || !description || !price || !category_id || !brand_id) {
        return response.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO products (name, description, price, category_id, brand_id) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [name, description, price, category_id, brand_id], (err, results) => {
        if (err) {
            console.error('Error adding product:', err.sqlMessage);
            response.status(500).json({ error: 'Database error', details: err.sqlMessage });
            return;
        }
        response.status(201).json({ message: 'Product added', productId: results.insertId });
    });
});


// Update a product by ID
router.put('/:id', (request, response) => {
    const productId = request.params.id;
    const { name, description, price, category_id, brand_id } = request.body;
    const query = 'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, brand_id = ? WHERE product_id = ?';
    connection.query(query, [name, description, price, category_id, brand_id, productId], (err, results) => {
        if (err) {
            console.error('Error updating product:', err);
            response.status(500).json({ error: 'Database error' });
            return;
        }
        if (results.affectedRows === 0) {
            response.status(404).json({ message: 'Product not found' });
            return;
        }
        response.json({ message: 'Product updated' });
    });
});

// Delete a product
router.delete('/:productId', (request, response) => {
    const { productId } = request.params;

    const query = 'DELETE FROM products WHERE product_id = ?';
    connection.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Error deleting product:', err);
            return response.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return response.status(404).json({ error: 'Product not found' });
        }
        response.status(200).json({ message: 'Product deleted' });
    });
});

module.exports = router;
