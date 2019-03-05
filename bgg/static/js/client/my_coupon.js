$(function(){
    var page = 1;
    var pagesize = 10;
    var loadall = false;
    //启用双击监听
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            down: {
                auto: true,
                style:'circle',
                callback: pulldownRefresh
            },
            up: {
                height: 50,
                contentrefresh: '正在加载...',
                callback: pullupRefresh
            }
        }
    });

    function getCouponList(){
        var data = {
            page: page,
            pagesize: pagesize
        };
        $.ajax({
            url: _apiUrl + 'public/bgg/index/user/getmembercoupon',
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
                    var html = ''
                    $.each(res.data, function(index, item){
                        var time = getTime2(item.coupon_validity)
                        var status = item.timeout == 1? 'disabled':item.status == 0?'unuse':'used'
                        var statusStyle = item.timeout == 1? '':item.status == 0?'active':'color_999'
                        var statusText = item.timeout == 1?'已过期':item.status == 0?'使用':'已使用'
                        html += '<div class="coupon_item ' + status + '">\
                                    <div class="item_top clear">\
                                        <div class="coupon_rule fl">\
                                            <p class="title">' + item.couponname + '</p>\
                                            <p class="rule color_999">满' + item.used_minprice + '可用</p>\
                                        </div>\
                                        <div class="coupon_value fr">\
                                        <span class="unit">￥</span>\
                                        <span class="credit">' + item.credit + '</span></div>\
                                    </div>\
                                    <div class="item_bottom clear">\
                                        <span class="available_time color_999 fl">有效期：' + time + '</span>\
                                        <span class="use_status fr ' + statusStyle + '">' + statusText + '</span>\
                                    </div>\
                                </div>'
                    })
                    loadall = false
                    if(res.data == '' || res.data.length < pagesize){
                        loadall = true
                        blackHiht("没有更多数据了");
                    }
                    if(page == 1){
                        if(res.data == ''){
                            html = noneTip()
                        }
                        $('.coupon_list').html(html);
                        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                    }else{
                        $('.coupon_list').append(html);
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                    }
                }else{
                    blackHiht(res.message)
                }
            },
            error: function () {
                blackHiht('网络错误')
            }
        })
    }


    /** 上拉加载 */
    function pullupRefresh() {
        if(loadall){
            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
            blackHiht('没有更多数据了');
            $('.mui-pull-bottom-pocket').css('display', 'none');
            return
        }else{
            page++;
            getCouponList();
        }
    }

    /** 下拉刷新 */
    function pulldownRefresh() {
        page = 1;
        getCouponList();
    }


    $('.coupon_list').on('tap', '.use_status.active', function () {
        $(this).removeClass('active')
        location.href = '../index/goods_list.html?from=web'
    })
})