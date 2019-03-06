$(function(){
    loading()
    var orderid = getUrl('orderid')
    $('.head_left_icon').on('tap', function () {
        location.href = 'order_detail.html?id=' + orderid
    })
    function getDetail(){
        $.ajax({
            url: _apiUrl + 'public/bgg/index/user/orderdetail',
            beforeSend: function (request) {
                request.setRequestHeader("token", getUserToken())
            },
            data: {
                id: orderid
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
                    $('.ordersn .ordersn_num').text(res.data.ordersn);
                    $('.price .price_num').text('￥' + res.data.price);
                }else{
                    blackHiht(res.message)
                }
                loadend()
            },
            error: function () {
                blackHiht('网络错误')
            }
        })
    }
    getDetail()

    $('.pay_type').on('tap', '.pay_list.active', function(){
        var $self = $(this)
        $(this).removeClass('active')
        $(this).children('.pay_draw').addClass('active').parent().siblings().children('.pay_draw').removeClass('active')
        var index = $(this).index();
        if(index == 0){
            // 支付宝支付
            $.ajax({
                url: _apiUrl + 'public/bgg/index/user/orderalipay',
                beforeSend: function (request) {
                    request.setRequestHeader("token", getUserToken())
                },
                data: {
                    id: orderid
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
                        $self.addClass('active')
                        var str = res.data
                        // 调用原生方法
                        doAlipayPayment(str)
                    }
                },
                error: function () {
                    blackHiht('网络错误')
                }
            })
        }else{
            // 微信支付
            $.ajax({
                url: _apiUrl + 'public/bgg/index/user/orderwxpay',
                beforeSend: function (request) {
                    request.setRequestHeader("token", getUserToken())
                },
                data: {
                    id: orderid
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
                        $self.addClass('active')
                        var str = JSON.stringify(res.data)
                        // 调用原生方法
                        doWeChatPayment(str)
                    }
                },
                error: function () {
                    blackHiht('网络错误')
                }
            })
        }
    })
});