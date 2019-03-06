$(function(){
    loading()
    var id = getUrl('id');
    var options = [];
    var optionid = null;
    // 页面初始化
    function initialize() {
        // banner初始化
        $.ajax({
            url: _apiUrl + 'public/bgg/index/index/goodsdetail',
            data: {id: id},
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
                    // 详情
                    var bannerText = '';
                    $.each(res.data.thumbs, function (index, item) {
                        bannerText += '<div class="swiper-slide">\
                                        <img src="' + item + '">\
                                    </div>';
                    });
                    $(".swiper-wrapper").html(bannerText);
                    var swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: true,
                        autoplay:true,
                        loop : true,
                        autoplay : 7000,
                        speed:600,
                        autoplayDisableOnInteraction:false,
                        observer:true,//修改swiper自己或子元素时，自动初始化swiper
                        observeParents:true//修改swiper的父元素时，自动初始化swiper
                    });
                    $('.deal_text').text(res.data.title);
                    $('[name=dealPrice]').text(res.data.price);
                    $('[name=salesNum]').text(res.data.sales);
                    $('.style_modal_img img').attr('haoniu-lazy-data', res.data.thumb);
                    var paramhtml = '';
                    $.each(res.data.params, function (index, item) {
                        paramhtml += '<div class="deal_msg_list">\
                                        <div class="deal_msg_tabel">' + item.key + '</div>\
                                        <div class="deal_msg_text">' + item.value + '</div>\
                                    </div>';
                    });
                    $('.discuss_content_list.desc').html(paramhtml);
                    $('.deal_img_box').html(res.data.desc);
                    $('.discuss_head_list.rate').text('商品评价(' + res.data.comment + ')');
                    if(res.data.comment == 0){
                        $('.discuss_content_list.rate').html(noneTip('暂无评论'))
                    }
                    // 购买时选择
                    var optionshtml = '';
                    var optionsText = ''
                    $.each(res.data.options, function(index, item){
                        optionshtml += '<div class="style_list">\
                                            <div class="style_title">' + item.groupname + '</div>\
                                            <div class="style_text_box">';
                        $.each(item.option, function(index2,item2){
                            var isactive = index2 == 0?'active':'';
                            optionshtml += '<div class="style_text_list ' + isactive + '" data-option-id="' + item2.id + '">' + item2.optionname + '</div>';
                        });
                        optionshtml += '</div></div>';
                        optionsText += item.groupname
                        if(index < res.data.options.length - 1){
                            optionsText += ','
                        }
                    });
                    options = res.data.optionsrelation;
                    $('[name=deal_style]').text(optionsText)
                    $('.style_modal_body').prepend(optionshtml);
                    haoniuLazyLoading()
                } else{
                    blackHiht(res.message);
                }
                loadend()
            },
            error: function () {
                blackHiht('网络错误')
            }
        });
    }
    initialize();

    // 判断当前选择optionid
    function judge(){
        var nums = [];
        var length = $('.style_text_list.active').length;
        for(var i=0;i<length;i++){
            nums[i] = $('.style_text_list.active').eq(i).attr('data-option-id');
        }
        $.each(options, function(index,item){
            if(item.optionids.indexOf(nums[0]) != -1 && item.optionids.indexOf(nums[1]) != -1){
                // 更改库存和价格
                $('[name=dealPrice]').text(item.price);
                $('[name=surplus]').text(item.total);
                $('.style_modal_img img').attr('haoniu-lazy-data', item.thumb);
                optionid = item.id;
                haoniuLazyLoading()
            }
        })
        var optionsText = ''
        $.each($('.style_text_list.active'), function (index, item){
            optionsText += $(item).text()
            if(index < $('.style_text_list.active').length - 1){
                optionsText += ','
            }
        })
        $('[name=deal_style]').text(optionsText)
    }

    var goodsStatus = null;
    // 点击客服
    $('.deal_footer_list1.kefu').on('tap', function(){
        console.log('客服');
    });

    // 点击购物车
    $('.deal_footer_list1.cart').on('tap', function(){
        if(!getUserToken()){
            // 跳转到登录页
            doLogin()
        }else{
            // 跳转到购物车
            goShopping()
        }
    });

    // 加入购物车
    $(".join_car_btn").click(function(){
        $(".style_modal_box").show();
        judge();
        goodsStatus = 'join_cart';
        modelOpen();
    });

    // 点击购买弹出选择类型模态框
    $(".buy_btn").click(function(){
        $(".style_modal_box").show();
        judge();
        goodsStatus = 'buy';
        modelOpen();
    });



    // 确定
    $(".style_modal_box").on('tap','.style_modal_btn', function(){

        if(!getUserToken()){
            // 跳转到登录页
            doLogin()
        }else{
            var data = {
                goodsid: id,
                total: $('.deal_num').val(),
                optionid: optionid
            }
            // 如果是加入购物车
            if(goodsStatus == 'join_cart'){
                $.ajax({
                    url: _apiUrl + 'public/bgg/index/user/addbuycart',
                    beforeSend: function ( request ) {
                        request.setRequestHeader( "token", getUserToken() );
                    },
                    data: data,
                    dataType: 'JSON',
                    type: 'POST',
                    success: function(resstr) {
                        var res = null;
                        if (typeof resstr.result == "undefined") {
                            res = JSON.parse(resstr);
                        } else {
                            res = resstr;
                        }
                        if(res.code == 200){
                            $(".style_modal_box").hide();
                            modelClose();
                            blackHiht('加入购物车成功')
                        }else{
                            blackHiht(res.message)
                        }
                    },
                    error: function(){
                        blackHiht('网络错误')
                    }
                })
            // 如果是立即购买
            }else if(goodsStatus == 'buy'){
                location.href = '../my/order.html?from=web&goodsid=' + id + '&optionid=' + optionid + '&total=' + parseInt($(".deal_num").val());
            }
        }
    });

    // 关闭模态框
    $(".style_modal_box").on('tap',function(){
        $(".style_modal_box").hide();
        modelClose();
    });
    $(".style_modal_box").on('tap','.icon_modal_close',function(){
        $(".style_modal_box").hide();
        modelClose();
    });
    $(".style_modal_box").on('tap','.style_content',function(e){
        e.stopPropagation()
    });

    // 切换参数评论
    $(".discuss_head_list").click(function(){
        $(".discuss_head_list").removeClass("active");
        $(this).addClass("active");
        var thisIndex = $(this).index();
        $(".discuss_content_list").removeClass("active");
        $(".discuss_content_list").eq(thisIndex).addClass("active");
        // 评价
        if(thisIndex == 1){
            $('.deal_img_box').hide();
            getRateList()
        }else{
            $('.deal_img_box').show();
        }
    });

    // 点击选择类型按钮
    $(".style_modal_box").on('tap','.style_text_list',function(){
        $(this).closest(".style_text_box").find(".style_text_list").removeClass('active');
        $(this).addClass('active');
        judge()
        if($(".deal_num").val() >  parseInt($("span[name='surplus']").html())){
            $('.deal_num').val(parseInt($("span[name='surplus']").html()))
        }
    });
    // 点击加号
    $(".style_modal_box").on('tap','.icon_add',function(){
        var num = parseInt($(".deal_num").val());
        var restrict = parseInt($("span[name='surplus']").html());
        if(num < restrict){
            $(".deal_num").val( num + 1 );
        }else{
            blackHiht('数量超出范围')
        }
    });
    // 点击减号
    $(".style_modal_box").on('click','.icon_minus',function(){
        var num = parseInt($(".deal_num").val());
        if(num > 1){
            $(".deal_num").val( num - 1 );
        }
    });

    // 获取评价列表
    function getRateList(){
        $.ajax({
            url: _apiUrl + 'public/bgg/index/index/goodscomment',
            data: {
                id: id,
                page: 1,
                pagesize: 10
            },
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
                        var time = getTime2(item.commenttime);
                        html += '<div class="deal_discuss_list">\
                                    <div class="discuss_user_head">\
                                        <img src="' + item.avatar + '">\
                                        <div class="discuss_user_name">' + item.nickname + '</div>\
                                    </div>\
                                    <div class="discuss_text">' + item.commenttext + '</div>\
                                    <div class="discuss_img_list_box">\
                                        <div class="discuss_img_list">';

                            $.each(item.commentmedia,function (index2,item2) {
                                html += '<div class="discuss_img_box">\
                                            <img class="haoniu-lazy-data" haoniu-lazy-data="' + item2 + '">\
                                        </div>'
                            });
                        html += '</div></div><div class="discuss_time">' + time + '</div></div>'
                    });
                    if(res.data == ''){
                        html = noneTip('暂无评价')
                    }else{
                        html += '<a href="rate_list.html?from=web&id=' + id + '" class="all_discuss_btn">查看更多评价</a>';
                    }
                    $('.discuss_content_list.rate').html(html);
                    haoniuLazyLoading()
                }else{
                    blackHiht(res.message)
                }
            },
            error:  function(){
                blackHiht('网络错误')
            }
        })
    }
});
