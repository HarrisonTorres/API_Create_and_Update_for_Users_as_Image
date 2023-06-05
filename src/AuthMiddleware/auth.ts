import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayLoad{
    sub: string;
}

class AuthMiddleware {
    async auth(request: Request, response: Response, next: NextFunction) {
        const authHeader  = request.headers.authorization;
        if(!authHeader){
            return response.status(401).json({code: "Token.missing" , message: "Token missing"});
        }
        const [ , token] = authHeader.split(" ");
        const secretKey = process.env.ACCESS_KEY_TOKEN;
        if(!secretKey){
            return response.status(401).json({code: "Token.missing" , message: "There is no secret key"});
        }
        try{
            const {sub} = verify(token, secretKey) as IPayLoad;
            request.user_id = sub;
            return next();
        }catch(error){
            response.status(401).json({code: "Token.expired" , message: "Token expired"});
        }
    }
    
}

export { AuthMiddleware };