'set strict'

function clickBtn1() {    
  //alert(rawData.length);
}

function processData(rawData) {
	const rowArray = rawData.split("\n");	
	const header = createHeader(rowArray);
	const dataObjects = createData(rowArray, header, emptyFirstRows);
	createHeadElements(header);	
	//outputArea.value = dataObjects[896];
}

function createHeadElements(header) {
	//const test = document.createElement("input");
	//test.setAttribute("type", "checkbox");
	//document.getElementById("checkBox").appendChild(test);
	header.forEach((head, index) => {
		const input = document.createElement("input");
		const label = document.createElement("label");
		const labelId = "label" + index;
		input.setAttribute("type", "checkbox");
		label.setAttribute("id", labelId);
		label.appendChild(input);
		document.getElementById("checkBox").appendChild(label);
		const content = document.createTextNode(head);
		document.getElementById(labelId).appendChild(content);
		//document.getElementById(labelId).innerText += head;
	});
	
}

function createHeader(rowArray) {
	const tmpData = rowArray[headerRow].split("\t");
	tmpData.splice(emptyFourthRow, 1);
	tmpData.splice(0, emptyFirstRows);
	return tmpData;
}

function createData(rowArray, header, emptyFirstRows) {
	let rowData = [];
	for (let i = rmRowsTop; i < rowArray.length - rmRowsBottom; i++) {
		const tmpData = rowArray[i].split("\t");
		tmpData.splice(emptyFourthRow, 1);
		tmpData.splice(0, emptyFirstRows);		
		rowData.push(tmpData);
	}
	return rowData;
}

function uploadFile(fileInput) {
	let file = fileInput.files[0];
	let reader = new FileReader();
		
	reader.readAsText(file, "windows-1252");
	reader.onload = function (e) {
		const rawData = e.target.result;
		processData(rawData);
	};	
}

// Statische Ankerpunkte zum Parsen der Datei
const rmRowsTop = 7;
const rmRowsBottom = 3;
const headerRow = 5;
const emptyFirstRows = 2;
const emptyFourthRow = 4;

const button1 = document.getElementById("button1");
const outputArea = document.getElementById("outputArea");

button1.addEventListener("click", clickBtn1);
