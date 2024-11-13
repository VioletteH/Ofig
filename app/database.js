// 1. require le module
import pg from 'pg';

// 2. Créer un client
const client = new pg.Client(process.env.PG_URL);

// 3. Connecter le client
await client.connect();

// 4. Exporter le client connecté
export default client;
