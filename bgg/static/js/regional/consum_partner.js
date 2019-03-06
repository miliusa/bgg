$(function(){
    //图片懒加载
    loading()
    var page = 1
    var pagesize = 10
    var keywords = ''
    var loadall = false
    $('[name=keywords]').val(keywords)
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

    function getList(){
        $.ajax({
            url: _apiUrl + 'public/bgg/index/partner/merchlist',
            data: {
                keywords: keywords,
                page: page,
                pagesize: pagesize
            },
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
                    var html = ''
                    $.each(res.data, function (index, item) {
                        var statusText = item.status == 0?'待审核':item.status == 1?'已同意':'已驳回'
                        html += ' <div class="shop_item clear" data-id="' + item.id + '">\
                                    <div class="fl shop_img">\
                                       <img class="haoniu-lazy-data" haoniu-lazy-data="' + item.avatar + '" />\
                                    </div>\
                                    <div class="fr shop_desc">\
                                        <p class="shop_name text_ellipsis_1">店铺名称：' + item.newmerchname + '</p>\
                                        <p class="shop_id text_ellipsis_1">店铺ID：' + item.merchid + '</p>\
                                        <p class="shop_connect_name text_ellipsis_1">联系人： ' + item.realname + '</p>\
                                        <div class="connect_phone clear">\
                                            <p class="shop_connect_phone text_ellipsis_1 fl">联系方式：' + item.mobile + '</p>\
                                            <span class="status fr">' + statusText + '</span>\
                                        </div>\
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
                        $('.shop_list').html(html);
                        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                    }else{
                        $('.shop_list').append(html);
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                    }
                    $('.search_btn').addClass('active')
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
            getList();
        }
    }

    /** 下拉刷新 */
    function pulldownRefresh() {
        page = 1;
        getList();
    }


    $('.search_btn.active').on('tap', function () {
        $(this).removeClass('active')
        keywords = $('[name=keywords]').val()
        pulldownRefresh()
    })

    $('.shop_list').on('tap', '.shop_item',function () {
        var id = $(this).attr('data-id')
        location.href = 'shop_detail.html?from=web&id=' + id
    })
})
