import figurineDataMapper from "../figurineDataMapper.js";

async function categoriesMW (req, res, next){
  res.locals.categories = await figurineDataMapper.countCategory(); 
  next();
}

export default categoriesMW;

// OPTION 1 (sans MW)
// Dans mainController > fonctions homePage et articlePage
// const categories = await figurineDataMapper.countCategory();
// response.render('accueil', {figurines});

// OPTION 2 (avec MW global)
// Dans index
// import categoriesMW from './middlewares/categories.js';
// app.use(categoriesMW);

// OPTION 3 (avec MW par route)
// Dans router puis dans les routes utiles
// import categoriesMW from './middlewares/categories.js';
// router.get('/article/:id', categoriesMW, mainController.articlePage);