'set strict'

function clickBtn1() {    
  //alert(rawData.length);
}

function processData(rawData) {
	const rowArray = rawData.split("\n");
	const header = rowArray[5].split("\t");
	const emptyRowIds = findEmptyRows(header);
	const dataObjects = createData(rowArray, header, emptyRowIds);
	outputArea.value = dataObjects[895];	
}

function findEmptyRows(header) {
	const rowIds = [];
	for (let i = 0; i < header.length; i++) {
		if (header[i] == "") {
			rowIds.push(i);
		}
	}
	return rowIds;
}

function createData(rowArray, header, emptyRowIds) {
	let rowData = [];
	for (let i = 7; i < rowArray.length - 3; i++) {
		const tmpData = rowArray[i].split("\t");
		emptyRowIds.reverse().forEach(id => tmpData.splice(id,1));
		//tmpData.splice(0,2);
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

const button1 = document.getElementById("button1");
const outputArea = document.getElementById("outputArea");

button1.addEventListener("click", clickBtn1);
