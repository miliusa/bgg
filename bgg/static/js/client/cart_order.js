$(function(){
	loading()
	var cartText = getUrl('cartids')
	var couponid = null
	var addressid = sessionStorage.getItem('addressid') || null

	function initPage(){
		// 初始化数据
		$.ajax({
			url: _apiUrl + 'public/bgg/index/user/getsubmitbuycartdata',
			beforeSend: function (request) {
				request.setRequestHeader("token", getUserToken())
			},
			data: {
				carts: cartText,
				addressid: addressid,
				couponid: couponid
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
					// 库存
					// 用户地址信息
					if(res.data.defaultaddress == ''){
						$('.tips').show()
					}else{
						sessionStorage.setItem('addressid', res.data.defaultaddress.id)
						addressid = res.data.defaultaddress.id
						getAddressInfo( addressid )
					}
					 // 商品信息
					var html = ''
					 $.each(res.data.goodslist, function(index, item){
					 	html += '<div class="goods">\
									<div class="goods_content clear">\
								 		<div class="goods_left">\
								 			<img class="haoniu-lazy-data" haoniu-lazy-data="' + item.goodsinfo.thumb + '" />\
								 		</div>\
										<div class="goods_des">\
											 <div class="goods_title">' + item.goodsinfo.title + '</div>\
											 <div class="goods_text cart clear">\
												 <p class="goods_price">¥<span>' + item.goodsinfo.price + '</span></p>\
										 	 </div>\
								 		</div>\
									</div>\
									<div class="price">\
										<div class="count">共<span>' + item.total + '</span>件商品  小计<span class="price_color">¥' + item.total_price + '</span></div>\
									</div>\
								 </div>'
					 })
					$('.goods_list').html(html)
					haoniuLazyLoading()
					$('[name=total_price]').text('￥' + res.data.original_price);
					// 合计
					$('[name=pay_price]').text(res.data.price);
				}else{
					// blackHiht(res.message)
					app.appCancelPay()
				}
				loadend()
			},
			error: function () {
				blackHiht('网络错误')
			}
		});
	}
	initPage()


	function getAddressInfo(id){
		$.ajax({
			url: _apiUrl + 'public/bgg/index/user/addressdetail',
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
					// 用户地址信息
					$('.user_info .user_name').text(res.data.realname);
					$('.user_info .user_phone').text(res.data.mobile);
					$('.address_text').text(res.data.provincename + ' ' +  res.data.cityname + ' ' + res.data.areaname);
				}else{
					blackHiht(res.message)
				}
			},
			error: function () {
				blackHiht('网络错误')
			}
		})
	}

	//立即支付
	$('.foot').on('tap','.foot_btn.active', function(){
		var $self = $(this)
		$self.removeClass('active')
		var remark = $('[name=remark]').val();
		if(!addressid){
			blackHiht('请选择收货地址')
		}else{
			$.ajax({
				url: _apiUrl + 'public/bgg/index/user/submitbuycart',
				beforeSend: function(request){
					request.setRequestHeader("token", getUserToken())
				},
				data: {
					carts: cartText,
					remark: remark,
					addressid: addressid,
					couponid: couponid
				},
				dataType: 'JSON',
				type: 'POST',
				success: function (resstr) {
					var res = null;
					if (typeof resstr.result == "undefined") {
						res = JSON.parse(resstr);
					} else {
						res = resstr;
					}
					if(res.code == 200){
						location.href = 'pay_type.html?from=web&orderid=' + res.data.id
					}else{
						blackHiht(res.message)
					}
					$self.addClass('active')
				},
				error: function () {
					blackHiht('网络错误')
					$self.addClass('active')
				}
			});
		}

	})

	// 选择优惠券
	$('[name=select_coupon]').on('tap', function () {
		$.ajax({
			url: _apiUrl + 'public/bgg/index/user/getbuycartcoupon',
			beforeSend: function (request) {
				request.setRequestHeader("token", getUserToken())
			},
			data: {
				carts: cartText
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
					var html = ''
					$.each(res.data, function(index, item){
						html += '<li class="coupon_item clear" data-coupon-id="' + item.id + '">\
									<span class="value fl" data-coupon-value="￥' +item.deduction + '">￥' + item.deduction + ': 满' + item.used_minprice + '-' + item.deduction + '元</span>\
									<span class="sel_icon fr"></span>\
								</li>'
					})
					html += '<li class="coupon_item clear" data-coupon-id="0">\
									<span class="value fl" data-coupon-value="不使用优惠">不使用优惠</span>\
									<span class="sel_icon fr"></span>\
								</li>'
					$('.coupon_list').html(html)
					$('.coupon_select_modal').show()
				}else{
					blackHiht(res.message)
				}
				loadend()
			},
			error: function () {
				blackHiht('网络错误')
			}
		})

	})

	$('.coupon_select_modal').on('click', function (e) {
		e.stopPropagation()
		$(this).hide()
	})
	$('.coupon_select_modal').on('click', '.coupon_select_content', function (e) {
		e.stopPropagation()
	})
	$('.coupon_select_modal').on('click', '.coupon_item', function (e) {
		e.stopPropagation()
		$(this).children('.sel_icon').addClass('active').parent().siblings().children('.sel_icon').removeClass('active')
		couponid = $(this).attr('data-coupon-id')
		initPage()
		$('[name=coupon_value]').text($(this).children('.value').attr('data-coupon-value'))
		$('.coupon_select_modal').hide()
	})
	$('.coupon_select_modal').on('click', '.close_modal', function (e) {
		e.stopPropagation()
		$('.coupon_select_modal').hide()
	})

});
