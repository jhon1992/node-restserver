const express = require('express');

let { validateToken, validateAdminRole } = require('../middlewares/authentication');

let app = express();

let Producto = require('../models/producto');

app.get('/productos', validateToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    let to = req.query.limit || 5;
    to = Number(to);
    Producto.find({ disponible: true })
        .skip(from)
        .limit(to)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    records: productos.length,
                    total_records: conteo
                });
            })
        });
});


app.get('/productos/:id', validateToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El Id no es correcto'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        }).populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');
});

/// buscar productos

app.get('/productos/search/:termino', validateToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            res.json({
                ok: true,
                productos
            })
        });
});


app.post('/productos', validateToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        usuario: req.usuario._id,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

app.put('/productos/:id', validateToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.descripcion = body.descripcion;
        productoDB.precioUni = body.precioUni;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productSave) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productSave
            })
        });
    });
});

app.delete('/productos/:id', [validateToken, validateAdminRole], (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensage_error: err
            });
        }
        if (!productoDelete) {
            return res.status(400).json({
                ok: false,
                message: 'Producto no encontrado'
            });
        }
        res.json({
            ok: true,
            message: 'Producto eliminado'
        })
    });
});

module.exports = app;