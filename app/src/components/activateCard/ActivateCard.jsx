import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function ActivateCard(props) {
	const [ssn, setssn] = useState('');
	const [ccnumber, setCcnumber] = useState('');
	const [cvv, setcvv] = useState('');
	const [user, setUser] = useState({});
	const [feedback, setFeedback] = useState('');
	const [isUserVerified, setIsUserVerified] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const history = useHistory();

	const verify = (e) => {
		e.preventDefault();
		console.log('...Verifying');
		let dbuser;
		let verifiedUser;
		let verificationStatus = false;
		// Check database for user with associated ssn and find phone number
		if (ssn) {
			axios.get(process.env.REACT_APP_AIRTABLE_URL).then((response) => {
				dbuser = response.data.records.find(
					(user) => user.fields.lastssn === ssn,
				);
				// console.log(dbuser)
				verifiedUser = dbuser;
				verificationStatus = true;

				if (verifiedUser) {
					if (verifiedUser.fields.phone && verificationStatus) {
						// Send Twilio the phone number to verify user
						local
							.post(`/ssnverify`, {
								phone_number: `${verifiedUser.fields.phone}`,
								verification_method: `${verifiedUser.fields.preferred_verification}`,
							})
							.then((response) => {
								setUser(verifiedUser);
								setIsUserVerified(true);
							});
					} else {
						setFeedback(
							'To keep your account secure please provide a phone number to double verify it is you!',
						);
					}
				} else {
					setFeedback('No user was found.');
				}
			});
		} else {
			setFeedback(
				'We do not have this social on file. Get pre-approved today!',
			);
			verificationStatus = false;
		}
	};
	const verifyCheck = (e) => {
		// Send Twilio the phone number to verify user
		local
			.post(`/verifycode`, {
				phone_number: `${user.fields.phone}`,
				enteredCode: `${verifyCode}`,
			})
			.then((response) => {
				console.log(response.data);
				if (response.data === 'approved') {
					setIsCodeVerified(true);
				} else {
					setIsCodeVerified(false);
				}
			});
	};

	useEffect(() => {
		console.log(user);
	}, [user]);

	const activate = (e) => {
		e.preventDefault();
        console.log('...Activating');
        if(isUserVerified && isCodeVerified && ccnumber === user.fields.cc_number && cvv === user.fields.cvv) {
            const savedUser = {
                ...user,
                isVerified: true,
                isCodeVerified: true,
            }
            history.push('/flow/create-account', savedUser);
        } else {
            setFeedback('Your card number and CVV do not match our records on file');
        }

		// axios.get(`/`, phone).then(response => {
		//     console.log(response);
		// })
	};

	return (
		<div className='ActivateCard page'>
			<FormContainer>
				<h1>Activate Your Card</h1>
				<p className='text-center'>
					We just need a little bit of information to activate your card. All fields are required.
				</p>
				<Form onSubmit={activate}>
					<Form.Group
						disabled={isUserVerified}
						className={isUserVerified ? 'verified' : null}
					>
						<Form.Label>Social Security Number</Form.Label>

						<InputGroup className='mb-3'>
							<FormControl
								placeholder="Recipient's SSN"
								aria-label="Recipient's SSN"
								onChange={(e) => setssn(e.target.value)}
								value={formatSocial(ssn)}
								maxLength={4}
								className={isUserVerified ? 'verified' : null}
							/>
							<InputGroup.Append>
								<Button
									className={`px-5 ${isUserVerified ? 'verified' : null}`}
									onClick={verify}
									variant='secondary'
								>
									{isUserVerified ? 'Sending Code...' : 'Verify'}
								</Button>
							</InputGroup.Append>
						</InputGroup>
					</Form.Group>
					{isUserVerified ? (
						<Form.Group className={isCodeVerified ? 'verified' : null}>
							<InputGroup className='mb-3'>
								<FormControl
									placeholder='Verification Code'
									aria-label='Verification Code'
									onChange={(e) => setVerifyCode(e.target.value)}
									value={verifyCode}
                                    maxLength={6}
                                    className={isCodeVerified ? 'verified' : null}
								/>
								<InputGroup.Append>
									<Button
										className={`px-5 ${isCodeVerified ? 'verified' : null}`}
										onClick={verifyCheck}
										variant='secondary'
									>
										{`${isCodeVerified ? 'Verified!' : 'Submit'}`}
									</Button>
								</InputGroup.Append>
							</InputGroup>
						</Form.Group>
					) : null}
					<Form.Group>
						<Row>
							<Col sm={8}>
								<Form.Label>Last 4 of card</Form.Label>
								<Form.Control
									onChange={(e) => setCcnumber(e.target.value)}
									value={formatCC(ccnumber)}
									maxLength={4}
								/>
							</Col>
							<Col>
								<Form.Label>CVV</Form.Label>
								<Form.Control
									onChange={(e) => setcvv(e.target.value)}
									value={formatCC(cvv)}
									maxLength={3}
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
