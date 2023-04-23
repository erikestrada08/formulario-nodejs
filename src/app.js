//levantamos un servidor local con el framework express
const express = require('express');
const app = express();
const path = require('path'); //es multiplataforma
const morgan = require('morgan');

//configuracion de la app
app.set('port',5000); //establecemos el puerto que usara la app web en el servidor
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');//establecer motor de plantillas


//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));//recibe la informacion de los formularios y los convierte a json


//routes
app.use(require('./routes/index'));

//archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//404 error
app.use((req, res, next)=>{
    res.status(404).send('404');
})

module.exports = app;