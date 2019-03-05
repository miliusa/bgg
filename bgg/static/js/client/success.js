$(function () {
    $('.detals').on('tap', function () {
        if(getUserToken()){
            location.href = '../my/order_list.html'
        }else{
            doLogin()
        }
    })

    $('.walk').on('tap', function () {
        location.href = 'goods_list.html'
    })

    $('.head_left_icon').on('tap', function () {
        location.href = '../my/order_list.html'
    })
})