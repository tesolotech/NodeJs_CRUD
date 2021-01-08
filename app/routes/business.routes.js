

module.exports = (app) => {
    const business = require('../controllers/business.controller.js');

    app.post('/api/createBusiness', business.createBusiness);

    app.get('/api/business', business.GetAllBusiness);


}

