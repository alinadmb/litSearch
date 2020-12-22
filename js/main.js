// var token = localStorage.getItem("token");

if (localStorage.getItem("token")) {
    document.querySelector("#signin_link").hidden = true;
    document.querySelector("#signup_link").hidden = true;
} else {
    $("#menu").children().prop("style", "pointer-events:none");
    $("#tobooks_link").children().prop("style", "pointer-events:none");
}