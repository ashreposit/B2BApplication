import express from "express";
import userRoutes from './routes/user.routes';
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swaggerConfig";
import CONFIG from "./config/config";

const app = express();
app.use(cookieParser()); 
app.use(express.json());

app.use('/user',userRoutes);

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));

app.listen(CONFIG.APP_PORT,()=>{
    console.log({INFO:`your app is running at port ${CONFIG.APP_PORT}`});
})