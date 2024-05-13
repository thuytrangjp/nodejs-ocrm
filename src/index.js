import express from 'express';
import cors from 'cors';

const app = express();

//Chèn middle để chuyển đổi sang json
app.use(express.json());

//Tùy chỉnh CORS header
app.use(cors({
    origin: [
        "http://localhost:5173"
    ]
}))

app.listen(8080);

//Add RootRouter
import rootRouter from "./routes/rootRouter.js";
app.use(rootRouter);