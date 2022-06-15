'set strict'

function clickBtn1() {    
  //alert(rawData.length);
}

function processData(rawData) {
	const rowArray = rawData.split("\n");	
	const header = createHeader(rowArray);
	const dataObjects = createData(rowArray, header, emptyFirstRows);
	showData(header);	
}

function showData(header) {
	let stringi = "";
	header.forEach((item) => { 
		stringi += `${item}  `;
	});
	outputArea.value = stringi;
}

function createHeader(rowArray) {
	const tmpData = rowArray[headerRow].split("\t");
	tmpData.splice(0, emptyFirstRows);
	return tmpData;
}

function createData(rowArray, header, emptyFirstRows) {
	let rowData = [];
	for (let i = rmRowsTop; i < rowArray.length - rmRowsBottom; i++) {
		const tmpData = rowArray[i].split("\t");		
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

const button1 = document.getElementById("button1");
const outputArea = document.getElementById("outputArea");

button1.addEventListener("click", clickBtn1);
