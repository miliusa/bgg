$(function(){
    loading()
  //  初始化数据
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
    		    var isDefaultAddress = item.isdefault == 1? 'active':'notactive'
                var isDefaultAddressText = item.isdefault == 1?'默认地址':'设为默认'
    			html += '<div class="list" data-id="' + item.id + '">\
                            <div class="info">\
                                <div class="info_text">\
                                    <div class="info_user">' + item.realname + ' ' + item.mobile + '</div>\
                                    <div class="address_center">' + item.provincename + ',' + item.cityname + ',' + item.areaname + ' ' + item.address + '</div>\
                                </div>\
                                <div class="info_delete active"></div>\
                            </div>\
                            <div class="default clear">\
                                <div class="default_block fl ' + isDefaultAddress + '">\
                                    <span class="default_icon"></span>\
                                    <span class="default_text">' + isDefaultAddressText + '</span>\
                                </div>\
                                <div class="default_block fr">\
                                    <a href="alter_address.html?id=' + item.id + '">\
                                        <span class="default_redact">编辑</span>\
                                    </a>\
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
    // 设为默认地址
    $('.body_box').on('click', '.default_block.notactive', function(){
        var $self = $(this)
        var id = $self.parent().parent().attr('data-id')
        confirmModal(
            '确认更改默认地址吗？',
            function(){
                var data = {
                    id: id,
                    isdefault: 1
                };
                $.ajax( {
                    url: _apiUrl + 'public/bgg/index/user/updateaddress',
                    data: data,
                    beforeSend: function ( request ) {
                        request.setRequestHeader( "token", getUserToken() );
                    },
                    dataType: 'JSON',
                    type: 'POST',
                    success: function ( resstr ) {
                        var res = null;
                        if (typeof resstr.result == "undefined") {
                            res = JSON.parse(resstr);
                        } else {
                            res = resstr;
                        }
                        if(res.code == 200){
                            $self.parent().parent().siblings().children().children('.default_block.active').removeClass('active').addClass('notactive')
                            $self.parent().parent().siblings().children().children('.default_block.active').children('.default_text').text('设为默认')
                            $self.addClass('active').removeClass('notactive')
                            $self.children('.default_text').text('默认地址')
                        }else{
                            blackHiht( res.message )
                        }
                    },
                    error: function () {
                        blackHiht('网络错误')
                    }
                } )
            },
            function(){

            }
        )
    });
    // 删除地址
    $('.body_box').on('click', '.info_delete.active', function(){
        var $self = $(this)
        $self.removeClass('active');
        var id = $(this).closest('.list').attr('data-id');
        confirmModal(
            '确认删除该地址吗？',
            function(){
                $.ajax( {
                    url: _apiUrl + 'public/bgg/index/user/deleteaddress',
                    beforeSend: function ( request ) {
                        request.setRequestHeader( "token", getUserToken() );
                    },
                    data: {
                        id: id
                    },
                    dataType: 'JSON',
                    type: 'POST',
                    success: function ( resstr ) {
                        var res = null;
                        if (typeof resstr.result == "undefined") {
                            res = JSON.parse(resstr);
                        } else {
                            res = resstr;
                        }
                        if(res.code == 200){
                            blackHiht('删除成功')
                            $self.parent().parent().remove()
                        }else{
                            blackHiht( res.message )
                        }
                        $self.addClass('active')
                    },
                    error: function () {
                        blackHiht('网络错误')
                    }
                } )
            },
            function(){
                $self.addClass('active');
            }
        )
    })
});
