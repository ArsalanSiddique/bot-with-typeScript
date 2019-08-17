import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

// import the appropriate class
//const functions = require('firebase-functions')
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require("dialogflow-fulfillment");


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
    (request, response) => {

        //  Create an instance
        const _agent = new WebhookClient({ request, response });

        console.log(
            "Dialogflow Request headers: " + JSON.stringify(request.headers)
        );
        console.log("Dialogflow Request body: " + JSON.stringify(request.body));

        function welcome(agent) {
            agent.add(`Good day! Welcome to the Westin Hotel`);
            agent.add(new Suggestion('Custom booking'));
            agent.add(new Suggestion('Show packages'));
        }

        function fallback(agent) {
            agent.add(`I didn't understand`);
            agent.add(`I'm sorry, can you try again?`);
        }

        function all(agent) {



            agent.add(new Suggestion('Yes'));
            agent.add(new Suggestion('No'));



            agent.add(
                new Card({
                    title: `Summer special`,
                    imageUrl: `https://www.edenhotels.nl/media/images/shutterstock_1433028059.2e16d0ba.original.fill-1280x960.jpg`,
                    text: ` 1 x overnight stay in a comfortable room \n
                                Based on two persons`,
                    buttonText: `See full Package`,
                    buttonUrl: `https://www.themanorhotelamsterdam.com/en/packages/summer-package/?_ga=2.209328790.587124662.1564954816-1563133300.1564954816`,
                })


            );


        }


        // Run the proper handler based on the matched Dialogflow intent
        let intentMap = new Map();

        //  intentMap('Intent Name', Function Name)
        intentMap.set("Default Welcome Intent", welcome);
        intentMap.set("Default Fallback Intent", fallback);
        intentMap.set("everything", all);

        //intentMap.set("room pictures", show_images);
        _agent.handleRequest(intentMap);

    }
);
