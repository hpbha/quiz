var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport"),
    bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
	User          = require("./models/user"),
	answer = require("./models/ans.js");
 

mongoose.connect('mongodb+srv://Bharath:Rambo2501@cluster0.objup.mongodb.net/quiz?retryWrites=true&w=majority',{
	 useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true}).then(()=>{
	console.log('connected to db');
}).catch(err => {
	console.log("ERROR:",err.message);
});


		
var app = express();
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")(
{
	secret: "Rusty is the best and cutest dog in the world",
	resave: false,
	saveUninitialized : false
	
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(function(req, res, next){
// 	res.locals.currentUser = req.user;
// 	next();
// });
// //===Routes=====

app.get("/",function(req,res){
	res.render("login");
});


app.get("/secret",isLoggedin,function(req,res){
	let answercount = req.user.answercount;
	if(answercount<2){
		res.render("secret",{answercount}); 
	}else{
	   res.render("quiz2",{user:req.user});	
	}
});

//Auth Routes

//show sign up
app.get("/register",function(req,res){
	res.render("register");
});

//handle sign up form
app.post("/register",function(req,res){
	User.register(new User({username:req.body.username}), req.body.password,function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}else{
			passport.authenticate("local")(req, res, function(){
				res.redirect("/secret");
				
			})
		}
	})
});

//login routes
//render login form
//middleware
app.get("/login",function(req,res){
	console.log("logging in");
	res.render("login");
})

//login logic
app.post("/login",passport.authenticate("local",{
		 successRedirect:"/secret",
		 failureRedirect:"/login" }),
		 function(req,res){
	
});

app.get("/logout",function(req, res){
	req.logout();
	return res.render("home");
})

//handling answer


app.post("/update",bodyParser.json(),function(req,res){
	 let ans = req.body.answer;
	console.log(ans);
	 User.findOneAndUpdate({_id:req.user._id},{$push:{answers:ans}},function(error,data){
		 
		 User.findOneAndUpdate({_id:req.user._id},{answercount:data.answercount + 1},function(error,data){
		res.json(true);
			 
			 
	 })
		
	 })
	
})
app.get("/finish",function(req,res){
	User.findOne({_id:req.user._id},function(error,data){
		if(error){
			console.log(error);
		}else{
			res.render("quiz2",{user:req.user});
		}
	})
})

app.get("/getcount",function(req,res){
	User.findOne({_id:req.user._id},function(error,data){
		if(error){
			console.log(error);
		}else{
			res.json(data.answercount);
		}
	})
})
function isLoggedin(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect("login");
	}
}
app.listen(process.env.PORT||3000, function(){
	console.log("Server listening on port 3000");
});