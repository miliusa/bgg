$(function(){
	// loading()
	var id = getUrl('id')
	$.ajax({
		url: _apiUrl + 'public/bgg/index/partner/breachorderdetail',
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
				var html = ''
				var statusText = res.data.status == 1?'已处理':'待处理'
				$('[name=ordersn]').text(res.data.ordersn)
				$.each(res.data.ordergoods, function (index, item) {
					html += '<div class="info_top clear">\
								<div class="fl goods_img">\
									<img class="haoniu-lazy-data" haoniu-lazy-data="' + item.goodsinfo.thumb + '" />\
								</div>\
								<div class="fr goods_desc">\
									<p class="goods_title">' + item.goodsinfo.title + '</p>\
									<p class="goods_num"></p>\
									<p class="goods_price clear">\
										<span class="price_color fl">￥' + item.price + '</span>\
										<span class="status fr">' + item.total + '件 ' + statusText + '</span>\
									</p>\
								</div>\
							</div>'
				})
				$('.goods_info').html(html)
				// 地址
				$('[name=address]').text(res.data.provincename + res.data.cityname + res.data.areaname + ' ' + res.data.address)
				// 电话
				$('[name=phone]').text(res.data.mobile || '暂无')
				// 电话
				$('[name=deposit]').text('￥' + res.data.deposit)
				if(res.data.status == -1){
					$('.default_btn_box').hide()
				}
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

	// 确认扣款
	$('.agree.active').on('tap', function () {
		var $self = $(this)
		$self.removeClass('active')
		confirmModal(
			'确认扣款吗？',
			function () {
				$.ajax({
					url: _apiUrl + 'public/bgg/index/partner/applybreachorder',
					beforeSend: function (request) {
						request.setRequestHeader("token", getUserToken())
					},
					data: {
						id: id,
						status: 1
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
							blackHiht('扣款成功')
							location.href = 'order_list.html'
						}else{
							blackHiht(res.message)
						}
					},
					error: function () {
						blackHiht('网络错误')
					}
				})
			},
			function () {
				$self.addClass('active')
			}
		)
	})
	// 取消扣款
	$('.refuse.active').on('tap', function () {
		var $self = $(this)
		$self.removeClass('active')
		confirmModal(
			'确认取消吗？',
			function () {
				$.ajax({
					url: _apiUrl + 'public/bgg/index/partner/applybreachorder',
					beforeSend: function (request) {
						request.setRequestHeader("token", getUserToken())
					},
					data: {
						id: id,
						status: 2
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
							blackHiht('处理成功')
							location.href = 'order_list.html'
						}else{
							blackHiht(res.message)
						}
					},
					error: function () {
						blackHiht('网络错误')
					}
				})
			},
			function () {
				$self.addClass('active')
			}
		)
	})
	/*$('.resolve_btn').on('click', function(){
		$('.deduct_deposit_modal').show()
		$('.deduct_deposit_modal input').on('input propertychange', function(e){
			var val = $(e.target).val()
			if(val != null){
				$(this).siblings('.confirm_btn').addClass('active')
			}
		})
	})
	$('.deduct_deposit_modal').on('click', '.confirm_btn.active', function(){
		$('.deduct_deposit_modal').hide()
	})*/
})