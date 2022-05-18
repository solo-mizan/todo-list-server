const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//  middleware
app.use(cors());
app.use(express.json());

// mongodb config
const uri = `mongodb+srv://dbuser2:viNcndRgW9PkyN2p@cluster0.udusb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);

async function run() {
    try {
        await client.connect();
        const todoCollection = client.db('todo').collection('list');

        // get all todo list
        app.get('/list', async (req, res) => {
            const query = {};
            const cursor = todoCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        // post a new todo list
        app.post('/list', async (req, res) => {
            const newItem = req.body;
            console.log(newItem);
            const result = await todoCollection.insertOne(newItem);
            res.send(result);
        });

        // delete single todo item
        app.delete('/list/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

    }
    catch { }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running for todo list');
});

app.listen(port, () => {
    console.log('Server is running on port', port);
});