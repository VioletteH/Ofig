//import path from 'node:path';
import figurineDataMapper from '../figurineDataMapper.js';

const bookmarksController = {
  
  async bookmarksPage(request, response) {
    response.render('favoris', { bookmarks: request.session.bookmarks });
  },

  async bookmarksAdd(request, response) {

    try{

      const figurineId = parseInt(request.params.id, 10);
  
      if (!request.session.bookmarks) { 
        request.session.bookmarks = []; 
      }; 

      const isFigurineInList = request.session.bookmarks.some(figurine => figurine.id === figurineId); 

      if(!isFigurineInList){
        const figurine = await figurineDataMapper.getOneFigurine(figurineId); 
        request.session.bookmarks.push(figurine);
        console.log(request.session.bookmarks);
      };


    }
    catch(error){
      console.error(error);
      return response.status(500).send('Server Error');    
    }

    response.redirect('/bookmarks');
  },

  async bookmarksDelete(request, response) {

    try{

      const figurineId = parseInt(request.params.id, 10);

      const isFigurineInList = request.session.bookmarks.some(figurine => figurine.id === figurineId); 

      if(isFigurineInList){
        const figurine = await figurineDataMapper.getOneFigurine(figurineId); 
        const figurineToDelete = request.session.bookmarks.filter(figurine);
        console.log(figurineToDelete);
      };


    }
    catch(error){
      console.error(error);
      return response.status(500).send('Server Error');    
    }

    response.redirect('/bookmarks');
  },

};


export default bookmarksController;