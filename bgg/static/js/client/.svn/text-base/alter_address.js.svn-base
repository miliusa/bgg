$(function() {
	loading()
	var id = getUrl('id');
	var isdefault = 0;
	//设为默认地址
	$('.default').click(function() {
		if(isdefault === 0) {
			$(this).find('span').addClass('active');
      		isdefault = 1
		} else if(isdefault === 1) {
			$(this).find('span').removeClass('active');
      		isdefault = 0
		}
	});

	// 初始化地址信息
  $.ajax( {
    url: _apiUrl + 'public/bgg/index/user/addressdetail',
    beforeSend: function ( request ) {
      request.setRequestHeader( "token", getUserToken() );
    },
	data: {
		id: id
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
        $('.realname').val(res.data.realname);
        $('.mobile').val(res.data.mobile);
        $('#cityname').val(res.data.cityname);
        $('.address').val(res.data.address);
		if(res.data.isdefault == 1) {
			$('.default span').addClass('active')
		}
      }else{
	    blackHiht( res.message )
	  }
	  loadend()
    },
    error: function () {
      blackHiht('网络错误')
    }
  } );
	//	 删除
	$('.delete.active').on('click', function(){
		$(this).removeClass('active');
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
					location.replace('address.html?from=web')
				}else{
					blackHiht( res.message )
				}
			},
			error: function () {
				blackHiht('网络错误')
			}
		} )
	})
	// 修改
	$('.save.active').on('click',function(){
		$(this).removeClass('active');
		var realname = $( '.realname' ).val();
		var mobile = $( '.mobile' ).val();
		var address = $('.address').val();

		var areaText = $("#cityname").val();
		var prov = areaText.split(",")[0];
		var city = areaText.split(",")[1];
		var area = areaText.split(",")[2];
		var addressCode = $("#value").val();
		var provCode = addressCode.split(",")[0];
		var cityCode = addressCode.split(",")[1];
		var areaCode = addressCode.split(",")[2];
		var data = {
			id: id,
			mobile: mobile,
			address: address,
			realname: realname,
			provincename: prov,
			provinceid: provCode,
			cityname: city,
			cityid: cityCode,
			areaname: area,
			areaid: areaCode,
			isdefault: isdefault
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
					location.replace('address.html?from=web')
				}else{
					blackHiht( res.message )
				}
			},
			error: function () {
				blackHiht('网络错误')
			}
		} )
	})
})