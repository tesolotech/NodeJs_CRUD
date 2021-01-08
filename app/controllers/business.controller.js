
const mongoose = require('mongoose');
// const User = require('../models/user.model.js');
// const Products = require('../models/products.model.js');
const Business = require('../models/business.model.js');


// Create and save Business
exports.createBusiness = (req, res, next) => {

    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: "you can't submit empty!!" });
    }
    if (!req.body.name) {
        return res.status(400).send({ error: "Name is required!!" });
    }
    if (!req.body.email) {
        return res.status(400).send({ error: "Email is required!!" });
    }

    Business.findByEmail(req.body.email)
        .then((result) => {
            if (result.email) {
                return res.status(400).send({ error: "Email is already exists!!" });
            } else {
                Business.createBusiness(req.body)
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
                Business.createBusiness(req.body)
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


exports.GetAllBusiness = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    Business.getBusinessList(limit, page)
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
