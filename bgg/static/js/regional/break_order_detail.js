$(function(){
	haoniuLazyLoading()
	$('.resolve_btn').on('click', function(){
		$('.deduct_deposit_modal').show()
		$('.deduct_deposit_modal input').on('input propertychange', function(e){
			let val = $(e.target).val()
			if(val != null){
				$(this).siblings('.confirm_btn').addClass('active')
			}
		})
	})
	$('.deduct_deposit_modal').on('click', '.confirm_btn.active', function(){
		$('.deduct_deposit_modal').hide()
	})
})