export const isAdmin = (req,res,next)=>{
  if(req.user && req.user.role === "admin"){
    // console.log("just hit here");
    next();
  }else{
    return res.status(403).json({message:"Access denied. Admins only."});
  }
};