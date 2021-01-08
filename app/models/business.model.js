
const mongoose = require('mongoose');

const BusinessSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
    registrationNo: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

BusinessSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BusinessSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
    },
});

// module.exports = mongoose.model('Business', BusinessSchema);

const Business = mongoose.model('Business', BusinessSchema);

exports.Business = Business;


BusinessSchema.findById = function (cb) {
    return this.model('Business').find({ id: this.id }, cb);
};


exports.findById = (id) => {
    return BusinessSchema.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createBusiness = (businessData) => {
    const business = new Business(businessData);
    return business.save();
};

exports.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        Business.findOne({ "email": email }).exec((err, result) => {
            if (err) return reject(err);
            console.log(result)
            return resolve(result);
        })
    })
};


exports.getBusinessList = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Business.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};


