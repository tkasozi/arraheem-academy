/**
 * 
 *Talik Kasozi <talik.aziizi@gmail.com>
 *
 *init.js   December 5, 2016
 *
 */

/*
 * Using JQuery's
 */


$(document).ready(function () {

//mouse-movements implementation.
    (function () {
        //navigation bar
        $(".nav-li").mouseover(function () {
            $(this).css("background-color", "#424242");
            $(this).css("cursor", "pointer");
        }).mouseleave(function () {
            $(this).css("background-color", "#232323");
        }).mousedown(function () {
            $(this).css("background-color", "#424242");
            $(this).css("cursor", "pointer");
        });
        //end of navigation bar

        //scroll to an element ie. div onclick()
        $(".index-link").click(function () { //test
            $('html,body').animate({
                scrollTop: $(".main-page-body").offset().top}, //example, change offset here
                    'slow');
        });

        $(".news").mouseover(function () {
            $(this).addClass('right-border-highlight');
        }).mouseleave(function () {
            $(this).removeClass('right-border-highlight');
        });

    })();//end of mouse-movement impl

    if (location.pathname === '/directory') {
        (function () {
            var count = 0;
            var $p = $("<div>"), $container = $('#content');
            for (var ASCII = 65; ASCII < 91; ASCII++) {
                var letter = String.fromCharCode(ASCII);
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    var $a = $('<a>').attr('href', '#').css('margin', '.5rem').addClass('tagLetter').html(letter);
                    if (++count % 13 === 0)
                    {
                        $container.append($("<br>"));

                        $container.append($p);

                        $p = $("<div>").append($("<br>")).append($a);

                        $container.append($p);

                        count = 0;
                    } else {
                        $p.append($a);
                    }

                } else {
                    $container.append($('<a>').attr('href', '#').css('margin', '.5rem').html(letter).addClass('tagLetter'));
                }
            }
            $container.append($("<br/>")).append($("<br/>"));
            $container.append($("<div>").attr('id', 'pages_matched'));

            $('.tagLetter').click(function () {
                var _letter = new String($(this).html());

                $(this).attr('href', '#' + _letter);

                directoryPage('#pages_matched', '#' + _letter, _letter);
            });

        })();
    }//end of /directory

    //alternativeStyle.jade
    (function () {
        var altOtherHeight = $('#content').height();

        if ($('#altOther').height() < altOtherHeight) {
            $('#altOther').css('height', altOtherHeight + 'px');
        }
        if ($('#text-content').height() < altOtherHeight) {
            $('#text-content').css('height', altOtherHeight + 'px');
        }

        $(window).on('orientationchange', function () {
            altOtherHeight = $('#content').height();

            if ($('#altOther').height() < altOtherHeight) {
                $('#altOther').css('height', altOtherHeight + 'px');
            }
            if ($('#text-content').height() < altOtherHeight) {
                $('#text-content').css('height', altOtherHeight + 'px');
            }
        });

    }()); //end of alternativeStyle.jade

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && screen.width <= 800)
    {
        $(".mobilePopup").tooltip('show');

        onScreenRotate();

        $(window).on("orientationchange", onScreenRotate);

        $('#tags').focus(function () {
            $(".mobilePopup").tooltip('hide');
        });
    }


});

onScreenRotate = function () {
    if (screen.orientation.angle === 90 || screen.orientation.angle === -90
            || screen.availWidth > screen.availHeight) {
        //landscape             
        $(".mobilePopup").tooltip('hide');

        $('#news').css('display', 'block');
        $('#newsDetailModal').css('display', 'block');
        $('#events').css('display', 'block');

    } else {
        //potrait
        $(".mobilePopup").tooltip('show');

        if (screen.availWidth < screen.availHeight)
        {
            $('#news').css('display', 'none');
            $('#newsDetailModal').css('display', 'none');
            $('#events').css('display', 'none');
        }
    }
};
function removeClass(stepThrough, toggle) {
    while (stepThrough) {
        $(stepThrough).removeClass(toggle);
        stepThrough = stepThrough.nextSibling;
    }
}

function buildOut() {
    var contentHolder = $('<div>', {
        id: 'search-result-div',
        'class': 'search-result-div',
        style: 'min-width: 100%;max-width:100%;background-color: white;'
    });

    $('#tags').after(contentHolder);

    return contentHolder;
}

reload_dir = function () {
    var pathname = location.pathname;
    var hash = new String(location.hash);

    if (pathname === '/directory') {
        var _letter = (hash.toLowerCase()).charAt(1);

        directoryPage('#pages_matched', hash, _letter);
    }
};
element_dir = function (key, href, title) {
    var elem = "<li class='" + key + "'> <a href='/" + href + "' style='font-size:1.3rem;'>" + title + "</a> </li>";
    return elem;
};

element_search = function (key, href, title, matched) {
    var elem = "<li class='" + key + "'> <span class='pull-right'>" + matched + "</span> <a  href='/" + href + "' style='font-size:1.3rem;'>" + title + "</a> </li>";
    return elem;
};
//onreload functions

directoryPage = function (div, hash, _letter) {

    $(div).empty();

    if (hash.length !== 0)
    {
        $.getJSON('/api/page/' + _letter.toLowerCase(), function (data) {
            var items = [];

            $.each(data, function (key, val) {
                if (key === "hits") {
                    for (var i = 0; i < val.length; i++) {
                        items.push(element_dir(key, val[i]._source.page, val[i]._source.title));
                    }
                }
            });

            $('<ul/>', {
                style: 'list-style: none;',
                'class': 'list',
                html: items.join('')
            }).appendTo(div);
        }).fail(function () {
            $(div).append($('<li></li>').html("No Result").css('font-size', '1.7rem').css('list-style', 'none'));
        });
    } else {
        if ($(div)[0].childNodes[0] === undefined) {
            var _first;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                _first = $('#content')[0].childNodes[1].childNodes[0];
            } else {
                _first = $('#content')[0].childNodes[0];
            }
            _first.click();
        }
    }
};
