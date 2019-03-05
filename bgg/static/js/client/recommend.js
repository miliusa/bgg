$(function () {
    loading()
    var title = ''
    var thumb = ''
    $.ajax({
        url: _apiUrl + 'public/bgg/index/index/syssetconfig',
        data: {
            type: 'user_share'
        },
        dataType: 'JSON',
        type: 'GET',
        success: function (res) {
            if(res.code == 200){
                $('[name=sharetext]').text(res.data.sharetext)
            }else{
                blackHiht(res.message)
            }
            loadend()
        },
        error: function () {
            blackHiht('网络错误')
        }
    })

    /* 分享 */
    $('.share_btn').on('click', function () {
        if(getUserToken()){
            $('.share-modal').show()
        }else{
            doLogin()
        }
    })
    $('.share-item').on('click', function () {
        var type = $(this).attr('data-type')
        var url = 'register.html'
        ShareWeChat(type, thumb, url)
    })
    $('.share-modal').on('click', function () {
        $(this).hide()
    })
    $('.share-modal-content').on('click', function (e) {
        e.stopPropagation()
    })
    $( '.cancel-share' ).on( 'click', function () {
        $('.share-modal').hide()
    } );

})