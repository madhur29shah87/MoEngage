function loadCanpaignList() {
    var modal = document.getElementById('myModal');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var mainDiv = document.getElementById("tBody");
            var campaignListData = JSON.parse(this.responseText);
            for (x = 0; x < 9; x++) {

                var checkBox = document.createElement("INPUT");
                checkBox.setAttribute("type", "checkbox");
                var editIcon = document.createElement("i");
                // editIcon.setAttribute('class', 'fa fa-pencil-square-o');
                editIcon.classList.add("icon");
                editIcon.classList.add("fa");
                editIcon.classList.add("fa-pencil-square-o");
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

                campaignTh.setAttribute('scope', 'row');
                campaignTh.appendChild(checkBox);
                campaignTd1.innerHTML = campaignListData[x].company;
                campaignTd2.innerHTML = campaignListData[x].type;
                campaignTd3.innerHTML = "v";
                campaignTd4.classList.add('align-content-center');
                campaignTd4.appendChild(editIcon);
                editIcon.onclick = function () {
                    modal.style.display = "block";
                }
                campaignTd4.appendChild(deleteIcon);
                campaignTr.appendChild(campaignTh);
                campaignTr.appendChild(campaignTd1);
                campaignTr.appendChild(campaignTd2);
                campaignTr.appendChild(campaignTd3);
                campaignTr.appendChild(campaignTd4);
                mainDiv.appendChild(campaignTr);
            }
        }
    };
    xhttp.open("GET", "data.json", true);
    xhttp.send();
    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    var modal = document.getElementById('myModal');
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

