import client from './database.js';

const figurineDataMapper = {
    async getAllFigurines(){
        const result = await client.query(`SELECT * FROM "figurine";`);
        return result.rows;    
    },

    async getOneFigurine(id){
        const result = await client.query(`SELECT * FROM "figurine" WHERE "id" = $1;`, [id]);
        return result.rows[0]; 
    },

    async getAllReviews(figurineId){
        const result = await client.query(`SELECT * FROM "review" WHERE "figurine_id" = $1;`, [figurineId]);
        return result.rows; 
    },
    
    async getCategory(figurineCategory){
        const result = await client.query(`SELECT * FROM "figurine" WHERE LOWER(category) = $1;`, [figurineCategory]);
        return result.rows; 
    }
};

export default figurineDataMapper;