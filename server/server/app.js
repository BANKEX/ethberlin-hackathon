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
const contractcontroller = require('./controllers/contract.ctrl')

const app = express()
const router = express.Router()
const url = process.env.MONGODB_URI || "mongodb://137.117.212.107:27017/snark"
const nodeUrl="http://localhost:8545";

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
    console.log(`[backend] Server started at port: ${port}`);
});

function loop (){
    console.log("[backend] listener started");
    // votecontroller.checkVotes((data)=>{
    //     console.log('[backend] votes ' + data);
    //     snarkcontroller.createInput(data, ()=>{
    //         console.log("[backend] created inputs");
    //         snarkcontroller.generateSnark(()=>{
    //             console.log("[backend] generated keys.json and proof.json");
                contractcontroller.deploy(nodeUrl,(address)=>{
                    console.log("[backend] deployed on adress "+ address)
                    contractcontroller.verify(nodeUrl, address,(result)=>{
                        console.log("[backend] verified " + result);
                        setTimeout(loop, 15000);
                    })
    //            })
    //        })
    //    })
    });
}

loop();
