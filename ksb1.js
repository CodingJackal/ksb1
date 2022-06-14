'set strict'

function clickBtn1() {
  //let inputContent = inputArea.value;
  //let testArray = createDataArray(inputContent);
  alert(fileString.length);
}

function createDataArray(inputContent) {
	const rowArray = inputContent.split("\n");
  const objArray = [];
	
	rowArray.forEach(row => {
		const dataArray = row.split("\t");
		const dataObj = { "kostenstelle": dataArray[0],
											"kostenart": dataArray[1],
											"betrag": dataArray[2],
									  };
		objArray.push(dataObj);
	});
	return objArray;
}

function uploadFile(fileInput) {
	let file = fileInput.files[0];
	let reader = new FileReader();
		
	reader.readAsText(file);
	reader.onload = function (e) {
		fileString = e.target.result;
	};
	
}

let fileString = "";
const button1 = document.getElementById("button1");
const inputArea = document.getElementById("inputArea");
const outputArea = document.getElementById("outputArea");

button1.addEventListener("click", clickBtn1);