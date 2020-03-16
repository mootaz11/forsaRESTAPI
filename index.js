const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");


//routes
const userRoute=require("./routes/user");
const experienceRoute=require("./routes/experience");
const educationRoute=require("./routes/education");
const friendRoute = require("./routes/friend");
const jobRoute = require("./routes/job");
const projectRoute = require("./routes/project");
const companyRoute = require("./routes/company");
const skillRoute = require("./routes/skill");
const commentRoute = require("./routes/comment");

const app=Express()

app.use(BodyParser.urlencoded({extended:false}))
app.use(BodyParser.json());
app.use(cors());
app.use(morgan('tiny'));

const password ="4NdwfdVtGM84LID1";
//mongodb://127.0.0.1:27017/linkedin
//const uri="mongodb://127.0.0.1:27017/linkedin";
const uri="mongodb+srv://amara11:"+password+"@cluster0-09veh.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})

mongoose.connection.on('error',()=>{console.log('connection failed')});
mongoose.connection.on('ok',()=>{console.log('connection done')})


app.use('/uploads',Express.static('uploads'));


//setting routes 
app.use('/skill',skillRoute);
app.use('/education',educationRoute);
app.use('/user',userRoute);
app.use('/experience',experienceRoute);
app.use('/friend',friendRoute);
app.use('/company',companyRoute);
app.use('/project',projectRoute);
app.use('/job',jobRoute);
app.use('/comment',commentRoute);





app.set('port',process.env.port || 3000);
app.listen(app.get('port'),()=>{
    console.log(`server is running on port  ${app.get('port')}`)});









//N.B: l5edma hethy lkol eli fel backend matbadil feha chey hatta les models matbadalsh fihom 

