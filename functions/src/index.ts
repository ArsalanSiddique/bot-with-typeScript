

//import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

// import the appropriate class
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const { WebhookClient } = require('dialogflow-fulfillment');
const { Suggestion } = require("dialogflow-fulfillment");

admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

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

            const storage_usb: number = agent.parameters.storage;

            const brand: string = agent.parameters.brand;

            const price: number = agent.parameters.price.amount;

            const port: number = agent.parameters.port;


            if (storage_usb) {
                // do nothing if true
            } else {
                agent.add('Select storage, we have ')
                agent.add(new Suggestion('16 GB'));
                agent.add(new Suggestion('32 GB'));
                agent.add(new Suggestion('64 GB'));
            }

            if (storage_usb) {
                if (price) {
                    // do nothing if true
                } else {
                    agent.add('Enter your expected price');
                }
            }

            if (storage_usb && price) {
                agent.add(`storage ${storage_usb} ,brand ${brand} ,price ${price} and port ${port}`);
                let result24 = show_products(storage_usb, price, brand, price);
            }

        }


        function add_products(agent) {
            const params = agent.parameters;
            firestore.collection("usb").add(params)
                .then(() => {
                    response.send({
                        fulfillmentText:
                            `${params.brand} usb, ${params.price} price, ${params.port} port, storage ${params.storage} added to database.`
                    });

                    return response.status(200);
                })
                .catch((e) => {
                    response.send({
                        fulfillmentText: "Something went wrong when writing in database."
                    });
                });
        }

        function show_products(usb_storage: Number, usb_ports: Number, usb_brand: String, usb_price: Number): void {
            firestore.collection('usb').get()
            .then((querySnapshot) => {

                const orders = [];
                querySnapshot.forEach((doc) => { orders.push(doc.data()) });

                let speech = `Here is usb \n`;

                orders.forEach((eachOrder, index) => {
                    speech += `\n Brand ${index + 1} is ${eachOrder.brand} brand for ${eachOrder.price} price, ordered by ${eachOrder.storage} GB and ${eachOrder.port} port \n`
                })

                response.send({
                    fulfillmentText: speech
                });
                return response.status(200);
            })
            .catch((err) => {
                console.log('Error getting documents', err);

                response.send({
                    speech: "something went wrong when reading from database"
                })
            })

        }



        // Run the proper handler based on the matched Dialogflow intent
        let intentMap = new Map();

        //  intentMap('Intent Name', Function Name)
        intentMap.set("Default Welcome Intent", welcome);
        intentMap.set("Default Fallback Intent", fallback);
        intentMap.set("usb", usb);
        intentMap.set("add products", add_products);

        //intentMap.set("room pictures", show_images);
        _agent.handleRequest(intentMap);

    }
);

