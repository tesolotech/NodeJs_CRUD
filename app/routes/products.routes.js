

module.exports = (app) => {
    const products = require('../controllers/products.controller.js');


    app.post('/api/createProduct', products.createProducts);

    app.get('/api/productList', products.GetAllProducts);

    app.delete('/api/product/:productId', products.deleteProductById);

    app.put('/api/product', products.UpdateProductsById);


}

