$(function () {
    var id = getUrl('id')

    $.ajax({
        url: _apiUrl + 'public/bgg/index/merch/getcommentcontent',
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
                $('[name=avatar]').attr('src', res.data.userinfo.avatar)
                $('[name=nickname]').text(res.data.userinfo.nickname)
                $('.star_list li:lt(' + res.data.comment.scoring + ') img').attr('src', '../../../static/img/star.png')
                $('[name=commenttext]').text(res.data.comment.commenttext)
            }else{
                blackHiht(res.message)
            }
        },
        error: function () {
            blackHiht('网络错误')
        }
    })
})