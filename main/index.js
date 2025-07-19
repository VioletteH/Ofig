import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import session from "express-session";
import { connectDb } from "./app/models/database.js"; // Importez la fonction de connexion
import router from "./app/router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();

app.locals.year = 2024;

app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: process.env.SESSION_SECRET,
		cookie: {
			secure: false,
			maxAge: 365 * 24 * 1000 * 60 * 60,
		},
	}),
);

app.set("view engine", "ejs");
// app.set("views", "app/views");
app.set("views", path.resolve(__dirname, "app/views")); // Chemin ABSOLU
// app.use(express.static('public'));
app.use(express.static(path.resolve(__dirname, "public")));

app.use(router);

// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });

async function startServer() {
	await connectDb(); // Attendre la connexion à la DB
	app.listen(PORT, () => {
		console.log(`Server started on http://localhost:${PORT}`);
	});
}

startServer();
