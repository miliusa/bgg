$(function(){
  loading()
  //  初始化数据
  var addressid = sessionStorage.getItem('addressid')
  lastUrl()
  $.ajax( {
    url: _apiUrl + 'public/bgg/index/user/getaddress',
    beforeSend: function ( request ) {
      request.setRequestHeader( "token", getUserToken() );
    },
	dataType: 'JSON',
    type: 'GET',
    success: function ( resstr ) {
        var res = null;
        if (typeof resstr.result == "undefined") {
            res = JSON.parse(resstr);
        } else {
            res = resstr;
        }
    	if(res.code == 200){
    		var html = '';
    		$.each(res.data, function(index, item) {
    		    var isDefault = item.id == addressid? 'default':'notdefault'
    			html += '<div class="list '+ isDefault + '" data-id="' + item.id + '">\
                            <div class="info">\
                                <div class="info_text">\
                                    <div class="info_user">' + item.realname + ' ' + item.mobile + '</div>\
                                    <div class="address_center">' + item.cityname + '' + item.address + '</div>\
                                </div>\
                            </div>\
                        </div>'
				});
				$('.body_box').html(html)
      }else{
          blackHiht(res.message)
      }
      loadend()
    },
    error: function () {
      blackHiht('网络错误')
    }
  } );

    $('.body_box').on('tap', '.list', function(){
        var addressid = $(this).attr('data-id');
        sessionStorage.setItem('addressid', addressid);
        if(sessionStorage.getItem('addressid')){
            history.back()
        }
    })
});
