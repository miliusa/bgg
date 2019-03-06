$(function () {
    loading()
    var title = '贝瓜瓜邀请您注册！'
    var img = ''
    var desc = ''
    var shareid = ''
    $.ajax({
        url: _apiUrl + 'public/bgg/index/index/syssetconfig',
        data: {
            type: 'merch_share'
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
                $('[name=sharetext]').text(res.data.sharetext)
                img = res.data.thumb
                desc = res.data.sharetext
            }else{
                blackHiht(res.message)
            }
            loadend()
        },
        error: function () {
            blackHiht('网络错误')
        }
    })

    $.ajax({
        url: _apiUrl + 'public/bgg/index/merch/getmerchinfo',
        beforeSend: function (request) {
            request.setRequestHeader("token", getUserToken())
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
                shareid = res.data.id
            }else{
                blackHiht(res.message)
            }
        },
        error: function () {
            blackHiht('网络错误')
        }
    })
    /* 分享 */
    $('.share_btn').on('click', function () {
        if(getUserToken()){
            $('.share-modal').show()
        }else{
            doLogin()
        }
    })
    $('.share-item').on('click', function () {
        var type = $(this).attr('data-type')
        var url = 'http://bgg.hfrjkf.cn/proStorage/public/appfile/bgg/h5page/web/client/index/register.html?shareid=' + shareid + '&sharetype=1'
        var str = JSON.stringify( {
            type: type,
            title: title,
            desc: desc,
            img: img,
            url: url
        } );
        ShareWeChat(str)
    })
    $('.share-modal').on('click', function () {
        $(this).hide()
    })
    $('.share-modal-content').on('click', function (e) {
        e.stopPropagation()
    })
    $( '.cancel-share' ).on( 'click', function () {
        $('.share-modal').hide()
    } );

})