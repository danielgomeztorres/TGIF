var diferente = window.location.pathname;
console.log(diferente);

if (diferente == "/senate-data.html") {
	diferente = "senate";
}
if (diferente == "/congress-data.html") {
	diferente = "house";
}


var url = "https://api.propublica.org/congress/v1/113/" + diferente + "/members.json";
var allMembers; //data.results[0].members;// call all members in the object
var checkbox = document.getElementsByTagName("input"); //checkbox add trhee 3 inputs

fetch(url, {

	headers: {
		"X-API-Key": "QjAnrhMfW4qsQRXckkyVrwr44BwkoPvJqErI7Zzz"
	}
}).then(function (data) {
	return data.json();
}).then(function (myData) { //here calls the functions by order of execution
	console.log(myData);
	allMembers = myData.results[0].members;
	generateTable(allMembers);
	stateGenerate(compareArray(fillArray(allMembers)));
	checkboxs();
	document.getElementById("state").addEventListener("change", filter);
})
//FTN genera la tabla//generate the table
function generateTable(TheMembers) {

	var table = document.getElementById("congress113-data");

	for (var i = 0; i < TheMembers.length; i++) {

		var tr = document.createElement("tr"); //creamos las tr /td / de la tabla
		tr.setAttribute("class", TheMembers[i].party); //ponemos clases añadiendo el atributo a las tr

		var td = document.createElement("td"); //

		var a = document.createElement("a");
		a.setAttribute("href", TheMembers[i].url); //añadimos el href para los links de cada senador

		if (TheMembers[i].middle_name == null) {
			a.innerHTML = TheMembers[i].first_name + " " + TheMembers[i].last_name;
		} else {
			a.innerHTML = TheMembers[i].first_name + " " + TheMembers[i].middle_name + " " + TheMembers[i].last_name;
		} //al ser null el segundo nombre en algunos casos creamos un if y a los null le quitamos el middlename y si no da true(sin null)lo imprime 

		td.appendChild(a);
		tr.appendChild(td);

		var tdParty = document.createElement("td"); //creamos los td y los asociamos  hijo/padre
		tdParty.innerHTML = TheMembers[i].party; //añadimos a las columnas creadas los datos 
		tr.appendChild(tdParty);

		var tdState = document.createElement("td"); //loop para encontrar cada parametro y posicionarle en una tabla
		tdState.innerHTML = TheMembers[i].state;
		tr.appendChild(tdState);

		var tsSeniority = document.createElement("td");
		tsSeniority.innerHTML = TheMembers[i].seniority;
		tr.appendChild(tsSeniority);

		var Votes = document.createElement("td");
		Votes.innerHTML = TheMembers[i].votes_with_party_pct + "%";
		tr.appendChild(Votes);

		table.appendChild(tr);
	}
}
//FTN so that the checkboxes react  //para que reaccione los checkbox
function checkboxs() {


	for (var i = 0; i < checkbox.length; i++) { //añadimos un evento  click para los inputs del checkbox 
		checkbox[i].addEventListener("click", filter);
	}
}
//FTN filter the checkboxes y dropdown //
function filter() {
	var partyCheckbox = []; //variable vacia para la checkbox
	var finalTable = []; //variable vacia que generara la tabla con los checkbox y dropdown
	var selecState = document.getElementById("state").value;

	for (var i = 0; i < checkbox.length; i++) { // si todos los input estan checked mete el valor  en una nueva array
		if (checkbox[i].checked) {
			partyCheckbox.push(checkbox[i].value);
		}
	}
	if (partyCheckbox.length == 0 && selecState == "All") { // si no estan checked los checkbok y el dropdown esta en all muestra todos
		finalTable = allMembers;
	}

	if (partyCheckbox.length == 0 && selecState !== "All") { // si ningun checbox esta cheked y tenemos un estado seleccionado mostratra los miembros de ese estado, si volvemos a la opcion all los mostara todos
		for (var k = 0; k < allMembers.length; k++) {

			var stateFilter = allMembers[k].state == selecState || selecState == "All";

			if (stateFilter) {
				finalTable.push(allMembers[k]);

			}
		}
	} else {
		for (var k = 0; k < allMembers.length; k++) {
			for (var i = 0; i < partyCheckbox.length; i++) {
				//dos variables fuera del if para no hacer el if tan largo
				var partyFilter = partyCheckbox[i] == allMembers[k].party; //muestra los miembros del party seleccionado en el checkbox 
				var stateFilter = allMembers[k].state == selecState || selecState == "All"; //muestra el stado seleccionado o todos los estados
				if (partyFilter && stateFilter) { //nos mete en la tabla los dos filtros si son true,si coinciden
					finalTable.push(allMembers[k]);
				}
			}
		}
	}

	document.getElementById("congress113-data").innerHTML = ""; //generamos una tabla vacia
	generateTable(finalTable);
}
//FTN order the states 
function fillArray(arrayState) {
	var states = []; //order the states to later make a loop and separate the repeated ones
	for (var i = 0; i < arrayState.length; i++) {
		states.push(arrayState[i].state) //
	}
	states.sort();
	return states;
}
//FTN compares the states, if it is different it puts it inside, if it is the same it jumps it
function compareArray(stateRepeat) { ////in this parameter I have the ordered states
	var statesResult = [stateRepeat[0]];
	for (var j = 1; j < stateRepeat.length; j++) {
		if (stateRepeat[j] != statesResult[statesResult.length - 1]) { //now the previous one if it is the same it jumps if it is different it puts it in the array statesresult
			statesResult.push(stateRepeat[j]);
		}
	}
	return statesResult;
}
//FTN generate the dropdown
function stateGenerate(addStates) {
	//put in dropdown all states
	var select = document.getElementById("state"); //get id of the html
	for (var i = 0; i < addStates.length; i++) {
		var option = document.createElement("option");
		option.innerHTML = addStates[i]; //loop to find state members
		option.setAttribute("class", addStates[i].state); //put class in the state
		select.appendChild(option); //associate the son with the father
	} //Now all the states are in the dropdown
}

function readMoreLess() {
	var dots = document.getElementById("dots");
	var moreText = document.getElementById("readMore");
	var btnText = document.getElementById("myBtn");

	if (dots.style.display === "none") {
		dots.style.display = "inline";
		btnText.innerHTML = "Read more";
		moreText.style.display = "none";
	} else {
		dots.style.display = "none";
		btnText.innerHTML = "Read less";
		moreText.style.display = "inline";
	}
}