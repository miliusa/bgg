$(function(){
	loading()
	var id = getUrl('id')
	$.ajax({
		url: _apiUrl + 'public/bgg/index/partner/orderdetail',
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
				var statusText = res.data.refundstatus == 1?'待处理':'已处理'
				$.each(res.data.ordergoods, function (index, item) {
					html += ' <div class="info_top clear">\
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
				if(res.data.refundstatus != 1){
					$('.default_btn_box').hide()
				}
				$('.return_desc .select_reason_text').text(res.data.refundselectremark || '未选择')
				$('.return_desc .reason_text').text(res.data.refundremark)
				$('.return_desc .price_text').text('￥' + res.data.refundprice)
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

	// 同意
	$('.agree.active').on('tap', function () {
		var $self = $(this)
		$self.removeClass('active')
		confirmModal(
			'确定同意退款吗？',
			function () {
				$.ajax({
					url: _apiUrl + 'public/bgg/index/partner/surerefund',
					beforeSend: function (request) {
						request.setRequestHeader("token", getUserToken())
					},
					data: {
						id: id,
						refundstatus: 2
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
							blackHiht('成功')
							location.reload()
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
	// 驳回
	$('.refuse.active').on('tap', function () {
		location.href = 'return_goods_refuse.html?from=web&id=' + id
	})
})