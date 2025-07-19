import figurineDataMapper from "../models/figurineDataMapper.js";

async function categoriesMW(
	// biome-ignore lint/correctness/noUnusedVariables: 'req' est un paramètre standard des middlewares Express, même s'il n'est pas utilisé ici.
	req, res, next) {
	try {
		res.locals.categories = await figurineDataMapper.countCategory();
		next();
	} catch (error) {
		console.error(error);
		next(error);
	}
}

export default categoriesMW;
