const errorHandler=(err,req,res,next)=>{
  let statusCode=err.statusCode || 500;
  let message=err.message || "Server Error";

  // Invalid MongoDB ObjectId
  if(err.name==="CastError"){
    statusCode=404;
    message="Resource not found";
  }

  // Duplicate key error
  if(err.code===11000){
    const field=Object.keys(err.keyValue)[0];
    statusCode=400;
    message=`${field} already exists`;
  }

  // Validation errors
  if(err.name==="ValidationError"){
    statusCode=400;
    message=Object.values(err.errors)
      .map(item=>item.message)
      .join(", ");
  }

  // Multer file size limit
  if(err.code==="LIMIT_FILE_SIZE"){
    statusCode=400;
    message="File size exceeds 10MB";
  }

  // Multer unexpected file
  if(err.code==="LIMIT_UNEXPECTED_FILE"){
    statusCode=400;
    message="Unexpected file upload";
  }

  // JWT invalid token
  if(err.name==="JsonWebTokenError"){
    statusCode=401;
    message="Invalid token";
  }

  // JWT expired token
  if(err.name==="TokenExpiredError"){
    statusCode=401;
    message="Token expired";
  }

  // Console logging
  console.error("Error:",{
    message:err.message,
    stack:process.env.NODE_ENV==="development"
      ? err.stack
      : undefined
  });

  res.status(statusCode).json({
    success:false,
    error:message,
    statusCode,

    ...(process.env.NODE_ENV==="development"
      ? { stack:err.stack }
      : {})
  });
};

export default errorHandler;