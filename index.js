
import express from "express"; // "type": "module"
import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import cors from "cors";
import shortid from "shortid";
import signinRouter from './router/login.router.js';
import emailRouter from './router/route.js';
import { auth } from "./middleware/auth.js";

dotenv.config()
const app = express();

const MONGO_URL = (process.env.MONGO_URL)
const PORT = process.env.PORT;

export const client = new MongoClient(MONGO_URL);
await client.connect();
console.log('mongo is connected!!');

app.use(cors())
app.use(express.json())

app.get("/", function (request, response) {
    response.send("🙋‍♂️,hello..worlds 🌏 🎊✨🤩");
});


app.post('/api/shorten', async (req, res) => {
    const { url } = req.body;
    if (url) {
        // Generate short ID
        const shortId = shortid.generate();

        // Save URL to database
        const newUrl = await client
            .db("urlshortner")
            .collection("urlshortner")
            .insertOne({
                originalUrl: url,
                shortUrl: `https://url-backend-phi.vercel.app/${shortId}`,
            });
        // await newUrl.save();

        // Return shortened URL
        res.json({
            originalUrl: url,
            shortUrl: `https://url-backend-phi.vercel.app/${shortId}`,
        });
    } else { res.status(400).json({ message: 'url not defind' }) }
});

app.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;

    // Find URL in database
    const url = await client
        .db("urlshortner")
        .collection("urlshortner")
        .findOne({ shortUrl: `https://url-backend-phi.vercel.app/${shortId}` });

    if (!url) {
        return res.status(404).send('URL not found');
    }

    // Redirect to original URL
    res.redirect(url.originalUrl);
});

app.use("/", signinRouter);
app.use("/", emailRouter);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));