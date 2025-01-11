import figurineDataMapper from "../models/figurineDataMapper.js";

async function categoriesMW (req, res, next){
  res.locals.categories = await figurineDataMapper.countCategory(); 
  next();
}

export default categoriesMW;

