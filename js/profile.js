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
var token = localStorage.getItem("token");
if (token != '') {
    var decoded = jwt_decode(token);
    user_id = decoded.username;
}

var info = {};


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

function logOutRequest() {
    return $.ajax({
        url: "https://litsearch.auth.us-east-1.amazoncognito.com/logout?client_id=o72ukjio3s1aeuhanffgh0akp&logout_uri=com.litsearch://myclient/logout",
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

        var name = document.querySelector(".name_value");
        var email = document.querySelector(".email_value");
        name.textContent = info.name;
        email.textContent = info.email;
    }
}

function deleteCookie(cookie_name) {
    var cookie_date = new Date(); // Текущая дата и время
    cookie_date.setTime(cookie_date.getTime() - 1);
    document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
}

function logOut() {
    localStorage.removeItem("token");
    window.location.href = "https://litsearch.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=o72ukjio3s1aeuhanffgh0akp&redirect_uri=https://d14dzdt6afnpms.cloudfront.net/html/books.html";
}