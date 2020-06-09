'use strict';
// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Create the endpoint for our webhook
app.post('/webhook', (req,res) => {
    let body = req.body;

    // Checks this is an event from a page subscription
    if(body.object === 'page'){
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach( entry => {
            // Get the message. entry.message is an array, but will contain only one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
        });
        res.status(200).send('EVENT RECIEVED');
    }
    else{
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
})
// Add support for get requests to our webhook

app.get('/webhook', (req,res) => {
    let VERIFY_TOKEN = "devhelpbot"

    // Pare the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if(token && mode){
        if(mode === 'subscribe' && token === VERIFY_TOKEN){

            //Responds with the challenge token from the request
            console.log('WEBHOOK VERIFIED');
            res.status(200).send(challenge); 
        }
        else{
            //Responds with 403 Forbidden if verify token do not match
            res.sendStatus(403);
        }
    }
})