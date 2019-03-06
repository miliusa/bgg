$(function () {
    loading()
    var type = getUrl('type')
    var balance = 0

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
                balance = res.data.balance
                $('[name=balance]').text(balance)
            }else{
                blackHiht(res.message)
            }
            loadend()
        },
        error: function () {
            blackHiht('网络错误')
        }
    })

    function withdraw(account, price){
        // 支付宝提现
        if(type == 1){
            var data = {
                withdrawtype: 'balance',
                withdrawtools: type,
                price: price,
                alipay_account: account
            }
        }else{
            var data = {
                withdrawtype: 'balance',
                withdrawtools: type,
                price: price,
                wechat_account: account
            }
        }
        $.ajax({
            url: _apiUrl + 'public/bgg/index/partner/withdraw',
            beforeSend: function (request) {
                request.setRequestHeader("token", token)
            },
            data: data,
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
                    location.href = 'withdraw_success.html'
                }else{
                    blackHiht(res.message)
                }
                $(this).addClass('active')
            },
            error: function () {
                blackHiht('网络错误')
            }
        })
    }

    $('.default_btn.active').on('tap', function () {
        $(this).removeClass('active')
        var account = $('.account_value').val()
        var price = $('[name=price]').val()
        if(!account){
            blackHiht('请输入提现账号')
        }else if(!price){
            blackHiht('请输入提现金额')
        }else if(price > balance){
            blackHiht('可提现金额不足')
        }else if(price <= 0){
            blackHiht('提现金额不能为0')
        }else{
            withdraw(account, price)
        }
    })
})