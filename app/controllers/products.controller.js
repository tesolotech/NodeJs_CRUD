
// const mongoose = require('mongoose');
// const User = require('../models/user.model.js');
const Product = require('../models/products.model.js');
// const Business = require('../models/business.model.js');


// Create and save user
exports.createProducts = (req, res, next) => {

    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: "you can't submit empty!!" });
    }
    if (!req.body.name) {
        return res.status(400).send({ error: "Name is required!!" });
    }
    if (!req.body.mrp) {
        return res.status(400).send({ error: "MRP is required!!" });
    }

    Product.findByName(req.body.name)
        .then((result) => {
            if (result.name) {
                return res.status(400).send({ error: "Name is already exists!!" });
            } else {
                Product.createProducts(req.body)
                    .then(async (result) => {
                        result = result.toObject();
                        // result.id = result._id;
                        delete result.__v;
                        let response = {
                            status: 201,
                            message: "SUCEESS",
                            data: result
                        }
                        res.status(201).send(response);
                    }).catch((err) => {
                        let response = {
                            status: 400,
                            message: "ERROR",
                            error: err
                        }
                        return res.status(400).send(response);
                    })
            }
        }).catch((err) => {

            if (Object.entries(err).length === 0) {
                Product.createProducts(req.body)
                    .then(async (result) => {
                        result = result.toObject();
                        // result.id = result._id;
                        delete result.__v;
                        let response = {
                            status: 201,
                            message: "SUCEESS",
                            data: result
                        }
                        res.status(201).send(response);
                    }).catch((err) => {
                        let response = {
                            status: 400,
                            message: "ERROR",
                            error: err
                        }
                        return res.status(400).send(response);
                    })

            } else {
                console.log(err);
                let response = {
                    status: 400,
                    message: "ERROR",
                    error: err
                }
                return res.status(400).send(response);
            }

        });

};

exports.GetAllProducts = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    Product.getProductsList(limit, page)
        .then((result) => {
            let response = {
                status: 200,
                message: "SUCEESS",
                data: result
            }
            res.status(200).json(response);
        }).catch((err) => {
            let response = {
                status: 400,
                message: "ERROR",
                data: []
            }
            res.status(400).json(response);
        })
}


// Delete Products
exports.deleteProductById = (req, res, next) => {
    Product.removeById(req.params.productId)
        .then((result) => {
            let response = {
                status: 201,
                message: "SUCCESS",
                data: result
            }
            res.status(201).json(response);
        }).catch((err) => {
            let response = {
                status: 400,
                message: "ERROR",
                data: {}
            }
            res.status(400).json(response);
        })
};


//Update Single Product by id
exports.UpdateProductsById = (req, res) => {
    Product.updateData(req.body._id, req.body)
        .then((result) => {
            console.log("result is", result);
            let response = {
                status: 200,
                message: "SUCCESS",
                data: result
            }
            res.status(200).json(response);
        }).catch((err) => {
            console.log("err is", err);

            let response = {
                status: 400,
                message: "ERROR",
                error: err
            }
            res.status(400).json(response);
        })

};

