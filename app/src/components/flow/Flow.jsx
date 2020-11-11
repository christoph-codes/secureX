import React from 'react';
import Header from '../header/Header';
import ActivateCard from '../activateCard/ActivateCard';
import CreateAccount from '../createAccount/CreateAccount';
import './Flow.scss'
import { Switch, Route } from 'react-router-dom';

export default function Flow({ children }) {
    return (
        <div className='Flow'>
            <Header/>
            <Switch>
                <Route path='/flow/card-activation' exact component={ActivateCard} />
				<Route path='/flow/create-account' exact component={CreateAccount} />
            </Switch>
        </div>
    )
}