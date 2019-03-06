$(function () {
    var price = getUrl('price')
    $('[name=price]').text('¥' + price)

    $('.pay_type').on('tap', '.pay_list.active', function(){
        ing()
        var $self = $(this)
        $(this).removeClass('active')
        $(this).children('.pay_draw').addClass('active').parent().siblings().children('.pay_draw').removeClass('active')
        var index = $(this).index();
        if(index == 0){
            // 支付宝支付
            $.ajax({
                url: _apiUrl + 'public/bgg/index/merch/retroactivelydepositalipayparam',
                beforeSend: function (request) {
                    request.setRequestHeader("token", getUserToken())
                },
                data: {
                    price: price
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
                        doAlipayPayment(str, 2)
                    }else{
                        blackHiht(res.message)
                    }
                    ingend()
                },
                error: function () {
                    blackHiht('网络错误')
                }
            })
        }else{
            // 微信支付
            $.ajax({
                url: _apiUrl + 'public/bgg/index/merch/retroactivelydepositweixinparam',
                beforeSend: function (request) {
                    request.setRequestHeader("token", getUserToken())
                },
                data: {
                    price: price
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
                        doWeChatPayment(str, 2)
                    }else{
                        blackHiht(res.message)
                    }
                    ingend()
                },
                error: function () {
                    blackHiht('网络错误')
                }
            })
        }
    })
});