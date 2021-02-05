$(function () {
    getEvents(1);

    var $next = $('#nextBtn');
    var $prev = $('#prevBtn');
    var refreshInterval;

    $next.on('click', () => {
        getEvents($next.data('page'));
    });

    $prev.on('click', () => {
        getEvents($prev.data('page'));
    })

    function refreshEvents(){
        $.getJSON({
            url: "https://localhost:5001/api/event/count",
            success: function (response, textStatus, jqXhr) {
              if (response != $('#total').html()) {
                console.log("success");
                getEvents($('#current').data('val'));
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              // log the error to the console
              console.log("The following error occured: " + jqXHR.status, errorThrown);
            }
          });
    }
    

    function getEvents(page) {
        $.getJSON({
            url: "https://localhost:5001/api/event/pagesize/20/page/" + page,
            success: function (response, textStatus, jqXhr) {
                console.log(response);
                var content = $('.consumerInfo').html("");
                var events = response.events;
                var pageInfo = response.pagingInfo;
                var totalPages = pageInfo.totalPages;
                var currentPage = pageInfo.currentPage;
                $('#current').data('val', pageInfo.currentPage);

                var currentPageNum = $('#currentPage').html("Page " + currentPage + " of " + totalPages);

                // fix next button on roll back
                if (currentPage === totalPages) {
                    $next.prop('disabled', true);
                    $('.next').attr('class', 'page-item next disabled');
                } else {
                    $next.prop('disabled', false);
                    $next.data('page', pageInfo.nextPage);
                    $('.next').attr('class', 'page-item next');
                }

                if (currentPage === 1) {
                    $prev.prop('disabled', true);
                    $('.prev').attr('class', 'page-item prev disabled');
                } else {
                    $prev.prop('disabled', false);
                    $prev.data('page', pageInfo.previousPage);
                    $('.prev').attr('class', 'page-item prev');
                }

                events.forEach(event => {
                    var flagged = event.flag;
                    var dateTime = new Date(event.stamp);
                    var formatDate = dateTime.toLocaleString([], { hour12: true });

                    if (flagged == false) {
                        flagged = "<i class='far fa-flag'></i>"
                    } else {
                        flagged = "<i class='fas fa-flag'></i>"
                    }
                    let data = "<tr>" +
                        "<td>" + event.id + "</td>" +
                        "<td>" + formatDate + "</td>" +
                        "<td>" + event.loc + "</td>" +
                        "<td>" + flagged + "</td>" +
                        "</tr>";
                    content.append(data);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // log the error to the console
                console.log("The following error occured: " + textStatus, errorThrown);
            }
        });
    }

    function initAutoRefresh(){
        // if auto-refresh button is set to true
        if ($('#auto-refresh').data('val')) {
            // display checked icon
            $('#auto-refresh i').removeClass('fa-square').addClass('fa-check-square');
            // start timer
            refreshInterval = setInterval(refreshEvents, 2000);
        } else {
            // display unchecked icon
            $('#auto-refresh i').removeClass('fa-check-square').addClass('fa-square');
            // if the timer is on, clear it
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        }
      }


    // // delegated event handler needed
    // // http://api.jquery.com/on/#direct-and-delegated-events
    // $('tbody').on('click', '.flag', function () {
    //     var checked;
    //     if ($(this).data('checked')) {
    //         $(this).data('checked', false);
    //         $(this).removeClass('fas').addClass('far');
    //         checked = false;
    //     } else {
    //         $(this).data('checked', true);
    //         $(this).removeClass('far').addClass('fas');
    //         checked = true;
    //     }
    //     // AJAX to update database
    //     $.ajax({
    //         headers: { "Content-Type": "application/json" },
    //         url: "https://localhost:5001/api/event/" + $(this).data('id'),
    //         type: 'patch',
    //         data: JSON.stringify([{ "op": "replace", "path": "Flagged", "value": checked }]),
    //         success: function () {
    //             console.log("success");
    //         },
    //         error: function (jqXHR, textStatus, errorThrown) {
    //             // log the error to the console
    //             console.log("The following error occured: " + jqXHR.status, errorThrown);
    //         }
    //     });
    // });

    // event listener to toggle data auto-refresh
    $('#auto-refresh').on('click', function () {
        $(this).data('val', !($(this).data('val')));
        initAutoRefresh();
    });
});