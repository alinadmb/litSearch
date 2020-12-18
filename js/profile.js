// запрос GET;

var response_ = {
    'name': "Алина",
    'email': "alina@mail.ru"
}

function loadPage() {
    loadInfo(response_);
}

function loadInfo(response) {
    var name = document.querySelector(".name_value");
    var email = document.querySelector(".email_value");
    name.textContent = response.name;
    email.textContent = response.email;
}