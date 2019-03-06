$(function(){
    loading()
    var page = 1;
    var pagesize = 10;
    var loadall = false
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


    function getReturnList(){
        var data = {
            page: page,
            pagesize: pagesize
        };
        $.ajax({
            url: _apiUrl + 'public/bgg/index/user/refundorderlist',
            beforeSend: function ( request ) {
                request.setRequestHeader( "token", getUserToken() );
            },
            data: data,
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
                    var html = '';
                    $.each(res.data, function(index, item){
                        var statusText = item.refundstatus == 1?'审核中':item.refundstatus == 2?'已退款': '未知'
                        html += '<div class="order_item" data-id="' + item.id + '">'
                        $.each(item.ordergoods, function (index1, item1) {
                            html += '<div class="top_info clear">\
                                    <div class="img_box fl">\
                                        <img class="haoniu-lazy-data" haoniu-lazy-data="' + item1.goodsinfo.thumb + '"/>\
                                    </div>\
                                    <div class="center_info fl">\
                                        <p class="title">' + item1.goodsinfo.title + '</p>\
                                        <p class="count">数量： ' + item1.total + '</p>\
                                        <p class="address color_999">地址：' + item.provincename + ' ' + item.cityname + ' ' + item.areaname + '' + item.address + '</p>\
                                    </div>\
                                    <div class="left_info fl">\
                                        <p class="order_status">' + statusText + '</p>\
                                        <p class="total_price color_999">合计：￥<span>' + item.price + '</span></p>\
                                    </div>\
                                </div>'
                        })
                         html += '<div class="bottom_btns clear">\
                                    <button class="r_btn active review fr">查看详情</button>\
                                </div>\
                            </div>';
                    });
                    loadall = false;
                    if(res.data == '' || res.data.length < 10){
                        loadall = true;
                        if(page != 1){
                            blackHiht("没有更多数据了");
                        }
                    }
                    if(page == 1){
                        if(res.data == ''){
                            html = noneTip('没有相关订单')
                        }
                        $('.order_list').html(html);
                        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                    }else{
                        $('.order_list').append(html);
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                    }
                    haoniuLazyLoading();
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

    /** 上拉加载 */
    function pullupRefresh() {
        if(loadall){
            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
            blackHiht('没有更多数据了');
            $('.mui-pull-bottom-pocket').css('display', 'none');
            return
        }else{
            page++;
            getReturnList();
        }
    }

    /** 下拉刷新 */
    function pulldownRefresh() {
        page = 1;
        getReturnList();
    }

    $('.order_list').on('tap', '.review.active', function () {
        $(this).removeClass('active')
        var id = $(this).closest('.order_item').attr('data-id')
        location.href = 'return_goods_status.html?from=web&id=' + id
    })
});