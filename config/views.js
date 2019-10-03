const express = require('express');

module.exports = (app) => {
    app.set('view engine', 'ejs');
    app.set('views', 'views');
    app.use(express.static('./public'));
};