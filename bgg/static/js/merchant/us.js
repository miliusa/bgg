$(function () {
    var version = appGetVersion()
    var u = navigator.userAgent;
    var isAndroid = u.indexOf( 'Android' ) > -1 || u.indexOf( 'Linux' ) > -1; //android终端或者uc浏览器
    var platform = isAndroid ? 1 : 2
    $.ajax({
        url: _apiUrl + 'public/bgg/index/index/versioninfo',
        data: {
            versions: version,
            apptype: '2',
            platform: platform
        },
        type: 'GET',
        dataType: 'JSON',
        success: function (resstr) {
            var res = null;
            if (typeof resstr.result == "undefined") {
                res = JSON.parse(resstr);
            } else {
                res = resstr;
            }
            if(res.result == 1){
                $('[name=logo]').attr('src', res.data.logo)
                $('[name=version]').text(res.data.versions)
            }else{
                blackHiht(res.message)
            }
        },
        error: function () {
            blackHiht('网络错误')
        }
    })
})