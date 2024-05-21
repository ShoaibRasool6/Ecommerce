const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes');
const connection = require('./db');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.use('/products', productRoutes);

app.get('/', (request, response) => {
    response.status(200).json({ message: "Hello World" });
});

app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}`);
});
