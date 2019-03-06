$(function () {
    var id = getUrl('id')
    $.ajax({
        url: _apiUrl + 'public/bgg/index/user/getcommentcontent',
        beforeSend: function (request) {
            request.setRequestHeader("token", getUserToken())
        },
        data: {
            orderid: id
        },
        dataType: 'JSON',
        type: 'GET',
        success: function (resstr) {
            var res = null;
            if (typeof resstr.result == "undefined") {
                res = JSON.parse(resstr);
            } else {
                res = resstr;
            }
            if(res.code == 200){
                var html = ''
                $.each(res.data.comment, function (index, item) {
                    html += '<div class="rate_item">\
                                <div class="rate_info clear">\
                                    <div class="img_box fl">\
                                        <img class="haoniu-lazy-data" haoniu-lazy-data="' + item.goodsinfo.thumb + '"/>\
                                    </div>\
                                    <div class="star_info fl">\
                                        <p class="text">' + item.goodsinfo.title + '</p>\
                                        <ul class="star_list">'
                    for(var i = 0; i < 5; i++){
                        if(i < item.scoring){
                            html += '<li><img src="../../../static/img/star.png"/></li>'
                        }else{
                            html += '<li><img src="../../../static/img/starhui.png"/></li>'
                        }
                    }
                    html += '</ul>\
                            </div>\
                        </div>\
                        <div class="rate_text_box">\
                            <p class="rate_text" name="commenttext">' + item.commenttext + '</p>\
                        </div>\
                    </div>'
                })
                $('.rate_list').html(html)
                haoniuLazyLoading()
            }else{
                blackHiht(res.message)
            }
        },
        error: function () {
            blackHiht('网络错误')
        }
    })
})