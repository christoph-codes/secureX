const express =  require('express');
const twilio = require('twilio');
const router = express.Router();

router.get('/', (req, res) => {
    try{
        let client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
        client.messages.create({
            body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: req.body.phone_number
        }).then(message => {
            res.status(200).send(message);
        });
    }
    catch(err){
        res.status(400).send({
            error: ""
        });
    }
});

module.exports = router;