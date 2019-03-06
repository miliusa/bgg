$(function () {
	loading()
	var id = getUrl('id')
	// var ordersn_code = null
	$.ajax({
		url: _apiUrl + 'public/bgg/index/merch/orderdetail',
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
				// 商品详情
				var html = ''
				$.each(res.data.ordergoods, function (index,item) {
					html += '<div class="goods_info">\
					<div class="info_top clear">\
						<div class="fl goods_img">\
							<img class="haoniu-lazy-data" haoniu-lazy-data="' + item.goodsinfo.thumb + '" />\
						</div>\
						<div class="fr goods_desc">\
							<p class="goods_title">' + item.goodsinfo.title + '</p>\
							<p class="goods_num color_999">数量：<span>' + item.total + '</span></p>\
							<p class="goods_price"><span class="price_color">￥' + item.price + '</span></p>\
						</div>\
					</div>\
					<div class="bottom_info">\
						<p class="goods_price">合计 <span class="price_color">￥' + item.total_price + '</span></p>\
					</div>\
				</div>'
                })
				$('.order_list').html(html)
				// 商品总价
				$('.price_info .goods_price .fr').text('￥' + res.data.ordergoods[0].price)
				$('[name=copy]').attr('data-copy', res.data.ordersn)
				// 优惠券
				$('.price_info .coupon_value .fr').text('￥' + res.data.discountsprice)
				// 订单总价
				$('.price_info .total_price .fr').text('￥' + res.data.original_price)
				// 已支付
				$('.total_pay .fr').text('￥' + res.data.original_price)
				$('.ordersn_num span').text(res.data.ordersn)
				$('.create_time').text('创建时间：' + getTime(res.data.createtime))
				var status = res.data.status
				var btnhtml = ''
				if(status == 2 && res.data.isshipments == 0){
					$('.pay_time').text('付款时间：' + getTime(res.data.paytime))
					btnhtml = '<button class="r_btn active send fr">立即发货</button>'
				}else if(status == 2 && res.data.isshipments == 1){
					$('.pay_time').text('付款时间：' + getTime(res.data.paytime))
					$('.translate_time').text('发货时间：' + getTime(res.data.receivetime))
					$('.reciver_info').show()
					$('[name=name]').text(res.data.realname)
					$('[name=phone]').text(res.data.mobile)
					$('[name=address]').text(res.data.provincename + res.data.cityname + res.data.areaname + res.data.address)
					$('[name=call]').attr('data-mobile', res.data.mobile)
					btnhtml = '<button class="r_btn active confirm_recive fr">确认送达</button>'
				}else if(status == 4){
					$('.pay_time').text('付款时间：' + getTime(res.data.paytime))
					$('.translate_time').text('发货时间：' + getTime(res.data.receivetime))
					$('.complete_time').text('成交时间：' + getTime(res.data.receivedtime))
					if(res.data.iscommentuser == 1){
						btnhtml = '<a class="r_btn view_rate fr" href="rate_detail.html?from=web&id=' + id + '">查看评价</a>'
					}else{
						btnhtml = '<button class="r_btn active rate fr">评价</button>'
					}
				}
				$('.btn_box').html(btnhtml)
				haoniuLazyLoading()
				loadend()
			}else{
				blackHiht(res.message)
			}
		},
		error: function () {
			blackHiht('网络错误')
		}
	})
	// 立即发货
	$('.btn_box').on('tap', '.send.active', function () {
		var $self = $(this)
		$self.removeClass('active')
		confirmModal('确认发货吗？',
			function () {
				$.ajax({
					url: _apiUrl + 'public/bgg/index/merch/shipmentsorder',
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
							blackHiht('发货成功')
							location.reload()
						}else{
							blackHiht(res.message)
						}
						$self.addClass('active')
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
	})

	// 确认收货
	$('.btn_box').on('click', '.confirm_recive.active', function () {
		$('.recive_code_input_modal').show()
	});

	// 关闭模态窗
	$('.recive_code_input_modal').on('tap', function (e) {
		e.stopPropagation()
		$(this).hide()
        $('[name=recive_code]').val('')
    })
    $('.cancel_recive_code_btn').on('tap', function (e) {
        e.stopPropagation()
        $('.recive_code_input_modal').hide()
        $('[name=recive_code]').val('')
    })


	$('.recive_code_input_content').on('tap', function (e) {
        e.stopPropagation()
        $('[name=recive_code]').val('')
    })

	// 扫码确认收货
	$('.scan_code').on('tap', function () {
		openQrCode()
	})
	
	// 确定收货
    $('.recive_code_btn_box').on('tap','.recive_code_btn.active', function (e) {
    	e.stopPropagation()
    	var $self = $(this)
		$self.removeClass('active')
    	var ordersn_code = $('[name=recive_code]').val()
		if(ordersn_code){
			$.ajax({
				url: _apiUrl + 'public/bgg/index/merch/suredelivery',
				beforeSend: function (request) {
					request.setRequestHeader("token", getUserToken())
				},
				data: {
					ordersn_code: ordersn_code,
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
						blackHiht('收货成功')  
						location.reload()
					}else{
						blackHiht(res.message)
						$('[name=recive_code]').val('')
					}
					$self.addClass('active')
				},
				error: function(){
					blackHiht('网络错误')
					$self.addClass('active')
				}
			})
		}else{
			blackHiht('请输入收货码')
			$self.addClass('active')
		}

    })

	// 评价
	$('.btn_box').on('click', '.rate.active', function () {
		location.href = 'rate.html?from=web&id=' + id
	});
})