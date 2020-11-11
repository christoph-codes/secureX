import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Flow from '../flow/Flow';
import Home from '../home/Home';
import './App.scss';

export default function App(props) {
	return (
		<Router>
			<div className='App'>
				<Switch>
					<Route path="/flow" component={Flow} />
					<Route path='/' exact component={Home} />
				</Switch>
			</div>
		</Router>
	);
}
