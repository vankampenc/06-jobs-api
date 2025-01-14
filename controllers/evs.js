const Ev = require('../models/ev')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllEVs = async (req, res) => {
    const evs = await Ev.find({ createdBy: req.user.userID }).sort('createdAt')
    res.status(StatusCodes.OK).json({ evs, count: evs.length })
}
const getEV = async (req, res) => {
    const { user: { userID }, params: { id: evID } } = req
    const ev = await Ev.findOne({
        _id: evID,
        createdBy: userID
    })
    if (!ev) {
        throw new NotFoundError(`No EV with id ${evID}`)
    }
    res.status(StatusCodes.OK).json({ ev })
}
const createEV = async (req, res) => {
    req.body.createdBy = req.user.userID
    const ev = await Ev.create(req.body)
    res.status(StatusCodes.CREATED).json({ ev })
}
const updateEV = async (req, res) => {
    const { body: { make, model }, user: { userID }, params: { id: evID } } = req
    if (make === '' || model === '') {
        throw new BadRequestError('Make or Model fields cannot be empty')
    }
    const ev = await Ev.findByIdAndUpdate({ _id: evID, createdBy: userID }, req.body, { new: true, runValidators: true })
    if (!ev) {
        throw new NotFoundError(`No EV with id ${evID}`)
    }
    res.status(StatusCodes.OK).json({ ev })
}
const deleteEV = async (req, res) => {
    const { user: { userID }, params: { id: evID } } = req
    const ev = await Ev.findByIdAndRemove({ _id: evID, createdBy: userID })
    if (!ev) {
        throw new NotFoundError(`No EV with id ${evID}`)
    }
    res.status(StatusCodes.OK).send()
}
module.exports = {
    getAllEVs,
    getEV,
    createEV,
    updateEV,
    deleteEV,
}
