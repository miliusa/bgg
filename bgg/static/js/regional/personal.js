$(function () {
    loading()
    $.ajax({
        url: _apiUrl + 'public/bgg/index/partner/getpartnerinfo',
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
                var res = null;
                if (typeof resstr.result == "undefined") {
                    res = JSON.parse(resstr);
                } else {
                    res = resstr;
                }
                $('.avatar .right img').attr('src', res.data.avatar)
                $('.name .right').text(res.data.realname)
                $('.phone .right').text(res.data.mobile)
                $('.commissions .right').text(res.data.commissions)
               /* $('.bankname .right').text(res.data.bankname)
                $('.bankcard .right').text(res.data.bankcard)
                $('.bankrealname .right').text(res.data.bankrealname)
                $('.bankmobile .right').text(res.data.bankmobile)
                $('.bankaddress .right').text(res.data.bankaddress)*/
            }else{
                blackHiht(res.message)
            }
            loadend()
        },
        error: function () {
            blackHiht('网络错误')
        }
    })

    // 上传头像
    $('.avatar .right').on('tap', function(){
        uploadAvatar()
    })

    // 进入银行卡页面
    $('.bank').on('tap', function(){
        doUpdateBankcard()
    })
})