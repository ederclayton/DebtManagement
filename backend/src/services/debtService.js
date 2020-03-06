const DebtModel = require('../models/debt.model');
const validator = require('./validator');
const Mongoose = require('mongoose');
const AppError = require('../utils/error');
const _ = require('lodash');

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
        const res = await DebtModel.find({ clientId }, {'__v': 0});
        return res;
    } catch (error) {
        throw error;
    }
};

const getDebt = async (debtId) => {
    try {
        let res = await DebtModel.findById(debtId, {'__v': 0});
        
        return res;
    } catch (error) {
        if (error instanceof Mongoose.CastError) {
            throw new AppError(`Could not find debt with id: ${debtId}`, 404);
        } else {
            throw error;
        }
    }
};

const updateDebt = async (debtId, data) => {
    try {

        if (_.isEmpty(data)) {
            throw new AppError('No data was found to be updated.', 404);
        }

        if (data.clientId) {
            await validator.clientIdValidator(data.clientId);
        }

        if (data.value) {
            await validator.valueDebtValidator(data.value);
        }

        if (data.date) {
            await validator.dateValidator(data.date);
        }

        await DebtModel.findByIdAndUpdate(debtId, data);
        
    } catch (error) {
        if (error instanceof Mongoose.CastError) {
            console.log(error);
            throw new AppError(`Could not find debt with id: ${debtId}`, 404);
        } else {
            throw error;
        }
    }
};

const deleteDebt = async (debtId) => {
    try {
        await DebtModel.findByIdAndDelete(debtId);
    } catch (error) {
        if (error instanceof Mongoose.CastError) {
            throw new AppError(`Could not find debt with id: ${debtId}`, 404);
        } else {
            throw error;
        }
    }
};

module.exports = {
    saveDebt,
    getAllDebts,
    getDebt,
    updateDebt,
    deleteDebt
};