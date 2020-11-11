const express = require('express');
const twilio = require('twilio');
const router = express.Router();

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

router.post('/ssnverify', (req, res) => {
	try {
        console.log(process.env.TWILIO_VERIFY_SERVICE_SID);
        let client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

		client.verify
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
			.verifications.create({ 
                to: req.body.phone_number, 
                channel: 'sms',
            })
			.then((verification) => {
                console.log(verification.status);
				res.status(200).send(verification);
            })
            .catch(err => {
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
