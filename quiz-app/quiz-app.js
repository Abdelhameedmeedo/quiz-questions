let questionCounter = document.querySelector('.app-info .Q-count span');
let bullets = document.querySelector('.bullets');
let QuestionBullets = document.querySelector('.app-page .bullets .span-container');
let questionTitle = document.querySelector('.app-page .Q-title');
let questionArea = document.querySelector('.app-page .Q-area');
let submitButton = document.querySelector('.btn');
let finallResult = document.querySelector('.result');
let timeCounterDiv = document.querySelector('.time-counter');
    //set question index 
let questionIndex = 0;
    //right-Answer count
let rightAnswer = 0;
    //time-counter-down
let timeConterDown;
    //ajax
function getQuestionRequest() {
    let getRequest = new XMLHttpRequest();
    getRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200){
            let jsonToJS = JSON.parse(this.responseText);
                //get the length of the questions
            let questionLength = jsonToJS.length;
            createBullets(questionLength);
                //get the q-index and q-length
            createTitleAnswers(jsonToJS[questionIndex],questionLength);
                //time-counter 
            timeCounter(240,questionLength);
                //submit function on click
            submitButton.onclick = ()=>{
                //get the right answer
                let rightAnswer = jsonToJS[questionIndex].right_answer;
                //increase question index
                questionIndex++;
                checkedAnswers(rightAnswer,questionLength);
                    //clear q-area and q-header
                questionTitle.innerHTML ="";
                questionArea.innerHTML = "";   
                    //get the q-index and q-length
                createTitleAnswers(jsonToJS[questionIndex],questionLength);
                    //handle bullets
                handleBullets();
                    //show result
                showResult(questionLength);
            }
        }
    }
    getRequest.open("GET","quizAppQuestions.json",true);
    getRequest.send();
}
getQuestionRequest();



//bullets function
function createBullets(num) {
        //put the number of questions
    questionCounter.innerHTML = num;
        //create bullets (span that show you at which question)
    for(let i = 0; i < num ; i++){
            //create span
        let spanBullet = document.createElement('span');
            //check if the span has class on or not
        if(i === 0){
                //add the class on
            spanBullet.className = "on";
        }
            //append spanBullet into questionBllets
        QuestionBullets.appendChild(spanBullet);
    }
}

//create title and q-answers
function createTitleAnswers(obj,count) {
    if(questionIndex < count){
        //create h2
    let QTitle = document.createElement('h2');
    //create title text
let titleText = document.createTextNode(obj['title']);
    //append title text inton q-title
QTitle.appendChild(titleText);
    //append q-title into title parent div
questionTitle.appendChild(QTitle);
    //create input answers
for(let i = 1; i < 5 ; i++){
        //create mainDiv
    let mainDiv = document.createElement('div');
        //add class
    mainDiv.className = "Q-answer";
        //create input answer
    let inputAnswer = document.createElement('input');
        //create or add name id dataset type
    inputAnswer.type = "radio";
    inputAnswer.name = "question";
    inputAnswer.id = `answer_${i}`;
        //to deal with q-answer
    inputAnswer.dataset.answer = obj[`answer_${i}`];
    //add focus on first answer
    if(i === 1){
        inputAnswer.checked = true;
    } 
        //create label
    let labelAnswer = document.createElement('label');
        //add for attr
    labelAnswer.htmlFor =  `answer_${i}`;
        //create label text
    let labelText = document.createTextNode(obj[`answer_${i}`]);
        //append label text into label answer
    labelAnswer.appendChild(labelText);
        //append input-answer and label-answer into main-div
    mainDiv.appendChild(inputAnswer);
    mainDiv.appendChild(labelAnswer);
        //append main-div into q-area
    questionArea.appendChild(mainDiv);
} 
    }
           
}

//function for right answer and q-count 
function checkedAnswers(rAnswer,count){
   let allAnswers = document.getElementsByName('question');
   let theChoosenAnswer;
   for(let i = 0; i < 4; i++){
       if(allAnswers[i].checked){
           //get the value of chhosen-answer
           theChoosenAnswer = allAnswers[i].dataset.answer;
        
       }
       //if right-answer in json === choosen-answer
       if(rAnswer === theChoosenAnswer){
            //increase the right-answers   
        rightAnswer++;
           console.log("per");
       }
   }
   
}
//handle bullets function
function handleBullets(){
    let allBulletsSpan = document.querySelectorAll('.bullets span');
    let putBulletsSpanInArray = Array.from(allBulletsSpan);
    putBulletsSpanInArray.forEach((span,spanIndex)=>{
        if(questionIndex === spanIndex){
            span.className = "on";
        }
    })
}

//show result
function showResult(count){
    let theResult;
    if(questionIndex === count){
        questionArea.remove();
        bullets.remove();
        submitButton.remove();
        if(rightAnswer > (count / 2) && rightAnswer < count){
            theResult = `<span class="good">Good<span/>, you answered${rightAnswer} from ${count}`;
        }else if(rightAnswer === count){
            theResult = `<span class="perfect">perfect<span/> , you answered ${count}`;
        }else {
            theResult = `<span class="bad">bad<span/>, you answered ${count}`;
        }
        finallResult.innerHTML = theResult;
    }
}

//time-counter function
function timeCounter(duration,count){
    if(questionIndex < count){
        var minute,second;
        timeConterDown = setInterval(()=>{
            minute = parseInt(duration / 60);
            second = parseInt(duration % 60);
            timeCounterDiv.innerHTML = `time is: ${minute} : ${second} `;
            if(--duration < 0){
                clearInterval(timeConterDown);
                timeCounterDiv.innerHTML = "time is: done";
            }
        },1000)
    }

}