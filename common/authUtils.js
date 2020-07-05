const jwt = require('jsonwebtoken');
const newSessionRoutes = { path: '/user/login', method: 'POST' };
const authRoutes = { path: '/user/password', method: 'PUT' };
const SECRET_KEY = "JWT_SECRET";

const clientApiKeyValidation = async(req, res, next ) => {
    let apiKey = req.get('api_key');
    if(!apiKey) {
        return res.status(400).send({status: false, response: "Missing API key"});
    }
    try {
        let clientDetails = await getClientDetails(req.db, apiKey);
        if(clientDetails){
            next();
        }
    } catch(error) {
        console.log(error);
        return res.status(400).send({status: false, response: "Invalid API key"});
    }
}

const isNewSessionRequired = (httpMethod, url) => {
    return (newSessionRoutes.method === httpMethod && newSessionRoutes.path === url) ? true : false
};

const isAuthrequired = (httpMethod, url) => {
    return (authRoutes.method === httpMethod && authRoutes.path === url) ? true : false;
}

const generateJWTtoken = (userData) => {
    return jwt.sign(userData, SECRET_KEY);
} 

const verifyToken = (jwtToken) => {
    try {
        return jwt.verify(jwtToken, SECRET_KEY);
    } catch(error) {
        console.log(error);
        return null;
    }
}

module.exports = { clientApiKeyValidation, isNewSessionRequired, isAuthrequired, generateJWTtoken, verifyToken }