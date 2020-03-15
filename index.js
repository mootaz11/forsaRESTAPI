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


const app=Express()

app.use(BodyParser.urlencoded({extended:false}))
app.use(BodyParser.json());
app.use(cors());
app.use(morgan('tiny'));

const password ="rbTYm11n9UXBtAeE";
//mongodb://127.0.0.1:27017/linkedin
const uri="mongodb://127.0.0.1:27017/linkedin";
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





app.set('port',process.env.port || 3000);
app.listen(app.get('port'),()=>{
    console.log(`server is running on port  ${app.get('port')}`)});

//Model mte3 job wel project nahi field company w 5ali field barka user e5dem bih ynajim ye5ou iduser wela idcompany ma8ir reference al les deux models 5ater mahesh haja kbira msh lezem fel faza adhiya ne5dmou b populate
//getlatestFeeds (ordered by time) jib beha e5er projects w jobs habtouhom les amis mte3 l company wela l user
//latestfeeds ordered by time eli bch yet7atou fel profile mte3 l user wela company 
//j'aime wel commentaire , w getLikesBypost w getCommentsByposts
//Getfriendslist , getOnlinefriends
//gettopjobs(_id,title,salary,description)
//getTopprofiles (ordered by number of friendlist)
//getsuggestions 
//N.B: l5edma hethy lkol eli fel backend matbadil feha chey hatta les models matbadalsh fihom 

