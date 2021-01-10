# NodeJs_CRUD

CRUD with nodejs and mongodb

Installation and app starting steps:

1. First you need to clone project

2. you Need to install all dependency by npm install command

3. You have to create "dbconfig" folder and inside this folder you need to create "database.config.js" file.

4. Inside database.config.js file you have to copy and paste following code:

   module.exports = {
   url: '' // here you need to pass mongodb database url or mongodb atlas database url.
   }

5. Last stape to start app by using npm start command.

You can find below api documentation:

#User Collection:

1. To create User{method: POST}:
   url: http://localhost:3000/api/signup

   User Models:

   {
   "name": "Vikash Kumar",
   "email": "megasoft909@gmail.com",
   "bio": "You are cool man",
   "profilePic": ""
   }

2. To get All user List with server side pagination{method: GET}:

   urls: http://localhost:3000/api/users

#Business Collection:

    1) To create Business{method: POST}:

        url: http://localhost:3000/api/createBusiness

    Business Model

    {
    "name": "Mobile",
    "mrp": "50000",
    "description": "smart phone",
    "productImage": ""
    }

    2) To get  All Business List with server side pagination{method: GET}:

        urls: http://localhost:3000/api/business

#Products Collections

    1) To create Business{method: POST}:

        url: http://localhost:3000/api/createProduct

        #Product Model:

        {
        "name": "Vikash Kumar",
        "email": "megasoft909@gmail.com",
        "registrationNo": "123456"
        }


    2) To get  All Business List with server side pagination{method: GET}:

        urls: http://localhost:3000/api/productList

    3) To delete Product{method: DELETE}:

        urls: http://localhost:3000/api/product/:productId

    4) To update product{method: PUT}:

        urls: http://localhost:3000/api/product
