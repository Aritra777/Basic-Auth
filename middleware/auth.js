const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    console.log(req.cookies);
    const token = req.header('Authorization')?.replace('Bearer ', "") || req.cookies.token || req.body.token
    if(!token) {
       return res.status(403).send("token is missing");
    }

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decode);
        req.user = decode;
        // or bring more info about the user from DB.
    } catch (error) {
        return res.status(401).send("invalid token")
    }
    return next();
}

module.exports = isAuth