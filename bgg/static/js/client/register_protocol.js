$(function () {
    loading()
    $.ajax({
        url: _apiUrl + 'public/bgg/index/index/registrationprotocol',
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
                $('.content').html(res.data.content)
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