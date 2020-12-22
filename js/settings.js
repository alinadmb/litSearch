var info = {};

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    console.log(ca);
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

var user_id = '';
var token;
if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
    if (token != '') {
        var decoded = jwt_decode(token);
        user_id = decoded.username;
    }
} else {
    window.location.href = "https://litsearch.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=o72ukjio3s1aeuhanffgh0akp&redirect_uri=https://d14dzdt6afnpms.cloudfront.net/html/books.html";
}

function getInfoRequest() {
    return $.ajax({
        url: "https://f3f59c3lb7.execute-api.us-east-1.amazonaws.com/v1/users",
        type: "GET",
        headers: { 'Authorization': token },
        contentType: "text/plain",
        data: { "user_id": String(user_id) },
        dataType: "json",
        success: function(data) {},
    });
}

var filledInfo = false;

function getInfo() {
    getInfoRequest().done(function(result) {
        if (result) {
            info = result;
            filledInfo = true;
        }
    });
};

var timerId;

function loadPage() {
    getInfo();
    timerId = setInterval(() => {
        loadPageFull();
    }, 100);
}

function loadPageFull() {
    if (filledInfo) {
        clearInterval(timerId);
        var name = document.querySelector("#name_value");
        name.placeholder = info.name;
    }
}

function putInfoRequest(user) {
    return $.ajax({
        url: "https://f3f59c3lb7.execute-api.us-east-1.amazonaws.com/v1/users",
        type: "PUT",
        headers: { 'Authorization': token },
        contentType: "text/plain",
        data: JSON.stringify({
            "user_id": String(user_id),
            "name": String(user.name)
        }),
        dataType: "json",
        success: function(data) {},
    });
}

function saveChanges() {
    var name = info.name;
    var name_val = document.querySelector("#name_value").value;

    var f = 0;

    if (name_val != "") {
        name = name_val;
        f = 1;
    }

    if (f) {
        var user = {
            'name': name
        };
        putInfoRequest(user);
        alert('Do you want to save changes?');
    } else {
        alert("Fields are empty")
    }
}