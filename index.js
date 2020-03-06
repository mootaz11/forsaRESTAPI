const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");


//routes
const userRoute=require("./routes/user");
const experienceRoute=require("./routes/experience");
const friendRoute = require("./routes/friend");


const app=Express()

app.use(BodyParser.urlencoded({extended:false}))
app.use(BodyParser.json());
app.use(cors());
app.use(morgan('tiny'));

const password ="rbTYm11n9UXBtAeE";
const uri="mongodb+srv://amara11:"+password+"@cluster0-09veh.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})


mongoose.connection.on('error',()=>{console.log('connection failed')});
mongoose.connection.on('ok',()=>{console.log('connection done')})


app.use('/uploads',Express.static('uploads'));


//setting routes 

app.use('/user',userRoute);
app.use('/experience',experienceRoute);
app.use('/friend',friendRoute);


app.set('port',process.env.port || 3000);
app.listen(app.get('port'),()=>{
    console.log(`server is running on port  ${app.get('port')}`)
});

