const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String },
    profilePic: { type: String }
}, {
    timestamps: true
});

UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
    },
});

// module.exports = mongoose.model('User', UserSchema);

const User = mongoose.model('User', UserSchema);

exports.User = User;


UserSchema.findById = function (cb) {
    return this.model('User').find({ id: this.id }, cb);
};


exports.findById = (id) => {
    return UserSchema.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        User.findOne({ "email": email }).exec((err, result) => {
            if (err) return reject(err);
            console.log(result)
            return resolve(result);
        })
    })
};


exports.getUserrList = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
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


