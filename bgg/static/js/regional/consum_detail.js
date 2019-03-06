$(function () {
    loading()
    var id = getUrl('id')
    $.ajax({
        url: _apiUrl + 'public/bgg/index/partner/userdetail',
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
                $('[name=avatar]').attr('haoniu-lazy-data', res.data.avatar)
                $('.integral').text('会员积分: ' + res.data.credit)
                $('.score .star:lt(' + res.data.scoring + ')').addClass('red')
                $('[name=nickname]').text(res.data.nickname)
                $('[name=id]').text(res.data.id)
                $('[name=dealnum]').text(res.data.dealnum + '单')
                haoniuLazyLoading()
            }else{
                blackHiht(res.message)
            }
            loadend()
        },
        error: function () {
            blackHiht('网络错误')
        }
    })
})