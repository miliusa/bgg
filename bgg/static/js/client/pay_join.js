$(function(){
	loading()
	$.ajax({
		url: _apiUrl + 'public/bgg/index/index/syssetconfig',
		beforeSend: function (request) {
			request.setRequestHeader("token", getUserToken())
		},
		data: {
			type: 'priceset'
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
				$('[name=applyprice]').text('￥' + res.data.applyprice)
			}else{
				blackHiht(res.message)
			}
			loadend()
		},
		error: function () {
			blackHiht('网络错误')
		}
	})

	$('.pay_type').on('click', '.pay_list.active', function(){
		var $self = $(this)
		$(this).removeClass('active')
		$(this).children('.pay_draw').addClass('active').parent().siblings().children('.pay_draw').removeClass('active')
		var index = $(this).index();
		if(index == 0){
			// 支付宝支付
			$.ajax({
				url: _apiUrl + 'public/bgg/index/user/merchalipay',
				beforeSend: function (request) {
					request.setRequestHeader("token", getUserToken())
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
						$self.addClass('active')
						var str = res.data
						// 调用原生方法
						doAlipayPayment(str)
					}
				},
				error: function () {
					blackHiht('网络错误')
				}
			})
		}else{
			// 微信支付
			$.ajax({
				url: _apiUrl + 'public/bgg/index/user/merchwxpay',
				beforeSend: function (request) {
					request.setRequestHeader("token", getUserToken())
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
						$self.addClass('active')
						var str = JSON.stringify(res.data)
						// 调用原生方法
						doWeChatPayment(str)
					}
				},
				error: function () {
					blackHiht('网络错误')
				}
			})
		}
	})
})