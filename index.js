// Toujours commencer par importer les variables d'environnement !
import 'dotenv/config';

import express from 'express';
 

// on importe le router
import router from './app/router.js';

// un peu de config
const PORT = process.env.PORT || 3000;

const app = express();

import session from 'express-session';
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "Guess it!",
  cookie: {
    secure: false,
  }
}));

app.set("view engine", "ejs");
app.set("views", "app/views");

// servir les fichiers statiques qui sont dans "integration"
app.use(express.static('public'));

// routage !
app.use(router);

// on lance le serveur
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
