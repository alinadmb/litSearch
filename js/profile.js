var user_id = "1";

var info = {};

// запрос GET;

function getInfoRequest() {
    return $.ajax({
        url: "https://f3f59c3lb7.execute-api.us-east-1.amazonaws.com/v1/users",
        type: "GET",
        contentType: "text/plain",
        data: { "user_id": user_id },
        dataType: "json",
        success: function(data) {},
    });
}

function logOutRequest() {
    return $.ajax({
        url: "https://litsearch.auth.us-east-1.amazoncognito.com/logout?client_id=o72ukjio3s1aeuhanffgh0akp&logout_uri=com.litsearch://myclient/logout",
        type: "GET",
        contentType: "text/plain",
        data: { "user_id": user_id },
        dataType: "json",
        success: function(data) {},
    });
}

var filledInfo = false;

function getInfo() {
    getInfoRequest().done(function(result) {
        if (result) {
            console.log(result);
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


function logOut() {

}