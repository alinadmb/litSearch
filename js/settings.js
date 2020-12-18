//запрос к бд;

var response_ = {
    'name': "Alina",
    'email': "alina@mail.ru",
    'password_len': "8"
};

function loadPage() {
    loadInfoInput(response_);
}

function loadInfoInput(response) {
    var name = document.querySelector("#name_value");
    var email = document.querySelector("#email_value");
    var pswd = document.querySelector("#pswd_value");
    name.placeholder = response.name;
    email.placeholder = response.email;
    pswd.placeholder = '*'.repeat(response.password_len);
}

function saveChanges() {
    var name = document.querySelector("#name_value").value;
    var email = document.querySelector("#email_value").value;
    var pswd = document.querySelector("#pswd_value").value;

    if (name != "") {
        //запрос к бд с обновлением имени;
        var json = {
            'name': name
        };
        alert(JSON.stringify(json));
    }

    if (email != "") {
        //запрос к бд с обновлением почты;
        var json = {
            'email': email
        };
        alert(JSON.stringify(json));
    }

    if (pswd != "") {
        //запрос к бд с обновлением пароля;
        var json = {
            'password_len': pswd.length
        };
        alert(JSON.stringify(json));
    }

}