import path from 'node:path';

const mainController = {

  // méthode pour la page d'accueil
  homePage(request, response) {
    // Remplacer le response.sendFile par le rendu d'un fichier EJS
    response.sendFile('accueil.html', {
      root: path.join(import.meta.dirname, '../../integration'),
    });
  },

  // méthode pour la page article
  articlePage(request, response) {
    // Remplacer le response.sendFile par le rendu d'un fichier EJS
    response.sendFile('article.html', {
      root: path.join(import.meta.dirname, '../../integration'),
    });
  }
};


export default mainController;
