const express = require('express');
const router = express.Router();
const controller = require('../controllers/debtController');

router.post('/:client', controller.createDebt);
router.get('/:client/all', controller.getAllDebts);
router.get('/:id', controller.getDebt);
router.put('/:id', controller.updateDebt);
router.delete('/:id', controller.deleteDebt);

module.exports = router;