$(function(){
	$('.pay_type').on('click', '.pay_list', function(){
		$(this).children('.pay_draw').addClass('active').parent().siblings().children('.pay_draw').removeClass('active')
	})
})