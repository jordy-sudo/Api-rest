'use strict'

var express=require('express');
var ArticleController=require('../controllers/article');

var router= express.Router();
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir: './upload/articles'});
//rutas de pruebas
router.get('/test-controlador', ArticleController.test);
router.post('/datos-usuarios', ArticleController.datos);

//rutas asignadas
router.post('/save',ArticleController.save);
router.get('/articles/:last?'/*se pone el signo ? para decir q es un parametro opcional*/ ,ArticleController.getArticles);
router.get('/article/:id'/*como es obligatorio el campo ya no se pone ?*/ ,ArticleController.getArticle);
router.put('/article/:id',ArticleController.updateArticle);
router.delete('/article/:id',ArticleController.delete);
router.post('/upload-image/:id',md_upload,ArticleController.upload);
router.get('/get-image/:img',ArticleController.getImage);
router.get('/search/:search',ArticleController.search);

module.exports=router;