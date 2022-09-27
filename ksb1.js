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
  const tmpArr = filterRule(ruleId);
  // Zusammenfassung anzeigen
  outputArea.value =
    "Placeholder1: " +
    ruleSet[ruleId].kostenstelle +
    "\nPlaceholder2: " +
    ruleSet[ruleId].kostenart +
    "\nDatensaetze: " +
    tmpArr.length +
    "\nSumme: " +
    calculateSum(tmpArr) +
    `\n`;
  // Datensaetze anzeigen
  tmpArr.forEach((obj) => {
    outputArea.value += `\n${obj[kostenstelleIndex]}\t${obj[kostenartIndex]}\t${obj[betragIndex]}`;
  });
}

function filterRule(ruleId) {
  let kstWildcards = [];
  let filterKst = [];
  let karWildcards = [];
  let filterKar = [];
  let tmpArr = [];
  // Sammle alle (Wildcard)Kostenstellen
  ruleSet[ruleId].kostenstelle.forEach((kostenstelle) => {
    if (kostenstelle.includes("*")) {
      kstWildcards.push(kostenstelle.substring(0, kostenstelle.indexOf("*")));
    } else {
      filterKst.push(kostenstelle);
    }
  });
  // Sammle alle (Wildcard)Kostenarten
  ruleSet[ruleId].kostenart.forEach((kostenart) => {
    if (kostenart.includes("*")) {
      karWildcards.push(kostenart.substring(0, kostenart.indexOf("*")));
    } else {
      filterKar.push(kostenart);
    }
  });
  // Filter!
  dataObjects.forEach((object) => {
    if (
      filterKst.includes(object[kostenstelleIndex]) ||
      wildcardMatch(object[kostenstelleIndex], kstWildcards)
    ) {
      if (
        filterKar.includes(object[kostenartIndex]) ||
        wildcardMatch(object[kostenartIndex], karWildcards)
      ) {
        tmpArr.push(object);
      }
    }
  });

  // Teste String auf WildcardArray - Function in Function
  function wildcardMatch(str, searchAry) {
    for (let i = 0; i < searchAry.length; i++) {
      if (str.startsWith(searchAry[i])) {
        return true;
      }
    }
  }
  return tmpArr;
}

function processData(rawData) {
  const rowArray = rawData.split("\n");
  header = createHeader(rowArray);
  dataObjects = createData(rowArray, header, emptyFirstRows);
  betragIndex = findRowByName(betragKopf);
  kostenstelleIndex = findRowByName("Kostenst");
  kostenartIndex = findRowByName("Kostenart");
  showFileStats(rowArray);
  createLeftButtons();
}

/*
 * Berechnet die Summe der Objekte.
 */
function calculateSum(objectArr) {
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

function showFileStats(rowArray) {
  const creationDate = rowArray[2].split("\t")[0];
  const hardcodedSum = rowArray.at(-2).split("\t")[7];
  const sumToNum = parseFloat(
    hardcodedSum.replaceAll(".", "").replace(",", ".")
  );
  const calcSum = calculateSum(dataObjects);
  const difference = calcSum - sumToNum;

  fileStatsArea.innerText = "Erstellungsdatum: " + creationDate + "\n";
  fileStatsArea.innerText += "Periode: PLATZHALTER\n";
  fileStatsArea.innerText += "SAP Summe: " + hardcodedSum + "\n";
  fileStatsArea.innerText +=
    "Berechnete Summe: " + calcSum.toLocaleString("de-DE") + "\n";
  fileStatsArea.innerText += "Differenz: " + difference.toLocaleString("de-DE");
}

function createLeftButtons() {
  const leftDivBox = document.getElementById("left");
  leftDivBox.replaceChildren();
  outputArea.value = "";
  ruleSet.forEach((rule) => {
    const input = document.createElement("input");
    const inputId = rule.name;
    input.setAttribute("type", "button");
    input.setAttribute("id", inputId);
    input.setAttribute("value", inputId);
    input.setAttribute("class", "leftButtons");
    leftDivBox.appendChild(input);
  });
  // Ist die Zeile nicht redundant?
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
    // String nach Number
    tmpData[betragIndex] = parseFloat(
      tmpData[betragIndex].replaceAll(".", "").replace(",", ".")
    );
    rowData.push(tmpData);
  }
  return rowData;
}

// Einlesen der Datei
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

// Bereinigte Datenvariablen und ermittelte Ankerpunkte
let header = [];
let dataObjects = [];
let betragIndex = -1;
let kostenstelleIndex = -1;
let kostenartIndex = -1;

//const button1 = document.getElementById("button1");
const outputArea = document.getElementById("bottom");
const fileStatsArea = document.getElementById("top");

//button1.addEventListener("click", clickBtn1);
