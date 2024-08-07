const express = require('express');
const cors = require('cors');
require('dotenv').config();
import authRouter from './routes/authRouter'
import userRouter from './routes/userRouter'
import projectRouter from './routes/projectRouter'

const app = express();

// app.use(cors())
const corsOptions = {
    origin: [`http://localhost:${process.env.CLIENT_PORT}`], // Allow only these origins
};
  
app.use(cors(corsOptions));

app.use(express.json())

app.use("/api", authRouter);
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on localhost:${process.env.SERVER_PORT}`)
});