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
    function getRecordList(){
        $.ajax({
            url:  _apiUrl + 'public/bgg/index/partner/partnerrechargelog',
            beforeSend: function (request) {
                request.setRequestHeader("token", getUserToken())
            },
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
                        var statusText = item.status == 1?'已提现':item.status == -1?'已驳回':item.status == 0?'未处理': ''
                        html += '<div class="record_item">\
                                    <p class="sn">提现单号: <span>' + item.sn + '</span></p>\
                                    <div class="center_info">\
                                        <div class="record_type">\
                                            <img src="../../../static/img/yhk.png"/>\
                                        </div>\
                                        <div class="center">\
                                            <p class="record_title">提现到银行卡</p>\
                                            <p class="record_balance">余额: <span>' + item.usedbalance + '</span></p>\
                                            <p class="record_time">' + time + '</p>\
                                        </div>\
                                    <div class="right">\
                                        <p class="record_money">' + item.price + '</p>\
                                        <p class="status">' + statusText + '</p>\
                                    </div>\
                                </div>\
                                <div class="bottom_info">\
                                    <p class="bank_account">银行卡号: <span>' + item.bankcard + '</span></p>\
                                    <p class="bank_name">开户行: <span>' + item.bankname + '</span></p>\
                                    <p class="info">\
                                        <span class="name">' + item.realname + '</span>\
                                        <span class="phone">' + item.mobile + '</span>\
                                    </p>\
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
                        $('.record_list').html(html);
                        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                    }else{
                        $('.record_list').append(html);
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
            getRecordList();
        }
    }

    /** 下拉刷新 */
    function pulldownRefresh() {
        page = 1;
        getRecordList();
    }
})