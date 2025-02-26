const { response } = require('express');
const Evento = require('../models/Eventos');



const obtenerEventos = async (req, res = response, next) => {

    const eventos = await Evento.find().populate('user', 'name');
    return res.status(200).json({
        ok: true,
        msg: eventos
    })
}
const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.json({

            ok: true,
            evento: eventoGuardado
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({

            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarEvento = async (req, res = response, next) => {

    const eventoID = req.params.id;
    const evento = await Evento.findById(eventoID);
    try {
        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No posee permisos para eliminar este evento'
            })
        } else {
            const eventoParaBorrar = await Evento.findByIdAndDelete(eventoID)

            return res.json({
                ok: true,
                evento: eventoParaBorrar
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


    return res.status(200).json({
        ok: true,
        msg: 'borrar Evento'
    })
}

module.exports = {
    obtenerEventos,
    crearEvento,
    actualizarEvento,
    borrarEvento
}