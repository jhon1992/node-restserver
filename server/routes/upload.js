const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/uploads/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    console.log(req.params.id);

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo',
            }
        });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
                tipo
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreArchivoArray = archivo.name.split('.');
    let extension = nombreArchivoArray[nombreArchivoArray.length - 1];

    let externsionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (externsionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + externsionesValidas.join(', '),
                extension
            }
        });
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (error) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: error
                }
            });
        }
        saveImage(id, res, nombreArchivo, tipo);
    });
});


function saveImage(id, res, nombreArchivo, tipo) {
    if (tipo == 'usuarios') {
        Usuario.findById(id, (err, usuarioDB) => {
            if (err) {
                borrarArchivo(tipo, nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!usuarioDB) {
                borrarArchivo(tipo, nombreArchivo);
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }
                });
            }

            borrarArchivo(tipo, usuarioDB.img);

            usuarioDB.img = nombreArchivo;
            usuarioDB.save((err, usuarioSave) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    usuario: usuarioSave,
                    img: nombreArchivo
                })
            })
        });
    } else if (tipo == 'productos') {
        Producto.findById(id, (err, productoDB) => {
            if (err) {
                borrarArchivo(tipo, nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                borrarArchivo(tipo, nombreArchivo);
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
            }

            borrarArchivo(tipo, productoDB.img);

            productoDB.img = nombreArchivo;
            productoDB.save((err, productoSave) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    producto: productoSave,
                    img: nombreArchivo
                })
            })
        });
    }
}

function borrarArchivo(tipo, nombreImage) {
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImage}`);

    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}

module.exports = app;