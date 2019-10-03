const db = require('../config/mysql');
/**
 * @module controller/home
 */

/**
 * Denne funktion retunerer main.ejs med data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */

exports.main = async (req, res, next) => {
    try {
        const userSql = `SELECT products.id, products.name, products.description, products.price, products.weight, products.amount, categories.name AS category, images.name AS image 
                        FROM products 
                        INNER JOIN categories ON products.fk_category = categories.id
                        INNER JOIN images ON products.fk_image = images.id
                        ORDER BY RAND() LIMIT 3 `;
        const [rows, fields] = await db.query(userSql);        
        res.render('client/main', { 'title': 'Hej verden', 'content': 'Forside', 'products': rows });
    } catch (error) {
        console.log(error);
        res.send("Kan ikke hente produkter");
    }
}