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

exports.getDebt = async (req, res) => {
    try {
        const debtId = req.params.id;
        const debt = await debtServices.getDebt(debtId);
        res.status(200).json(debt);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({message: error.message});
        } else {
            console.log(error.message);
            res.status(500).json({message: 'Internal Error'});
        }
    }
};

exports.updateDebt = async (req, res) => {
    try {
        const debtId = req.params.id;
        const data = {...req.body};
        await debtServices.updateDebt(debtId, data);
        res.status(200).json({message: 'The debt was successfully updated.'});
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({message: error.message});
        } else {
            console.log(error.message);
            res.status(500).json({message: 'Internal Error'});
        }
    }
};

exports.deleteDebt = async (req, res) => {
    try {
        const debtId = req.params.id;
        await debtServices.deleteDebt(debtId);
        res.status(200).json({message: 'The debt was successfully deleted.'});
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({message: error.message});
        } else {
            console.log(error.message);
            res.status(500).json({message: 'Internal Error'});
        }
    }
};