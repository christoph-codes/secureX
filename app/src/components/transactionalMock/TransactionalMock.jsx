import React from 'react';
import './TransactionalMock.scss';
import wolverine from '../../assets/images/wolverine.svg';

export default function TransactionalMock(props) {
	return (
		<div className='TransactionalMock'>
			<div className='container'>
				<h1>Transactional Dash</h1>
				<img src={wolverine} alt='Star Wars is Awesome!' />
			</div>
		</div>
	);
}
