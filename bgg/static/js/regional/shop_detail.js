$(function () {
	loading()
	var id = getUrl('id')
	function init(){
		$.ajax({
			url: _apiUrl + 'public/bgg/index/partner/merchdetail',
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
					$('.shop_img img').attr('haoniu-lazy-data',res.data.avatar)
					$('[name=merchname]').text(res.data.newmerchname)
					$('[name=merchid]').text(res.data.id)
					$('[name=realname]').text(res.data.realname)
					$('[name=mobile]').text(res.data.mobile)
					$('[name=call]').attr('data-mobile', res.data.mobile)
					$('[name=address]').text(res.data.cityname + res.data.areadesc)
					$('[name=rate]').text(res.data.scroingavg)
					var memberhtml = ''
					$.each(res.data.memberid_thumb, function(index, item){
						memberhtml += '<div class="photo_box">\
									<img class="haoniu-lazy-data" haoniu-lazy-data="' + item + '" />\
								</div>'
					})
					$('.identification_photo .img_list_box').html(memberhtml)
					var btnhtml = ''
					if(res.data.status == -1){
						btnhtml = '<span class="refused active">已驳回</span>'
					}else if(res.data.status == 0){
						btnhtml = '<span class="refuse unrefused active fl">驳回</span>\
						<span class="agree unrefused active fr">同意</span>'
					}else if(res.data.status == 1){
						btnhtml = '<span class="access active">已同意</span>'
					}
					$('.btn_box').html(btnhtml)
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
	init()


	function disposeApply(status, apply_remark){
		$.ajax({
			url: _apiUrl + 'public/bgg/index/partner/disposemerchapply',
			beforeSend: function (request) {
				request.setRequestHeader("token", token)
			},
			data: {
				id: id,
				status: status,
				apply_remark: apply_remark
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
					init()
					$('.refuse_reason_modal').hide()
				}else{
					blackHiht(res.message)
				}
			},
			error: function () {
				blackHiht('网络错误')
			}
		})
	}
	// 同意
	$('.btn_box').on('click','.agree.active', function () {
		$(this).removeClass('active')
		disposeApply(1, null)
	})
	// 驳回
	$('.btn_box').on('click','.refuse.active', function () {
		$('.refuse_reason_modal').show()
	})
	$('.refuse_reason_modal').on('click', function (e) {
		e.stopPropagation()
		$(this).hide()
	})
	$('.modal_content').on('click', function (e) {
		e.stopPropagation()
	})
	$('[name=refuse_reason]').on('keyup', function () {
		if($(this).val() != ''){
			$('.confirm_btn').addClass('active')
		}else{
			$('.confirm_btn').removeClass('active')
		}
	})
	$('.modal_content').on('click', '.confirm_btn.active', function (e) {
		e.stopPropagation()
		var apply_remark = $('[name=refuse_reason]').val()
		disposeApply(-1, apply_remark)
	})
})