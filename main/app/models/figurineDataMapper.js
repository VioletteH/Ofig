import client from "./database.js";

const figurineDataMapper = {
	async getAllFigurines() {
		const result = await client.query(`
            SELECT figurine.*, AVG(note) as note 
            FROM figurine LEFT JOIN review ON (review.figurine_id = figurine.id)
            GROUP BY figurine.id;`);
		console.log(result.rows);
		return result.rows;
	},

	async getOneFigurine(id) {
		const result = await client.query(
			`
            SELECT figurine.*, AVG(note) as note  
            FROM figurine LEFT JOIN review ON (review.figurine_id = figurine.id)
            WHERE figurine.id = $1
            GROUP BY figurine.id;`,
			[id],
		);
		return result.rows[0];
	},

	async getAllReviews(figurineId) {
		const result = await client.query(
			`
            SELECT * 
            FROM "review" 
            WHERE "figurine_id" = $1;`,
			[figurineId],
		);
		return result.rows;
	},

	async getCategory(figurineCategory) {
		const result = await client.query(
			`
            SELECT figurine.*, AVG(note) as note 
            FROM figurine LEFT JOIN review ON (review.figurine_id = figurine.id)
            WHERE category = $1
            GROUP BY figurine.id;`,
			[figurineCategory],
		);
		return result.rows;
	},

	async countCategory() {
		const result = await client.query(
			"SELECT category, COUNT(*) as count FROM figurine GROUP BY category;",
		);
		return result.rows;
	},

	async search(name) {
		const result = await client.query(
			`
            SELECT figurine.*, AVG(note) as note  
            FROM figurine LEFT JOIN review ON (review.figurine_id = figurine.id)
            WHERE figurine.name ILIKE $1
            GROUP BY figurine.id;`,
			[`%${name}%`],
		);
		return result.rows[0];
	},
};

export default figurineDataMapper;
