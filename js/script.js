var typedWord = ""; //a variable that holds the word being typed on current .game-row

var gameOver = false;
var tries = 0;
//define a variable that holds page height without header element
var pageHeight = $(window).height() - $('header').height();
$('#game').css('height', pageHeight);

$('#help-button').click(function() {
    //show help text
    $('#help-text').show();
    //hide help text after 6 seconds
    setTimeout(function() {
        $('#help-text').hide();
    }, 3000);
});
$('#settings-button').click(function() {
    location.reload();
});

//set #game-keyboard height to 22.5% of pageHeight variable
$('#game-keyboard').css('height', pageHeight * 0.225);
//set #board-container height to 77.5% of pageHeight variable
$('#board-container').css('height', pageHeight * 0.775);

//#board-container and #game-keyboard max-width is 500px
$('#board-container').css('max-width', '500px');
$('#game-keyboard').css('max-width', '500px');

/*
set each .game-row's height to #board's height divided by the number of rows
*/
$('.game-row').css('height', ($('#board').height() - 6) / 6);

/*Set each .game-tile's font size to fill it's container */
$('.game-tile').css('font-size', ($('.game-row').height()) / 1.6);


//Left SideBar Menu
function openNav(){
    document.getElementById("sidebarNav").style.visibility = "visible";
    
}

function closeNav(){
    document.getElementById("sidebarNav").style.visibility = "hidden"; 
    document.getElementById("infopopup").style.visibility = "hidden";
    document.getElementById("howtopopup").style.visibility = "hidden";
    document.getElementById("teampopup").style.visibility = "hidden"; 

}

function openinfopopup(){
    document.getElementById("infopopup").style.visibility = "visible";
    document.getElementById("sidebarNav").style.visibility = "hidden";
    document.getElementById("howtopopup").style.visibility = "hidden";
    document.getElementById("teampopup").style.visibility = "hidden";

}
function closeinfopopup(){
    document.getElementById("infopopup").style.visibility = "hidden";
    
}

function openhowtopopup(){
    document.getElementById("howtopopup").style.visibility = "visible";
    document.getElementById("sidebarNav").style.visibility = "hidden";
    document.getElementById("infopopup").style.visibility = "hidden";
    document.getElementById("teampopup").style.visibility = "hidden"; 
    
}
function closehowtopopup(){
    document.getElementById("howtopopup").style.visibility = "hidden";    
}

function openteampopup(){
    document.getElementById("teampopup").style.visibility = "visible";
    document.getElementById("sidebarNav").style.visibility = "hidden";
    document.getElementById("infopopup").style.visibility = "hidden";
    document.getElementById("howtopopup").style.visibility = "hidden";    
    
}
function closeteampopup(){
    document.getElementById("teampopup").style.visibility = "hidden";    
}

function openmeanpopup(){
    document.getElementById("meanpopup").style.visibility = "visible";
}
function closemeanpopup(){
    document.getElementById("meanpopup").style.visibility = "hidden";  

}


//function to get the word list from js/words.json jquery and return it
function getWordList() {
    var wordlist = $.ajax({
        url: 'js/words.json',
        dataType: 'json',
        async: false
    }).responseText;
    wordlist = JSON.parse(wordlist);
    return wordlist;
}

// Türkçe'ye özel harf dönüşümü fonksiyonları


var wordList = getWordList();

//function to get a random word from /js/words.json using jquery and set it to var word
function getRandomWord() {
    var word = window.wordList;
    //make word lowercase
    word = word[Math.floor(Math.random() * word.length)].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
    return word;
}

wordOfTheSession = getRandomWord();
displayWordMeaning(); 

//function to get meaning of the word
function displayWordMeaning() {
    const word = window.wordOfTheSession; // Oyun sırasında seçilen kelime
    fetch('js/meanings.json') // meanings.json dosyasını yükle
        .then(response => {
            if (!response.ok) {
                throw new Error("meanings.json dosyasına erişilemiyor!");
            }
            return response.json(); // JSON verisini ayrıştır
        })
        .then(data => {
            const meaning = data[word.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase()] || "Bu kelimenin anlamı bulunamadı."; // Kelimenin anlamını al
            const meaningElement = document.querySelector('.meaning'); // HTML'deki meaning sınıfını seç
            if (meaningElement) {
                meaningElement.innerHTML = `<h3><strong>"${word.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase()}"</strong>: ${meaning}</h3>`; // Anlamı yazdır
            } else {
                console.error("Meaning sınıfı bulunamadı!");
            }
        })
        .catch(error => {
            console.error("Anlam yükleme sırasında hata:", error);
        });
}


//if any .keyboard-key is clicked, type it's value to the first available .game-tile
$('.keyboard-key:not(#enter-button, #backspace-button)').click(function() {
    if (window.typedWord.length < 5 && gameOver === false) {
        var key = $(this).text();
        window.typedWord += key;
        console.log('typedWord: ' + typedWord);
        key = key.replace(/ı/g, 'I');
        key = key.replace(/i/g, 'İ');
        key = key.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
        var firstEmpty = $('.game-tile').filter(function() {
            return ($(this).text() === '');
        }).first();
        firstEmpty.text(key);
    }
});

//if any physical keyboard key is pressed, type it's value to the first available .game-tile
$(document).keypress(function(e) {
    //check if key pressed is a letter, also include turkish letters (ı,İ,ğ,Ğ,ç,Ç,ş,Ş,ö,Ö,ü,Ü)
    //turkish letters' unicode avlues are 305, 231, 351, 246, 252, 287, 304, 199, 350, 214, 220, 286
    if (window.typedWord.length < 5 && gameOver === false) {
        if (e.which >= 65 && e.which <= 90 || e.which >= 97 && e.which <= 122 || e.which == 305 || e.which == 231 || e.which == 351 || e.which == 246 || e.which == 252 || e.which == 287 || e.which == 304 || e.which == 199 || e.which == 350 || e.which == 214 || e.which == 220 || e.which == 286) {
            //convert i to İ, ı to I using regex
            var key = String.fromCharCode(e.which);
            window.typedWord += key;
            console.log('typedWord: ' + typedWord);
            key = key.replace(/ı/g, 'I');
            key = key.replace(/i/g, 'İ');
            key = key.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
            var firstEmpty = $('.game-tile').filter(function() {
                return ($(this).text() === '');
            }).first();
            firstEmpty.text(key);
        }
    }
});

//if backspace is pressed, remove the last character from the tile before the first available .game-tile
$(document).keyup(function(e) {
    if (e.which == 8) {
        var lastLetterTyped = $('.game-tile').filter(function() {
            return ($(this).text() !== '');
        }).last();
        //remove last character from typedWord variable
        if (window.typedWord.length > 0 && gameOver === false) {
            lastLetterTyped.text('');
            window.typedWord = window.typedWord.slice(0, -1);
            console.log('typedWord: ' + typedWord);
        }
    }
});

$('#backspace-button').click(function() {
    var lastLetterTyped = $('.game-tile').filter(function() {
        return ($(this).text() !== '');
    }).last();
    //remove last character from typedWord variable
    if (window.typedWord.length > 0 && gameOver === false) {
        lastLetterTyped.text('');
        window.typedWord = window.typedWord.slice(0, -1);
        console.log('typedWord: ' + typedWord);
    }
});

var dictionary = {};
const bool = [null,null,null,null,null];


function enter() {
    if (window.gameOver === false) {
        for (var i = 0; i < window.wordOfTheSession.length; i++) {
            var letter = window.wordOfTheSession[i];
            window.dictionary[letter] = 0;
        }
        for (var i = 0; i < window.wordOfTheSession.length; i++) {
            var letter = window.wordOfTheSession[i];
            window.dictionary[letter]++;
        }
        console.log(window.dictionary);
        if (window.typedWord.length === 5) {
            //check if typedWord is in wordList
            if (window.wordList.includes(window.typedWord)) {
                for (var i = 0; i < 5; i++) {
                    if (window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase() == window.wordOfTheSession[i]) {
                        $('.game-tile').eq(i + (tries * 5)).css('background-color', 'green');
                        bool[i] = window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
                        $('.keyboard-key').filter(function() {
                            return ($(this).text() === window.typedWord[i].replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase());
                        }).css('background-color', 'green');
                        window.dictionary[window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase()]--;

                        if(window.dictionary[window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase()] <0){
                            let ii = window.dictionary[window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase()]*-1
                            for(var a = 0; a < i; a++){
                                var text = $('.game-tile').eq(a + (tries * 5)).first();
                                if($('.game-tile').eq(a + (tries * 5)).css('background-color') === 'rgb(181, 159, 59)' && text.text() === window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase() && ii > 0){
                                    $('.game-tile').eq(a + (tries * 5)).css('background-color', '#3a3a3c');
                                    ii--;
                                    window.dictionary[window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase()]++;
                                }
                            }
                        }
                    }
                    //check if window.typedWord[i] is in wordOfTheSession
                    else if (window.wordOfTheSession.includes(window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase()) && window.dictionary[window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase()] > 0) {
                        $('.game-tile').eq(i + (tries * 5)).css('background-color', '#b59f3b');
                        //if the letter's keyboard key is not green, make it yellow
                        if ($('.keyboard-key').filter(function() {
                                return ($(this).text() === window.typedWord[i].replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase());
                            }).css('background-color') !== 'green') {
                            $('.keyboard-key').filter(function() {
                                return ($(this).text() === window.typedWord[i].replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase());
                            }).css('background-color', '#b59f3b');
                            window.dictionary[window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase()]--;
                            //Last Control
                            if(bool.includes(window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase())){
                                $('.keyboard-key').filter(function() {
                                    return ($(this).text() === window.typedWord[i].replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase());
                                }).css('background-color', 'green');
                            }else if(window.wordOfTheSession.includes(window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase())){
                                $('.keyboard-key').filter(function() {
                                    return ($(this).text() === window.typedWord[i].replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase());
                                }).css('background-color', '#b59f3b');
                            }
                        }
                    } else {
                        $('.game-tile').eq(i + (tries * 5)).css('background-color', '#3a3a3c');
                        //if the letter's keyboard key is not green or yellow, make it red
                        if ($('.keyboard-key').filter(function() {
                            return ($(this).text() === window.typedWord[i].replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase());
                        }).css('background-color') !== 'green' && $('.keyboard-key').filter(function() {
                            return ($(this).text() === window.typedWord[i].replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase());
                        }).css('background-color') !== '#b59f3b') {
                            $('.keyboard-key').filter(function() {
                                return ($(this).text() === window.typedWord[i].replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase());
                            }).css('background-color', '#3a3a3c');
                            //Last Control
                            if(bool.includes(window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase())){
                                $('.keyboard-key').filter(function() {
                                    return ($(this).text() === window.typedWord[i].replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase());
                                }).css('background-color', 'green');
                            }else if(window.wordOfTheSession.includes(window.typedWord[i].replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase())){
                                $('.keyboard-key').filter(function() {
                                    return ($(this).text() === window.typedWord[i].replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase());
                                }).css('background-color', '#b59f3b');
                            }
                        }
                    }
                }


                if (window.typedWord.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase() === window.wordOfTheSession) {
                    {
                        const notification = document.createElement('div');
                            notification.className = 'custom-notification';
                            notification.innerText = 'Tebrikler, doğru bildin!';
                            document.body.appendChild(notification);
    
                            setTimeout(() => {
                            notification.remove(); // Bildirimi 3 saniye sonra kaldır
                            }, 3000);
                       
                       
                        
                        gameOver = true;
    
    
                        setTimeout(() => {
                            openmeanpopup() 
                        }, 1000);
    
                    }

                    $('.game-tile').eq(0 + (tries * 5)).addClass('flip-animation');
                    $('.game-tile').eq(1 + (tries * 5)).addClass('flip-animation');
                    $('.game-tile').eq(2 + (tries * 5)).addClass('flip-animation');
                    $('.game-tile').eq(3 + (tries * 5)).addClass('flip-animation');
                    $('.game-tile').eq(4 + (tries * 5)).addClass('flip-animation');
                    $('.game-tile').eq(4 + (tries * 5)).on('animationend', function() {
                        $('.game-tile').eq(0 + (tries * 5))[0].classList.remove('flip-animation');
                        $('.game-tile').eq(1 + (tries * 5))[0].classList.remove('flip-animation');
                        $('.game-tile').eq(2 + (tries * 5))[0].classList.remove('flip-animation');
                        $('.game-tile').eq(3 + (tries * 5))[0].classList.remove('flip-animation');
                        $('.game-tile').eq(4 + (tries * 5))[0].classList.remove('flip-animation');
                    });

                    window.gameOver = true;

                    setTimeout(() => {
                        openmeanpopup()
                    }, 1000);

                } else {
                    

                    $('.game-tile').eq(0 + (tries * 5)).addClass('flip-animation');
                    $('.game-tile').eq(1 + (tries * 5)).addClass('flip-animation');
                    $('.game-tile').eq(2 + (tries * 5)).addClass('flip-animation');
                    $('.game-tile').eq(3 + (tries * 5)).addClass('flip-animation');
                    $('.game-tile').eq(4 + (tries * 5)).addClass('flip-animation');
                    $('.game-tile').eq(4 + (tries * 5)).on('animationend', function() {
                        $('.game-tile').eq(0 + (tries * 5))[0].classList.remove('flip-animation');
                        $('.game-tile').eq(1 + (tries * 5))[0].classList.remove('flip-animation');
                        $('.game-tile').eq(2 + (tries * 5))[0].classList.remove('flip-animation');
                        $('.game-tile').eq(3 + (tries * 5))[0].classList.remove('flip-animation');
                        $('.game-tile').eq(4 + (tries * 5))[0].classList.remove('flip-animation');
                    });

                    typedWord = '';
                    window.tries += 1;

                    if(tries < 6){
                        const notification = document.createElement('div');
                        notification.className = 'custom-notification';
                        notification.innerText = 'Üzgünüm, yanlış tahmin!';
                        document.body.appendChild(notification);

                        setTimeout(() => {
                        notification.remove(); // Bildirimi 3 saniye sonra kaldır
                        }, 3000);
                    }

                }
                if (tries > 5) {
                    const notification = document.createElement('div');
                        notification.className = 'custom-notification';
                        notification.innerText = 'Kaybettin, ' +'cevap '+ window.wordOfTheSession.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase() + ' olacaktı!';
                        document.body.appendChild(notification);

                        setTimeout(() => {
                        notification.remove(); // Bildirimi 3 saniye sonra kaldır
                        }, 3000);
                   
                   
                    
                    gameOver = true;


                    setTimeout(() => {
                        openmeanpopup() 
                    }, 1000);

                }
                console.log(window.dictionary);
            } else {
                const notification = document.createElement('div');
                        notification.className = 'custom-notification';
                        notification.innerText = 'Böyle bir kelime yok.';
                        document.body.appendChild(notification);

                        setTimeout(() => {
                        notification.remove(); // Bildirimi 3 saniye sonra kaldır
                        }, 3000);
                $('.game-tile').eq(0 + (tries * 5)).addClass('shake');
                $('.game-tile').eq(1 + (tries * 5)).addClass('shake');
                $('.game-tile').eq(2 + (tries * 5)).addClass('shake');
                $('.game-tile').eq(3 + (tries * 5)).addClass('shake');
                $('.game-tile').eq(4 + (tries * 5)).addClass('shake');
                setTimeout(() => {
                    $('.game-tile').eq(0 + (tries * 5))[0].classList.remove('shake');
                    $('.game-tile').eq(1 + (tries * 5))[0].classList.remove('shake');
                    $('.game-tile').eq(2 + (tries * 5))[0].classList.remove('shake');
                    $('.game-tile').eq(3 + (tries * 5))[0].classList.remove('shake');
                    $('.game-tile').eq(4 + (tries * 5))[0].classList.remove('shake');
                }, 1000);
            }


        } else {
//Add shake animation
                const notification = document.createElement('div');
                notification.className = 'custom-notification';
                notification.innerText = '5 harfli bir kelime giriniz.';
                document.body.appendChild(notification);

                setTimeout(() => {
                notification.remove(); // Bildirimi 3 saniye sonra kaldır
                }, 3000);
        }
    }
}



//if enter is pressed
$(document).keydown(function(e) {
    if (e.which === 13 && gameOver === false) {
        enter();
    }
});
//if #enter-button is clicked
$('#enter-button').click(function() {
    if (gameOver === false) {
        enter();
    }
});
