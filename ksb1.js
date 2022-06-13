'set strict'

function clickBtn1() {
  let inputContent = inputArea.value;
  let testArray = createDataArray(inputContent);
  alert(testArray);
}

function createDataArray(inputContent) {
  return inputContent.split(";");
}


const button1 = document.getElementById("button1");
const inputArea = document.getElementById("inputArea");
const outputArea = document.getElementById("outputArea");

button1.addEventListener("click", clickBtn1);