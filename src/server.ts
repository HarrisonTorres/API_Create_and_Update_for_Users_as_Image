import express, { Application, NextFunction, Request, Response, request, response } from 'express';
import { UserRoutes } from './routers/users.routes';


const app:Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usersRouters = new UserRoutes().getRoutes();



app.use('/users', usersRouters);


app.use((err:Error, request:Request, res:Response, next:NextFunction) => {
    if(err instanceof Error){
        return res.status(400).json({
            message: err.message,
        })
    }
    return response.status(500).json({
        message: 'Internal server error',
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})