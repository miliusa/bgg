$(function () {
    var id = getUrl('id')
    $('.confirm_btn').on('tap', function () {
        location.href = 'rate_detail.html?from=web&id=' + id
    })
})