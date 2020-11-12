const express = require('express');
const twilio = require('twilio');
const router = express.Router();
const Airtable = require('airtable');

router.post('/', (req, res) => {
	try {
		let client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
		client.messages
			.create({
				body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
				from: process.env.TWILIO_PHONE_NUMBER,
				to: req.body.phone_number,
			})
			.then((message) => {
				res.status(200).send(message);
			});
	} catch (err) {
		res.status(400).send({
			error: err,
		});
	}
});

router.post('/writedb', (req, res) => {
	try {
		console.log(req.body.id);
		const base = new Airtable({apiKey: 'keyX79659k8TsxfTb'}).base('appHh4nd4KMCZ4NLL');
		base('twilio').update([
			{
			  "id": req.body.id,
			  "fields": {
				username: req.body.username,
				password: req.body.password
			  }
			}
		])
		res.send({ status: 'Everything is healthy' });
	} catch (err) {
		res.send({ status: 'Everything is NOT healthy' });
	}
});

router.post('/ssnverify', (req, res) => {
	try {
		console.log(process.env.TWILIO_VERIFY_SERVICE_SID);
		let client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

		client.verify
			.services(process.env.TWILIO_VERIFY_SERVICE_SID)
			.verifications.create({
				to: req.body.phone_number,
				channel: req.body.verification_method,
			})
			.then((verification) => {
                console.log(verification.status);
				res.status(200).send(verification);
            })
			.catch((err) => {
				console.log(err);
			});
	} catch (err) {
		res.status(400).send({
			error: '',
		});
	}
});

router.post('/verifycode', (req, res) => {
	try {
		console.log(process.env.TWILIO_VERIFY_SERVICE_SID);
		let client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
		console.log(req.body.phone_number);
		console.log(req.body.enteredCode);

		client.verify
			.services(process.env.TWILIO_VERIFY_SERVICE_SID)
			.verificationChecks.create({
				to: req.body.phone_number,
				code: req.body.enteredCode,
			})
			.then(verification_check => {
				console.log(verification_check.status);
				res.status(200).send(verification_check.status);
			})
			.catch((err) => {
				console.log(err);
			});
	} catch (err) {
		res.status(400).send({
			error: '',
		});
	}
});

router.get('/healthcheck', (req, res) => {
	try {
		res.send({ status: 'Everything is healthy' });
	} catch (err) {
		res.send({ status: 'Everything is NOT healthy' });
	}
});

module.exports = router;
