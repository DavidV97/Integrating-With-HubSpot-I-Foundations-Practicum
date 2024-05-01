const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-na1-47df19d2-e499-4ed4-8b10-0bd57ce5aa01';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {

    const pets = 'https://api.hubspot.com/crm/v3/objects/2-20576949?properties=age,name,breed,weight';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(pets, { headers });
        const data = resp.data.results;
        res.render('pets', { title: 'Pets | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }

});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/add', async (req, res) => {

    try {
        res.render('add', {});
        
    } catch(err) {
        console.error(err);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/add', async (req, res) => {
    const searchTerm = req.body.nameVal;
    const searchUrl = 'https://api.hubapi.com/crm/v3/objects/2-20576949/search';
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    const requestData = {
        filterGroups: [
            {
                filters: [
                    {
                        propertyName: 'name',
                        value: searchTerm,
                        operator: 'EQ'
                    }
                ]
            }
        ]
    };
    
    try {
        const resp = await axios.post(searchUrl, requestData, { headers });
        const total = resp.data.total;
        if(total > 0){
            const id = resp.data.results[0].id;
            const update = {
                properties: {
                    "age": req.body.ageVal,
                    "breed": req.body.breedVal,
                    "weight": req.body.weightVal
                }
            }

            const updatePet = `https://api.hubapi.com/crm/v3/objects/2-20576949/${id}`;

            try { 
                await axios.patch(updatePet, update, { headers } );
            } catch(err) {
                console.error(err);
            }

        }else{
            const create = {
                properties: {
                    "age": req.body.ageVal,
                    "breed": req.body.breedVal,
                    "weight": req.body.weightVal,
                    "name": req.body.nameVal
                }
            }

            const createPet = `https://api.hubapi.com/crm/v3/objects/2-20576949`;

            try { 
                await axios.post(createPet, create, { headers } );
            } catch(err) {
                console.error(err);
            }
        }

        res.redirect('/');


    } catch (err) {
        console.error(err);
    }

});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));