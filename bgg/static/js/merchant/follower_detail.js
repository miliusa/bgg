$(function(){
    //图片懒加载
    loading()
    var id = getUrl('id')
    var page = 1
    var pagesize = 10
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

    function getList(){
        $.ajax({
            url: _apiUrl + 'public/bgg/index/merch/getsubordinatedetail',
            data: {
                subordinate_uid: id,
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
                        html += '<div class="record_item">\
                                    <p class="ordersn color_999">订单编号:<span>' + item.ordersn + '</span></p>\
                                    <p class="commissions color_999">订单收益: ¥<span>' + item.commissions + '</span></p>\
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
                        $('.record_list').html(html);
                        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                    }else{
                        $('.record_list').append(html);
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                    }
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
})
