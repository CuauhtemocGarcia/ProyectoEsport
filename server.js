const express = require('express');
const cors = require('cors');
require('dotenv').config();
const usersRouter = require('./routes/users');

class server {
    constructor(){
        this.app = express();//se instancia express
        this.port = process.env.PORT;    //definimos el puerto

        //paths         http://localhost:3000/api/v1
        this.basePath = '/api/v1';   //ruta base

        this.usersPath = `${this.basePath}/esports`;

        this.middlewares();       //invocacion de los middlewares

        this.routes();
    }
    
    middlewares(){
        this.app.use(express.json());   //para podeer interpretar texto en formato JSON
    }

    routes(){
        this.app.use(this.usersPath, usersRouter);   //Endpoint de users
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log("server listening on port" + this.port)
        })
    }
}

module.exports = server;