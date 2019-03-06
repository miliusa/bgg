$(function(){
    loading()
    var page = 1
    var pagesize = 10
    function getCouponList(){
        var data = {
            page: page,
            pagesize: pagesize
        }
        $.ajax({
            url: _apiUrl + 'public/bgg/index/user/couponlist',
            beforeSend: function (request) {
                request.setRequestHeader("token", getUserToken())
            },
            data: data,
            dataType: 'JSON',
            type: 'GET',
            success: function(resstr){
                var res = null;
                if (typeof resstr.result == "undefined") {
                    res = JSON.parse(resstr);
                } else {
                    res = resstr;
                }
                if(res.code == 200){
                    var html = '';
                    $.each(res.data.coupon, function(index,item){
                        html += '<div class="coupon_item">\
                                    <div class="item_top clear">\
                                        <div class="coupon_rule fl">\
                                            <p class="title">' + item.name + '</p>\
                                        </div>\
                                        <div class="coupon_value fr">￥<span>' + item.deduction + '</span></div>\
                                    </div>\
                                    <div class="item_bottom clear">\
                                        <span class="point color_999 fl">' + item.credit + '积分兑换</span>\
                                        <span class="change active fr" data-id="' + item.id + '" data-credit="' + item.credit + '">去兑换<i class="enter_icon fr"></i></span>\
                                    </div>\
                                </div>'
                    });
                    $('.coupon_list').html(html)
                    $('.point_box .point').text(res.data.membercredit)
                }else{
                    blackHiht(res.message)
                }
                loadend()
            },
            error: function () {
                blackHiht('网络错误')
            }
        })
    }
    getCouponList()

    function getRecordList(){
        var data = {
            page: page,
            pagesize: pagesize
        }
        $.ajax({
            url: _apiUrl + 'public/bgg/index/user/invitationlog',
            beforeSend: function (request) {
                request.setRequestHeader("token", getUserToken())
            },
            data: data,
            dataType: 'JSON',
            type: 'GET',
            success: function(resstr){
                var res = null;
                if (typeof resstr.result == "undefined") {
                    res = JSON.parse(resstr);
                } else {
                    res = resstr;
                }
                if(res.code == 200){
                    var html = '';
                    $.each(res.data, function(index, item){
                        var time = getTime3(item.createtime);
                        html += '<li class="invite_item">' + time + ' ' + item.invitationtext + '，' + item.credit + '积分入账！</li>'
                    });
                    $('.invite_list').html(html)
                }else{
                    blackHiht(res.message)
                }
            },
            error: function () {
                blackHiht('网络错误')
            }
        })
    }
    getRecordList();

    // 去兑换
    $('.coupon_list').on('click', '.change.active', function(){
        var id = $(this).attr('data-id');
        var credit = $(this).attr('data-credit');
        var str = '确定用' + credit + '积分兑换该券吗？';
        confirmModal(
            str,
            function(){
                $.ajax({
                    url: _apiUrl + 'public/bgg/index/user/conversioncoupon',
                    beforeSend: function(request){
                        request.setRequestHeader("token", getUserToken())
                    },
                    data: {
                        id: id
                    },
                    dataType: 'JSON',
                    type: 'POST',
                    success: function(resstr){
                        var res = null;
                        if (typeof resstr.result == "undefined") {
                            res = JSON.parse(resstr);
                        } else {
                            res = resstr;
                        }
                        if(res.code == 200){
                            blackHiht(res.message)
                            getCouponList()
                        }else{
                            blackHiht(res.message)
                        }
                    },
                    error: function(){
                        blackHiht('网络错误')
                    }
                })
            },
            function(){

            }
        )
    })
})