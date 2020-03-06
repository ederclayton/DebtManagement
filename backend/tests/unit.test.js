const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
const { mockReq, mockRes } = require('sinon-express-mock');

const serviceDebt = require('../src/services/debtService');
const validator = require('../src/services/validator');
const DebtModel = require('../src/models/debt.model');
const controllerDebt = require('../src/controllers/debtController');
const AppError = require('../src/utils/error');
const Mongoose = require('mongoose');

chai.use(sinonChai);

describe('API Unit Tests', () => {
    describe('Services - Unit Tests', () => {
        describe('saveDebt function', () => {
            beforeEach(() => {
                debtValidatorStub = sinon.stub(validator, "debtValidator");
                saveStub = sinon.stub(DebtModel.prototype, "save");
            });

            afterEach(() => {
                debtValidatorStub.restore();
                saveStub.restore();
            });

            it('should return an error when validator failed', async () => {
                const validatorErrorMock = new Error('Fake Error');
                const debtMock = {
                    clientId: '1',
                    reason: 'BlaBla',
                    value: 23.5,
                    date: new Date()
                };

                debtValidatorStub.throws(validatorErrorMock);

                try {
                    await serviceDebt.saveDebt(debtMock);
                } catch (error) {
                    expect(error).to.equal(validatorErrorMock);
                }

            });

            it('should return an error when Mongo failed', async () => {
                const mongoErrorMock = new Error('Fake Error');
                const debtMock = {
                    clientId: '1',
                    reason: 'BlaBla',
                    value: 23.5,
                    date: new Date()
                };

                saveStub.throws(mongoErrorMock);

                try {
                    await serviceDebt.saveDebt(debtMock);
                } catch (error) {
                    expect(error).to.equal(mongoErrorMock);
                }

            });

            it('should finish the function with success', async () => {
                const debtMock = {
                    clientId: '1',
                    reason: 'BlaBla',
                    value: 23.5,
                    date: new Date()
                };

                await serviceDebt.saveDebt(debtMock);

            });
        });

        describe('getAllDebts function', () => {
            beforeEach(() => {
                findStub = sinon.stub(DebtModel, "find");
            });

            afterEach(() => {
                findStub.restore();
            });

            it('should return an error when Mongo failed', async () => {
                const clientIdMock = '1';
                const mongoErrorMock = new Error('Fake Error');

                findStub.throws(mongoErrorMock);

                try {
                    const result = await serviceDebt.getAllDebts(clientIdMock);
                } catch (error) {
                    expect(error).to.equal(mongoErrorMock);
                }

            });

            it('should return an object when Mongo find with success', async () => {
                const clientIdMock = '1';
                const debtResMock = {};

                findStub.returns(debtResMock);

                const result = await serviceDebt.getAllDebts(clientIdMock);
                expect(result).to.equal(debtResMock);

            });
        });

        describe('getDebt function', () => {

            beforeEach(() => {
                findByIdStub = sinon.stub(DebtModel, "findById");
            });

            afterEach(() => {
                findByIdStub.restore();
            });

            it('should return an error when Mongo failed', async () => {
                const debtIdMock = '1';
                const mongoErrorMock = new Error('Fake Error');

                findByIdStub.throws(mongoErrorMock);

                try {
                    const result = await serviceDebt.getDebt(debtIdMock);
                } catch (error) {
                    expect(error).to.equal(mongoErrorMock);
                }

            });

            it('should return a specific error when debtId not found', async () => {
                const debtIdMock = '1';
                const mongoSpecificErrorMock = new Mongoose.CastError('Fake Error');

                const messageErrorMock = `Could not find debt with id: ${debtIdMock}`;
                const statusErrorMock = 404;

                findByIdStub.throws(mongoSpecificErrorMock);

                try {
                    const result = await serviceDebt.getDebt(debtIdMock);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                    expect(error.status).to.equal(statusErrorMock);
                }

            });

            it('should return an object when Mongo find with success', async () => {
                const debtIdMock = '1';
                const debtResMock = {};

                findByIdStub.returns(debtResMock);

                const result = await serviceDebt.getDebt(debtIdMock);
                expect(result).to.equal(debtResMock);

            });
        });

        describe('updateDebt function', () => {
            beforeEach(() => {
                clientIdValidatorStub = sinon.stub(validator, "clientIdValidator");
                valueDebtValidatorStub = sinon.stub(validator, "valueDebtValidator");
                dateValidatorStub = sinon.stub(validator, "dateValidator");
                findByIdAndUpdateStub = sinon.stub(DebtModel, "findByIdAndUpdate");
            });

            afterEach(() => {
                clientIdValidatorStub.restore();
                valueDebtValidatorStub.restore();
                dateValidatorStub.restore();
                findByIdAndUpdateStub.restore();
            });

            it('should return an error when data is empty', async () => {
                const dataMock = {};
                const debtId = '1';

                const messageErrorMock = 'No data was found to be updated.';
                const statusErrorMock = 404;

                try {
                    await serviceDebt.updateDebt(debtId, dataMock);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                    expect(error.status).to.equal(statusErrorMock);
                }

            });

            it('should return an error when clientId is invalid', async () => {
                const dataMock = {
                    clientId: 'InvalidClientId',
                    value: 100,
                    reason: 'BlaBla',
                    date: '2020-01-01'
                };
                const debtId = '1';
                const validatorErrorMock = new Error('Fake Error');

                clientIdValidatorStub.throws(validatorErrorMock);

                try {
                    await serviceDebt.updateDebt(debtId, dataMock);
                } catch (error) {
                    expect(error).to.equal(validatorErrorMock);
                }

            });

            it('should return an error when value is invalid', async () => {
                const dataMock = {
                    clientId: 'ValidClientId',
                    value: -100,
                    reason: 'BlaBla',
                    date: '2020-01-01'
                };
                const debtId = '1';
                const validatorErrorMock = new Error('Fake Error');

                valueDebtValidatorStub.throws(validatorErrorMock);

                try {
                    await serviceDebt.updateDebt(debtId, dataMock);
                } catch (error) {
                    expect(error).to.equal(validatorErrorMock);
                }

            });

            it('should return an error when date is invalid', async () => {
                const dataMock = {
                    clientId: 'ValidClientId',
                    value: 100,
                    reason: 'BlaBla',
                    date: 'InvalidDate'
                };
                const debtId = '1';
                const validatorErrorMock = new Error('Fake Error');

                dateValidatorStub.throws(validatorErrorMock);

                try {
                    await serviceDebt.updateDebt(debtId, dataMock);
                } catch (error) {
                    expect(error).to.equal(validatorErrorMock);
                }

            });

            it('should return an error when Mongo failed', async () => {
                const dataMock = {
                    clientId: 'ValidClientId',
                    value: 100,
                    reason: 'BlaBla',
                    date: '2020-01-01'
                };
                const debtId = '1';
                const mongoErrorMock = new Error('Fake Error');

                findByIdAndUpdateStub.returns(mongoErrorMock);

                try {
                    await serviceDebt.updateDebt(debtId, dataMock);
                } catch (error) {
                    expect(error).to.equal(mongoErrorMock);
                }

            });

            it('should return a specific error when debtId not found', async () => {
                const dataMock = {
                    clientId: 'ValidClientId',
                    value: 100,
                    reason: 'BlaBla',
                    date: '2020-01-01'
                };
                const debtId = '1';
                const mongoSpecificErrorMock = new Mongoose.CastError('Fake Error');

                const messageErrorMock = `Could not find debt with id: ${debtId}`;
                const statusErrorMock = 404;

                findByIdAndUpdateStub.returns(mongoSpecificErrorMock);

                try {
                    await serviceDebt.updateDebt(debtId, dataMock);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                    expect(error.status).to.equal(statusErrorMock);
                }

                sinon.restore();
            });

            it('should return without error when Mongo find with success', async () => {
                const dataMock = {
                    clientId: 'ValidClientId',
                    value: 100,
                    reason: 'BlaBla',
                    date: '2020-01-01'
                };
                const debtId = '1';

                await serviceDebt.updateDebt(debtId, dataMock);
               
            });
        });

        describe('deleteDebt function', () => {
            beforeEach(() => {
                findByIdAndDeleteStub = sinon.stub(DebtModel, "findByIdAndDelete");
            });

            afterEach(() => {
                findByIdAndDeleteStub.restore();
            });

            it('should return an error when Mongo failed', async () => {
                const debtIdMock = '1';
                const mongoErrorMock = new Error('Fake Error');

                findByIdAndDeleteStub.throws(mongoErrorMock);

                try {
                    await serviceDebt.deleteDebt(debtIdMock);
                } catch (error) {
                    expect(error).to.equal(mongoErrorMock);
                }

            });

            it('should return a specific error when debtId not found', async () => {
                const debtIdMock = '1';
                const mongoSpecificErrorMock = new Mongoose.CastError('Fake Error');

                const messageErrorMock = `Could not find debt with id: ${debtIdMock}`;
                const statusErrorMock = 404;

                findByIdAndDeleteStub.throws(mongoSpecificErrorMock);

                try {
                    await serviceDebt.deleteDebt(debtIdMock);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                    expect(error.status).to.equal(statusErrorMock);
                }

            });

            it('should return when Mongo find and delete without error', async () => {
                const debtIdMock = '1';

                await serviceDebt.deleteDebt(debtIdMock);

            });
        });
    });

    describe('Validator - Unit Tests', () => {
        describe('clientIdValidator function', () => {

            it('should return an error when clientId is undefined', async () => {
                const messageErrorMock = 'No clientId was entered.';
                
                try {
                    await validator.clientIdValidator(undefined);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
            });

            it('should return an error when clientId is a empty string', async () => {
                const messageErrorMock = 'No clientId was entered.';
                
                try {
                    await validator.clientIdValidator('');
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
            });
    
            it('should return whithout error when clientId is valid', async () => {
                const clientIdMock = '1';
                await validator.clientIdValidator(clientIdMock);
            });
        });
    
        describe('valueDebtValidator function', () => {
            it('should return an error when value is undefined', async () => {
                const messageErrorMock = 'No value was entered.';

                try {
                    await validator.valueDebtValidator(undefined);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }

            });
    
            it('should return an error when value is not a number', async () => {
                const messageErrorMock = 'The informed value is not a number.';
                const valueMockV1 = 'text';
                const valueMockV2 = {'test': 'test'};

                try {
                    await validator.valueDebtValidator(valueMockV1);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
                
                try {
                    await validator.valueDebtValidator(valueMockV2);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
            });

            it('should return an error when value is negative', async () => {
                const messageErrorMock = 'The informed value is negative or zero.';
                const valueMock = -1;

                try {
                    await validator.valueDebtValidator(valueMock);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
            });

            it('should return an error when value is zero', async () => {
                const messageErrorMock = 'The informed value is negative or zero.';
                const valueMock = 0;

                try {
                    await validator.valueDebtValidator(valueMock);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
            });

            it('should return without error when value is valid', async () => {
                const valueMock = 1;

                await validator.valueDebtValidator(valueMock);
            });
        });

        describe('dateValidator function', () => {
            it('should return an error when date is undefined', async () => {
                const messageErrorMock = 'No date was entered.';

                try {
                    await validator.dateValidator(undefined);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
            });

            it('should return an error when date is an empty string', async () => {
                const messageErrorMock = 'No date was entered.';

                try {
                    await validator.dateValidator('');
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
            });

            it('should return an error when date is in a wrong format', async () => {
                const messageErrorMock = 'The informed date is not valid.';
                const dateinvalidFormatV1 = '21/12/2019';
                const dateinvalidFormatV2 = '12/21/2019';
                const dateinvalidFormatV3 = '21-12-2019';
                const dateinvalidFormatV4 = '12-21-2019';

                try {
                    await validator.dateValidator(dateinvalidFormatV1);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }

                try {
                    await validator.dateValidator(dateinvalidFormatV2);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }

                try {
                    await validator.dateValidator(dateinvalidFormatV3);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }

                try {
                    await validator.dateValidator(dateinvalidFormatV4);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
            });

            it('should return an error when date is in future', async () => {
                const messageErrorMock = 'The date entered indicates the future.';
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);

                const mockDateTomorrow = tomorrow.toISOString().split('T')[0];

                try {
                    await validator.dateValidator(mockDateTomorrow);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
            });

            it('should return without error when date is valid', async () => {
                const mockDate = '2019-12-21';

                await validator.dateValidator(mockDate);
            });
        });

        describe('debtValidator function', () => {

            it('should return an error when clientId is invalid', async () => {
                const debtMock = {
                    clientId: undefined,
                    value: 100,
                    date: '2019-12-21'
                };
                const messageErrorMock = 'No clientId was entered.';

                try {
                    await validator.debtValidator(debtMock);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
                
            });

            it('should return an error when value is invalid', async () => {
                const debtMock = {
                    clientId: '1',
                    value: undefined,
                    date: '2019-12-21'
                };
                const messageErrorMock = 'No value was entered.';

                try {
                    await validator.debtValidator(debtMock);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
                
            });

            it('should return an error when date is invalid', async () => {
                const debtMock = {
                    clientId: '1',
                    value: 100,
                    date: undefined
                };
                const messageErrorMock = 'No date was entered.';

                try {
                    await validator.debtValidator(debtMock);
                } catch (error) {
                    expect(error.message).to.equal(messageErrorMock);
                }
                
            });

            it('should return without error when debt is valid', async () => {
                const debtMock = {
                    clientId: '1',
                    value: 100,
                    date: '2019-12-21'
                };

                await validator.debtValidator(debtMock);
            });
        });
    });

    describe('Controller - Unit Tests', () => {

        describe('createDebt function', () => {
            beforeEach(() => {
                saveDebtStub = sinon.stub(serviceDebt, "saveDebt");
            });
    
            afterEach(() => {
                saveDebtStub.restore();
            });

            const request = {
                body: {
                    value: '1',
                    date: '2019-12-21',
                    reason: '....'
                },
                params: {
                    client: '1'
                }
            };

            it('should return an error in res when saveDebt throw an AppError', async () => {
                
                const serviceErrorMock = new AppError('Fake Error');

                saveDebtStub.throws(serviceErrorMock);

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.createDebt(req, res);
                expect(res.json).to.be.calledWith({message: serviceErrorMock.message});
                expect(res.status).to.be.calledWith(serviceErrorMock.status);
            });

            it('should return an internal error in res when saveDebt throw an error', async () => {
                
                const serviceErrorMock = new Error('Fake Error');

                saveDebtStub.throws(serviceErrorMock);

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.createDebt(req, res);
                expect(res.json).to.be.calledWith({message: 'Internal Error'});
                expect(res.status).to.be.calledWith(500);
            });

            it('should return a status 200 in res when saveDebt don\'t return an error', async () => {

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.createDebt(req, res);
                expect(res.json).to.be.calledWith({message: 'The debt was successfully saved'});
                expect(res.status).to.be.calledWith(200);
            });
        });

        describe('getAllDebts function', () => {
            beforeEach(() => {
                getAllDebtsStub = sinon.stub(serviceDebt, "getAllDebts");
            });
    
            afterEach(() => {
                getAllDebtsStub.restore();
            });

            const request = {
                params: {
                    client: '1'
                }
            };

            it('should return an error in res when getAllDebts throw an AppError', async () => {
                
                const serviceErrorMock = new AppError('Fake Error');

                getAllDebtsStub.throws(serviceErrorMock);

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.getAllDebts(req, res);
                expect(res.json).to.be.calledWith({message: serviceErrorMock.message});
                expect(res.status).to.be.calledWith(serviceErrorMock.status);
            });

            it('should return an internal error in res when getAllDebts throw an error', async () => {
                
                const serviceErrorMock = new Error('Fake Error');

                getAllDebtsStub.throws(serviceErrorMock);

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.getAllDebts(req, res);
                expect(res.json).to.be.calledWith({message: 'Internal Error'});
                expect(res.status).to.be.calledWith(500);
            });

            it('should return a status 200 and a object in res when getAllDebts don\'t return an error', async () => {

                const req = mockReq(request);
                const res = mockRes();

                const debtsMock = {
                    debts: [{}, {}, {}]
                };

                getAllDebtsStub.returns(debtsMock);

                await controllerDebt.getAllDebts(req, res);
                expect(res.json).to.be.calledWith(debtsMock);
                expect(res.status).to.be.calledWith(200);
            });
        });

        describe('getDebt function', () => {
            beforeEach(() => {
                getDebtStub = sinon.stub(serviceDebt, "getDebt");
            });
    
            afterEach(() => {
                getDebtStub.restore();
            });

            const request = {
                params: {
                    id: '1'
                }
            };

            it('should return an error in res when getDebt throw an AppError', async () => {
                
                const serviceErrorMock = new AppError('Fake Error');

                getDebtStub.throws(serviceErrorMock);

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.getDebt(req, res);
                expect(res.json).to.be.calledWith({message: serviceErrorMock.message});
                expect(res.status).to.be.calledWith(serviceErrorMock.status);
            });

            it('should return an internal error in res when getDebt throw an error', async () => {
                
                const serviceErrorMock = new Error('Fake Error');

                getDebtStub.throws(serviceErrorMock);

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.getDebt(req, res);
                expect(res.json).to.be.calledWith({message: 'Internal Error'});
                expect(res.status).to.be.calledWith(500);
            });

            it('should return a status 200 and a object in res when getDebt don\'t return an error', async () => {

                const req = mockReq(request);
                const res = mockRes();

                const debtMock = {
                    debt: {}
                };

                getDebtStub.returns(debtMock);

                await controllerDebt.getDebt(req, res);
                expect(res.json).to.be.calledWith(debtMock);
                expect(res.status).to.be.calledWith(200);
            });
        });

        describe('updateDebt function', () => {
            beforeEach(() => {
                updateDebtStub = sinon.stub(serviceDebt, "updateDebt");
            });
    
            afterEach(() => {
                updateDebtStub.restore();
            });

            const request = {
                body: {
                    clientId: '1',
                    value: 1,
                    date: '2019-12-21',
                    reason: '....'
                },
                params: {
                    id: '1'
                }
            };

            it('should return an error in res when updateDebt throw an AppError', async () => {
                
                const serviceErrorMock = new AppError('Fake Error');

                updateDebtStub.throws(serviceErrorMock);

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.updateDebt(req, res);
                expect(res.json).to.be.calledWith({message: serviceErrorMock.message});
                expect(res.status).to.be.calledWith(serviceErrorMock.status);
            });

            it('should return an internal error in res when updateDebt throw an error', async () => {
                
                const serviceErrorMock = new Error('Fake Error');

                updateDebtStub.throws(serviceErrorMock);

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.updateDebt(req, res);
                expect(res.json).to.be.calledWith({message: 'Internal Error'});
                expect(res.status).to.be.calledWith(500);
            });

            it('should return a status 200 in res when updateDebt don\'t return an error', async () => {

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.updateDebt(req, res);
                expect(res.json).to.be.calledWith({message: 'The debt was successfully updated.'});
                expect(res.status).to.be.calledWith(200);
            });
        });

        describe('deleteDebt function', () => {
            beforeEach(() => {
                deleteDebtStub = sinon.stub(serviceDebt, "deleteDebt");
            });
    
            afterEach(() => {
                deleteDebtStub.restore();
            });

            const request = {
                params: {
                    id: '1'
                }
            };

            it('should return an error in res when deleteDebt throw an AppError', async () => {
                
                const serviceErrorMock = new AppError('Fake Error');

                deleteDebtStub.throws(serviceErrorMock);

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.deleteDebt(req, res);
                expect(res.json).to.be.calledWith({message: serviceErrorMock.message});
                expect(res.status).to.be.calledWith(serviceErrorMock.status);
            });

            it('should return an internal error in res when deleteDebt throw an error', async () => {
                
                const serviceErrorMock = new Error('Fake Error');

                deleteDebtStub.throws(serviceErrorMock);

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.deleteDebt(req, res);
                expect(res.json).to.be.calledWith({message: 'Internal Error'});
                expect(res.status).to.be.calledWith(500);
            });

            it('should return a status 200 in res when deleteDebt don\'t return an error', async () => {

                const req = mockReq(request);
                const res = mockRes();

                await controllerDebt.deleteDebt(req, res);
                expect(res.json).to.be.calledWith({message: 'The debt was successfully deleted.'});
                expect(res.status).to.be.calledWith(200);
            });
        });
    });

});
