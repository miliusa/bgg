$(function () {
    var id = getUrl('id')

    $.ajax({
        url: _apiUrl + 'public/bgg/index/merch/getcommentuserinfo',
        beforeSend: function (request) {
            request.setRequestHeader("token", getUserToken())
        },
        data: {
            orderid: id
        },
        dataType: 'JSON',
        type: 'GET',
        success: function (resstr){
            var res = null;
            if (typeof resstr.result == "undefined") {
                res = JSON.parse(resstr);
            } else {
                res = resstr;
            }
            if(res.code == 200){
                $('[name=avatar]').attr('src', res.data.userinfo.avatar)
            }else{
                blackHiht(res.message)
            }
        },
        error: function () {
            blackHiht('网络错误')
        }
    })

    var scoring = 0
    $('.star_list').on('tap', 'li', function () {
        var index = $(this).index()
        scoring = index + 1
        $('.star_list li:gt(' + index + ') img').attr('src', '../../../static/img/starhui.png')
        $('.star_list li:lt(' + (index + 1) + ') img').attr('src', '../../../static/img/star.png')
    })
    $('.left_text.active').on('tap', function () {
        $(this).removeClass('active')
        var commenttext = $('[name=commenttext]').val()
        if(scoring == 0){
            blackHiht('请选择星级')
        }
        if(scoring > 0 && commenttext){
            $.ajax({
                url: _apiUrl + 'public/bgg/index/merch/commentuser',
                beforeSend: function (request) {
                    request.setRequestHeader("token", getUserToken())
                },
                data: {
                    id: id,
                    scoring: scoring,
                    commenttext: commenttext
                },
                dataType: 'JSON',
                type: 'POST',
                success: function (resstr) {
                    var res = null;
                    if (typeof resstr.result == "undefined") {
                        res = JSON.parse(resstr);
                    } else {
                        res = resstr;
                    }
                    if(res.code == 200){
                        location.replace('rate_success.html?id=' + id)
                    }else{
                        blackHiht(res.message)
                    }
                },
                error: function () {
                    blackHiht('网络错误')
                }
            })
        }
    })
})