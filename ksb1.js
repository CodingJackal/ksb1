"set strict";

/*
 * Ohne Funktion.
 */
function clickBtn1() {
  executeRule(ruleSet[0]);
}

function executeRule(ruleName) {
  // Feststellen, wo sich unserer Regel befindet.
  let ruleId = -1;
  ruleSet.forEach((rule, index) => {
    if (rule.name == ruleName) {
      ruleId = index;
    }
  });

  const kostenstelleId = findRowByName("Kostenst");
  const kostenartId = findRowByName("Kostenart");
  let tmpArr = [];

  for (let i = 0; i < dataObjects.length; i++) {
    ruleSet[ruleId].kostenstelle.forEach((kostenstelle) => {
      if (dataObjects[i][kostenstelleId] == kostenstelle) {
        tmpArr.push(dataObjects[i]);
      }
    });
  }
  outputArea.value =
    "Placeholder1: " +
    ruleSet[ruleId].kostenstelle +
    "\nPlaceholder2: " +
    ruleSet[ruleId].kostenart +
    "\nPlaceholder3: " +
    tmpArr.length +
    "\nPlaceholder4: " +
    calculateSum(tmpArr);
}

function processData(rawData) {
  const rowArray = rawData.split("\n");
  header = createHeader(rowArray);
  dataObjects = createData(rowArray, header, emptyFirstRows);
  createLeftButtons();
  //showFileStats(rowArray);
}

/*
 * Berechnet die Summe der Objekte.
 */
function calculateSum(objectArr) {
  const betragIndex = findRowByName(betragKopf);
  let summe = 0;
  for (let i = 0; i < objectArr.length; i++) {
    objectArr[i].forEach((value, index) => {
      if (index == betragIndex) {
        summe += value;
      }
    });
  }
  return summe;
}

function findRowByName(searchStr) {
  let index = -1;
  for (let i = 0; i < header.length; i++) {
    if (header[i].includes(searchStr)) {
      index = i;
      break;
    }
  }
  return index;
}

function showFileStats(oneRow) {
  const creationDate = oneRow[2].split("\t")[0];
  const hardcodedSum = oneRow.at(-2).split("\t")[7];

  outputArea.value =
    "Erstellungsdatum: " +
    creationDate +
    "\nSAP Summe: " +
    hardcodedSum +
    "\nBerechnete Summe: " +
    calculateSum(dataObjects).toLocaleString("de-DE");
}

function createLeftButtons() {
  const leftDivBox = document.getElementById("left");
  ruleSet.forEach((rule) => {
    const input = document.createElement("input");
    const inputId = rule.name;
    input.setAttribute("type", "button");
    input.setAttribute("id", inputId);
    input.setAttribute("value", inputId);
    input.setAttribute("class", "leftButtons");
    leftDivBox.appendChild(input);
  });
  const leftBox = document.getElementById("left");
  leftBox.addEventListener("click", (event) => {
    const isButton = event.target.nodeName === "INPUT";
    if (!isButton) {
      return;
    }
    executeRule(event.target.id);
  });
}

// Eigentlich ueberfluessig.
function createHeadElements(header) {
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
  const betragIndex = findRowByName(betragKopf);
  for (let i = rmRowsTop; i < rowArray.length - rmRowsBottom; i++) {
    const tmpData = rowArray[i].split("\t");
    tmpData.splice(emptyFourthRow, 1);
    tmpData.splice(0, emptyFirstRows);
    tmpData[betragIndex] = parseFloat(
      tmpData[betragIndex].replace(".", "").replace(",", ".")
    );
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
const betragKopf = "Wert";
const rmRowsTop = 7;
const rmRowsBottom = 3;
const headerRow = 5;
const emptyFirstRows = 2;
const emptyFourthRow = 4;

// Bereinigte Datenvariablen
let header = [];
let dataObjects = [];

//const button1 = document.getElementById("button1");
const outputArea = document.getElementById("outputArea");

//button1.addEventListener("click", clickBtn1);
