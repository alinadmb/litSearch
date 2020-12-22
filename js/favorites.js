const n = 9;
const title_len = 30;
const author_len = 32;
const descr_len = 125;

var counter = 0;
var c = 0;
var results = [];
var k = 0;
var n_page = 1;

var favs = [];
var filledFavs = 0;

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

function getFavs() {
    getFavsRequest().done(function(result) {
        if (result) {
            filledFavs = 1;
            favs = result;
        }
    }).fail(function() {
        alert('Error');
        return -1;
    });
}

function getBookRequest(book_id) {
    return $.ajax({
        url: "https://f3f59c3lb7.execute-api.us-east-1.amazonaws.com/v1/books",
        type: "GET",
        contentType: "text/plain",
        data: { "book_id": book_id },
        dataType: "json",
        success: function(data) {},
    });
}

var timerId;
var firstTime = true;

function loadPage(block_num) {


    getFavs();
    timerId = setInterval(() => {
        loadPageFull();
    }, 100);
}

function getBooks(books) {
    for (i = 0; i < favs.length; i++) {
        var book_id = favs[i];
        getBookRequest(book_id).done(function(result) {
            if (result) {
                books.push(result);
            }
        });
    }
}

var books = [];

function loadPageFull() {
    if (filledFavs) {
        clearInterval(timerId);
        favs = favs.favorites;

        getBooks(books);
        timerId = setInterval(() => {
            handleResponse(books)
        }, 10);
    }
}

function handleResponse(response) {
    if (!response) {
        document.querySelector("#main_block").innerHTML = "<span id='no_res'>No favorites</span>";
    } else if (response.length == favs.length) {
        clearInterval(timerId);
        counter = 0;
        k = response.length;
        results = response;
        for (var i = 0; i < n; i++) {
            if (response[i]) {
                var item = response[i];
                var div = document.querySelector('#book_block' + String(i + 1));
                var title = div.querySelector('#book_title');
                var author = div.querySelector('#book_author');
                var descr = div.querySelector('#book_text');
                var it_title = String(item.book_title);
                var it_author = String(item.book_author);
                var it_descr = String(item.book_description);
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

function removeItem(arr, value) {
    var idx = arr.indexOf(value);
    if (idx > -1) {
        arr.splice(idx, 1);
    }
    return arr;
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

function deleteFavBook(item) {
    var book_id = item.book_id;
    removeItem(favs, book_id);
    removeItem(books, item);

    deleteFavRequest(book_id);
    handleResponse(books);
}

function deleteFavBookAtPage(block_num) {
    var item = books[block_num + n * (n_page - 1) - 1];
    var book_id = item.book_id;
    removeItem(favs, book_id);
    removeItem(books, item);

    deleteFavRequest(book_id);
    handleResponse(books);
}

function openBookInfo(block_num) {
    var item = books[block_num + n * (n_page - 1) - 1];
    var it_title = String(item.book_title);
    var it_author = String(item.book_author);
    var it_descr = String(item.book_description);
    var it_year = String(item.book_date);
    var it_rate = String(item.book_date);
    var it_id = String(item.book_id);
    var it_link = String(item.book_link);
    var newWin = window.open("about:blank", "book_info", "width=800,height=600, location=no, left=50%, scrollbars=yes");

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
                <span id="add_to_fav_text">In</br>favorites</span>\
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
        deleteFavBook(item);
        newWin.close();
    });
}