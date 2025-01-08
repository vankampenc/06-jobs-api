const Ev = require('../models/ev')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllEVs = async (req, res) => {
    const evs = await Ev.find({ createdBy: req.user.userID }).sort('createdAt')
    res.status(StatusCodes.OK).json({ evs, count: evs.length })
}
const getEV = async (req, res) => {
    res.send('get EV')
}
const createEV = async (req, res) => {
    req.body.createdBy = req.user.userID
    const ev = await Ev.create(req.body)
    res.status(StatusCodes.CREATED).json({ ev })
}
const updateEV = async (req, res) => {
    res.send('update EV')
}
const deleteEV = async (req, res) => {
    res.send('delete EV')
}
module.exports = {
    getAllEVs,
    getEV,
    createEV,
    updateEV,
    deleteEV,
}