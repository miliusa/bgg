$(function () {
    var type = getUrl('type')
    $('.apply_btn.active').on('tap', function () {
        if(type == 1){
            goBusinessApply()
        }else if(type == 2){
            goPartnerApply()
        }
    })
})