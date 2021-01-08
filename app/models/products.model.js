
const mongoose = require('mongoose');

const ProductsSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    mrp: { type: String, required: true },
    description: { type: String },
    productImage: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

// module.exports = mongoose.model('Products', ProductsSchema);


ProductsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ProductsSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
    },
});

const Product = mongoose.model('Product', ProductsSchema);

exports.Product = Product;


ProductsSchema.findById = function (cb) {
    return this.model('Product').find({ id: this.id }, cb);
};


exports.findById = (id) => {
    return ProductsSchema.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createProducts = (productsData) => {
    const products = new Product(productsData);
    return products.save();
};

exports.findByName = (name) => {
    return new Promise((resolve, reject) => {
        Product.findOne({ "name": name }).exec((err, result) => {
            if (err) return reject(err);
            return resolve(result);
        })
    })
};


exports.getProductsList = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Product.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, prod) {
                if (err) {
                    reject(err);
                } else {
                    resolve(prod);
                }
            })
    });
};


exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        Product.remove({ _id: id }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

exports.updateData = (id, data) => {
    return new Promise((resolve, reject) => {
        Product.findByIdAndUpdate(id, { $set: data }, { new: true, upsert: true }, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    })
}

