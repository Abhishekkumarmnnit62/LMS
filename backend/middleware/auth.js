import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect=async(req,res,next)=>{
    let token;

    // Check if token exists
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        try{
            // Get token
            token=req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded=jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Find user
            req.user=await User.findById(decoded.id)
                .select('-password');

            // User not found
            if(!req.user){
                return res.status(401).json({
                    success:false,
                    error:'Not authorized, user not found',
                    statusCode:401
                });
            }

            next();
        }
        catch(error){
            console.error(
                'Auth middleware error:',
                error.message
            );

            // Token expired
            if(error.name==='TokenExpiredError'){
                return res.status(401).json({
                    success:false,
                    error:'Token expired',
                    statusCode:401
                });
            }

            return res.status(401).json({
                success:false,
                error:'Not authorized, token failed',
                statusCode:401
            });
        }
    }

    // No token
    if(!token){
        return res.status(401).json({
            success:false,
            error:'Not authorized, no token provided',
            statusCode:401
        });
    }
};

export default protect;