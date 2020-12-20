//запрос к бд;
var user_id = "1";
var password_len = 7;

var info = {};

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
        var email = document.querySelector("#email_value");
        var pswd = document.querySelector("#pswd_value");
        name.placeholder = info.name;
        email.placeholder = info.email;
        pswd.placeholder = '*'.repeat(password_len);
    }
}

function putInfoRequest(user) {
    return $.ajax({
        url: "https://f3f59c3lb7.execute-api.us-east-1.amazonaws.com/v1/users",
        type: "PUT",
        contentType: "text/plain",
        data: JSON.stringify({
            "user_id": String(user_id),
            "name": String(user.name),
            "email": String(user.email)
        }),
        dataType: "json",
        success: function(data) {},
    });
}

function saveChanges() {
    var name = info.name;
    var email = info.email;
    // var pswd_len = response_.password_len;
    var name_val = document.querySelector("#name_value").value;
    var email_val = document.querySelector("#email_value").value;
    // var pswd_val = document.querySelector("#pswd_value").value;

    var f = 0;

    if (name_val != "") {
        name = name_val;
        f = 1;
    }
    if (email_val != "") {
        email = email_val;
        f = 1;
    }
    // if (pswd_val != "") {
    //     pswd_len = pswd_val.length;
    //     f = 1;
    // }

    //ОБНОВЛЕНИЕ ПАРОЛЯ

    //запрос к бд с обновлением данных о юзере;
    if (f) {
        var user = {
            'name': name,
            'email': email
                // 'password_len': pswd_len
        };
        putInfoRequest(user);
        alert('Do you want to save changes?');
    } else {
        alert("Fields are empty")
    }
}