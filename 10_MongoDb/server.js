import express from "express";
import connections from './connections.js';
import routes from './routes/Routes.js'

const app = express();
const dbName = "Gaurav";

await connections.connectMongoDb(`mongodb://127.0.0.1:27017/${dbName}`);

app.use(express.json());

await routes.formulateRoutes(app);

app.listen(8080, () => {
    console.log("Server started listening at port 8080");
});
