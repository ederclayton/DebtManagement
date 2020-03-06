const _ = require('lodash');
const moment = require('moment');
const AppError = require('../utils/error');

const clientIdValidator = async (clientId) => {
    if (!clientId) {
        throw new AppError('No clientId was entered.');
    }
};

const valueDebtValidator = async (value) => {
    if (value === undefined) {
        throw new AppError('No value was entered.');
    }

    if (!_.isNumber(value)) {
        throw new AppError('The informed value is not a number.');
    }

    if (value <= 0.0) {
        throw new AppError('The informed value is negative or zero.');
    }
    
};

const dateValidator = async (date) => {
    if (!date) {
        throw new AppError('No date was entered.');
    }

    if (!moment(date, "YYYY-MM-DD", true).isValid()) {
        throw new AppError('The informed date is not valid.');
    }

    const isFutureDate = (new Date() - new Date(date)) < 0.0;

    if (isFutureDate) {
        throw new AppError('The date entered indicates the future.');
    }
}

const debtValidator = async (debt) => {
    try {
        await clientIdValidator(debt.clientId);

        await valueDebtValidator(debt.value);

        await dateValidator(debt.date);

    } catch (error) {
        throw error;
    }
};

module.exports = { debtValidator, clientIdValidator, valueDebtValidator, dateValidator };