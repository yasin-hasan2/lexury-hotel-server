const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3tdkdjy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const serviceCollection = client.db('LuxuryHotel').collection('services')
        const bookingCollection = client.db('LuxuryHotel').collection('bookings')
        const usersCollection = client.db('LuxuryHotel').collection('users')


        //services

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }

            const options = {
                projection: { room_image: 1, room_name: 1, details_description: 1, room_price: 1, bed_name: 1, room_category: 1, room_offer: 1, rating: 1, max_guest: 1, room_space: 1, room_view: 1, hotel_rules: 1 }
            }

            const result = await serviceCollection.findOne(query, options)
            res.send(result)
        })


        //bookings

        app.post('/bookings', async (req, res) => {
            const booking = req.body
            console.log(booking)
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
        })

        //users 


        app.post('/users', async (req, res) => {
            const users = req.body
            const result = await usersCollection.insertOne(users)
            console.log(result)
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find();
            const users = await cursor.toArray();
            console.log(users)
            res.send(users)
        })

        app.patch('/users', async (req, res) => {
            const user = req.body
            const filter = { email: user.email }
            const updateDoc = {
                $set: {
                    lastLoggedAt: user.lastLoggedAt
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Hotel is running ')
})

app.listen(port, () => {
    console.log(`hotel server is running on port ${port}`)
})


