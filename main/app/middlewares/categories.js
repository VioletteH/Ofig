import figurineDataMapper from "../models/figurineDataMapper.js";

async function categoriesMW(_req, res, next) {
	try {
		void _req;
		res.locals.categories = await figurineDataMapper.countCategory();
		next();
	} catch (error) {
		console.error(error);
		next(error);
	}
}

export default categoriesMW;
