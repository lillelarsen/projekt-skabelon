require('dotenv').config();
const express = require('express');
const app = express();

// CONFIG
require('./config/session')(app);
require('./config/flash')(app);
require('./config/parser')(app);
require('./config/locals')(app);
require('./config/views')(app);


// ROUTES
require('./routes/main.route.js')(app);
require('./routes/admin-main.route.js')(app);

require('./routes/signup.route.js')(app);
require('./routes/signup.route.js')(app);

require('./routes/users.route.js')(app);
require('./routes/profile.route.js')(app);
require('./routes/login.route.js')(app);

require('./routes/categories.route.js')(app);
require('./routes/products.route.js')(app);
require('./routes/images.route.js')(app);




// SERVER
require('./server/server')(app);