'use strict'

var mongoose= require('mongoose');
var app=require('./app')
var port=3900;

mongoose.set('useFindAndModify',false);
mongoose.Promise=global.Promise
mongoose.connect('mongodb://localhost:27017/api_rest_blog',{useNewUrlParser: true})
                .then(()=>{
                    console.log('conexion a la base de datos exitosa.!!!')

                    //crear el servidor que escuche peticion http
                    app.listen(port,()=>{
                        console.log('Escuchando desde el puerto : '+port);
                    });
                })