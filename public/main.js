let question1_ans = document.querySelectorAll(".q1o");
let question2_ans = document.querySelectorAll(".q2o");
let nextBtn = document.querySelector(".next");
let question1 = document.querySelector(".first");
let question2 = document.querySelector(".second");
let answer1 ;
let progressbar = document.querySelector(".progressbar-container .first-part");
let questionPara = document.querySelector(".question-para");
    
let questioncount = 0;
fetch("/getcount",{
	method:"GET",
	}).then(res=> res.json())
      .then(data=> {
	      console.log(data);
	   if(data === 1){
		  progressbar.classList.add("move-progressbar"); 
	   }
		  questioncount = data;
	  });

question1_ans.forEach(function(option){
	option.addEventListener("input",function(e){
		nextBtn.removeAttribute("disabled"); 
		answer1 = this.value;
		console.log(answer1);
	})
})
   
	nextBtn.addEventListener("click",function(e){
		update(answer1,e);
		progressbar.classList.add("move-progressbar");
		nextBtn.setAttribute("disabled","true"); 		
})

question2_ans.forEach(option=>{
	option.addEventListener("input",function(){
		nextBtn.removeAttribute("disabled"); 
		answer1 = this.value;
		console.log("clicked");
		console.log(answer1);
	})
})

function update(answer,e){
	fetch("/update",{
		method:"POST",
		headers:{
			'Content-Type':'application/json'
		},
		body:JSON.stringify({
			answer:answer1
		})
	}).then(res=>{
			return res.json();
		}).then(data=>{
		console.log("function" + questioncount);
		questionPara.innerText = "Question 2";
		questioncount++;
		if(questioncount!=2){
	       question1.style.display = "none";
	       question2.style.display="block";		
		}else{
			window.location = "/finish";
		}
		})
}

