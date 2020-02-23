const debtServices = require('../services/debtService');

exports.createDebt = async (req, res) => {
    try {
        let newDebt = { ...req.body };
        newDebt.clientId = req.params.client;
        await debtServices.saveDebt(newDebt);
        res.status(200).json({message: 'The debt was successfully saved'});
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({message: error.message});
        } else {
            console.log(error.message);
            res.status(500).json({message: 'Internal Error'});
        }
    }
};

exports.getAllDebts = async (req, res) => {
    try {
        const clientId = req.params.client;
        const debts = await debtServices.getAllDebts(clientId);
        res.status(200).json(debts);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({message: error.message});
        } else {
            console.log(error.message);
            res.status(500).json({message: 'Internal Error'});
        }
    }
};

exports.getDebt = (req, res) => {
    res.status(200).send('Get Debt');
};

exports.updateDebt = (req, res) => {
    res.status(200).send('Update Debt');
};

exports.deleteDebt = (req, res) => {
    res.status(200).send('Delete Debt');
};