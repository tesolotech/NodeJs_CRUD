
// const checkAuth = require('../middleware/check_auth');

module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    app.post('/api/signup', users.signupUser);

    app.get('/api/users', users.getUserListPaging);

}

