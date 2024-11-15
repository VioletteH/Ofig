//import path from 'node:path';
import figurineDataMapper from '../figurineDataMapper.js';

const mainController = {

  async homePage(request, response) {

        try{
          const figurines = await figurineDataMapper.getAllFigurines();
          response.render('accueil', {figurines});  
        }
        catch(error){
          console.error(error);
          response.status(500).send('Server Error');    
        }
  },

  async articlePage(request, response) {

    try{
      const figurineId = parseInt(request.params.id, 10);
      const oneFigurine = await figurineDataMapper.getOneFigurine(figurineId);
      const reviews = await figurineDataMapper.getAllReviews(figurineId);
      response.render('article', {oneFigurine, reviews});  
    }
    catch(error){
      console.error(error);
      response.status(500).send('Server Error');    
    }

  },

  async categoryPage(request, response, next) {

    try{
      const categoryUrl = request.params.category;
      const figurines = await figurineDataMapper.getCategory(categoryUrl);

      if (figurines.length === 0){
        next();
        return;
      }

      response.render('accueil', {figurines});  
    }
    catch(error){
      console.error(error);
      response.status(500).send('Server Error');    
    }

  },

};


export default mainController;
