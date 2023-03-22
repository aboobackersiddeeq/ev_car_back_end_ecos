const jwt=require('jsonwebtoken')
module.exports.adminJwt = async (req, res, next) => {
  const token = req.headers["x-access-admintoken"];
  if (!token) {
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        res.json({
          auth: false,
          status: "failed",
          message: "failed to authenticate",
        });
      } else { 
        console.log(decoded,'decoded');
        req.adminId = decoded.adminId;
        next();
      }
    });
  }
};

module.exports.dealerJwt = async(req,res,next)=>{
    const token =req.headers['x-access-dealertoken']
    if(!token){
        res.json({status: 'failed',message : 'you need token'})
    }else{
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if (err) {
            console.log(err);
            res.json({
              auth: false,
              status: "failed",
              message: "failed to authenticate",
            });
          } else {
            req.dealerId = decoded.dealerId;
            next();
          }

    })
    }
}
