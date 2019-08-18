

//import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

// import the appropriate class
const functions = require('firebase-functions')
const { WebhookClient } = require('dialogflow-fulfillment');
const { Suggestion } = require("dialogflow-fulfillment");


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
    (request, response) => {

        //  Create an instance
        const _agent = new WebhookClient({ request, response });

        console.log(
            "Dialogflow Request headers: " + JSON.stringify(request.headers)
        );
        console.log("Dialogflow Request body: " + JSON.stringify(request.body));

        function welcome(agent) {
            agent.add(`Good day! Welcome to shopmart`);
            agent.add(`What would you like to buy ?`);
        }

        function fallback(agent) {
            agent.add(`I didn't understand`);
            agent.add(`I'm sorry, can you try again?`);
        }


        function usb(agent) {
            
            if(agent.parameters.storage) {
                const storage_usb:number = agent.parameters.storage;    
            }else {
                agent.add(`Select storage for usb, we've `);
                agent.add(new Suggestion('16 GB'));
                agent.add(new Suggestion('32 GB'));
                agent.add(new Suggestion('64 GB'));
            }
            
            if (agent.parameters.brand) {
                const brand:string = agent.parameters.brand;
                
            }else {
                agent.add(`Would you like any specific brand, we've `);
                agent.add(new Suggestion('Samsung'));
                agent.add(new Suggestion('Kingston'));
            }

            if(agent.parameters.price) {
                let price:number = agent.parameters.price
            }else {
                agent.add(`Your budget?`);
            }

             const port:number = agent.parameters.port;

            agent.add(`storage ${storage_usb} ,brand ${brand} ,price ${price} and port ${port}` );

        }


        // Run the proper handler based on the matched Dialogflow intent
        let intentMap = new Map();

        //  intentMap('Intent Name', Function Name)
        intentMap.set("Default Welcome Intent", welcome);
        intentMap.set("Default Fallback Intent", fallback);
        intentMap.set("usb", usb);

        //intentMap.set("room pictures", show_images);
        _agent.handleRequest(intentMap);

    }
);
