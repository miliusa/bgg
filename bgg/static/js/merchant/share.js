// 共用地址
var _apiUrl = 'http://bgg.hfrjkf.cn/proStorage/';

// 自定义tap事件
$( document ).on( "touchstart", function ( e ) {
  $( e.target ).data( "isMoved", 0 );
} );
$( document ).on( "touchmove", function ( e ) {
  $( e.target ).data( "isMoved", 1 );
} );
$( document ).on( "touchend", function ( e ) {
  if ( $( e.target ).data( "isMoved" ) == 0 )
    $( e.target ).trigger( "tap" );
} );


/* 手机rem适配 */
( function ( doc, win ) {
  var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
        var clientWidth = docEl.clientWidth;
        if ( !clientWidth ) return;
        if ( clientWidth >= 750 ) {
          docEl.style.fontSize = '100px';
        } else {
          docEl.style.fontSize = 100 * ( clientWidth / 750 ) + 'px';
        }
      };

  if ( !doc.addEventListener ) return;
  win.addEventListener( resizeEvt, recalc, false );
  doc.addEventListener( 'DOMContentLoaded', recalc, false );
} )( document, window );

function modelOpen() {
  $( 'body' ).css( 'overflow', 'hidden' );
  $( 'body' ).css( 'height', '100%' );
  $( 'html' ).css( 'overflow', 'hidden' );
  $( 'html' ).css( 'height', '100%' );
}

function modelClose() {
  $( 'body' ).css( 'overflow', 'visible' );
  $( 'body' ).css( 'height', 'auto' );
  $( 'html' ).css( 'overflow', 'visible' );
  $( 'html' ).css( 'height', 'auto' );
}

//自动关闭提示框
var timer = null;

function blackHiht( msg ) {
  clearTimeout( timer )
  timer = null
  $( ".hiht_window_black" ).remove( '' );
  var text = '<div class="hiht_window_black">\
                    <div class="hiht_black">' + msg + '</div>\
                </div>';
  $( "body" ).append( text );
  $( ".hiht_window_black" ).show();
  timer = setTimeout( function () {
    $( ".hiht_window_black" ).remove( '' );
    clearTimeout( timer )
    timer = null
  }, 2000 );
}

function noneTip(msg){
  var msgtip = msg || '暂无数据...'
  var nonehtml = '<div style="width: 100%;text-align:center;background:#fff;padding: 0.6rem 0;">\
                      <img style="display: inline-block;width: 2rem;padding-bottom: 0.2rem;" src="../img/none.png">\
                      <p style="color:#999;font-size: 0.36rem;letter-spacing: 0.03rem;">' + msgtip + '</p>\
                  </div>'
  return nonehtml
}

//毫秒转化成年月日
function getTime( str ) {
  var oDate = new Date( str );
  var year = oDate.getFullYear();
  var month = oDate.getMonth() + 1;
  var date = oDate.getDate();
  var hour = oDate.getHours();
  var minute = oDate.getMinutes();
  var second = oDate.getSeconds();
  if ( minute < 10 ) {
    minute = "0" + minute;
  }
  if ( second < 10 ) {
    second = "0" + second;
  }
  var oTime = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second; //最后拼接时间
  return oTime;
};

function getTime2( str ) {
  var oDate = new Date( str );
  var year = oDate.getFullYear();
  var month = oDate.getMonth() + 1;
  var date = oDate.getDate();
  var oTime = year + '-' + month + '-' + date; //最后拼接时间
  return oTime;
}
// 毫秒转化成年月日
function getTime3( str ) {
  var oDate = new Date( str );
  var year = oDate.getFullYear() - 1;
  var month = oDate.getMonth() + 1;
  var date = oDate.getDate();
  var hour = oDate.getHours();
  var minute = oDate.getMinutes();
  if ( minute < 10 ) {
    minute = "0" + minute;
  }
  var oTime = year + '-' + month + '-' + date + ' ' + hour + ':' + minute; //最后拼接时间
  return oTime;
}

// 获取URL参数
function getUrl( name ) {
  var url = location.search;
  var ur2 = url.substring( 1, url.length );
  var ur3 = ur2.split( "&" );
  var thisIndex = ''
  $.each( ur3, function ( v, k ) {
    var ur4 = ur3[ v ].split( "=" );
    $.each( ur4, function ( v, k ) {
      if ( ur4[ v ] == name ) {
        thisIndex = ur4[ v + 1 ];
      }
    } );
  } );
  return thisIndex;
}
function modalOpen() {
  $( 'body' ).css( 'overflow', 'hidden' );
  $( 'body' ).css( 'height', '100%' );
  $( 'html' ).css( 'overflow', 'hidden' );
  $( 'html' ).css( 'height', '100%' );
}

function modalClose() {
  $( 'body' ).css( 'overflow', 'visible' );
  $( 'body' ).css( 'height', 'auto' );
  $( 'html' ).css( 'overflow', 'visible' );
  $( 'html' ).css( 'height', 'auto' );
}

// 确认框
function confirmModal( title, succFun, errFun ) {
  if ( !succFun ) {
    succFun = function succFun() {
      return true;
    };
  }
  if ( !errFun ) {
    errFun = function errFun() {
      return false;
    };
  }
  var html = '<div class="confirm-modal">' +
      '<div class="confirm-content">' +
      '<div class="top-info">' +
      '<p class="top-title">' + title + '</p>' +
      '</div>' +
      '<div class="bottom-btns">' +
      '<span class="cancel-btn">取消</span>' +
      '<span class="confirm-btn">确定</span>' +
      '</div>' +
      '</div>' +
      '</div>';
  $( 'body' ).append( html );
  modalOpen();
  $( '.confirm-modal' ).on( 'click', '.cancel-btn', function (e) {
    e.stopPropagation()
    $( '.confirm-modal' ).remove();
    modalClose();
    errFun();
  } );
  $( '.confirm-modal' ).on( 'click', '.confirm-btn', function (e) {
    e.stopPropagation()
    modalClose();
    $( '.confirm-modal' ).remove();
    succFun();
  } );
}

$( function () {
  $( ".head_left_icon" ).click( function () {
    if ( getUrl( 'from' ) === 'web' ) {
      history.back();
    }else{
      goBack()
    }
  } );
} )

function loading(){
  var html = '<div id="loading" class="loader">\
                <div class="loader-inner ball-clip-rotate-multiple">\
                  <div></div>\
                  <div></div>\
                </div>\
              </div>';
  $('body').append(html)
}

function loadend(){
  $('#loading').remove()
}

// 打电话
$('[name=call]').on('tap', function () {
  var phone = $(this).attr('data-mobile')
  callPhone(phone)
})

// 复制到剪贴板
$('[name=copy]').on('tap', function () {
  var text = $(this).attr('data-copy')
  copyText(text)
})

/** 调用原生方法 */
// 返回上一级
function goBack() {
  try{
    app.goBack()
  }catch(err){
    blackHiht('返回上一级失败')
  }
}

// 获取用户token
function getUserToken(){
  var token = ''
  try{
    token = app.getUserTooken()
  }catch(err){
    blackHiht('获取不到登录信息')
  }
  return token
}

// 微信支付
function doWeChatPayment(str){
  try{
    app.doWeChatPayment(str)
  }catch(err){
    blackHiht('微信支付失败')
  }
}

// 支付宝支付
function doAlipayPayment(str){
  try{
    app.doAlipayPayment(str)
  }catch(err){
    blackHiht('支付宝支付失败')
  }
}

// 拨打电话
function callPhone(phone){
  try{
    app.callPhone(phone)
  }catch(err){
    blackHiht('拨打电话失败')
  }
}

// 复制文本
function copyText(text){
  try{
    app.copyText(text)
  }catch(err){
    blackHiht('复制文本失败')
  }
}

// 跳转到登录页
function doLogin() {
  try{
    app.doLogin()
  }catch(err){
    blackHiht('跳转到登录页失败')
  }
}

// 跳转到购物车
function goShopping() {
  try{
    app.goShopping()
  }catch(err){
    blackHiht('跳转到购物车失败')
  }
}

// 跳转到商家申请表单
function goBusinessApply() {
  try{
    app.goBusinessApply()
  }catch(err){
    blackHiht('跳转到商家申请表单失败')
  }
}

// 跳转到合伙人申请表单
function goPartnerApply() {
  try{
    app.goPartnerApply()
  }catch(err){
    blackHiht('跳转到合伙人申请表单失败')
  }
}

// 跳转到评价页
function doComment(id){
  try{
    app.doComment(id)
  }catch(err){
    blackHiht('跳转到商品评价页失败')
  }
}

// 分享
function ShareWeChat(type, img, url) {
  try{
    app.ShareWeChat(type, img, url)
  }catch(err){
    blackHiht('分享失败')
  }
  $('.share-modal').hide()
}


function lastUrl(){
  sessionStorage.setItem('url', location.href)
}


function goSuccess(type){
  location.href = '../index/success.html?type=' + type
}

// 如果不是订单页, 选择地址页的话, 清除addressid的缓存
if(location.href.indexOf('/order.html') == -1 && location.href.indexOf('/cart_order.html') == -1 && location.href.indexOf('/select_address.html') == -1 ){
  sessionStorage.removeItem('addressid')
}