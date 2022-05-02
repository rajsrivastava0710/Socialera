const express = require('express');
const path = require('path');
const app = express();
const logger = require('morgan');
require('./config/view-helper.js')(app);
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const expressLayouts = require('express-ejs-layouts');
const db = require("./config/mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy.js');
const passportGithub = require('./config/passport-github-strategy.js');
const env = require('./config/environment');

// const passportFacebook = require('./config/passport-facebook-strategy.js');

const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const custoMware = require('./config/middleware');
const port = env.port || 8000;

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets.js').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat Server listening on port 5000');

const notifyServer = require('http').Server(app);
const notifySockets = require('./config/notify_sockets.js').notifySockets(notifyServer);
notifyServer.listen(3000);
console.log('Notification Server listening on port 3000');

if(env.name=='development'){
	app.use(sassMiddleware({
	src:path.join(__dirname,env.asset_path,'/scss'),
	dest:path.join(__dirname,env.asset_path,'/css'),
	debug: true,
	outputStyle:'extended',
	prefix:'/css'
	}))
}

app.use(logger(env.morgan.mode,env.morgan.options));

app.use(express.static(path.join(__dirname,env.asset_path)));

// make the uploads path available to the browser for (file-upload)
app.use('/uploads', express.static(path.join(__dirname,env.upload_path)));

app.use(cookieParser());

//Body-Parser

app.use(bodyParser.urlencoded({extended:true}));

//layout must be above route part
app.use(expressLayouts);
//Extracting style and script from subpages into layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

//session cookie 
//mongostore to store session cookie in db
app.use(session({
	name:'cookie_1',
	secret: env.session_cookie_key,
	saveUninitialized:false,
	resave:false,
	cookie:{
		maxAge:1000*60*100
		// in milli seconds
	},
	store: new MongoStore(
	{
		// mongooseConnection: db,
		url: `mongodb://localhost/${env.db}`,
		autoRemove: 'disabled'
	},
	function(err){
		console.log(err || 'connect mongo setup done');
	})
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
//whenever app is initialised passport is also initialised and this function is called as middleware

// connect-flash used after session is used
app.use(flash());

app.use(custoMware.setFlash);

//Using moments library
app.locals.moment = require('moment');

//EXPRESS router://Must be after passport.initialize
app.use('/',require('./routes'));

app.listen(port , function(err){
	if(err){
		console.log(`Error in running server: ${err}`);
	}
	console.log(`Server is running on port: ${port}`);
});