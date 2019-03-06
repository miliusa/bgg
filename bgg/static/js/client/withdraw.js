$(function(){
	$('.pay_type').on('click', '.pay_list', function(){
		$(this).children('.pay_draw').addClass('active').parent().siblings().children('.pay_draw').removeClass('active')
		location.href = 'withdraw_card.html?from=web'
		/*if($(this).index() == 0){
			location.href = 'withdraw_alipay.html?from=web&type=1'
		}else{
			location.href = 'withdraw_wechat.html?from=web&type=2'
		}*/
	})
})