import express from "express";
import routes from "./router";

const app = express();
app.use(express.json());
app.use(routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Users API running on port ${port}`);
});
