const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let checkCount = 0 ;
handleSlider();
// set strength circle color to grey initially.
setIndicator("#ccc");

// set password length and show it on UI
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min) * 100 / (max-min)) + "% 100%";  // here 100% is height of colored slider, and ( (passwordLength - min) * 100 / (max-min)) + "% gives width of colored part.
}

// set indicator of strength of passwords
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// function for getting random integers
function getRndInteger(min, max){
  return Math.floor(Math.random()*(max-min)) + min; //gives random number btw max and min
}

function generateRandomNumber(){
  return getRndInteger(0,9);
}

function generateLowerCase(){
  return String.fromCharCode(getRndInteger(97,123));  // String.fromCharCode changes ascii value to its corrsponding string
}

function generateUpperCase(){
  return String.fromCharCode(getRndInteger(65,91));  // String.fromCharCode changes ascii value to its corrsponding string
}

function generateSymbol(){
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

// func to calculate strength of password generated 
function calcStrength(){
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

// func for copieing to clipboard
async function copyContent(){
  try{
    await navigator.clipboard.writeText(passwordDisplay.value); //used to copy to clipboard
    copyMsg.innerText = "copied";
  }
  catch(e){
    copyMsg.innerText = "failed";
  }
  // to make copy vala span visible
  copyMsg.classList.add("active");
  setTimeout( () => {
    copyMsg.classList.remove("active");  // to make copied vala span unvisible after 2s of copied success.
  },2000);
 
}

function shufflePassword(array){
  // fisher Yates method : --> used to shuffle the array indexes
  for(let i = array.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;

}

function handleCheckBoxChange(){
   checkCount = 0;
   allCheckBox.forEach((checkbox) =>{
    if(checkbox.checked) checkCount++;
   });
   if(passwordLength<checkCount){
      passwordLength=checkCount;
      handleSlider();
   } 
}

// listner for checkbox to update the count of checked check box.
allCheckBox.forEach((checkbox) =>{
  checkbox.addEventListener('change', handleCheckBoxChange);
} )

// listener for slider to update password length number on display.
inputSlider.addEventListener('input', (e) =>{
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener('click', () => { 
  if(passwordDisplay.value)
   copyContent();
});

// generate password
generateBtn.addEventListener('click', () => {
  // none of the box is checked
  if(checkCount == 0)
   return;
  if(passwordLength <checkCount){
    passwordLength = checkCount;
    handleSlider();
  }

  // lets try to find new password: 

    // remove old password
    password = "";
    
    // let's put the stuff mentioned by checkboxes :-->

// noob way : 
    // if(uppercaseCheck.checked) password += generateUpperCase();

    // if(lowercaseCheck.checked) password += generateLowerCase();

    // if(numbersCheck.checked) password += generateRandomNumber();

    // if(symbolsCheck.checked) password += generateSymbol();

// pro way :
let funcArr =[];

if(uppercaseCheck.checked) 
  funcArr.push(generateUpperCase);

if(lowercaseCheck.checked) 
  funcArr.push(generateLowerCase);

if(numbersCheck.checked)
 funcArr.push(generateRandomNumber);

if(symbolsCheck.checked)
 funcArr.push(generateSymbol);

    // compulsary addition (due to checked box) : -->
    for(let i = 0; i<funcArr.length; i++){
      password += funcArr[i]();
    }

    // remaining addition
    for(let i = 0; i<passwordLength-funcArr.length; i++){
      let randIndex = getRndInteger(0,funcArr.length);
      password += funcArr[randIndex]();
    }

    // here we can say that if all boxes are checked then 1st digit will always be uppercase, 2nd is lowercase then number and in last symbol
    // to avoid the above senario we need to shuffle the genrated password.

    // shuffling the password
    password = shufflePassword(Array.from(password)); // giving password in form of array as a parameter to shufflepassword function.

        // show in UI
        passwordDisplay.value = password;
        
        // calculate strength : 
        calcStrength();

});