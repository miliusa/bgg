$(function () {
    loading()
    var commissions = 0

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
                commissions = parseInt(res.data.commissions)
                $('[name=balance]').text(commissions)
            }else{
                blackHiht(res.message)
            }
            loadend()
        },
        error: function () {
            blackHiht('网络错误')
        }
    })

    // 手续费
    $.ajax({
        url: _apiUrl + 'public/bgg/index/partner/getfee',
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
                $('[name=fee]').text(res.data.fee)
            }else{
                blackHiht(res.message)
            }
        },
        error: function () {
            blackHiht('网络错误')
        }
    })

    function withdraw(price){
        // 银行卡提现
        var data = {
            withdrawtype: 'commission',
            withdrawtools: 3,
            price: price,
        }
        $.ajax({
            url: _apiUrl + 'public/bgg/index/partner/withdraw',
            beforeSend: function (request) {
                request.setRequestHeader("token", getUserToken())
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
        var $self = $(this)
        $(this).removeClass('active')
        var price = parseInt($('[name=price]').val())
        $.ajax({
            url: _apiUrl + 'public/bgg/index/partner/isfullbankcard',
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
                    if(!price){
                        blackHiht('请输入提现金额')
                    }else if(price % 100 != 0){
                        blackHiht('提现金额必须为100的倍数')
                    }else if(price <= 0){
                        blackHiht('提现金额不能为0')
                    }else if(price > commissions){
                        blackHiht('可提现金额不足')
                    }else{
                        withdraw(price)
                    }
                }else{
                    doUpdateBankcard()
                }
                $self.addClass('active')
            },
            error: function () {
                blackHiht('网络错误')
            }
        })
    })
})