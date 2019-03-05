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
					var time = getTime(res.data.createtime)
					$('.goods_img img').attr('haoniu-lazy-data', res.data.ordergoods[0].goodsinfo.thumb)
					$('.goods_desc .goods_title').text(res.data.ordergoods[0].goodsinfo.title)
					$('.goods_desc .goods_num span').text(res.data.ordergoods[0].total)
					$('.goods_desc .goods_price').text('￥' + res.data.ordergoods[0].price)
					$('.return_desc .return_price ').text('￥' + res.data.original_price)
					$('.bottom_info .goods_price span').text('￥' + res.data.ordergoods[0].total_price)
					refundprice = res.data.ordergoods[0].total_price
					$('span.return_price').text('￥' + res.data.refundprice)
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