import pg from "pg";

const client = new pg.Client(process.env.PG_URL);
// await client.connect();
// export default client;

// Exportez une fonction asynchrone pour la connexion
export async function connectDb() {
	try {
		await client.connect();
		console.log("Connexion à la base de données établie.");
	} catch (error) {
		console.error("Erreur de connexion à la base de données :", error);
		// Gérer l'erreur, par exemple en arrêtant l'application
		process.exit(1); // Arrêter l'application si la connexion échoue
	}
}

// Exportez le client pour qu'il puisse être utilisé par les data mappers après connexion
export default client;
