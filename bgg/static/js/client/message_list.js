$(function () {
    loading()
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

    function getMessageList(){
        $.ajax({
            url:  _apiUrl + 'public/bgg/index/merch/getnotice',
            data: {
                page: page,
                pagesize: pagesize
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
                    $.each(res.data, function (index,item) {
                        var time = getTime(item.createtime)
                        html += '<div class="mui-table-view mui-table-view-chevron message_list">\
                                    <div class="message_item">\
                                        <p class="text">' + item.content + '</p>\
                                        <p class="time">' + time + '</p>\
                                    </div>\
                                </div>'
                    });
                    loadall = false;
                    if(res.data == '' || res.data.length < 10){
                        loadall = true;
                        blackHiht("没有更多数据了");
                    }
                    if(page == 1){
                        if(res.data == ''){
                            html = noneTip()
                        }
                        $('.message_list').html(html);
                        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                    }else{
                        $('.message_list').append(html);
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                    }
                    loadend()
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
            getMessageList();
        }
    }

    /** 下拉刷新 */
    function pulldownRefresh() {
        page = 1;
        getMessageList();
    }
})