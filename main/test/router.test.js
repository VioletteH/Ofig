// main/test/router.test.js

import request from 'supertest';
import express from 'express';

// Déclarons les objets/fonctions mockées au niveau global du fichier de test.
// Jest gérera leur "hoisting" et les rendra accessibles au moment où jest.mock() est évalué.

// Mock pour mainController.js (qui exporte un objet par défaut)
const mockedMainController = {
  homePage: jest.fn((req, res) => res.status(200).send('Home')),
  articlePage: jest.fn((req, res) => res.status(200).send('Article')),
  categoryPage: jest.fn((req, res, next) => res.status(200).send('Category')),
  search: jest.fn((req, res, next) => res.status(200).send('Search')),
};

// Configurer le mock pour le module mainController.js
jest.mock('../app/controllers/mainController.js', () => ({
  default: mockedMainController // Le default export sera notre objet mocké
}));

// Mock pour bookmarksController.js (qui exporte un objet par défaut)
const mockedBookmarksController = {
  bookmarksPage: jest.fn((req, res) => res.status(200).send('Bookmarks')),
  bookmarksAdd: jest.fn((req, res) => res.status(200).send('Bookmark added')),
  bookmarksDelete: jest.fn((req, res) => res.status(200).send('Bookmark deleted')),
};

// Configurer le mock pour le module bookmarksController.js
jest.mock('../app/controllers/bookmarksController.js', () => ({
  default: mockedBookmarksController // Le default export sera notre objet mocké
}));

// Mock pour categories.js (qui exporte une fonction middleware par défaut)
const mockedCategoriesMW = jest.fn((req, res, next) => {
  res.locals.categories = []; // Simule l'ajout des catégories à res.locals
  next(); // Appel obligatoire pour un middleware qui passe la main
});

// Configurer le mock pour le module categories.js
jest.mock('../app/middlewares/categories.js', () => ({
  default: mockedCategoriesMW // Le default export sera notre fonction mockée
}));


// --- Importation du routeur après les mocks ---
// Il est CRUCIAL d'importer le routeur ici, APRÈS que tous les mocks aient été définis.
// Jest s'assurera que lorsque 'router.js' est chargé, il utilise les versions moquées
// de ses dépendances (contrôleurs et middlewares).
import router from '../app/router.js';


// --- Configuration de l'application Express pour le test ---
const app = express();
app.use(express.json()); // Essentiel si votre routeur gère des corps de requête JSON (POST/PUT/PATCH)
app.use(router); // Utilisation du routeur principal


// --- Suite de tests pour le routeur ---
describe('Router', () => {
  // Réinitialise l'état de tous les mocks avant chaque test
  beforeEach(() => {
    // Nettoyer les appels et les retours de chaque fonction mockée individuelle
    mockedMainController.homePage.mockClear();
    mockedMainController.articlePage.mockClear();
    mockedMainController.categoryPage.mockClear();
    mockedMainController.search.mockClear();

    mockedBookmarksController.bookmarksPage.mockClear();
    mockedBookmarksController.bookmarksAdd.mockClear();
    mockedBookmarksController.bookmarksDelete.mockClear();

    mockedCategoriesMW.mockClear();
  });

  // --- Tests des routes ---

  // Test de la route '/'
  test('GET / calls categoriesMW and mainController.homePage', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(mockedCategoriesMW).toHaveBeenCalledTimes(1);
    expect(mockedMainController.homePage).toHaveBeenCalledTimes(1);
  });

  // Test de la route '/article/:id'
  test('GET /article/:id calls categoriesMW and mainController.articlePage', async () => {
    const res = await request(app).get('/article/123');
    expect(res.statusCode).toEqual(200);
    expect(mockedCategoriesMW).toHaveBeenCalledTimes(1);
    expect(mockedMainController.articlePage).toHaveBeenCalledTimes(1);
    expect(mockedMainController.articlePage).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: '123' } }),
      expect.any(Object),
      expect.any(Function)
    );
  });

  // Test de la route '/bookmarks'
  test('GET /bookmarks calls bookmarksController.bookmarksPage', async () => {
    const res = await request(app).get('/bookmarks');
    expect(res.statusCode).toEqual(200);
    expect(mockedBookmarksController.bookmarksPage).toHaveBeenCalledTimes(1);
  });

  // Test de la route '/bookmarks/add/:id'
  test('GET /bookmarks/add/:id calls bookmarksController.bookmarksAdd', async () => {
    const res = await request(app).get('/bookmarks/add/456');
    expect(res.statusCode).toEqual(200);
    expect(mockedBookmarksController.bookmarksAdd).toHaveBeenCalledTimes(1);
    expect(mockedBookmarksController.bookmarksAdd).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: '456' } }),
      expect.any(Object),
      expect.any(Function)
    );
  });

  // Test de la route '/bookmarks/delete/:id'
  test('GET /bookmarks/delete/:id calls bookmarksController.bookmarksDelete', async () => {
    const res = await request(app).get('/bookmarks/delete/789');
    expect(res.statusCode).toEqual(200);
    expect(mockedBookmarksController.bookmarksDelete).toHaveBeenCalledTimes(1);
    expect(mockedBookmarksController.bookmarksDelete).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: '789' } }),
      expect.any(Object),
      expect.any(Function)
    );
  });

  // Test de la route '/category/:category'
  test('GET /category/:category calls categoriesMW and mainController.categoryPage', async () => {
    const res = await request(app).get('/category/fantasy');
    expect(res.statusCode).toEqual(200);
    expect(mockedCategoriesMW).toHaveBeenCalledTimes(1);
    expect(mockedMainController.categoryPage).toHaveBeenCalledTimes(1);
    expect(mockedMainController.categoryPage).toHaveBeenCalledWith(
      expect.objectContaining({ params: { category: 'fantasy' } }),
      expect.any(Object),
      expect.any(Function)
    );
  });

  // Test de la route '/search'
  test('GET /search calls categoriesMW and mainController.search', async () => {
    const res = await request(app).get('/search?query=cloud');
    expect(res.statusCode).toEqual(200);
    expect(mockedCategoriesMW).toHaveBeenCalledTimes(1);
    expect(mockedMainController.search).toHaveBeenCalledTimes(1);
    expect(mockedMainController.search).toHaveBeenCalledWith(
      expect.objectContaining({ query: { query: 'cloud' } }),
      expect.any(Object),
      expect.any(Function)
    );
  });
});