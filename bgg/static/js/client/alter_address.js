$(function() {
	loading()
	var id = getUrl('id');
	var isdefault = 0;
    var phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/
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

	// 选择地址
	$('#addressInfo').on('tap', function () {
		goSelectAddress()
	})

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
        $('#addressInfo').val(res.data.provincename + ',' + res.data.cityname + ',' + res.data.areaname);
		$('#longitude').val(res.data.lng)
		$('#latitude').val(res.data.lat)
        $('#detailAddressInfo').val(res.data.address);
	    isdefault = res.data.isdefault
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
					location.replace('address.html')
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
	    var $self = $(this)
		var realname = $( '.realname' ).val();
		var mobile = $( '.mobile' ).val();
		var longitude = $("#longitude").val();
		var latitude = $("#latitude").val();
		var addressInfo = $("#addressInfo").val();
		var prov = addressInfo.split(",")[0];
		var city = addressInfo.split(",")[1];
		var area = addressInfo.split(",")[2];
		var detailAddressInfo = $('#detailAddressInfo').val();

        if(realname == ''){
            blackHiht('请输入收货人姓名')
        }else if(mobile == ''){
            blackHiht('请输入收货人手机号')
        }else if(!phoneReg.test(mobile)){
            blackHiht('手机号格式不正确')
        }else if(addressInfo == ''){
            blackHiht('请选择所在地区')
        }else if(detailAddressInfo == ''){
            blackHiht('请输入详细地址')
        }else {
            $(this).removeClass('active');
            var data = {
                id: id,
                realname: realname,
                mobile: mobile,
                lng: longitude,
                lat: latitude,
                provincename: prov,
                cityname: city,
                areaname: area,
                address: detailAddressInfo,
                isdefault: isdefault
            };
            $.ajax({
                url: _apiUrl + 'public/bgg/index/user/updateaddress',
                data: data,
                beforeSend: function (request) {
                    request.setRequestHeader("token", getUserToken());
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
                    if (res.code == 200) {
                        $self.addClass('active')
                        location.replace('address.html')
                    } else {
                        blackHiht(res.message)
                    }
                },
                error: function () {
                    blackHiht('网络错误')
                }
            })
        }
	})
})