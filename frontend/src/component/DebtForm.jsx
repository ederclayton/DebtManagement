import React, { Component } from 'react';
import { Form, Container, InputGroup, Button } from 'react-bootstrap';

const initialState = {
    visibility: false,
    users: [],
    formValues: {},
    formValidation: {
        userId: {failed: false, message: ''},
        date: {failed: false, message: ''},
        value: {failed: false, message: ''}
    }
};

export default class DebtForm extends Component {

    state = { ...initialState };

    static getDerivedStateFromProps(nextProps) {
        return { 
            formValues: nextProps.initialValues, 
            users: nextProps.users,
            visibility: nextProps.visibility
        };
    }

    renderOptions() {
        return this.state.users.map((user) => {
            return(
                <option key={user.id} value={user.id}>
                    {user.name}
                </option>
            );
        });
    }

    updateField(event) {
        const state = { ...this.state };

        state.formValues[event.target.name] = event.target.value;
        if (event.target.name !== 'reason') {
            state.formValidation[event.target.name].failed = false;
        }
        
        this.setState( state );
    }

    validationFields(event, next) {
        event.preventDefault();

        let formValidation = {...this.state.formValidation};

        if (this.state.formValues.userId === "-1") {
            formValidation.userId = {
                failed: true,
                message: 'Deve ser informado um usuário.'
            };
        }

        if (this.state.formValues.date === '') {
            formValidation.date = {
                failed: true,
                message: 'Deve ser informado uma data.'
            };
        } else {
            const isFutureDate = (new Date() - new Date(this.state.formValues.date)) < 0.0;
            if (isFutureDate) {
                formValidation.date = {
                    failed: true,
                    message: 'A data não pode ser do futuro.'
                };
            }
        }

        if (isNaN(this.state.formValues.value)) {
            formValidation.value = {
                failed: true,
                message: 'O valor da dívida deve ser um número.'
            };
        } else if (Number(this.state.formValues.value) <= 0) {
            formValidation.value = {
                failed: true,
                message: 'A dívida não pode ser negativa.'
            };
        }

        if (formValidation.userId.failed || 
            formValidation.date.failed || 
            formValidation.value.failed) {

            this.setState( {formValidation} );
        } else {
            const formValues = {...this.state.formValues};
            this.setState( initialState );
            next(formValues);
        }
        
    };

    render() {
        const { formValues, formValidation } = this.state;
        
        return (
            <Container className={"form-container " + (this.state.visibility ? '' : 'invisible')}>
                    
                <Form onSubmit={(event) => this.validationFields(event, this.props.save)}>

                    <Form.Group controlId="userIdOptions">
                        <Form.Label> Usuário </Form.Label>
                        <Form.Control as="select"
                                name="userId"
                                value={formValues.userId}
                                onChange={e => this.updateField(e)}>
                            <option key="default" value="-1" defaultValue>Escolha um usuário...</option>
                            {this.renderOptions()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid" className={formValidation.userId.failed ? "d-block" : ""}>
                            {formValidation.userId.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="reasonInput">
                        <Form.Label> Motivo </Form.Label>
                        <Form.Control type="text"
                                name="reason"
                                placeholder="..."
                                value={formValues.reason}
                                onChange={e => this.updateField(e)}/>
                    </Form.Group>

                    <Form.Group controlId="dateInput">
                        <Form.Label> Data da Dívida </Form.Label>
                        <Form.Control type="date" 
                                name="date"
                                value={formValues.date}
                                onChange={e => this.updateField(e)}/>
                        <Form.Control.Feedback type="invalid" className={formValidation.date.failed ? "d-block" : ""}>
                            {formValidation.date.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="valueInput">
                        <Form.Label> Valor da Dívida </Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroupPrepend">R$</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control type="text" 
                                    name="value"
                                    placeholder="0.00" 
                                    aria-describedby="inputGroupPrepend"
                                    value={formValues.value === 0 ? "" : formValues.value}
                                    onChange={e => this.updateField(e)}/>
                            
                            <Form.Control.Feedback type="invalid" className={formValidation.value.failed ? "d-block" : ""}>
                                {formValidation.value.message}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <div className="buttons">
                        <Button type="submit">Salvar</Button>
                        <button type="button" className="btn btn-danger" 
                            onClick={() => this.props.delete(this.state.formValues.debtId)}>Excluir</button>
                    </div>
                </Form>
            </Container>
        );
    }
}