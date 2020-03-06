import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import User from '../component/User';
import DebtForm from '../component/DebtForm';
import BarsMenu from '../component/BarsMenu';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';

const externalApi = 'https://jsonplaceholder.typicode.com/users';
const backendUrl = 'http://localhost:3001/debt/';

const initialState = {
    users: [],
    formVisibility: false,
    formValues: {
        debtId: '-1',
        userId: '-1',
        reason: '',
        date: '',
        value: 0
    },
    icon: 'bars',
    menuVisibility: false 
};

const INVALID_VALUE = '-1';

export default class App extends Component {

    state = {...initialState};

    constructor(props) {
        super(props);

        this.saveClick = this.saveClick.bind(this);
        this.newDebt = this.newDebt.bind(this);
        this.editDebt = this.editDebt.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    async getUsersDebts() {
        const res = await axios.get(externalApi);
        
        let users = await Promise.all(res.data.map(async (user) => {
            
            let debtRes = await axios.get(backendUrl + user.id + '/all');
            
            let newUser = {
                id: user.id,
                name: user.name,
                visibleDebts: false,
                debts: debtRes.data
            };
            
            return newUser;
        }));

        return users;
    }

    async componentDidMount() {
        const users = await this.getUsersDebts();
        this.setState({ users });
    }

    renderMenu() {
        return (
            <aside className={`menu ${this.state.menuVisibility ? 'menu-visible' : ''}`}>
                <ul className="menu-container">
                    {this.renderItems()}
                </ul>
            </aside>
        );
    }

    renderItems() {
        const candidates = this.state.users.filter(user => {
                return user.debts.length !== 0;
            });
        return candidates.map((user) => {
            return(<User user={user} click={this.editDebt}/>);
        });
    }

    toggleVisibility(index) {
        let currentState = {...this.state};
        currentState.users[index].visibleDebts = !currentState.users[index].visibleDebts;
        this.setState(currentState);
    }

    newDebt() {
        const formValues = {
            debtId: INVALID_VALUE,
            userId: INVALID_VALUE,
            reason: '',
            date: '',
            value: 0
        };
        this.setState({ formVisibility: true, formValues });
    }

    saveClick(formValues) {
        if (formValues.debtId === INVALID_VALUE) {
            // New Debt
    
            axios.post(backendUrl + formValues.userId, {
                    value: Number(formValues.value),
                    date: formValues.date,
                    reason: formValues.reason
            }).then (async () => {
                toast.success("Nova Dívida cadastrada com sucesso!");
                const users = await this.getUsersDebts();
                this.setState({ users, formVisibility: false });
            }).catch (error => {
                toast.error(error.message);
            });
        } else {
            // Edit Debt

            axios.put(backendUrl + formValues.debtId, {
                clientId: formValues.userId,
                value: Number(formValues.value),
                date: formValues.date,
                reason: formValues.reason
            }).then (async () => {
                toast.success("A dívida foi atualizada com sucesso!");
                const users = await this.getUsersDebts();
                this.setState({ users, formVisibility: false });
            }).catch (error => {
                toast.error(error.message);
            });
        }
    }

    deleteClick(debtId) {
        if (debtId !== INVALID_VALUE) {
            axios.delete(backendUrl + debtId).then (async () => {
                toast.success("Dívida excluída com sucesso!");
                const users = await this.getUsersDebts();
                this.setState({ users, formVisibility: false });
            }).catch (error => {
                toast.error(error.message);
            });
        } else {
            this.setState({ formVisibility: false });
        }
    }

    editDebt(debtId) {
        axios.get(backendUrl + debtId).then(res => {
            const formValues = {
                debtId: res.data._id,
                userId: res.data.clientId,
                reason: res.data.reason,
                date: res.data.date.split('T')[0],
                value: res.data.value
            };

            this.setState({ formVisibility: true, formValues });
        }).catch (error => {
            toast.error(error.message);
        });
    }

    toggleMenu() {
        let { menuVisibility } = this.state;
        menuVisibility = !menuVisibility;
        let icon = menuVisibility ? 'times' : 'bars';

        this.setState({ menuVisibility, icon });;
    }

    render() {
        return (
            <div className="app">
                <BarsMenu icon={this.state.icon} click={this.toggleMenu}/>
                
                {this.renderMenu()}
                    
                <main className="content">
                    {
                        <DebtForm 
                            initialValues={this.state.formValues}
                            users={this.state.users}
                            save={this.saveClick}
                            delete={this.deleteClick}
                            visibility={this.state.formVisibility}/>
                    }
                </main>

                <ToastContainer autoClose={3000} position={toast.POSITION.TOP_RIGHT} />
                
                <button type="button" className="btn btn-lg newButton" onClick={ this.newDebt }> Novo </button>
            </div>
        );
    }
}
