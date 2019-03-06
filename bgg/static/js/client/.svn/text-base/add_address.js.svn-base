$( function () {
  var mobile = '';
  var address = '';
  var realname = '';
  var isdefault = 0;

  //设为默认地址
  $( '.default' ).click( function () {
    if ( isdefault === 0 ) {
      $( this ).find( 'span' ).addClass( 'active' );
      isdefault = 1
    } else if ( isdefault === 1 ) {
      $( this ).find( 'span' ).removeClass( 'active' );
      isdefault = 0
    }
  } );

  // 保存信息
  $( '.save.active' ).on( 'click', function () {

    var areaText = $("#cityname").val();
    var prov = areaText.split(",")[0];
    var city = areaText.split(",")[1];
    var area = areaText.split(",")[2];
    var addressCode = $("#value").val();
    var provCode = addressCode.split(",")[0];
    var cityCode = addressCode.split(",")[1];
    var areaCode = addressCode.split(",")[2];

  	$(this).removeClass('active');
    realname = $( '.realname' ).val();
    mobile = $( '.mobile' ).val();
    address = $('.address').val();
    var data = {
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
      url: _apiUrl + 'public/bgg/index/user/addaddress',
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
          history.back()
        }else{
          blackHiht( res.message )
        }
      },
      error: function () {
        blackHiht('网络错误')
      }
    } )
  } )

} );