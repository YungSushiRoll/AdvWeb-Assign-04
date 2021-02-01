$(function () {
    getEvents(1);

    var $next = $('#nextBtn');
    var $prev = $('#prevBtn');

    $next.on('click', ()=> {
        getEvents($next.data('page'));
    });

    $prev.on('click', ()=>{
        getEvents($prev.data('page'));
    })

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
                
                var currentPageNum = $('#currentPage').html("Page " + currentPage + " of " + totalPages);

                // fix next button on roll back
                if (currentPage === totalPages){
                    $next.prop('disabled', true);
                    $('.next').attr('class', 'page-item next disabled');
                } else {
                    $next.prop('disabled', false);
                    $next.data('page', pageInfo.nextPage);
                    $('.next').attr('class', 'page-item next');
                }

                if (currentPage === 1){
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
                    var formatDate = dateTime.toLocaleString([], {hour12: true});

                    if (flagged == false){
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
});