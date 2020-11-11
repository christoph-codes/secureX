import React, {useState,useEffect} from 'react';
import { user } from '../../util/user';
import FormContainer from '../formContainer/FormContainer';
import {Row, Col, Form, Button} from 'react-bootstrap';
import axios from 'axios';
import {local} from '../../index';
import './ActivateCard.scss'

export default function ActivateCard(props) {
    const [ssn,setssn] = useState('');
    const [ccnumber,setCcnumber] = useState('');
    const [cvv,setcvv] = useState('');
    const [phone,setPhone] = useState({"phone_number": "+17023360322"});

    const verify = (e) => {
        e.preventDefault();
        console.log('...Verifying')
        local.post(`/ssnverify`, phone).then(response => {
            console.log(response);
        })
    }
    const activate = (e) => {
        e.preventDefault();
        console.log('...Activating')
        // axios.get(`/`, phone).then(response => {
        //     console.log(response);
        // })
    }
    
    return (
        <div className='ActivateCard page'>
            <FormContainer>
                <h1>Activate Your Card</h1>
                <p className="text-center">It’s easy to set up Online Account Access. If you’re a first time user and have never set up access before, please use the form below to get started. If you’ve lost or misplaced your card,  click here instead.</p>
                <Form onSubmit={activate}>
                    <Form.Row>
                        <Form.Group>
                            <Form.Label>Social Security Number</Form.Label>
                            <Form.Control onChange={(e) => setssn(e.taget.value())} value={ssn} />
                            <Button onClick={verify} variant="primary">
                                Verify
                            </Button>
                        </Form.Group>
                        <Form.Group>
                            <Row>
                                <Col>
                                    <Form.Label>16 Digit Card Number</Form.Label>
                                    <Form.Control onChange={(e) => setCcnumber(e.taget.value())} value={ccnumber} />
                                </Col>
                                <Col>
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control onChange={(e) => setcvv(e.taget.value())} value={cvv} />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                        Submit
                        </Button>
                    </Form.Row>
                </Form>
            </FormContainer>
        </div>
    )
}