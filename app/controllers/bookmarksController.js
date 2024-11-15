import figurineDataMapper from '../figurineDataMapper.js';

const bookmarksController = {

  bookmarksPage(request, response) {
    // request.session.bookmarks = request.session.bookmarks ?? [];

    if (!request.session.bookmarks) {
      request.session.bookmarks = [];
    };

    response.render('favoris', { bookmarks: request.session.bookmarks });
  },

  async bookmarksAdd(request, response) {

    try {

      const figurineId = parseInt(request.params.id, 10);

      if (!request.session.bookmarks) {
        request.session.bookmarks = [];
      };

      // MA VERSION
      const isFigurineInList = request.session.bookmarks.some(figurine => figurine.id === figurineId);

      if (!isFigurineInList) {
        const figurine = await figurineDataMapper.getOneFigurine(figurineId);
        request.session.bookmarks.push(figurine);
        console.log(request.session.bookmarks);
      };

      // VERSION CORRIGEE
      // const figurineToAdd = await figurineDataMapper.getOneFigurine(figurineToAddId);
      // if (!figurineToAdd){
      //   next();
      //   return;
      // }
      // const IShouldAddTheFigurine = !bookmarks.some(figurine => figurine.id === figurineToAddId);
      // if (IShouldAddTheFigurine){
      //   bookmarks.push(figurineToAdd);
      // }      

      response.redirect('/bookmarks');
    }
    catch (error) {
      console.error(error);
      return response.status(500).send('Server Error');
    }
  },

  async bookmarksDelete(request, response) {
    
    try {
      const figurineId = parseInt(request.params.id, 10);
      
      if (!request.session.bookmarks) {
        request.session.bookmarks = [];
      }

      // MA VERSION

      const isFigurineInList = request.session.bookmarks.some(figurine => figurine.id === figurineId);

      if (isFigurineInList) {
        const figurine = await figurineDataMapper.getOneFigurine(figurineId);
        const figurineBookmarkIndex = request.session.bookmarks.indexOf(figurine);
        request.session.bookmarks.splice(figurineBookmarkIndex, 1);
      };

      // VERSION CORRIGEE
      // request.session.bookmarks = request.session.bookmarks.filter(figurine => figurine.id !== figurineToDeleteId);
      
      response.redirect('/bookmarks');

    }
    catch (error) {
      console.error(error);
      return response.status(500).send('Server Error');
    }

  },

};


export default bookmarksController;