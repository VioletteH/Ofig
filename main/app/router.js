import express from "express";
import bookmarksController from "./controllers/bookmarksController.js";
import mainController from "./controllers/mainController.js";
import categoriesMW from "./middlewares/categories.js";

const router = express.Router();

router.get("/", categoriesMW, mainController.homePage);
router.get("/article/:id", categoriesMW, mainController.articlePage);
router.get("/bookmarks", bookmarksController.bookmarksPage);
router.get("/bookmarks/add/:id", bookmarksController.bookmarksAdd);
router.get("/bookmarks/delete/:id", bookmarksController.bookmarksDelete);
router.get("/category/:category", categoriesMW, mainController.categoryPage);
router.get("/search", categoriesMW, mainController.search);

export default router;
