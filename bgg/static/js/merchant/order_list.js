$(function(){
	var page = 1;
	var pagesize = 10;
	var initstatus = null
	var isshipments = null
	var isrefund = false
	var loadall = false
	var timer = []
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
	$('.tabbar').on('click', '.tab_item', function(){
		loading()
		$(this).addClass('on').siblings().removeClass('on')
		var index = $(this).index();
		if(index == 0){
			initstatus = null
			isrefund = 0
			isshipments = null
		}else if(index == 1){
			initstatus = 2
			isshipments = 1
			isrefund = 0
		}else if(index == 2){
			initstatus = 4
			isrefund = 0
			isshipments = null
		}else if(index == 3){
			initstatus = null
			isrefund = 1
			isshipments = null
		}
		pulldownRefresh()
	})
	function getOrderList(){
		var data = {
			page: page,
			pagesize: pagesize,
			status: initstatus,
			isrefund: isrefund,
			isshipments: isshipments
		};
		$.ajax({
			url: _apiUrl + 'public/bgg/index/merch/orderlist',
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
						var status = item.status;
						var statusText = null
						statusText = item.refundstatus == 1?'维权中':item.refundstatus == 2?'已处理':status == 2 && item.isshipments == 0?'待发货':status == 2  && item.isshipments == 1?'待收货':status == 4?'已完成':'';
						html += '<div class="order_item" data-id="' + item.id + '">'
						$.each(item.ordergoods, function (index2, item2) {
							html += '<div class="top_info clear">\
										<div class="img_box fl">\
											<img class="haoniu-lazy-data" haoniu-lazy-data="' + item2.goodsinfo.thumb + '"/>\
										</div>\
										<div class="center_info fl">\
											<p class="title">' + item2.goodsinfo.title + '</p>\
											<p class="count_price">\
												<span class="count">数量： ' + item2.total + '</span>\
												<span class="price price_color">￥' + item2.price + '</span>\
											</p>\
											<p class="address color_999">地址：' + item.provincename + item.cityname + item.areaname + item.address + '</p>\
										</div>\
										<div class="left_info fl">\
											<p class="order_status">' + statusText + '</p>'
							if(status == 2 && item.isshipments == 1 && item.refundstatus == 0){
								html += '<div class="countdown" data-time="' + item.predictshipmentstime + '">\
										<span class="hour time">00</span>\
										<span class="point">:</span>\
										<span class="minute time">00</span>\
										<span class="point">:</span>\
										<span class="second time">00</span>\
									</div>'
							}
							html += '</div></div>'
						})
						html += '</div>';
					});
					loadall = false;
					if(res.data == '' || res.data.length < pagesize){
						loadall = true;
						if(page != 1){
							blackHiht("没有更多数据了");
						}
					}
					if(page == 1){
						if(res.data == ''){
							html = noneTip()
						}
						$('.order_list').html(html);
						mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
					}else{
						$('.order_list').append(html);
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}
					var nowtime = parseInt((new Date()).getTime()/1000)
					$.each($('.order_list .countdown'), function (index, item) {
						clearInterval(timer[index])
						var time = ($(item).attr('data-time') - nowtime)*1000
						timer[index] = setInterval(function () {
							var hour = parseInt(time/1000/60/60%60)
							var minute = parseInt(time/1000/60%60)
							var second = parseInt(time/1000%60)
							$(item).children('.time.hour').text(hour)
							$(item).children('.time.minute').text(minute)
							$(item).children('.time.second').text(second)
							time-=1000
							if(time < 1000){
								clearInterval(timer[index])
							}
						}, 1000)
					})
					haoniuLazyLoading()
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
			getOrderList();
		}
	}

	/** 下拉刷新 */
	function pulldownRefresh() {
		page = 1;
		getOrderList();
		$('.mui-scroll').css('transform', 'translate3d(0px, 0px, 0px) translateZ(0px)');
	}

	// 点击订单进入订单详情
	$('.order_list').on('tap', '.order_item', function () {
		var orderid = $(this).attr('data-id');
		var url = ''
		if(isrefund == 1){
			url = 'return_goods_detail.html'
		}else{
			url = 'order_detail.html'
		}
		location.href = url + '?from=web&id=' + orderid;
	});


})