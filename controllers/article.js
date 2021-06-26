'use strict'

//importar modulo para validar datos

var validator=require('validator');
var Article=require('../models/article')
var fs=require('fs');
var path=require('path');

var controlador={
    datos:(req,res)=>{
        var hola=req.body.hola;
        return res.status(200).send({
            curso:'Master en framewors JS',
            autor:'Jordy Quilachamin',
            url:'',
            hola
        });
    },
    test:(req,res)=>{
        return res.status(200).send({
            message:'Soy la accion de test en este servidor Rest'
        });
    },
    save:(req,res)=>{
        //recoger parametros post
        var params= req.body;

        //Validar datos con (validator)

        try{
            var validar_title = !validator.isEmpty(params.title);
            var validar_contend= !validator.isEmpty(params.content)
            
        }catch(err){
            return res.status(200).send({
                status:'err',
                message:'Faltan datos por enviar'
            });
            
        }
        //si esto se cumple entonces 
        if(validar_title & validar_contend){
            //creamos un nuevo schema para alamacenar los datos y luego enviarlos
            var nuevo_article= Article();
            //asgignamos valores
            nuevo_article.title=params.title;
            nuevo_article.content=params.content;
            nuevo_article.img=null;
            //guardar los datos
            nuevo_article.save((err,articulo_guardado)=>{
                if(err || !articulo_guardado){
                    return res.status(404).send({
                        status:'err',
                        message:'No se a podido guardar el articulo'
                    });   
                }else{
                    return res.status(200).send({
                        status:'succes',
                        nuevo_article:articulo_guardado,
                        message:'este es el metodo de guardar'
                    });
                }

            })
            
            
        }else{
            return res.status(200).send({
                status:'err',
                message:'Datos incorrectos'
            });
        }




       
    },
    getArticles:(req,res)=>{

        //guaramos en una variable para poder cambiar sus datos
        var query = Article.find({}/*dentro de [use poner lo que se  quiere buscar en este caso queremos todo por eso va en blanco busca]*/);
        //crear una variable para poder scar un numero de elemtnos 
        var last = req.params.last;
        if(last || last!=undefined){
            query.limit(4)//solo regresa 4 consultas 
        }


        //este son metotods para vlidar lso articulos y msotrarlos
        
        query.sort('_id').exec((err,articles)=>{
             
            if(err){
                return res.status(500).send({
                    status:'err',
                    message:'Error al devoolver articulso'
                });
            }
            if(!articles){
                return res.status(404).send({
                    status:'err',
                    message:'No existen articulos'
                });
            }
            //caso contrario mostramos todos los articulos
            return res.status(200).send({
                status:'succes',
                articles
            });


        });
        
    },
    getArticle:(req,res)=>{
        //capturar el id 
        var idArticle=req.params.id;
        //comprobar si existe
        if(!idArticle||idArticle==null){
            return res.status(500).send({
                status:'err',
                message:'No existe el articulo'
            });
        }
        //buscar el articulo
        Article.findById(idArticle,(err,articulo_consultado)=>{
            if(err){
                return res.status(500).send({
                    status:'err',
                    message:'Error al devolver los datos'
                });
            }
            if(!articulo_consultado){
                return res.status(404).send({
                    status:'err',
                    message:'No existen articulos'
                });
            }
            return res.status(200).send({
                status:'succes',
                articulo_consultado
            });

        })

    },
    updateArticle:(req,res)=>{
        //capturar el id del articulo por la url
        var id_article=req.params.id;
        //recoger los datos que lleguan del put
        var parametros = req.body//todos los datos es decir el body
        //validar datos
        try{    
            var validar_titulo= !validator.isEmpty(parametros.title);//el parametros es aquella variable donde guardamos los datos 
            var validar_content= !validator.isEmpty(parametros.content);
        }catch{
            return res.status(404).send({
                status:'err',
                message:'Faltan datos para enviar'
            });
        }
        if(validar_titulo && validar_content){
              //findy update
              Article.findOneAndUpdate({_id:id_article},parametros,{new:true}/*id para que busque por id- envio los parametros que quiero actualizar-new=true esto hace que devuelve el objeto actualizado y no el antiguo*/
                ,(err,articulo_actualizado)=>{
                    if(err){
                        return res.status(404).send({
                            status:'err',
                            message:'Error al actualizar'
                        });
                    }
                    if(!articulo_actualizado){
                        return res.status(404).send({
                            status:'err',
                            message:'La validacion no es correcta'
                        });
                    }
                    //si todo esta bien 
                    return res.status(200).send({
                        status:'success',
                        article:articulo_actualizado,
                        message:'este es el meotdo update'
                    });
              })

        }else{
            return res.status(404).send({
                status:'err',
                message:'Credenciales incorrectas'
            });
        }

      

    },
    delete:(req,res)=>{
        //capturamos el id
        var id_article=req.params.id;
        //buscar y eliminar
        Article.findByIdAndDelete({_id:id_article},(err,RmvArticle)=>{
             if(err){
                return res.status(404).send({
                    status:'err',
                    message:'error al borrar'
                });
             }
             if(!RmvArticle){
                return res.status(404).send({
                    status:'err',
                    message:'No se a encontrado el archivo posiblemtne no existe'
                });
             }
             return res.status(200).send({
                status:'success',
                article:RmvArticle
            });
        })
    },
    upload:(req,res)=>{
        //configurar el modulo multiparty en routes/article.js (revisar en rutes)

        //Recoger el fichero de la peticion
        var file_name='Imagen no subida..';

        //comprobar si llegua la imagen
        if(!req.files){ 
            return res.status(400).send({
                status:'err',
                message:file_name
            })
        }

        //Conseguir nombre y  la extension del archivo

        var file_path=req.files.file0.path; //capturamos todo le valor del path ponemos un nombre de enrada en este cas file0
        var file_split=file_path.split('\\');//separamos y dentro del split ponemos el separador (es decir elsimbolo por el cual se va a separar en el split)

        //en Linux y mac se usa 
        //var file_split=file_path.split('/')
         
        //nombre del archivo
        var file_name=file_split[2];//obtenemos el nombre dentro del split que esta en la poss 2(recordar q se comienza desde 0)
        //extension del fichero
        var extension_split=file_name.split('\.');//usamos otro serparador
        var file_ext=extension_split[1];//capturamos la poss 

        //comprobar la extension, solo imagenes si es valida

        if(file_ext!='png'&&file_ext!='jpg'&&file_ext!='jpeg'&&file_ext!='gif'){
            //borrar el archivo subido
            fs.unlink(file_path, (err)=>{
                return res.status(400).send({
                    status:'err',
                    message:'La extension de la imagen no es valida'
                })
            })

        }else{
            //si todo es valido 
            var id_articulo=req.params.id;
            //Buscar articulo, asignarle  el nombre de la imagen y actualizar
            Article.findOneAndUpdate({_id:id_articulo},{img: file_name},{new:true},(err,imagen_actualizada)=>{
                if(err || !imagen_actualizada ){
                    return res.status(200).send({
                        status:'error',
                        message:'Error al guardar la iamgen del articulo'
                    })
                }else{

                    return res.status(200).send({
                        status:'success',
                        article:imagen_actualizada
                    })

                }
            });

           

        }
      

        
    },
    getImage:(req,res)=>{
        var file = req.params.img;
        var path_file='./upload/articles/'+file;

        fs.exists(path_file,(exist)=>{

            if(exist){
                return res.sendFile(path.resolve(path_file));    
            }else{
                return res.status(404).send({
                    status:'err',
                    message:'La imagen no existe'
                });

            }
        });
    },
    search:(req,res)=>{
        //scaar ek string que se va a buscar
        var searchString=req.params.search;//valor que se ingresa 

        //find or 
        //usamos estos parametros para dar mas versatildiad a la hora de buscar con if y con and en la base de datos
        Article.find({"$or":[
            {"title":{"$regex":searchString,"$options":"i"}},//es decir cuando el title contenga el searchString que capturamos
            {"content":{"$regex":searchString,"$options":"i"}}
            //es decir que esto hace si el searchString esta contenido dentro del title o del content mostrar ese articulo
        ]})
        .sort([['date','descending']])//ordenar de manera decendente
        .exec((err,articles)=>{

            if(err){
                return res.status(404).send({
                    status:'err',
                    message:'Error en la peticion'
                });
            }
            if(!articles||articles.length<=0){
                return res.status(404).send({
                    status:'err',
                    message:'El articulo no existe'
                });
            }


            return res.status(200).send({
                status:'successs',
                article:articles
            });
        })
    }        
}

module.exports=controlador;