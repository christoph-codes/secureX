import React from 'react';
import Button from 'react-bootstrap/Button';
import './Home.scss';
import slogo from '../../assets/images/securex_logo.svg';

export default function Home(props) {
	return (
		<div className='Home'>
			<div className='home-container'>
				<div className='logo'>
					<img src={slogo} alt='SecureX Project by Credit One Bank' />
				</div>
				<div className='buttons'>
					<Button variant='primary' size={'lg'} href='/flow/card-activation'>
						Activate Card
					</Button>
					<Button variant='secondary' size={'lg'} href='/flow/create-account'>
						Create Account
					</Button>
				</div>
			</div>
		</div>
	);
}
