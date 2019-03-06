$(function () {
    loading()
    var id = getUrl('id')
    $.ajax({
        url: _apiUrl + 'public/bgg/index/user/orderdetail',
        beforeSend: function (request) {
            request.setRequestHeader("token", getUserToken())
        },
        data: {
            id: id
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
                $('.return_reason_select .fr').text(res.data.refundselectremark || '未选择')
                $('.text .return_price').text('￥' + res.data.refundprice)
                $('.return_status_text span').text(res.data.refundstatus == 1?'待审核': '已退款')
                if(res.data.refundstatus == 1){
                    $('.default_btn_box .default_btn').text('取消退款')
                    $('.default_btn_box .default_btn').addClass('cancel_apply')
                }else{
                    $('.default_btn_box .default_btn').hide()
                }
            }else{
                blackHiht(res.message)
            }
            loadend()
        },
        error: function () {
            blackHiht('网络错误')
        }
    })

    // 取消退款
    $('.default_btn_box').on('tap', '.cancel_apply', function () {
        $(this).removeClass('active')
        $.ajax({
            url: _apiUrl + 'public/bgg/index/user/cancelrefundorder',
            beforeSend: function (request) {
                request.setRequestHeader("token", getUserToken())
            },
            data: {
                id: id
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
                    blackHiht('退款成功')
                    modalOpen()
                    setTimeout(function(){
                        history.back()
                    },500)
                }else{
                    blackHiht(res.message)
                }
            },
            error: function () {
                blackHiht('网络错误')
            }
        })
    })
})