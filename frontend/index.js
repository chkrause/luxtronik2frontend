// index.js
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const luxtronik = require('luxtronik2');

const pump = luxtronik.createConnection('192.168.2.50', 8888);


const app = express();

app.use((request, response, next) => {
    console.log(request.path);
    next();
})

app.use((request, response, next) => {
    request.chance = Math.random();
    next();
})

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (request, response) => {
    pump.read(function (err, data) {
        if (err) {
            return console.log(err);
        }

        response.render('home', {
            data: data.additional
        });
    });
})

app.get('/*', (request, response) => {
    throw new Error('404');
})

app.use((err, request, response, next) => {
    // log the error, for now just console.log
    console.log(err);
    response.status(404);
    response.render('404');
})

app.listen(3000);