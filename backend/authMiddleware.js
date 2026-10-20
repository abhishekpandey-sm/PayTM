const {JWT_SECRET} = require("./config")
const jwt = require("jsonwebtoken")


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Authorization Token Missing"
        })
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET)

        if(!decoded.userId){
            return res.status(401).json({
                message: "Invalid token"
            })
        }

        req.userId = decoded.userId;
        
        next();
    } catch(error){
        return res.status(500).json({
            message: "Invalid or Expired Token"
        })
    }

}

module.exports = {
    authMiddleware
}