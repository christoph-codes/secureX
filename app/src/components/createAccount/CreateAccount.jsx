import React from 'react';
import { users } from '../../util/user';
import FormContainer from '../formContainer/FormContainer';
import './CreateAccount.scss'

export default function CreateAccount(props) {
    return (
        <div className='CreateAccount page'>
            <FormContainer>
                <h1>Thanks {users.fname}, for activating your card!</h1>
				<p className='text-center'>
					It’s easy to set up Online Account Access. If you’re a first time user
					and have never set up access before, please use the form below to get
					started. If you’ve lost or misplaced your card, click here instead.
				</p>
            </FormContainer>
        </div>
    )
}