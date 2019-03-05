$(function () {
    // 立即申请
    $('.apply.active').on('tap', function () {
        goPartnerApply()
    })
    // 取消申请
    $('.cancel_btn.active').on('tap', function () {
        if(getUserToken()){
            doLogin()
        }else{
            $.ajax({
                url: _apiUrl + 'public/bgg/index/user/cancelpartnerapply',
                beforeSend: function (request) {
                    request.setRequestHeader("token", getUserToken())
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
                        blackHiht('取消申请成功')
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