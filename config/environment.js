const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const logDirectory = path.join(__dirname, '../production_logs');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory) 
 
// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  size: "2M",
  path: logDirectory,
  compress:'gzip'
})

const development = {
	name:'development',
	port:8000,
	asset_path:'/assets',
	upload_path:'/uploads',
	session_cookie_key:"weFR_3283n}}43$#8fnf12_ef",
	db:'CNFB_db',
	gmail_id:"rajsriv.14@gmail.com",
	gmail_password:"rj071014@gmail",
	google_client_id:"1062128411018-28svnet4lk4c3un619klibvv0t2pg3nt.apps.googleusercontent.com",
	google_client_secret:"IesopoFyMrldK2JpEf8LnZkw",
	google_callback_url:"http://localhost:8000/users/auth/google/callback",
	github_client_id:"b050085d98a316c7e03c",	
	github_client_secret:"f4b234a1adabf3335ef37f9a4565b808e5615703",
	github_callback_url:"http://localhost:8000/users/auth/github/callback",
	fb_client_id:"**********",
	fb_client_secret:"**********",
	fb_callback_url:"**********",
	jwt_secret:"hjHj93jKh[Igkjei8khk_R_fr",
	morgan:{
		mode:'dev',
		options:{ stream: accessLogStream,
					skip: function (req, res) { 
						return res.statusCode < 400
				 	}
		}
	}
}

const production = {
	name:'production',
	port:8000,
	asset_path: process.env.SOCIALERA_ASSET_PATH,
	upload_path: process.env.SOCIALERA_UPLOAD_PATH,
	session_cookie_key: process.env.SOCIALERA_SESSION_COOKIE_KEY,
	db: process.env.SOCIALERA_DB,
	gmail_id: process.env.GMAIL_ID,
	gmail_password: process.env.GMAIL_PASSWORD,
	google_client_id: process.env.SOCIALERA_GOOGLE_CLIENT_ID,
	google_client_secret: process.env.SOCIALERA_GOOGLE_CLIENT_SECRET,
	google_callback_url: process.env.SOCIALERA_GOOGLE_CALLBACK_URL,
	github_client_id: process.env.SOCIALERA_GITHUB_CLIENT_ID,	
	github_client_secret: process.env.SOCIALERA_GITHUB_CLIENT_SECRET,
	github_callback_url: process.env.SOCIALERA_GITHUB_CALLBACK_URL,
	fb_client_id: process.env.SOCIALERA_FB_CLIENT_ID,
	fb_client_secret: process.env.SOCIALERA_FB_CLIENT_SECRET,
	fb_callback_url: process.env.SOCIALERA_FB_CALLBACK_URL,
	jwt_secret: process.env.SOCIALERA_JWT_SECRET,
	morgan:{
		mode:'combined',
		options:{ stream: accessLogStream,
					skip: function (req, res) { 
						return res.statusCode < 400
				 	}
		}
	}
}

// module.exports = eval(process.env.NODE_ENV == undefined ? development:eval(process.env.NODE_ENV));
module.exports = development;