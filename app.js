'use strict'

// Cargar modulos de node para crear el servidor

var express=require('express');
var bodyParser=require('body-parser')


//Ejecutar express hhtp:
var app = express();

//cargar ficheros de rutas
var rutes=require('./rutes/articles');

//Middlewares se ejecutan antes de un fichero siempre
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//Cors es el acceso cruzado entre dominio para permitir el acceso/comunicacion al api desde cualquier front end
// Configurar cabeceras y cors
//este es middlewares que se ejcuta antes de los meotodos
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');//cofigurar el control acceso para que cualqueira pueda hacer peticiones
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Anadir prefijos a las rutas/cargar rutas
app.use('/',rutes)

//Exportar modulos
module.exports = app;