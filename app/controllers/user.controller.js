
const mongoose = require('mongoose');
const User = require('../models/user.model.js');
const Products = require('../models/products.model.js');
const Business = require('../models/business.model.js');


// Create and save user
exports.signupUser = (req, res, next) => {
    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: "you can't submit empty!!" });
    }
    if (!req.body.name) {
        return res.status(400).send({ error: "Name is required!!" });
    }
    if (!req.body.email) {
        return res.status(400).send({ error: "Email is required!!" });
    }

    User.findByEmail(req.body.email)
        .then((result) => {
            if (result.email) {
                return res.status(400).send({ error: "Email is already exists!!" });
            } else {
                User.createUser(req.body)
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
                User.createUser(req.body)
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

exports.getUserListPaging = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    User.getUserrList(limit, page)
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

// Login user
exports.loginUser = (req, res, next) => {
    User.find({ mobile: req.body.mobile })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    res.status(401).json({
                        message: 'Auth Failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        mobile: user[0].mobile,
                        userId: user[0]._id
                    },
                        'RADHASWAMI',
                        {
                            expiresIn: '1h',

                        });

                    res.status(200).json({
                        message: 'Auth Successful',
                        token: token
                    });
                }
                if (err) {
                    res.status(401).json({
                        message: 'Auth Failed'
                    });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
};


// Delete User
exports.userDelete = (req, res, next) => {
    console.log(req.params)
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
                result: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

//Get all Users
exports.GetAllUser = (req, res) => {
    User.find()
        .then(result => {
            res.send(result);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

//Get Single Users by id
exports.GetUserById = (req, res) => {

    User.findById({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                data: result
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

//Update Single Users by id
exports.UpdateUserById = (req, res) => {

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const dataModel = {
                mobile: req.body.mobile,
                password: hash
            }
            User.findByIdAndUpdate(req.params.userId, { $set: dataModel }, { new: true })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'User Successfully Updated',
                        data: result
                    });
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while Updating users."
                    });
                });

        }
    })
    // User.findByIdAndUpdate({ _id: req.params.userId, mobile:req.body.mobile, new: true})
    // .exec()
    // .then(result => {
    //     res.status(200).json({
    //         message:'User Successfully Updated',
    //         data:result
    //     });
    // }).catch(err => {
    //     res.status(500).send({
    //         message: err.message || "Some error occurred while Updating users."
    //     });
    // });
};


// Add contact number with name
exports.AddContacts = (req, res, next) => {

    Contact.find({ mobile: req.body.mobile })
        .exec()
        .then(contact => {
            if (contact.length >= 1) {
                return res.status(409).json({
                    message: "Contact Exists"
                })
            } else {

                messagebird.lookup.read(req.body.mobile, (err, response) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        console.log(response)
                        const contact = new Contact({
                            _id: new mongoose.Types.ObjectId(),
                            mobile: req.body.mobile,
                            name: req.body.name
                        });
                        contact.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'Contact created successfull'
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                })
            }
        })
        .catch()

};


//Get all Users
exports.GetMessage = (req, res) => {
    res.status(200).json({
        message: 'Welcome great user',
        EntraData: 'I love to coding'
    })

};
const DepartmentList = [
    { "id": 1, "name": "Angularjs" },
    { "id": 2, "name": "JavaScript" },
    { "id": 3, "name": "NodeJs" },
    { "id": 4, "name": "Deno" },
    { "id": 5, "name": "MongoDB" },
    { "id": 6, "name": "ReactJS" },
];

// Get Department list
exports.GetDepartments = (req, res) => {
    res.status(200).json(DepartmentList);
}

exports.GetDepartmentById = (req, res) => {
    console.log(req.params)
    const result = DepartmentList.find(depart => depart.id == req.params.id)
    if (result) {
        console.log(result);
        res.status(201).json({
            data: result,
            message: 'Department found successfully'
        })
    } else {
        res.status(500).json({
            error: "Department not found"
        });
    }

}

// Get GetEmployees list
exports.GetEmployees = (req, res) => {
    res.status(200).json({
        message: 'Welcome great user',
        EntraData: 'I love to coding'
    })
}


// create person
exports.RegisterPerson = (req, res, next) => {
    Person.find({ mobile: req.body.name })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "User Exists"
                })
            } else {
                const person = new Person({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    age: req.body.age,
                    salary: req.body.salary,
                });
                person.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created successfull'
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            }
        })
        .catch()

};