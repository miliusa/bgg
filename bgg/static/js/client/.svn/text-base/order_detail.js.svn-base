$(function () {
  loading()
  var id = getUrl('id')
  $.ajax({
    url: _apiUrl + 'public/bgg/index/user/orderdetail',
    beforeSend: function (request) {
      request.setRequestHeader("token", getUserToken())
    },
    data: {
      id: id
    },
    dataType: 'JSON',
    type: 'GET',
    success: function (resstr) {
      var res = null;
      if (typeof resstr.result == "undefined") {
        res = JSON.parse(resstr);
      } else {
        res = resstr;
      }
      if(res.code == 200){
        // 商品详情
        var html = ''
        $.each(res.data.ordergoods, function (index, item) {
          html += '<div class="goods_info">\
                    <div class="info_top clear">\
                      <div class="fl goods_img">\
                        <img class="haoniu-lazy-data" haoniu-lazy-data="' + item.goodsinfo.thumb + '" />\
                      </div>\
                      <div class="fr goods_desc">\
                        <p class="goods_title">' + item.goodsinfo.title + '</p>\
                        <p class="goods_num color_999">数量：<span>' + item.total + '</span></p>\
                        <p class="goods_price price_color">￥<span>' + item.price + '</span></p>\
                      </div>\
                    </div>\
                    <div class="bottom_info">\
                      <p class="goods_price">合计 <span class="price_color">￥' + item.total_price + '</span></p>\
                    </div>\
                  </div>'
        })
        $('.goods_list').html(html)
        // 商品总价
        $('.price_info .goods_price .fr').text('￥' + res.data.original_price)
        // 优惠券
        $('.price_info .coupon_value .fr').text('￥' + res.data.discountsprice)
        // 订单总价
        $('.price_info .total_price .fr').text('￥' + res.data.price)
        // 已支付
        $('.total_pay .fr').text('￥' + res.data.price)
        $('.ordersn_num span').text(res.data.ordersn)
        $('[name=copy]').attr('data-copy', res.data.ordersn)
        $('.create_time').text('创建时间：' + getTime(res.data.createtime))
        var status = res.data.status
        var btnhtml = ''
        if(status == 0){
          $('.total_pay .fl').text('需付款')
          btnhtml = '<button class="r_btn active pay fr">立即付款</button>\
                  <button class="b_btn active cancel fr">取消订单</button>';
        }else if((status == 2 && res.data.isshipments == 0) || status == 1){
          $('.pay_time').text('付款时间：' + getTime(res.data.paytime))
          btnhtml = '<button class="r_btn active remind fr">提醒发货</button>\
                  <button class="b_btn active server fr">申请维权</button>'
        }else if(status == 2 && res.data.isshipments == 1){
          $('.pay_time').text('付款时间：' + getTime(res.data.paytime))
          $('.translate_time').text('发货时间：' + getTime(res.data.receivetime))
          $('.deliver_info .address').text(res.data.provincename + res.data.cityname + res.data.areaname + res.data.address)
          $('.deliver_info .deliver .name').text(res.data.deliveryrealname)
          $('.deliver_info .deliver .phone').text(res.data.deliverymobile)
          $('[name=call]').attr('data-mobile', res.data.deliverymobile)
          $('.deliver_info').show()
          btnhtml = '<button class="r_btn active confirm_recive fr">确认收货</button>\
                  <button class="b_btn active server fr">申请维权</button>'
        }else if(status == 4){
          $('.pay_time').text('付款时间：' + getTime(res.data.paytime))
          $('.translate_time').text('发货时间：' + getTime(res.data.receivetime))
          $('.complete_time').text('成交时间：' + getTime(res.data.receivedtime))
          if(res.data.iscomment == 0){
            btnhtml = '<button class="r_btn active rate fr">评价</button>'
          }
          btnhtml += '<button class="b_btn active server fr">申请维权</button>'
        }
        $('.btn_box').html(btnhtml)
        haoniuLazyLoading()
        loadend()
      }else{
        blackHiht(res.message)
      }
    },
    error: function () {
      blackHiht('网络错误')
    }
  })


  // 取消订单
  $('.btn_box').on('tap', '.cancel.active', function () {
    var $self = $(this)
    $self.removeClass('active')
    var id = $(this).closest('.order_item').attr('data-id');
    confirmModal('确认取消该订单吗？',
        function(){
          $.ajax({
            url: _apiUrl + 'public/bgg/index/user/closeorder',
            beforeSend: function (request) {
              request.setRequestHeader("token", getUserToken())
            },
            data: {
              id: id,
            },
            dataType: 'JSON',
            type:'POST',
            success: function (resstr) {
              var res = null;
              if (typeof resstr.result == "undefined") {
                res = JSON.parse(resstr);
              } else {
                res = resstr;
              }
              if(res.code == 200){
                $self.closest('.order_item').remove()
                blackHiht('成功')
              }else{
                blackHiht(res.message)
              }
            },
            error: function(){
              blackHiht('网络错误')
              $self.addClass('active')
            }
          })
        },
        function () {
          $self.addClass('active')
        }
    )

  });

  // 立即付款
  $('.btn_box').on('tap', '.pay.active', function () {
    location.href = 'pay_type.html?from=web&orderid='+ id;
  });

  // 提醒发货
  $('.btn_box').on('tap', '.remind.active', function () {
    var $self = $(this)
    $self.removeClass('active')
    $.ajax({
      url: _apiUrl + 'public/bgg/index/user/sendordermessage',
      beforeSend: function (request) {
        request.setRequestHeader("token", getUserToken())
      },
      data: {
        id: id
      },
      dataType: 'JSON',
      type: 'GET',
      success: function (resstr) {
        var res = null;
        if (typeof resstr.result == "undefined") {
          res = JSON.parse(resstr);
        } else {
          res = resstr;
        }
        if(res.code == 200){
          blackHiht('已成功提醒商家')
        }else{
          blackHiht(res.message)
        }
        $self.addClass('active')
      },
      error: function () {
        blackHiht('网络错误')
      }
    })
  });

  // 申请维权
  $('.btn_box').on('tap', '.server.active', function () {
    location.href = 'return_goods_detail.html?from=web&id='+ id;
  });

  // 确认收货
  $('.btn_box').on('tap', '.confirm_recive.active', function () {
    var $self = $(this)
    $self.removeClass('active')
    confirmModal('确认收货？',
        function(){
          $.ajax({
            url: _apiUrl + 'public/bgg/index/user/suresignin',
            beforeSend: function (request) {
              request.setRequestHeader("token", getUserToken())
            },
            data: {
              id: id,
            },
            dataType: 'JSON',
            type:'POST',
            success: function (resstr) {
              var res = null;
              if (typeof resstr.result == "undefined") {
                res = JSON.parse(resstr);
              } else {
                res = resstr;
              }
              if(res.code == 200){
                blackHiht('收货成功')
                location.reload()
              }else{
                blackHiht(res.message)
              }
            },
            error: function(){
              blackHiht('网络错误')
              $self.addClass('active')
            }
          })
        },
        function () {
          $self.addClass('active')
        }
    )
  });

  // 评价
  $('.btn_box').on('tap', '.rate.active', function () {
    doComment(id)
  });
})