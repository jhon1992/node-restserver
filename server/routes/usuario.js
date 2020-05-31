const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario', function(req, res) {
    let from = req.query.from || 0;
    from = Number(from);
    let to = req.query.limit || 5;
    to = Number(to);
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(from)
        .limit(to)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje_error: err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    records: usuarios.length,
                    total_records: conteo
                });
            })
        })
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje_error: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje_error: err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, (err, usuarioDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensage_error: err
            });
        }
        if (!usuarioDelete) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            ok: true,
            message: 'Usuario eliminado'
        })
    });

    // Para eliminar registros físico

    // Usuario.findByIdAndRemove(id, (err, usuarioDelete) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             mensage_error: err
    //         });
    //     }
    //     if (!usuarioDelete) {
    //         return res.status(400).json({
    //             ok: false,
    //             mensage_error: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioDelete
    //     });
    // });
});

module.exports = app;