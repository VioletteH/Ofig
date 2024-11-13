// Toujours commencer par importer les variables d'environnement !
import 'dotenv/config';

import express from 'express';

// on importe le router
import router from './app/router.js';

// un peu de config
const PORT = process.env.PORT || 3000;

const app = express();

// servir les fichiers statiques qui sont dans "integration"
app.use(express.static('integration'));

// routage !
app.use(router);

// on lance le serveur
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
