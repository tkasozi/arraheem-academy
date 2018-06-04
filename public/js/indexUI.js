/**
 * Talik Kasozi <talik.aziizi@gmail.com
 * 
 * dashboard only
 */

(function () {
    //load Events and News Items
    var $item;
    var newsNode = $('#newsUl')[0], stepThroughNews = newsNode.firstElementChild;
    var eventsNode = $('#eventsUl')[0], stepThroughEvents = eventsNode.firstElementChild;

    $('.newsItem').click(function () {

        var $title = ($(this).find('h6')[0]).innerHTML;

        $('#newsModalLabel').html($title);

        removeClass(stepThroughNews, "toggle");

        if (!$(this).hasClass('toggle')) {
            $(this).addClass('toggle');
        }

        $.get('/api/info/:query', {category: 'news'}, function (data) {

            for (var i = 0; i < data.results.length; i++) {
                if (data.results[i].title === $title) {
                    $item = data.results[i];
                    $('.modal-body').empty();
                    for (var x = 0; x < $item.detail.length; x++) {
                        $('#newsModal-body').append($('<br/>')) //$('#ModalText')
                                .append($('<p></p>').html($item.detail[x])); //use for-loop
                    }
                    $("#news").tooltip('hide');
                    $('#newsModal').modal('show');
                    break;
                } else {
                    $('.modal-body').empty();
                }
            }
        });
    });

    $('.eventItem').click(function () {
        var $item;
        var $title = ($(this).find('h6')[0]).innerHTML;

        $('#eventsModalLabel').empty();

        $('#eventsModalLabel').append($("<h4></h4>").html($title));

        removeClass(stepThroughEvents, "toggle");

        if (!$(this).hasClass('toggle')) {
            $(this).addClass('toggle');
        }

        $.get('/api/info/:query', {category: 'events'}, function (data) {

            for (var i = 0; i < data.results.length; i++) {
                if (data.results[i].title === $title) {
                    $item = data.results[i];
                    $('#eventsModal-body').empty();
                    $('#eventsModalLabel').append(
                            $('<em></em>')
                            .append($("<h6></h6>").html(data.results[i].date[0]))
                            .append($("<h5></h5>").html(data.results[i].date[1]))
                            .addClass("label-date")
                            .css('right', '7%').css('position', 'absolute').css('top', '0'));
                    $('#eventsModal-body').append($("<h5></h5>").html(data.results[i].info));
                    for (var x = 0; x < $item.detail.length; x++) {
                        $('#eventsModal-body').append($('<br/>'))
                                .append($('<p></p>').html($item.detail[x])); //use for-loop
                    }

                    $("#news").tooltip('hide');
                    $('#eventsModal').modal('show');
                    break;
                } else {
                    $('#eventsModal-body').empty();
                }
            }
        });
    });

    $.fn.overflown = function () {
        var e = this[0];
        return e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth;
    };


    $.get('/api/info/:query', {category: 'news'}, function (data) {
        newsLength = data.results.length;
        for (var i = 0; i < data.posted.length; i++) {
            $($('span.daysAgoNews')[i]).html(data.posted[i] + " days ago");
        }
    }).done(function () {

        var x_value = $('.newsItem').width() * newsLength; //causes warning on line 102   " }()); "

        var scroll = $('#news').scrollLeft();
        var elementSize = $('.newsItem').width();

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && screen.width <= 800) {
            $(window).on("orientationchange", function () {
                if (screen.orientation.angle === 90 || screen.orientation.angle === -90
                        || screen.availWidth > screen.availHeight) {

                    if ($("#news").overflown()) {
                        $('.newsRight').removeClass('hidden');
                    }
                }
            });
        } else {
            if ($("#news").overflown()) {
                //$('.newsRight').removeClass('hidden');
            }
        }
        $('.newsRight').click(function () {
            $('.newsLeft').removeClass('hidden');

            if (scroll < x_value) {
                scroll += elementSize;
            }
            console.log(scroll, x_value);
            $('#news').animate({
                scrollLeft: scroll
            });
        });

        $('.newsLeft').click(function () {

            if (scroll > 0 && scroll < x_value) {
                scroll -= elementSize;
            } else if (scroll > 0 && scroll === x_value) {
                scroll -= (elementSize * 2);
            }

            if (scroll === 0) {
                $('.newsLeft').addClass('hidden');
            }

            console.log(scroll, x_value);

            $('#news').animate({
                scrollLeft: scroll
            });

        });
    });

    $.get('/api/info/:query', {category: 'events'}, function (data) {
        eventLength = data.results.length;

        for (var i = 0; i < data.posted.length; i++) {
            $($('span.daysAgoEvent')[i]).html(data.posted[i] + " days ago");
            var $item = $('span.daysAgoEvent')[i];
        }
    }).done(function () {

        var x_value = $('.newsItem').width() * eventLength;

        var scroll = $('#events').scrollLeft();
        var elementSize = $('.eventItem').width();

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && screen.width <= 800) {
            $(window).on("orientationchange", function () {
                if (screen.orientation.angle === 90 || screen.orientation.angle === -90
                        || screen.availWidth > screen.availHeight) {

                    console.log("landscape: ", $("#events").overflown());

                    if ($("#events").overflown()) {
                        $('.eventsRight').removeClass('hidden');
                    }
                }
            });
        } else {
            if ($("#events").overflown()) {
                //$('.eventsRight').removeClass('hidden');
            }
        }
        $('.eventsRight').click(function () {
            $('.eventsLeft').removeClass('hidden');

            if (scroll < x_value) {
                scroll += elementSize;
            }

            $('#events').animate({
                scrollLeft: scroll
            });
        });

        $('.eventsLeft').click(function () {

            if (scroll > 0 && scroll < x_value) {
                scroll -= elementSize;
            } else if (scroll > 0 && scroll === x_value) {
                scroll -= (elementSize * 2);
            }

            if (scroll === 0) {
                $('.eventsLeft').addClass('hidden');
            }

            $('#events').animate({
                scrollLeft: scroll
            });

        });
    });

    //search bar
    var $parent = buildOut();

    $('#tags').on('keyup', function (e) {
        $('#search-result-div').empty();

        if (this.value !== '') {

            $.getJSON('/api/search/' + this.value, function (data) {
                var items = [];

                $.each(data, function (key, val) {
                    if (key === "hits") {
                        for (var i = 0; i < val.length; i++) {
                            items.push(element_search(key, val[i]._source.page, val[i]._source.title, ""));
                        }
                    }
                });

                $('<ul/>', {
                    style: 'list-style: none; ',
                    'class': 'list',
                    html: items.join('')
                }).appendTo('#search-result-div');

            }).fail(function () {
                $('#search-result-div').append($('<span></span>').html("No Result").css('font-size', '1.3rem'));
                $($parent.parent()).css('margin-bottom', $('#search-result-div').height() + 'px');
            }).done(function () {
                $($parent.parent()).css('margin-bottom', $('#search-result-div').height() + 'px');
            });
        } else {
            $($parent.parent()).css('margin-bottom', $('#search-result-div').height() + 'px');
        }

    });
})();