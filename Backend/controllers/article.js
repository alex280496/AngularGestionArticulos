'use strict'

var validator = require('validator');
var Article = require('../models/article');

var fs = require('fs');
var path = require('path');

var controller = {
    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({

            curso: 'Api con node',
            autor: 'Alex Reyes',
            url: 'alexreyesweb.es',
            hola,

        });
    },
    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador'
        });
    },

    save: (req, res) => {

        // recoger parametros pos post
        var params = req.body;

        //validar  datos con libreria validator
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por llenar'
            });

        }
        if (validate_title && validate_content) {
            //crear el objeto a guardar
            var article = new Article();

            //Asignar Valores
            article.title = params.title;
            article.content = params.content;
            if (params.image){
                article.image=params.image;
            }else{
                article.image = null;
            }
            

            //Guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        message: 'El articulo no se ha guardado'
                    });
                }
                //Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            });



        } else {
            return res.status(200).send({
                status: 'error',
                message: 'los datos no son validos'
            });
        }
    },
    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);

        }
        console.log(last);
        //find

        query.sort('-_id').exec((err, articles) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'error al devolver los articulos'
                });
            }
            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });

    },
    //metodo para sacar un solo articulo
    getArticle: (req, res) => {
        //Recoger el id de la url
        var articleId = req.params.id;
        //comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }

        //buscar el articulo
        Article.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: ' No existe el articulo'

                });
            }
            //Devolver en json

            return res.status(200).send({
                status: 'success', article
            });
        });
    },
    udpate: (req, res) => {
        //recoger el id del articulo por la url
        var articleId = req.params.id;

        //recoger los datos que llegan por put
        var params = req.body;

        //validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: ' Faltan datos por enviar'
            });
        }
        if (validate_title && validate_content) {
            //find and update
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'

                    });
                }
                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo'

                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated

                });

            });

        } else {
            //devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: ' la validacion no es correcta'
            });
        }
    },

    delete: (req, res) => {
        //recoger el id de la url
        var articleId = req.params.id;
        // find and delete
        Article.findOneAndRemove({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: ' error al borrar'
                });
            }
            if (!articleRemoved) {
                return res.status(500).send({
                    status: 'error',
                    message: ' No se ha borrado el articulo, posiblemete no exista'
                });
            }
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });
    },
    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    staus: 'error',
                    message: 'la imagen no existe'
                })
            }
        });
    },
    search: (req, res) => {
        //sacar el string a buscar
        var searchString = req.params.search;

        //find or
        Article.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },
                { "content": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petecion',

                    });
                }
                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con tu busqueda',

                    });
                }
                return res.status(200).send({
                    status: 'success',
                    articles

                });

            });

    },
    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js (hecho)

        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                });
            });
        
        }else{
             // Si todo es valido, sacando id de la url
             var articleId = req.params.id;

             if(articleId){
                // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {

                    if(err || !articleUpdated){
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de articulo !!!'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
             }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
             }
            
        }   
    }, // end upload file
};  // end controller
module.exports = controller;                                               