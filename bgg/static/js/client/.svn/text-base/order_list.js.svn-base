$(function(){
	loading()
	var page = 1;
	var pagesize = 10;
	var status = null
	var isshipments = 0
	var loadall = false
	var initIndex = 0
	if(getUrl('from') == 'app'){
		initIndex = getUrl('initIndex')
		$('.tab_item:eq(' + initIndex + ')').addClass('on').siblings().removeClass('on')
		// 全部
		if(initIndex == 0){
			status = null
			isshipments = 0
			//	待付款
		}else if(initIndex == 1){
			status = 0
			isshipments = 0
			//	待发货
		}else if(initIndex == 2){
			status = 2
			isshipments = 0
			//	待收货
		}else if(initIndex == 3){
			status = 2
			isshipments = 1
			//	已完成
		}else if(initIndex == 4){
			status = 4
			isshipments = 0
		}
	}
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
		$(this).addClass('on').siblings().removeClass('on');
		var index = $(this).index();
		// 全部
		if(index == 0){
			status = null
			isshipments = 0
		//	待付款
		}else if(index == 1){
			status = 0
			isshipments = 0
		//	待发货
		}else if(index == 2){
			status = 2
			isshipments = 0
		//	待收货
		}else if(index == 3){
			status = 2
			isshipments = 1
		//	已完成
		}else if(index == 4){
			status = 4
			isshipments = 0
		}
		pulldownRefresh()
	});

	function getOrderList(){
		var data = {
			page: page,
			pagesize: pagesize,
			status: status,
			isshipments: isshipments
		};
		$.ajax({
			url: _apiUrl + 'public/bgg/index/user/orderlist',
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
						var statusText = status == 0?'待付款':(status == 2 && item.isshipments == 0) || status == 1?'待发货':status == 2  && item.isshipments == 1?'待收货':status == 4?'已完成':'';
						html += '<div class="order_item" data-id="' + item.id + '">\
									<p class="ordersn">订单编号: <span>' + item.ordersn + '</span></p>'
						$.each(item.ordergoods, function(index1, item1){
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
										<p class="total_price color_999">合计：￥<span>' + item1.total_price + '</span></p>\
									</div>\
								</div>';
						})

						if(status == 0){
							html += '<div class="bottom_btns clear">\
										<button class="r_btn active pay fr">立即付款</button>\
										<button class="b_btn active cancel fr">取消订单</button>\
									</div>';
						}else if((status == 2 && item.isshipments == 0) || status == 1){
							html += '<div class="bottom_btns clear">\
										<button class="r_btn active remind fr">提醒发货</button>\
										<button class="b_btn active server fr">申请维权</button>\
									</div>'
						}else if(status == 2  && item.isshipments == 1){
							html += '<div class="bottom_btns clear">\
										<button class="r_btn active confirm_recive fr">确认收货</button>\
										<button class="b_btn active server fr">申请维权</button>\
									</div>'
						}else if(status == 4){
							html += '<div class="bottom_btns clear">'
							if(item.iscomment == 0){
								html += '<button class="r_btn active rate fr">评价</button>'
							}else{
								html += '<button class="r_btn active view_detail fr">查看详情</button>'
							}
							html += '<button class="b_btn active server fr">申请维权</button>\
									</div>'
						}
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
	$('.order_list').on('tap', '.top_info', function () {
		var orderid = $(this).parent().attr('data-id');
		location.href = 'order_detail.html?from=web&id=' + orderid;
	});

	// 取消订单
	$('.order_list').on('click', '.cancel.active', function () {
		var $self = $(this)
		$self.removeClass('active')
		var id = $(this).closest('.order_item').attr('data-id');
		confirmModal('确认取消该订单吗？',
		 	function(){
				$.ajax({
					url: _apiUrl + 'public/bgg/index/user/closeorder',
					beforeSend: function (request) {
						request.setRequestHeader("token", getUserToken())
					},
					data: {
						id: id,
					},
					dataType: 'JSON',
					type:'POST',
					success: function (resstr) {
						var res = null;
						if (typeof resstr.result == "undefined") {
							res = JSON.parse(resstr);
						} else {
							res = resstr;
						}
						if(res.code == 200){
							$self.closest('.order_item').remove()
							blackHiht('成功')
						}else{
							blackHiht(res.message)
						}
					},
					error: function(){
						blackHiht('网络错误')
						$self.addClass('active')
					}
				})
		 	},
			function () {
				$self.addClass('active')
			}
		)

	});

	// 立即付款
	$('.order_list').on('click', '.pay.active', function () {
		var id = $(this).closest('.order_item').attr('data-id');
		var ordersn = $(this).closest('.order_item').attr('ordersn-num');
		location.href = 'pay_type.html?from=web&orderid='+ id;
	});

	// 提醒发货
	$('.order_list').on('click', '.remind.active', function () {
		var id = $(this).closest('.order_item').attr('data-id');
		var $self = $(this)
		$self.removeClass('active')
		$.ajax({
			url: _apiUrl + 'public/bgg/index/user/sendordermessage',
			beforeSend: function (request) {
				request.setRequestHeader("token", getUserToken())
			},
			data: {
				id: id
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
					blackHiht('已成功提醒商家')
				}else{
					blackHiht(res.message)
				}
				$self.addClass('active')
			},
			error: function () {
				blackHiht('网络错误')
			}
		})
	});

	// 申请维权
	$('.order_list').on('click', '.server.active', function () {
		var id = $(this).closest('.order_item').attr('data-id');
		location.href = 'return_goods_detail.html?from=web&id='+ id;
	});

	// 确认收货
	$('.order_list').on('click', '.confirm_recive.active', function () {
		var $self = $(this)
		$self.removeClass('active')
		var id = $(this).closest('.order_item').attr('data-id');
		confirmModal('确认收货？',
			function(){
				$.ajax({
					url: _apiUrl + 'public/bgg/index/user/suresignin',
					beforeSend: function (request) {
						request.setRequestHeader("token", getUserToken())
					},
					data: {
						id: id,
					},
					dataType: 'JSON',
					type:'POST',
					success: function (resstr) {
						var res = null;
						if (typeof resstr.result == "undefined") {
							res = JSON.parse(resstr);
						} else {
							res = resstr;
						}
						if(res.code == 200){
							$self.closest('.order_item').remove()
							blackHiht('收货成功')
						}else{
							blackHiht(res.message)
						}
					},
					error: function(){
						blackHiht('网络错误')
						$self.addClass('active')
					}
				})
			},
			function () {
				$self.addClass('active')
			}
		)
	});

	// 评价
	$('.order_list').on('click', '.rate.active', function () {
		var id = $(this).closest('.order_item').attr('data-id');
		doComment(id)
	});

	$('.order_list').on('click', '.view_detail', function () {
		var id = $(this).closest('.order_item').attr('data-id');
		location.href = 'order_detail.html?from=web&id=' + id
	})

});