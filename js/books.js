const n = 9;
const title_len = 30;
const author_len = 32;
const descr_len = 125;

var counter = 0;
var c = 0;
var results = [];
var k = 0;
var n_page = 1;

// function setCookie(cname, cvalue, exdays) {
//     var d = new Date();
//     d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//     var expires = "expires=" + d.toUTCString();
//     document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
// }

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + "; ";
    // localStorage.setItem(cname, cvalue);
}

function setLocalStorage(cname, cvalue) {
    localStorage.setItem(cname, cvalue);
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    // console.log(ca);
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

// function getCookie(cookie_name) {
//     var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

//     if (results)
//         return (unescape(results[2]));
//     else
//         return null;
// }

function getToken() {
    var token = '';
    var query = String(document.location.href).split('#');
    if (query[1]) {
        var part = query[1].split('&');
        for (i = 0; i < part.length; i++) {
            var data = part[i].split('=');
            if (data[0] == 'access_token' && data[1])
                return data[1];
        }
    }
    return '';
}

var user_id;

function loadPage() {
    token = getToken();
    if (token != '') {
        localStorage.setItem("token", token);
        var decoded = jwt_decode(token);
        user_id = decoded.username;
    } else {
        if (localStorage.getItem("token")) {
            token = localStorage.getItem("token");
            var decoded = jwt_decode(token);
            user_id = decoded.username;
        } else {
            window.location.href = "https://litsearch.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=o72ukjio3s1aeuhanffgh0akp&redirect_uri=https://d14dzdt6afnpms.cloudfront.net/html/books.html";
        }
    }
}

function handleResponse(response) {
    if (!response.items) {
        document.querySelector("#content").innerHTML = "<span id='no_res'>No results</span>";
    } else {
        counter = 0;
        k = response.items.length;
        results = response.items;
        for (var i = 0; i < n; i++) {
            if (response.items[i]) {
                var item = response.items[i];
                var div = document.querySelector('#book_block' + String(i + 1));
                var title = div.querySelector('#book_title');
                var author = div.querySelector('#book_author');
                var descr = div.querySelector('#book_text');
                var it_title = String(item.volumeInfo.title);
                var it_author = String(item.volumeInfo.authors);
                var it_descr = String(item.volumeInfo.description);
                if (it_author == 'undefined') it_author = '';
                if (it_descr == 'undefined') it_descr = '';

                if (it_title.length > title_len) {
                    title.textContent = it_title.slice(0, title_len) + '..';
                } else {
                    title.textContent = it_title.slice(0, title_len);
                }
                if (it_author.length > author_len) {
                    author.textContent = it_author.slice(0, author_len) + '..';
                } else {
                    author.textContent = it_author.slice(0, descr_len);
                }
                if (it_descr.length > descr_len) {
                    descr.textContent = it_descr.slice(0, descr_len) + '..';
                } else {
                    descr.textContent = it_descr.slice(0, descr_len);
                }
                counter += 1;
            } else {
                document.querySelector('#book_block' + String(i + 1)).hidden = true;
                document.querySelector("#next_block").hidden = true;
            }
        }
        document.querySelector("#prev_block").hidden = true;
        document.querySelector("#pages").textContent = String(n_page);
    }
}

function searchBook() {
    var request = document.getElementById("search_input").value.replace(/ /g, '-');
    var src_s = "https://www.googleapis.com/books/v1/volumes?q=" + request + "&callback=handleResponse&maxResults=40";
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = src_s;
    s.innerHTML = null;
    s.id = "link";
    document.getElementById("scripts").innerHTML = "";
    document.getElementById("scripts").appendChild(s);
}

const searchBtn = document.querySelector('#search_button');
searchBtn.addEventListener('click', event => {
    event.preventDefault();
});

function toNextPage() {
    n_page += 1;
    document.querySelector("#pages").textContent = String(n_page);
    document.querySelector("#prev_block").hidden = false;
    c = 0;
    for (var i = counter; i < n + counter; i++) {
        if (results[i]) {
            document.querySelector('#book_block' + String(i - counter + 1)).hidden = false;
            var item = results[i];
            var div = document.querySelector('#book_block' + String(i - counter + 1));
            var title = div.querySelector('#book_title');
            var author = div.querySelector('#book_author');
            var descr = div.querySelector('#book_text');
            var it_title = String(item.volumeInfo.title);
            var it_author = String(item.volumeInfo.authors);
            var it_descr = String(item.volumeInfo.description);
            if (it_author == 'undefined') it_author = '';
            if (it_descr == 'undefined') it_descr = '';

            if (it_title.length > title_len) {
                title.textContent = it_title.slice(0, title_len) + '..';
            } else {
                title.textContent = it_title.slice(0, title_len);
            }
            if (it_author.length > author_len) {
                author.textContent = it_author.slice(0, author_len) + '..';
            } else {
                author.textContent = it_author.slice(0, descr_len);
            }
            if (it_descr.length > descr_len) {
                descr.textContent = it_descr.slice(0, descr_len) + '..';
            } else {
                descr.textContent = it_descr.slice(0, descr_len);
            }
            c += 1;
        } else {
            document.querySelector('#book_block' + String(i - counter + 1)).hidden = true;
            document.querySelector("#next_block").hidden = true;
        }
    }
    counter += c;
}

function toPrevPage() {
    n_page -= 1;
    document.querySelector("#pages").textContent = String(n_page);
    document.querySelector("#next_block").hidden = false;
    var q = 0;
    if (counter == 2 * n) {
        document.querySelector("#prev_block").hidden = true;
    }
    for (var i = counter - c - n; i < counter - c; i++) {
        if (results[i]) {
            document.querySelector('#book_block' + String(9 - (counter - i - c) + 1)).hidden = false;
            var item = results[i];
            var div = document.querySelector('#book_block' + String(9 - (counter - i - c) + 1));
            var title = div.querySelector('#book_title');
            var author = div.querySelector('#book_author');
            var descr = div.querySelector('#book_text');
            var it_title = String(item.volumeInfo.title);
            var it_author = String(item.volumeInfo.authors);
            var it_descr = String(item.volumeInfo.description);
            if (it_author == 'undefined') it_author = '';
            if (it_descr == 'undefined') it_descr = '';

            if (it_title.length > title_len) {
                title.textContent = it_title.slice(0, title_len) + '..';
            } else {
                title.textContent = it_title.slice(0, title_len);
            }
            if (it_author.length > author_len) {
                author.textContent = it_author.slice(0, author_len) + '..';
            } else {
                author.textContent = it_author.slice(0, descr_len);
            }
            if (it_descr.length > descr_len) {
                descr.textContent = it_descr.slice(0, descr_len) + '..';
            } else {
                descr.textContent = it_descr.slice(0, descr_len);
            }
            q += 1;
        }
    }
    counter -= c;
    c = q;
}

function contains(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
        if (elem == arr[i])
            return true;
    }
    return false;
}

function removeItem(arr, value) {
    var idx = arr.indexOf(value);
    if (idx > -1) {
        arr.splice(idx, 1);
    }
    return arr;
}

var favs = [];
var token = getCookie("token");

function postBookRequest(item) {
    return $.ajax({
        url: "https://f3f59c3lb7.execute-api.us-east-1.amazonaws.com/v1/books",
        type: "POST",
        contentType: "text/plain",
        data: JSON.stringify({
            "book_id": String(item.id),
            "book_title": String(item.volumeInfo.title),
            "book_author": String(item.volumeInfo.authors),
            "book_description": String(item.volumeInfo.description),
            "book_date": String(item.volumeInfo.publishedDate),
            "book_rate": String(item.volumeInfo.averageRating),
            "book_link": String(item.volumeInfo.previewLink)
        }),
        dataType: "json",
        success: function(data) {},
    });
}

function getFavsRequest() {
    return $.ajax({
        url: "https://f3f59c3lb7.execute-api.us-east-1.amazonaws.com/v1/users/favorites",
        type: "GET",
        headers: { 'Authorization': token },
        contentType: "text/plain",
        data: { "user_id": String(user_id) },
        dataType: "json",
        success: function(data) {},
    });
}

var filledFavs = 0;

function getFavs() {
    getFavsRequest().done(function(result) {
        if (result) {
            favs = result;
            filledFavs = 1;
        }
    });
};

function postFavRequest(book_id) {
    return $.ajax({
        url: "https://f3f59c3lb7.execute-api.us-east-1.amazonaws.com/v1/users/favorites",
        type: "POST",
        headers: { 'Authorization': token },
        contentType: "text/plain",
        data: JSON.stringify({
            "user_id": String(user_id),
            "book_id": book_id
        }),
        dataType: "json",
        success: function(data) {},
    });
}

function addFavBook(item) {
    var book_id = String(item.id);
    favs.push(String(book_id));

    postFavRequest(book_id);
    postBookRequest(item);
}

function deleteFavRequest(book_id) {
    return $.ajax({
        url: "https://f3f59c3lb7.execute-api.us-east-1.amazonaws.com/v1/users/favorites",
        type: "DELETE",
        headers: { 'Authorization': token },
        contentType: "text/plain",
        data: JSON.stringify({
            "user_id": String(user_id),
            "book_id": book_id
        }),
        dataType: "json",
        success: function(data) {},
    });
}

function deleteFavBook(favs, book_id) {
    removeItem(favs, book_id);

    deleteFavRequest(book_id);
}

var timerId;
var firstTime = true;

function openBookInfo(block_num) {
    if (firstTime) {
        getFavs();
        timerId = setInterval(() => {
            openBookInfoFull(block_num);
        }, 100);
    } else {
        openBookInfoFull(block_num);
    }
}

function openBookInfoFull(block_num) {
    if (filledFavs) {
        if (firstTime) {
            clearInterval(timerId);
            firstTime = false;
            favs = favs.favorites;
        }

        var item = results[block_num + n * (n_page - 1) - 1];
        var it_title = String(item.volumeInfo.title);
        var it_author = String(item.volumeInfo.authors);
        var it_descr = String(item.volumeInfo.description);
        var it_year = String(item.volumeInfo.publishedDate);
        var it_rate = String(item.volumeInfo.averageRating);
        var it_id = String(item.id);
        var it_link = String(item.volumeInfo.previewLink);
        var newWin = window.open("about:blank", "book_info", "width=800,height=600, location=no, left=50%, scrollbars=yes");

        var favBtnValue;
        var f = 0;
        if (contains(favs, it_id)) {
            f = 1;
        } else {
            f = 0;
        }
        if (f == 0) { // добавить в избранное;
            favBtnValue = "Add\nto favorites";
        } else { // удаление из избранного;
            favBtnValue = "In\nfavorites";
        }

        newWin.document.write('<!DOCTYPE HTML>\
    <html>\
    <head>\
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\
        <link href="../css/book_style.css" type="text/css" rel="stylesheet">\
        <link href="https://fonts.googleapis.com/css?family=Tenor+Sans&display=swap" rel="stylesheet">\
        <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">\
        <title>litSearch - Book</title>\
    </head>\
    <body class="w">\
        <div id="bg">\
            <div id="add_to_fav_block">\
                <input type="image" id="heart_button" src="../images/heart.png">\
                <span id="add_to_fav_text">' + favBtnValue + '</span>\
            </div>\
            <a id="link_google" target="_blank" href=' + it_link + '>Open in Google Books</a>\
            <div id="book_block">\
                <span class="book_title" id="book_name">Title: </span>\
                <span class="book_text" id="book_name_text">' + it_title + '</br></span>\
                <span class="book_title" id="book_author">Author: </span>\
                <span class="book_text" id="book_author_text">' + it_author + '</br></span>\
                <span class="book_title" id="book_descr">Description: </span>\
                <span class="book_text" id="book_descr_text">' + it_descr + '</br></span>\
                <span class="book_title" id="book_year">Release year: </span>\
                <span class="book_text" id="book_year_text">' + it_year + '</br></span>\
                <span class="book_title" id="book_rate">Rate: </span>\
                <span class="book_text" id="book_rate_text">' + it_rate + '</br></span>\
            </div>\
        </div>\
        <script src="../js/books.js"></script>\
    </body>\
    </html>')


        var favBtn = newWin.document.querySelector("#add_to_fav_block");
        favBtn.addEventListener('click', event => {
            if (f == 0) { // добавить в избранное;
                addFavBook(item);
                favBtn.querySelector("span").textContent = "In\nfavorites";
                f = 1;
            } else { // удаление из избранного;
                deleteFavBook(favs, it_id);
                favBtn.querySelector("span").textContent = "Add\nto favorites";
                f = 0;
            }
        });

        // var win = newWin.document.querySelector(".w");
        // newWin.parent.addEventListener('click', event => {
        //     newWin.close();
        // });
    }
}