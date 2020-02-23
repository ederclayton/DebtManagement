const DebtModel = require('../models/debt.model');
const validator = require('./validator');

const saveDebt = async (debt) => {
    try {
        await validator.debtValidator(debt);
        
        debt.date = new Date(debt.date);
        
        let newDebt = new DebtModel(debt);
        await newDebt.save();
    } catch (error) {
        throw error;
    }
};

const getAllDebts = async (clientId) => {
    try {

        const res = await DebtModel.find({ clientId });

        return res;

    } catch (error) {
        throw error;
    }
};

module.exports = {
    saveDebt,
    getAllDebts
};