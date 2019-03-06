$(function () {
    $('[name=recharge]').val('')
    var minprice = 0
    $.ajax({
        url: _apiUrl + 'public/bgg/index/merch/minrechargedeposit',
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
                minprice = parseInt(res.data.minrechargedeposit)
            }else{
                blackHiht(res.message)
            }
        },
        error: function () {
            blackHiht('网络错误')
        }
    })
    $('.default_btn').on('tap', function () {
        var val = parseInt($('[name=recharge]').val())
        if(isNaN(val)){
            blackHiht('请输入数字')
        }else if(val == ''){
            blackHiht('请输入充值金额')
        }else if(val % 100 != 0){
            blackHiht('充值金额必须为100的倍数')
        }else if(val < minprice){
            blackHiht('未满足您的最小充值金额')
        }else{
            location.href = 'pay.html?from=web&price=' + val
        }
    })
})