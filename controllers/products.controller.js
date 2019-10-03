const db = require('../config/mysql');
/**
 * @module controller/products
 */

 /**
 * Denne funktion retunerer create-product.ejs
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.showProductCreateForm = async function(req, res, next) {
    try {
        const imagesSQL = `SELECT id, name FROM images`;
        const [images] = await db.query(imagesSQL);

        const categoriesSql = `SELECT categories.name, categories.id FROM categories`;
        const [rows, fields] = await db.query(categoriesSql); 
        res.render('admin/create-product', { 'images': images, 'title': 'Opret produkt', 'content': 'Opret produkt i formen', 'categories': rows});
    } catch (error) {
        console.log(error);
        res.send("Kan ikke indlæse siden");
    }
}

/**
 * Denne funktion opretter med POST et product
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.createProduct = async function(req, res, next) {
    try {       
        const categorySQL = `INSERT INTO products SET name = :name, description = :description, fk_category = :category, fk_image = :image`;
        const category = await db.query(categorySQL, {name: req.fields.name, description: req.fields.description, category: req.fields.category, image: req.fields.chooseImage});
        res.redirect('/products');
    } catch (error) {
        console.log(error);
        res.send("Kan ikke oprette produkt");
    }
}

/**
 * Denne funktion retunerer products.ejs med data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.getProducts = async function(req, res, next) {
    let values = req.query;
       
    // bestem hvor mange elementer der skal vises pr side
    let limit = Number(values.items) || 10;
    // vi går som standard ud fra at det er den første side der skal vises
    console.log(limit);
    
    let current_page = 1;
    // tjek at page findes i querystring og at det er et tal
    if (values.page != undefined) {
        if (parseInt(values.page) < 1) {
            res.redirect('/products');
            return;
        }
        if (parseInt(values.page) >= 1) {
            current_page = parseInt(values.page);
        }
    }
    // find ud af hvor mange produkter der er i databasen
    let [result] = await db.execute('SELECT COUNT(*) AS total_items FROM products');
    let total_items = result[0].total_items;

    // beregn hvor mange produkter der skal springes over 
    // for at vise den pågældende side
    let offset = (current_page - 1) * limit;

    // beregn hvor mange sider der er i alt, 
    // baseret på antal elementer og elementer pr side
    let total_pages = Math.ceil(total_items / limit);

    // hvis "offset" er større end totalle antal items, så indlæses den sidste side
    if (offset > total_items) {
        res.redirect(`/products?page=${total_pages}&items=${limit}`);
        return;
    }

    

    try {
        const userSql = `SELECT products.id, products.name, products.description, products.price, products.weight, products.amount, categories.name AS category, images.name AS image 
                        FROM products 
                        INNER JOIN categories ON products.fk_category = categories.id
                        INNER JOIN images ON products.fk_image = images.id
                        ORDER BY products.name
                        LIMIT :productlimit OFFSET :productoffset`;
        const [rows, fields] = await db.query(userSql, {productlimit: limit, productoffset: offset});        
        res.render('admin/products', { 
            'title': 'Produkter', 
            'content': 'en liste over produkter', 
            'products': rows,
            'total_pages': total_pages,
            'current_page': current_page,
            'itemsPerPage': limit
        });
    } catch (error) {
        console.log(error);
        res.send("Kan ikke hente produkter");
    }
}

/**
 * Denne funktion retunerer edit-product.ejs med data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.showProductForm = async function(req, res, next) {
    try {
        const userSQL = `SELECT products.id, products.name, products.description, products.fk_category, categories.name AS category, categories.id FROM products 
                        INNER JOIN categories ON products.fk_category = categories.id
                        WHERE products.id = :id`;
        const [userRows] = await db.query(userSQL, {id: req.params.id});


        const imagesSQL = `SELECT id, name FROM images`;
        const [images] = await db.query(imagesSQL);

        const categorySQL = `SELECT id, name, description FROM categories`;
        const [categoryRows] = await db.query(categorySQL);
        res.render('admin/edit-product', { 'images': images, 'title': 'Redigér', 'content': 'Redigér kategorien', 'product': userRows[0], 'categories': categoryRows  });
    } catch (error) {
        console.log(error);
        res.send("Kan ikke finde bruger");
    }
}

/**
 * Denne funktion opdaterer product data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.editProduct = async function(req, res, next) {
    try {
        const userSQL = `UPDATE products SET name = :name, description = :description, fk_category = :category WHERE id = :id`;

        const user = await db.query(userSQL, {id: req.params.id, name: req.fields.name, description: req.fields.description ,category: req.fields.category});
        res.redirect('/editProduct/' + req.params.id);
    } catch (error) {
        console.log(error);
        res.send("Kan ikke opdatere brugere");
    }
}
/**
 * Denne funktion sletter product data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.deleteProduct = async function(req, res, next) {
    try {
        const productSQL = `DELETE FROM categories WHERE id = (
            SELECT fk_category FROM products WHERE id = :id
        )`;

        await db.query(productSQL, {id: req.params.id});
        res.redirect('/products');
    } catch (error) {
        console.log(error);
        res.send("Kan ikke slette produkt");
    }
}


exports.searchProducts = async function(req, res, next) {    
    try {        
        let searchSQL = `SELECT products.id, products.name, products.description, products.price, products.weight, products.fk_category, products.amount, categories.name AS category, images.name AS image 
                        FROM products 
                        INNER JOIN categories ON products.fk_category = categories.id
                        INNER JOIN images ON products.fk_image = images.id
                        WHERE 1=1`;

        let countSQL = `SELECT COUNT(*) AS total_items FROM products WHERE 1=1`;

        // hent værdierne fra querystring
    let values = req.query;

    // tjek alle de værdier vi ønsker at kunne benytte i søgningen
    // sæt standard værdier hvis noget mangler
    if (values.name == undefined) {
        values.name = '';
    }
    if (values.category == undefined) {
        values.category = '';
    }
    if (values.producent == undefined) {
        values.producent = '';
    }
    if (values.globalsearch == undefined) {
        values.globalsearch = '';
    }
    if (values.minimumprice == undefined || isNaN(values.minimumprice)) {
        values.minimumprice = '';
    }
    if (values.maximumprice == undefined || isNaN(values.maximumprice)) {
        values.maximumprice = '';
    }
    if (parseInt(values.minimumprice) > parseInt(values.maximumprice)) {
        let temp = values.maximumprice;
        values.maximumprice = values.minimumprice;
        values.minimumprice = temp;
    }
    ////////////////////////////////////////////////////////////////////////
    // bestem hvor mange elementer der skal vises pr side
    if (values.items == undefined) {
        values.items = 10;
    }
    let limit = parseInt(values.items) || 10;
    // vi går som standard ud fra at det er den første side der skal vises
    
    let current_page = 1;
    // tjek at page findes i querystring og at det er et tal
    if (values.page != undefined) {
        if (parseInt(values.page) < 1) {
            res.redirect('/produkter');
            return;
        }
        if (parseInt(values.page) >= 1) {
            current_page = parseInt(values.page);
        }
    }
        // beregn hvor mange produkter der skal springes over 
        // for at vise den pågældende side
         let offset = (current_page - 1) * limit;
 
         if(offset == '' && offset == undefined) {
             offset = 0;
         }
 
        // start params samlingen, den skal bare være tom til at starte med
        let sql_params = []

        if (values.name != undefined && values.name != '') {
            searchSQL += ' AND products.name LIKE ? ';
            countSQL += ' AND products.name LIKE ? ';
            sql_params.push('%' + values.name + '%');
        }
        if (values.globalsearch != undefined && values.globalsearch != '') {
            searchSQL += ' AND (products.name LIKE ? OR products.description LIKE ? )';
            countSQL += ' AND (products.name LIKE ? OR products.description LIKE ? )';
            sql_params.push('%' + values.globalsearch + '%');
            sql_params.push('%' + values.globalsearch + '%');
        }
        if (values.category != undefined && values.category != '') {
            searchSQL += ' AND products.fk_category = ? ';
            countSQL += ' AND products.fk_category = ? ';
            sql_params.push(parseInt(values.category));
        }
        if (values.producent != undefined && values.producent != '') {
            searchSQL += ' AND fk_producent_id = ? ';
            countSQL += ' AND fk_producent_id = ? ';
            sql_params.push(values.producent);
        }
        if (values.minimumprice != undefined && values.minimumprice != '') {
            searchSQL += ' AND products.price >= ? ';
            countSQL += ' AND products.price >= ? ';
            sql_params.push(parseInt(values.minimumprice));
        }
        if (values.maximumprice != undefined && values.maximumprice != '') {
            searchSQL += ' AND products.price <= ? ';
            countSQL += ' AND products.price <= ? ';
            sql_params.push(parseInt(values.maximumprice));
        }

        if (values.page != undefined && values.page != '' && values.items != undefined && values.items != '') {
            values.page = 1;
            values.items = 10;
        }

        if (values.page != undefined && values.page != '' && values.items != undefined && values.items != '') {
            if (limit >= 0 && offset >= 0) {
                searchSQL += ' LIMIT ? OFFSET ? ';
                sql_params.push(limit, offset);
            }
        }

         // find ud af hvor mange produkter der er i databasen
         let [result] = await db.execute(countSQL, sql_params);
         console.log(result);
         
         let total_items = result[0].total_items;
 
         // beregn hvor mange sider der er i alt, 
         // baseret på antal elementer og elementer pr side
         let total_pages = Math.ceil(total_items / limit);
 
         // hvis "offset" er større end totalle antal items, så indlæses den sidste side
         if (offset > total_items) {
             res.redirect(`/produkter?page=${total_pages}&items=${limit}`);
             return;
         }
        
        const categorySQL = `SELECT id, name, description FROM categories`;
        const [categoryRows] = await db.query(categorySQL);
        
        const [rows] = await db.query(searchSQL, sql_params);
        res.render('client/products', { 
            'title': 'Produkter', 
            'content': 'en liste over produkter', 
            'products': rows, 
            'categories': categoryRows,
            'total_pages': total_pages,
            'current_page': current_page,
            'itemsPerPage': limit,
            'page_number': values.page,
            'name': values.name,
            'globalsearch': values.globalsearch,
            'category': values.category,
            'minimumprice': values.minimumprice,
            'maximumprice': values.maximumprice


        });

    } catch (error) {
        console.log(error);
        res.send("Kan ikke finde resultater");
    }
    
}

exports.showProduct = async function(req, res, next) {
    try {
        const productSQL = `SELECT products.id AS id, products.name AS name, products.description, products.fk_category, categories.name AS category, categories.id AS categoryId FROM products 
                        INNER JOIN categories ON products.fk_category = categories.id
                        WHERE products.id = :id`;
        const [productRows] = await db.query(productSQL, {id: req.params.id});

        const productsSQL = `SELECT products.id AS id, products.name AS name, products.description, products.fk_category, categories.name AS category, categories.id FROM products 
                        INNER JOIN categories ON products.fk_category = categories.id
                        WHERE products.fk_category = :id`;
        const [productsRows] = await db.query(productsSQL, {id: productRows[0].categoryId});

        res.render('client/product', { 'title': productRows[0].name, 'content': 'Redigér kategorien', 'product': productRows[0], 'products': productsRows });
    } catch (error) {
        console.log(error);
        res.send("Kan ikke finde bruger");
    }
}

exports.showCategory = async function(req, res, next) {
    try {
        const userSQL = `SELECT products.id AS productid, products.name, products.description, products.fk_category, categories.name AS category, categories.id FROM products 
                        INNER JOIN categories ON products.fk_category = categories.id
                        WHERE products.fk_category = :id`;
        const [userRows] = await db.query(userSQL, {id: req.params.id});

        const categorySQL = `SELECT id, name, description FROM categories`;
        const [categoryRows] = await db.query(categorySQL);

        if(req.params.id == 0 || req.params.id == 'undefined') {
            res.render('client/categories', { 'title': 'Redigér', 'content': 'Redigér kategorien','categories': categoryRows  });
        } else {
            res.render('client/categories-list', { 'title': 'Redigér', 'content': 'Redigér kategorien', 'products': userRows, 'categories': categoryRows  });
        }
    } catch (error) {
        console.log(error);
        res.send("Kan ikke finde bruger");
    }
}