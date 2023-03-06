// Fechting all the js used elements 
const inputSlider = document.querySelector("[data-lenghtSlider]");
const lenghtDisplay = document.querySelector("[data-lenghtNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%&*()_-+={}[];:",.<>/?';

//initially we have
let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
//set strength data-indicator color to grey
setIndicator("#ccc");

// set password Lenght slider function - reflect lenght of password on UI
function handleSlider() {
    inputSlider.value = passwordLength;
    lenghtDisplay.innerText = passwordLength;
    //slider color % while moving
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength- min)*100/(max-min)) + "% 100%"
}

//set password strenght indicator colour on UI
function setIndicator(color) {
    indicator.style.backgroundColour = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// get random integer btw min - max value
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// get random num btw 0-9
function generateRandomNumber() {
    return getRndInteger(0, 9);
}

// get random lowercase btm a to z
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

//get random uppercase btw A to Z
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

// get random symbol from symbols string
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// get the password strenght - check whick box are checked and verify the conditions to check strenght.
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator('#0f0');
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator('#ff0');
    }
    else {
        setIndicator('#f00');
    }
}

// copy the password available into password dispaly feild using clipboard.write method.
// this func retun promise
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy span text visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

//shffle the password function
function shufflePassword(array) {
    // Fisher Yates Metho - it is used to shuffle the password recived during genrate btn click
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// checkbox function - if no checkbox is checked you can not generate password .
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });
}

//special condition
if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
}

// it checkes eighter the box is checked or not , if found checks then it goes to handleCheckBoxChange function.
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// add event listner on slider it is changing value while moving.
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// add event lister on copy btn if ther is any password in display feild
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
});









// Genetrate Password Btn
generateBtn.addEventListener('click', () => {

    // if none of th box are checked
    if (checkCount == 0) 
    return;

    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    };

    // creating new password -
    console.log("Starting password creation");

    //remove old password
    password = "";

    //let's put stuff mentioned by checkboxes

    // if (uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if (lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }
    // if (numbersCheck.checked) {
    //     password += generateRandoNumber();
    // }
    // if (symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition in password
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("compulsory addition done");

    //remaining addition in password
    for (i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger (0, funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("remaining addition done");

    //shffle the password because if checkbox is checeked line by line so password is predictable
    password = shufflePassword(Array.from(password));
    console.log("shffuling done");

    // show password in UI
    passwordDisplay.value = password;
    console.log("UI addition done");

    //set strenght after getting password
    calcStrength();

})