var mainDiv;
var campaignListData;
var recordsLength = 0;
var modal;
var currentElement;
var currentCampaignId;


function pageLoadInit() {
    var ul = document.getElementById('ulPage');
    // Adding listner on Pagination click to load data accordingly
    ul.addEventListener('click', function navigate(event) {
        populateCampignTable(parseInt(event.target.innerText) - 1);
    });

    // Modal dom for edit and delete confirmaton 
    modal = document.getElementById('myModal');

    var xhttp = new XMLHttpRequest();
    var pageNumber = 0;
    // pageination container
    var paginationContainer = document.getElementById('ulPage');
    // Ajax listner when response is received from server
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            
            // Get list of campaign from response
            campaignListData = JSON.parse(this.responseText);
            recordsLength = campaignListData.length;
            // to decide number of pages .. below logic take care of last page if items less than 10
            var pagesCount = (recordsLength % 10 == 0) ? parseInt(recordsLength / 10) : parseInt(recordsLength / 10) + 1;
            for (var i = 0; i < pagesCount; i++) {

                // Populate pagination DOM
                var page = document.createElement('li');
                page.classList.add('page-item');
                var pageLink = document.createElement('a');
                pageLink.classList.add('page-link');
                pageLink.innerHTML = i + 1;
                pageLink.setAttribute('href', '#');
                page.appendChild(pageLink);
                paginationContainer.appendChild(page);
            }
            // Defaulting to page 0 i.e 1st page
            populateCampignTable(pageNumber);
        }
    };
    // defining Ajax request
    xhttp.open("GET", "data.json", true);
    //  trigger Ajax request to server in this case locale data.json
    xhttp.send();

    // Added listner for modal close button on top right corner
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    }

    // Added listner to get current element which user interacted for either edit or delete
    document.addEventListener('current-element', function (event) {
        currentElement = event.detail.element;
        currentCampaignId = event.detail.campaignId;
    });

    var modalButton = document.getElementById("modalButton");

    // Edit modal dialog , same dialog is used for delete confirmation conditionally 
    modalButton.onclick = function (event) {
        if (event.currentTarget.innerHTML == 'Delete') {
            currentElement.parentElement.parentElement.remove();
        } else if (event.currentTarget.innerHTML == 'Change') {
            currentElement.parentElement.parentElement.querySelector('#'+currentCampaignId).innerHTML = 
            event.currentTarget.parentElement.querySelector('#editCampaign').value;
            currentElement.parentElement.parentElement.querySelector('#date').innerHTML = new Date();
        }
        modal.style.display = "none";
    }

    
    // When the user clicks anywhere outside of the modal, close modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function populateCampignTable(pageNumber) {
    // Clears dom according to pagination.. no data is appended to older DOM 
    // same DOM is reused
    mainDiv = document.getElementById("tBody");
    while (mainDiv.hasChildNodes()) {
        mainDiv.removeChild(mainDiv.firstChild);
    }
    var x = (pageNumber == 0) ? 0 : (pageNumber * 10);
    var upperLimit = (x + 10 <= recordsLength) ? x + 10 : recordsLength;
    for (x; x < upperLimit; x++) {
        var checkBox = document.createElement("INPUT");
        checkBox.setAttribute("type", "checkbox");
        var editIcon = document.createElement("i");
        editIcon.classList.add("icon");
        editIcon.classList.add("fa");
        editIcon.classList.add("fa-pencil-square-o");
        editIcon.setAttribute("id", campaignListData[x].company);
        checkBox.setAttribute("type", "checkbox");
        var deleteIcon = document.createElement("i");
        // editIcon.setAttribute('class', 'fa fa-pencil-square-o');
        deleteIcon.classList.add("icon");
        deleteIcon.classList.add("fa");
        deleteIcon.classList.add("fa-trash-o");

        var campaignTr = document.createElement('tr');
        var campaignTh = document.createElement('th');
        var campaignTd1 = document.createElement('td');
        var campaignTd2 = document.createElement('td');
        var campaignTd3 = document.createElement('td');
        var campaignTd4 = document.createElement('td');

        // campaignTr.setAttribute('id', campaignListData[x].company);
        // campaignTh.setAttribute('scope', 'row');
        // campaignTh.appendChild(checkBox);
        campaignTd1.innerHTML = campaignListData[x].company;
        campaignTd1.setAttribute('id', campaignListData[x].company);
        campaignTd2.innerHTML = campaignListData[x].type;
        campaignTd3.innerHTML = "-";
        campaignTd3.setAttribute('id','date');
        campaignTd4.classList.add('align-content-center');
        campaignTd4.appendChild(editIcon);
        editIcon.onclick = function (event) {
            modal.style.display = "block";
            modal.querySelector('#modalButton').innerHTML = "Change";
            modal.querySelector('#editCampaign').style.display = "block";
            modal.querySelector('#editCampaign').focus();
            modal.querySelector('.modal-header h2').innerHTML = "Edit Campaign Name";
            this.dispatchEvent(new CustomEvent('current-element', {
                bubbles: true,
                detail: {
                    element: event.currentTarget,
                    campaignId: event.target.id
                }
            }));
        }
        campaignTd4.appendChild(deleteIcon);
        deleteIcon.onclick = function (event) {
            modal.style.display = "block";
            modal.querySelector('#modalButton').innerHTML = "Delete";
            modal.querySelector('#modalButton').focus();
            modal.querySelector('#editCampaign').style.display = "none";
            modal.querySelector('.modal-header h2').innerHTML = "Delete Campaign Name";
            this.dispatchEvent(new CustomEvent('current-element', {
                bubbles: true,
                detail: {
                    element: event.currentTarget
                }
            }));
        }
        // campaignTr.appendChild(campaignTh);
        campaignTr.appendChild(campaignTd1);
        campaignTr.appendChild(campaignTd2);
        campaignTr.appendChild(campaignTd3);
        campaignTr.appendChild(campaignTd4);
        mainDiv.appendChild(campaignTr);
    }
}

var timer = 0;
// delay the search for 400ms while user is typing, increase it to 1000 if our user is immense slow
function delaySearch(event) {
      clearTimeout(timer);
      var searchResult = document.getElementById('searchResult');
      timer = setTimeout(function () {
        var searchText = event.value;
        for(var i = 0; i<recordsLength;i++){
            if(campaignListData[i].company.toLowerCase() == searchText.toLowerCase()){
                searchResult.innerHTML = "Company Found - <i>" + campaignListData[i].company + "</i> Type - <i> " + campaignListData[i].type +"</i>";
                break;
            } else {
                searchResult.innerHTML = 'No search result';
            }
        }
      }, 400);
  }