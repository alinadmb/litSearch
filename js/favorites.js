const n = 9;
const title_len = 30;
const author_len = 32;
const descr_len = 125;

var counter = 0;
var c = 0;
var results = [];
var k = 0;
var n_page = 1;

var items = [];

function request1(id) {
    $.ajax({
        type: "GET",
        url: "https://www.googleapis.com/books/v1/volumes/" + id + "?projection=lite",
        // success: function(data) {
        //     response.push(data);
        //     // console.log(items);
        // },
        // dataType: "json"
    }).then(function(data) {
        // response.push(data);
        // console.log(response);
        console.log(data);
        return data;
    });
}

// function request(id) {
//     const request = new XMLHttpRequest();
//     const url = "https://www.googleapis.com/books/v1/volumes/" + id + "?projection=lite";
//     request.responseType = "json";
//     request.open("GET", url, true);

//     request.addEventListener("readystatechange", () => {
//         if (request.readyState === 4 && request.status === 200) {
//             console.log(request.responseText);
//         }
//     });
//     return request.responseText;
// }



function request(id) {
    var req = new XMLHttpRequest();
    req.responseType = "json";
    req.open("GET", "https://www.googleapis.com/books/v1/volumes/" + id + "?projection=lite", true);

    req.addEventListener("load", function() {
        console.log("Done:", req.responseText);
        return req.responseText;

    });
    req.send(null);
}

function loadPage() {
    //запрос GET для получения id-s favs;
    //получение по id-s по api json-ов книг;
    var favs = {
        'ids': [
            "jCfyDwAAQBAJ",
            "iAs4Lz5yog0C",
            "mDKphT8_XLsC",
            "aPDWoV34ISoC"
        ]
    };

    var response = [];
    var items = [];

    for (i = 0; i < favs.ids.length; i++) {
        var id = favs.ids[i];

        var req = new XMLHttpRequest();
        req.responseType = "json";
        req.open("GET", "https://www.googleapis.com/books/v1/volumes/" + id + "?projection=lite", true);


        // req.onload = function() {
        //     console.log(req.response);
        //     // if (req.status != 200) {
        //     //     console.log("Ошибка ${req.status}: ${req.statusText}");
        //     // } else {
        //     //     console.log(req.response);
        //     // }
        // };
        // req.send(null);

        // req.onprogress = function(event) {
        //     if (event.lengthComputable) {
        //         console.log("Получено ${event.loaded} из ${event.total} байт");
        //     } else {
        //         console.log("Получено ${event.loaded} байт"); // если в ответе нет заголовка Content-Length
        //     }
        // };

        // req.onerror = function() {
        //     alert("Запрос не удался");
        // };

        // req.addEventListener("load", function() {
        //     console.log("Done:", req.responseText);
        //     response.push(req.responseText);
        //     console.log(response);
        // });


        // var data = request(id);

        // while (!data) {}
        console.log('hi');
        // response.push(data);

        $.ajax({
            type: "GET",
            url: "https://www.googleapis.com/books/v1/volumes/" + id + "?projection=lite",
            // success: function(data) {
            //     response.push(data);
            //     // console.log(items);
            // },
            dataType: "json"
        }).done(function(data) {
            items.push(data);
            console.log(items);
            if (i == favs.ids.length - 1) {
                handleResponse(items);
                console.log('hi from if');
            }
        });
    }

    console.log('hi');
    console.log(response);
    // console.log(response[0]);
    // handleResponse(response);
}

console.log(items);


//эту функцию тоже подправить;
function handleResponse(response) {
    console.log('hi from handle');
    if (!response) {
        document.querySelector("#main_block").innerHTML = "<span id='no_res'>No favorites</span>";
    } else {
        counter = 0;
        k = response.length;
        console.log(response[0]);
        console.log(response.length);
        results = response;
        for (var i = 0; i < n; i++) {
            if (response[i]) {
                var item = response[i];
                console.log(item);
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

function deleteBook(block_num) {
    var item = results[block_num + n * (n_page - 1) - 1];
    var it_id = String(item.id);
    // запрос DELETE;
    // обновить данные на странице;
}

function openBookInfo(block_num) {
    var item = results[block_num + n * (n_page - 1) - 1];
    var it_title = String(item.volumeInfo.title);
    var it_author = String(item.volumeInfo.authors);
    var it_descr = String(item.volumeInfo.description);
    var it_year = String(item.volumeInfo.publishedDate);
    var it_rate = String(item.volumeInfo.averageRating);
    var it_id = String(item.id);
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
        // удаление из избранного и переставить элементы в избранном;
        var json = {
            'id': it_id,
        };
        newWin.close();
        // alert(JSON.stringify(json));
    });
}