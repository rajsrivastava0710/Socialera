const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const expressLayouts = require('express-ejs-layouts');
const db = require("./config/mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const custoMware = require('./config/middleware');
const port = 8000;

app.use(sassMiddleware({
	src:'./assets/scss',
	dest:'./assets/css',
	debug: true,
	outputStyle:'extended' ,
	prefix:'/css'
}))


app.use(express.static('./assets'));

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
	secret:'some-encryptionb ',
	saveUninitialized:false,
	resave:false,
	cookie:{
		maxAge:1000*60*100
		// in milli seconds
	},
	store: new MongoStore(
	{
		// mongooseConnection: db,
		url: 'mongodb://localhost/CNFB_db',
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

//EXPRESS router://Must be after passport.initialize
app.use('/',require('./routes'));

app.listen(port , function(err){
	if(err){
		console.log(`Error in running server: ${err}`);
	}
	console.log(`Server is running on port: ${port}`);
});