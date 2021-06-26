'use strict'

var mongoose= require('mongoose');//acceder a a liberia mongoose
var Schema=mongoose.Schema;//crear un nuevo schema con moongose

//crear una variable para poder almacenar la estructura del nuevo schema
var ArticleSchema = Schema({
    title:String,
    content: String,
    date:{type:Date,default:Date.now},//se usa llaves{} para poder dar caractersiticas especiales a un tipo JSON
    img:String
});


//exportar modulo
module.exports=mongoose.model('Article',ArticleSchema);

