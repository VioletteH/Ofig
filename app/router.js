import express from 'express';
import mainController from './controllers/mainController.js';
import bookmarksController from './controllers/bookmarksController.js';
import categoriesMW from './middlewares/categories.js';

const router = express.Router();

// page d'accueil
router.get('/', categoriesMW, mainController.homePage);

// page article
router.get('/article/:id', categoriesMW, mainController.articlePage);

// page favoris
router.get('/bookmarks', bookmarksController.bookmarksPage);
router.get('/bookmarks/add/:id', bookmarksController.bookmarksAdd);
router.get('/bookmarks/delete/:id', bookmarksController.bookmarksDelete);

// page category
router.get('/category/:category', categoriesMW, mainController.categoryPage);

// on exporte le router 
export default router;
