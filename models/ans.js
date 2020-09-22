var mongoose = require("mongoose");


var answer = new mongoose.Schema({
 answer:{
		  id:{
			  type:mongoose.Schema.Types.ObjectId,
			  ref:"User"
		  },
		  ans:String
	  },
	
});

var answer = mongoose.model("answer",answer);