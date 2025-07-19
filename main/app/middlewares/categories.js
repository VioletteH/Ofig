import figurineDataMapper from "../models/figurineDataMapper.js";

async function categoriesMW (req, res, next){
  try {
  res.locals.categories = await figurineDataMapper.countCategory(); 
  next();
  } catch (error) {
    console.error(error);
    next(error); 
  }
}

export default categoriesMW;

