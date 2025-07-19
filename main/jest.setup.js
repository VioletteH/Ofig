import path from "node:path";
import dotenv from "dotenv";

// On utilise directement __dirname qui devrait être fourni par Node.js/Babel
// dans l'environnement CommonJS des tests.
const currentDirname = __dirname; // __dirname devrait être disponible ici
process.env.NODE_ENV = "test";
dotenv.config({ path: path.resolve(currentDirname, ".env.test") });
