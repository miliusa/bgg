$(function(){
	loading()
	//商品数量
	var price = 100000;
	var goodsid = getUrl('goodsid');
	var optionid = getUrl('optionid');
	var total = getUrl('total');
	var optiontotal = 0
	var couponid = null
	var addressid = sessionStorage.getItem('addressid') || null


	function initPage(){
		// 初始化数据
		$.ajax({
			url: _apiUrl + 'public/bgg/index/user/getsubmitorderdefaultdata',
			beforeSend: function (request) {
				request.setRequestHeader("token", getUserToken())
			},
			data: {
				goodsid: goodsid,
				optionid: optionid,
				total: total,
				couponid: couponid,
				addressid: addressid
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
					price = parseInt(res.data.optioninfo.price || res.data.goodsinfo.price);
					// 库存
					optiontotal = res.data.optioninfo.total || res.data.goodsinfo.total;
					// 用户地址信息
					if(res.data.defaultaddress == ''){
						$('.tips').show()
					}else{
						sessionStorage.setItem('addressid', res.data.defaultaddress.id)
						addressid = res.data.defaultaddress.id
						getAddressInfo( addressid )
					}

					// 商品信息
					$('.goods_left img').attr('src', res.data.goodsinfo.thumb);
					$('.goods_des .goods_title').text(res.data.goodsinfo.title);
					$('.goods_des .goods_price span').text(res.data.optioninfo.price || res.data.goodsinfo.price);
					$('[name=count]').val(res.data.defaulttotal);
					$('.price .count span').text(res.data.defaulttotal);
					$('[name=total_price]').text('￥' + res.data.goods_total_price);
					// 合计
					$('[name=pay_price]').text(res.data.total_price);
				}else{
					blackHiht(res.message)
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
					$('.address_text').text(res.data.provincename + ' ' +  res.data.cityname + ' ' + res.data.areaname + ' ' + res.data.address);
				}else{
					blackHiht(res.message)
				}
			},
			error: function () {
				blackHiht('网络错误')
			}
		})
	}
	/* 数量加减 */
	$('.subtract').click(function(){
		if(total > 1){
			total--
			initPage()
		}
	});

	$('.add').click(function(){
		if(total < optiontotal){
			total++;
			initPage()
		}else{
			blackHiht('库存不足')
		}
	});

	//立即支付
	$('.foot').on('tap','.foot_btn.active', function(){
		var $self = $(this)
		$(this).removeClass('active')
		var total = $("[name=count]").val();
		var remark = $('[name=remark]').val();
		if(!addressid){
			blackHiht('请选择收货地址')
			$(this).addClass('active')
		}else{
			$.ajax({
				url: _apiUrl + 'public/bgg/index/user/createorder',
				beforeSend: function(request){
					request.setRequestHeader("token", getUserToken())
				},
				data: {
					remark: remark,
					goodsid: goodsid,
					total: total,
					addressid: addressid,
					optionid: optionid,
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
					$(this).addClass('active')
				}
			});
		}
	})

	// 选择优惠券
	$('[name=select_coupon]').on('tap', function () {
		$.ajax({
			url: _apiUrl + 'public/bgg/index/user/createordercoupon',
			beforeSend: function (request) {
				request.setRequestHeader("token", getUserToken())
			},
			data: {
				goodsid: goodsid,
				total: total,
				optionid: optionid
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
