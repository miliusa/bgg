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
				var html = ''
				var status = res.data.status
				var isshipments = res.data.isshipments
				var statusText = status == 1?'待抢单': status == 2 && isshipments == 0?'待发货':status == 2 && isshipments == 1?'待收货':status == 4?'已完成':''
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
				/*if(status == 1){
					$('.red_btn').text('立即抢单').addClass('grab_order')
				}else if(status == 2 && isshipments == 0){
					$('.red_btn').text('立即发货').addClass('deliver_goods')
				}else if(status == 2 && isshipments == 1){
					$('.red_btn').text('确认收货').addClass('confirm_resolve')
				}else if(status == 4){
					$('.red_btn').text('订单完成')
				}*/
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
})