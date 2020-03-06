import React, { Component } from 'react';


export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: false
        };
    }

    toggleVisibility() {
        const currentState = this.state.details;
        this.setState({ details: !currentState});
    }

    renderSubItems(user) {
        return (
            <ul className={ "menu-container " + 
                (this.state.details ? "visible" : "invisible")}>
                {this.renderDebts(user)}
            </ul>
        );
    }

    renderDebts(user) {
        return user.debts.map(debt => {
            return (
                <li key={debt._id} className="menu-item" 
                    onClick={() => this.props.click(debt._id)}>
                    
                    <div className="menu-link">
                        {`R$ ${Number(debt.value).toFixed(2)}`}
                    </div>
                </li>
            );
        });
    }

    render() {
        let total = this.props.user.debts.reduce((res, currentDebt) => res + Number(currentDebt.value), 0);
        return (
            <li key={this.props.user.id} className="menu-item">
                <div className="menu-link" onClick={ this.toggleVisibility.bind(this) }>
                    {`${this.props.user.name} (R$ ${total.toFixed(2)})`}
                    <i className={"menu-state-icon fa fa-caret-left " + 
                                (this.state.details ? "rotate-minus-90" : "")}></i>
                </div>
                
                {this.renderSubItems(this.props.user)}
            </li>
        );
    }
};