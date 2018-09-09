/** require dependencies */
const express = require("express")
const routes = require('./routes/')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cloudinary = require('cloudinary')

const votecontroller = require('./controllers/vote.ctrl')
const snarkcontroller = require('./controllers/snark.ctrl')

const app = express()
const router = express.Router()
const url = process.env.MONGODB_URI || "mongodb://137.117.212.107:27017/snark"

/** connect to MongoDB datastore */
try {
    mongoose.connect(url, {
        user:"eth",
        pass:"23fdfwef24f$!!3fgd88!!21"
    })    
} catch (error) {
    
}

let port = 5000 || process.env.PORT

/** set up routes {API Endpoints} */
routes(router)

/** set up middlewares */
app.use(cors())
app.use(bodyParser.json())
app.use(helmet())
//app.use('/static',express.static(path.join(__dirname,'static')))

app.use('/api', router)

/** start server */
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});


setInterval(() => {
    //опрос бд
    console.log("listener");
    votecontroller.checkVotes((data)=>{
        snarkcontroller.createInput(data, (inputs)=>{
            console.log(inputs);
        })
    });

}, 15000);
