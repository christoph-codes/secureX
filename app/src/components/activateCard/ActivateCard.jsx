import React, { useState } from 'react';
import { users } from '../../util/user';
import FormContainer from '../formContainer/FormContainer';
import {
	Row,
	Col,
	Form,
	Button,
	InputGroup,
	FormControl,
} from 'react-bootstrap';
import { local } from '../../index';
import { formatSocial, formatCC } from '../../util/helpers';
import './ActivateCard.scss';

export default function ActivateCard(props) {
	const [ssn, setssn] = useState('');
	const [ccnumber, setCcnumber] = useState('');
	const [cvv, setcvv] = useState('');
    const [verificationStatus,setVerificationStatus] = useState(false);
    const [user, setUser] = useState({});
    const [feedback, setFeedback] = useState('');

	const verify = (e) => {
		e.preventDefault();
        console.log('...Verifying');
        // Check database for user with associated ssn and find phone number
        if(ssn) {
            users.find(user => {
                return setUser(user.ssn === ssn)
            })
            setVerificationStatus(true)
        } else {
            setFeedback('We do not have this social on file. Get pre-approved today!');
            setVerificationStatus(false)
        }
        
        if(user.phone && verificationStatus) {
            // Send Twilio the phone number to verify user
            local.post(`/ssnverify`, {phone_number: `+1${user.phone}`}).then((response) => {
                console.log(response);
            });
        } else {
            setFeedback('To keep your account secure please provide a phone number to double verify it is you!');
        }
	};
	const activate = (e) => {
		e.preventDefault();
		console.log('...Activating');
		// axios.get(`/`, phone).then(response => {
		//     console.log(response);
		// })
	};

	return (
		<div className='ActivateCard page'>
			<FormContainer>
				<h1>Activate Your Card</h1>
				<p className='text-center'>
					It’s easy to set up Online Account Access. If you’re a first time user
					and have never set up access before, please use the form below to get
					started. If you’ve lost or misplaced your card, click here instead.
				</p>
				<Form onSubmit={activate}>
					<Form.Group>
						<Form.Label>Social Security Number</Form.Label>

						<InputGroup className='mb-3'>
							<FormControl
								placeholder="Recipient's SSN"
								aria-label="Recipient's SSN"
								onChange={(e) => setssn(e.target.value)}
								value={formatSocial(ssn)}
							/>
							<InputGroup.Append>
								<Button className='px-5' onClick={verify} variant='secondary'>
									Verify
								</Button>
							</InputGroup.Append>
						</InputGroup>
					</Form.Group>
					<Form.Group>
						<Row>
							<Col sm={8}>
								<Form.Label>16 Digit Card Number</Form.Label>
								<Form.Control
									onChange={(e) => setCcnumber(e.target.value)}
                                    value={formatCC(ccnumber)}
                                    maxLength={16}
								/>
							</Col>
							<Col>
								<Form.Label>CVV</Form.Label>
								<Form.Control
									onChange={(e) => setcvv(e.target.value)}
									value={cvv}
								/>
							</Col>
						</Row>
					</Form.Group>
					<Form.Group>
                        {feedback && <p>{feedback}</p>}
						<Button className='px-5 mt-3' variant='primary' type='submit'>
							Submit
						</Button>
					</Form.Group>
				</Form>
			</FormContainer>
		</div>
	);
}
