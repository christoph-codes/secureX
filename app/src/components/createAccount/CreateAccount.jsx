import React, { useState, useEffect } from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import FormContainer from '../formContainer/FormContainer';
import { formatSocial } from '../../util/helpers';
import axios from 'axios';
import { local } from '../../index';
import './CreateAccount.scss';

export default function CreateAccount({ location }) {
	const [user, setUser] = useState(() => {
		if (location.state) {
			return location.state.fields;
		} else {
			return {};
		}
	});
	const [ssn, setssn] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isUserVerified, setIsUserVerified] = useState(() => {
        if (location.state) {
			return true;
		} else {
			return false;
		}
    });
	const [verifyCode, setVerifyCode] = useState('');
	const [isCodeVerified, setIsCodeVerified] = useState(() => {
        if (location.state) {
			return true;
		} else {
			return false;
		}
    });
    const [feedback, setFeedback] = useState('');
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

	const createAccount = () => {
        if(isUserVerified && isCodeVerified) {
            if(username && password) {
                if(password === confirmPassword) {
                    const updates = {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        id: user.id,
                        username: username,
                        password: password,
                    }
                    console.log('...Creating the account');
                    history.push('/transactional');
                    local.post('/writedb', updates)
                        .then(function (response) {
                        // handle success
                        console.log(response);
                        })
                } else {
                    setFeedback('Your passwords do not match');
                }
            } else {
                setFeedback('You must enter a valid username and password');
            }
        } else {
            setFeedback('All fields must be complete')
        }
    };
    

	useEffect(() => {
		console.log(`User verified: ${isUserVerified}`);
		console.log(`Code verified: ${isCodeVerified}`);
	}, [isUserVerified, isCodeVerified]);

	return (
		<div className='CreateAccount page'>
			<FormContainer>
				{isCodeVerified ? (
					<h1>Thanks {user.firstname}, for activating your card!</h1>
				) : (
					<h1>Thank you for activating your card!</h1>
				)}
				<h4 className='text-center'>
					Let's get your online account access set up!
				</h4>

				<p className='text-center'>
					Please use the form below to get started. If you’ve lost or misplaced
					your card, click here instead.
				</p>
				<Form onSubmit={createAccount}>
					{!isCodeVerified ? (
						<>
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
							{isUserVerified && !isCodeVerified ? (
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
						</>
					) : <p className="verify">Your account has been verified!</p>}

					<Form.Group className={!isUserVerified || !isCodeVerified ? 'disabled' : null}>
						<Form.Label>Username</Form.Label>
						<Form.Control
							onChange={(e) => setUsername(e.target.value.replace(/[^\w\s]/gi, '').toLowerCase())}
                            value={username}
							maxLength={16}
							disabled={!isUserVerified || !isCodeVerified}
						/>
					</Form.Group>
					<Form.Group className={!isUserVerified || !isCodeVerified ? 'disabled' : null}>
						<Form.Label>Password</Form.Label>
						<Form.Control
							onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            minLength={8}
							type="password"
							disabled={!isUserVerified || !isCodeVerified}
						/>
					</Form.Group>
					<Form.Group className={!isUserVerified || !isCodeVerified ? 'disabled' : null}>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
							type="password"
							disabled={!isUserVerified || !isCodeVerified}
						/>
					</Form.Group>
					<Form.Group>
						{feedback && <p>{feedback}</p>}
						<Button disabled={!isUserVerified || !isCodeVerified} className='px-5 mt-3' variant='primary' type='submit'>
							Submit
						</Button>
					</Form.Group>
				</Form>
			</FormContainer>
		</div>
	);
}
