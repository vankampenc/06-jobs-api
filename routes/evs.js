const express = require('express')
const router = express.Router()


const { getAllEVs, getEV, createEV, updateEV, deleteEV } = require('../controllers/evs')

router.route('/').post(createEV).get(getAllEVs)
router.route('/:id').get(getEV).delete(deleteEV).patch(updateEV)

module.exports = router