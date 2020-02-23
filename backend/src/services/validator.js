const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const AppError = require('../utils/error');

const UserVerifyURL = 'https://jsonplaceholder.typicode.com/users/';

const clientIdValidator = async (clientId) => {
    if (!clientId) {
        throw new AppError('No clientId was entered.');
    }

    try {
        const user = await axios.get(UserVerifyURL + clientId);
        if (_.isEmpty(user)) {
            throw new AppError('The informed clientId is not found.');
        }
    } catch (error) {
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            throw new AppError('The informed clientId is not found.');
        } else {
            /*
             * The request was made but no response was received
             */
            throw new AppError('Internal Error.', 500);
        }
    }
};

const valueDebtValidator = async (value) => {
    if (!value) {
        throw new AppError('No value was entered.');
    }

    if (!_.isNumber(value)) {
        throw new AppError('The informed value is not a number.');
    }

    if (value <= 0.0) {
        throw new AppError('The informed value is negative.');
    }
    
};

const dateValidator = async (date) => {
    if (!date) {
        throw new AppError('No date was entered.');
    }

    if (!moment(date, "MM/DD/YYYY", true).isValid()) {
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