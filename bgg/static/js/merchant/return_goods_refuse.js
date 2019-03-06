$(function () {
    var id = getUrl('id')
    $('.default_btn.active').on('tap', function () {
        var $self = $(this)
        $self.removeClass('active')
        var rejectrefundremark = $('.refuse_text .textarea').val()
        $.ajax({
            url: _apiUrl + 'public/bgg/index/merch/surerefund',
            beforeSend: function (request) {
                request.setRequestHeader("token", getUserToken())
            },
            data: {
                id: id,
                refundstatus: -1,
                rejectrefundremark: rejectrefundremark
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
                    blackHiht('成功')
                    history.back()
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