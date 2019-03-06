$(function(){
	loading()
	var id = getUrl('id')
	var refundprice = 0
	var refundselectremark = ''
	function getDetail(){
		$.ajax({
			url: _apiUrl + 'public/bgg/index/user/orderdetail',
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
					$('span.return_price ').text('￥' + res.data.original_price)
					refundprice = res.data.original_price
					var html = ''
					$.each(res.data.ordergoods, function(index, item){
						html += '<div class="goods_info">\
									<div class="info_top clear">\
										<div class="fl goods_img">\
											<img class="haoniu-lazy-data" haoniu-lazy-data="' + item.goodsinfo.thumb + '" />\
										</div>\
										<div class="fr goods_desc">\
											<p class="goods_title">' + item.goodsinfo.title + '</p>\
											<p class="goods_num color_999">数量：<span>' + item.total + '</span></p>\
											<p class="goods_price price_color">￥' + item.price + '</p>\
										</div>\
									</div>\
									<div class="bottom_info">\
										<p class="goods_price">总价：<span class="price_color">￥' + item.total_price + '</span></p>\
									</div>\
								</div>'
					})
					$('.goods_list').html(html)
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
	getDetail()

	$('.default_btn_box').on('tap', '.default_btn.active', function () {
		$(this).removeClass('.active')
		var refundremark = $('.return_reason_input .textarea').val()
		$.ajax({
			url: _apiUrl + 'public/bgg/index/user/refundorder',
			beforeSend: function (request) {
				request.setRequestHeader("token", getUserToken())
			},
			data: {
				id: id,
				refundselectremark: refundselectremark,
				refundremark: refundremark,
				refundprice: refundprice
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
					location.replace('return_goods_list.html')
				}else{
					blackHiht(res.message)
				}
				$(this).addClass('.active')
			},
			error: function () {
				$(this).addClass('.active')
				blackHiht('网络错误')
			}
		})
	})

	$('.return_reason_select .fr').on('click', function () {
		$('.return_reason_select_modal').show()
	})

	$('.return_reason_select_modal').on('click', function (e) {
		e.stopPropagation()
		$(this).hide()
	})
	$('.return_reason_select_modal').on('click', '.return_reason_select_content', function (e) {
		e.stopPropagation()
	})
	$('.return_reason_select_modal').on('click', '.return_reason_item', function (e) {
		e.stopPropagation()
		refundselectremark = $(this).text()
		$('.return_reason_select .fr span').text($(this).text())
		$('.return_reason_select_modal').hide()
	})
	$('.return_reason_select_modal').on('click', '.close_modal', function (e) {
		e.stopPropagation()
		$('.return_reason_select_modal').hide()
	})
})