function getPages(){
    return document.getElementById("selectPages").value;  
}

function getLanguages(){
    var langArray = new Array ();
    var boxNumbers = document.getElementsByName("language");
    for(var i = 0; i < boxNumbers.length; i++){
        if(boxNumbers[i].type =='checkbox' && boxNumbers[i].checked == true){
            langArray.push(boxNumbers[i].value);
        }
    }
    return langArray;
}

function displayPages(){
    document.getElementById("showGists").innerHTML = "";
    addFavorites();
    for(var i = 1; i <= getPages(); i++){
        searchGist(i);
    }
}

function searchGist(pages){
    var httpRequest = new XMLHttpRequest();
    var displayArray = new Array ();
    var requestUrl = "https://api.github.com/gists?page=" + pages;

    httpRequest.open('GET', requestUrl);
    httpRequest.send();
    httpRequest.onreadystatechange = function readyOutput(){
    if(httpRequest.readyState === 4){
        if(httpRequest.status === 200){
            var reqReturn = JSON.parse(httpRequest.responseText);
        for(var i = 0; i < reqReturn.length; i++){
            for(var parent in reqReturn[i].files){
                var fileObj = reqReturn[i].files[parent];
                for(var child in fileObj){
                if(child == "language"){
                    if(getLanguages().length > 0){
                        if(getLanguages().indexOf(fileObj[child]) >= 0){
                            displayArray.push({description: reqReturn[i].description, language: fileObj[child], id: reqReturn[i].id, webAddress: reqReturn[i].html_url});
                        }
                        }
                        else{
                            displayArray.push({description: reqReturn[i].description, language: fileObj[child], id: reqReturn[i].id, webAddress: reqReturn[i].html_url});
                        }
                    }
                }
            }
        }
    formatResults(displayArray);
    }
}
};
}

var favesList = new Array ();
function formatResults(displayArray){
    for(var i = 0; i < displayArray.length; i++){
        var inFave = false;
        if(favesList != null){
            for(var j = 0; j < favesList.length; j++)
            {
                if (favesList[j].id == displayArray[i].id){
                    inFave = true;
                }
            }
        }
        if(inFave == false){
            var results = document.createElement("table");
            var dRow = document.createElement("tr");
            var dData = document.createElement("td");
            var dText = document.createElement("a");
            if(displayArray[i].description != null && displayArray[i].description != ""){
                dText.href = displayArray[i].webAddress;
                dText.innerHTML = displayArray[i].description;
            }
            else{
                dText.href = displayArray[i].webAddress;
                dText.innerHTML = "N/A";
            }
            dData.appendChild(dText);
            dRow.appendChild(dData);
            results.appendChild(dRow);
            var lRow = document.createElement("tr");
            var lData = document.createElement("td");
            var lText = document.createTextNode("Language: " + displayArray[i].language);
            lData.appendChild(lText);
            lRow.appendChild(lData);
            results.appendChild(lRow);
            var fRow = document.createElement("tr");
            var fData = document.createElement("td");
            fData.innerHTML = "<input type='button' name='" + displayArray[i].id + "' value='Add to Favorites' onclick='addFave(this.name)'>";
            fRow.appendChild(fData);
            results.appendChild(fRow);
            document.getElementById("showGists").appendChild(results);
            
            newDisplay.push({description: displayArray[i].description, language: displayArray[i].language, id: displayArray[i].id, webAddress: displayArray[i].webAddress});
        }
    }
}

var newDisplay = new Array ();
function addFave(buttonID){
    for(var i = 0; i < newDisplay.length; i++){
        if(buttonID == newDisplay[i].id){
            favesList.push({description: newDisplay[i].description, language: newDisplay[i].language, id: newDisplay[i].id, webAddress: newDisplay[i].webAddress});
        }
    }
    localStorage.setItem("favorites", JSON.stringify(favesList));
    displayPages();
}

function removeFave(buttonID){
    var tempStorage = new Array ();
    for(var i = 0; i < favesList.length; i++){
        if(buttonID != favesList[i].id){
            tempStorage.push(favesList[i]);
        }
    }
    localStorage.setItem("favorites", JSON.stringify(tempStorage));
    tempStorage = localStorage.getItem("favorites");
    favesList = JSON.parse(tempStorage);
    addFavorites();
}

function addFavorites(){
    if(localStorage.getItem("favorites") != null){
        favesList = JSON.parse(localStorage.getItem("favorites"));
    }
    document.getElementById("favorites").innerHTML = "";
    if(favesList != null){
        for(var i = 0; i < favesList.length; i++){
            var results = document.createElement("table");
            var dRow = document.createElement("tr");
            var dData = document.createElement("td");
            var dText = document.createElement("a");
            if(favesList[i].description != null && favesList[i].description != ""){
                dText.href = favesList[i].webAddress;
                dText.innerHTML = favesList[i].description;
            }
            else{
                dText.href = favesList[i].webAddress;
                dText.innerHTML = "N/A";
            }
            dData.appendChild(dText);
            dRow.appendChild(dData);
            results.appendChild(dRow);
            var lRow = document.createElement("tr");
            var lData = document.createElement("td");
            var lText = document.createTextNode("Language: " + favesList[i].language);
            lData.appendChild(lText);
            lRow.appendChild(lData);
            results.appendChild(lRow);
            var fRow = document.createElement("tr");
            var fData = document.createElement("td");
            fData.innerHTML = "<input type='button' name='" + favesList[i].id + "' value='Remove from Favorites' onclick='removeFave(this.name)'>";
            fRow.appendChild(fData);
            results.appendChild(fRow);
            document.getElementById("favorites").appendChild(results);
        }
    }
}

window.onload = function(){
    addFavorites();
}
