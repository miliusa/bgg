$(function(){
	loading()
	var pcategoryid = 0;
	var categoryid = 0;
	var ishot = 0;
	var isdiscounts = 0
	if(getUrl('from') == 'app'){
		pcategoryid = getUrl('pcategoryids')
		categoryid = getUrl('categoryid')
		ishot = getUrl('ishot')
		isdiscounts = getUrl('isdiscounts')
	}
	var keywords = ''
	$('.keyword_input').val(keywords)
	var orderby = '';
	var page = 1;
	var pagesize = 10;
	var loadall = false;

	//启用双击监听
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				auto: true,
				style:'circle',
				callback: pulldownRefresh
			},
			up: {
				height: 100,
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});

	function getList(){
		var data = {
			pcategoryid: pcategoryid,
			categoryid: categoryid,
			keywords: keywords,
			page: page,
			pagesize: pagesize,
			orderby: orderby,
			ishot: ishot,
			isdiscounts: isdiscounts
		};
		$.ajax({
			url: _apiUrl + 'public/bgg/index/index/searchgoods',
			dataType: 'JSON',
			data: data,
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
						html += '<div class="goods_item" data-id="' + item.id + '">\
							<div class="goods_img">\
								<div class="img_box">\
									<img class="haoniu-lazy-data" haoniu-lazy-data="' + item.thumb + '"/>\
								</div>\
							</div>\
							<div class="goods_info">\
								<p class="goods_title">' + item.short_title + '</p>\
								<p class="godos_price price_color">￥' + item.price + '</p>\
								<p class="market_price color_999">零售价:<span>￥' + item.originalprice + '</span></p>\
							</div>\
						</div>';
					});
					loadall = false;
					if(res.data == '' || res.data.length < pagesize){
						loadall = true;
						// blackHiht('没有更多数据了')
					}
					if(page == 1){
						if(res.data == ''){
							html = noneTip()
						}
						$('.goods_list').html(html);
						mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
					}else{
						$('.goods_list').append(html);
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}
					haoniuLazyLoading();
				}else{
					blackHiht( res.message )
				}
				loadend()
			},
			error: function () {
				blackHiht('网络错误');
			}
		});
	}

	/** 上拉加载 */
	function pullupRefresh() {
		if(loadall){
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			// blackHiht('没有更多数据了');
			$('.mui-pull-bottom-pocket').css('display', 'none');
			return
		}else{
			page++;
			getList();
		}
	}

	/** 下拉刷新 */
	function pulldownRefresh() {
		page = 1;
		getList();
		$('.mui-scroll').css('transform', 'translate3d(0px, 0px, 0px) translateZ(0px)');
	}

	// 关键词搜索
	$('.head_box').on('tap', '.search_btn', function () {
		keywords = $('.keyword_input').val()
		pulldownRefresh()
	})
	$("#keywords").bind("search", function() {
		//要执行的方法
		keywords = $('.keyword_input').val()
		pulldownRefresh()
	});

	var categoryList = [];
	// 筛选商品分类初始化
	function getCategory(){
		$.ajax({
			url: _apiUrl + 'public/bgg/index/index/getallgoodscategory',
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
					categoryList = res.data;
					var lefthtml = '<span class="left_tab_item on" data-pcategory-id="0">不限种类</span>';
					var righthtml = '';
					$.each(res.data, function(index, item){
						lefthtml += '<span class="left_tab_item" data-pcategory-id="' + item.pid + '">' + item.pcategoryname + '</span>';
					});
					$('.left_tabs').html(lefthtml);
					$('.right_tabs').html(righthtml);
				}else{
					blackHiht(res.message)
				}
			},
			error: function () {
				blackHiht('网络错误')
			}
		})
	}
	getCategory();

	// 点击分类
	$('.shift_modal').on('tap', function(){
		$(this).hide()
	});

	// 点击筛选分类,一级分类
	$('.left_tabs').on('tap', '.left_tab_item', function(){
		$(this).addClass('on').siblings().removeClass('on');
		var pid = $(this).attr('data-pcategory-id');
		var html = '';
		$.each(categoryList, function(index, item){
			if(item.pid == pid){
				html += '<span class="right_tab_item on" data-category-id="0">不限</span>';
				$.each(item.child, function(index2, item2){
					html += '<span class="right_tab_item" data-category-id="' + item2.id + '">' + item2.categoryname + '</span>'
				});
				return
			}
		});
		$('.right_tabs').html(html)
	});

	// 点击筛选分类,二级分类
	$('.right_tabs').on('tap', '.right_tab_item', function(){
		$(this).addClass('on').siblings().removeClass('on')
	});

	// 取消冒泡
	$('.shift_content').on('tap', function(e){
		e.stopPropagation()
	});

	// 点击重置
	$('.bottom_btns').on('tap', '.cancel_btn', function(e){
		e.stopPropagation();
		$('.left_tab_item.on').removeClass('on');
		$('.left_tab_item:first-child').addClass('on');
		$('.right_tabs').html('');
	});

	// 点击确定
	$('.bottom_btns').on('tap', '.confirm_btn', function(e){
		e.stopPropagation();
		pcategoryid = $('.left_tab_item.on').attr('data-pcategory-id');
		categoryid = $('.right_tab_item.on').attr('data-category-id') || 0;
		pulldownRefresh();
		$('.shift_modal').hide()
	});

	// 排序
	$('.order_bar').on('click', '.order_item', function(){
		$('.order_bar .order_item').children('.shift_icon').removeClass('active');
		$('.order_bar .order_item').children('.order_price_icon').attr('class', 'order_price_icon none');
		var index = $(this).index();
		var currentIndex = $('.order_bar .order_item.on').index();
		$(this).addClass('on').siblings().removeClass('on');
		console.log(index, currentIndex)
		if(index === 0 && currentIndex != index){
			orderby = '';
			pulldownRefresh();
		}else if(index === 1 && currentIndex != index){
			orderby = 'saledesc';
			pulldownRefresh();
		}else if(index === 2){
			if(orderby != 'pricedesc'){
				orderby = 'pricedesc';
				$(this).children('.order_price_icon').attr('class', 'order_price_icon desc');
			}else if(orderby == 'pricedesc'){
				orderby = 'priceasc';
				$(this).children('.order_price_icon').attr('class', 'order_price_icon asc');
			}
			pulldownRefresh();
		}else if(index == 3){
			$(this).children('.shift_icon').addClass('active');
			$('.shift_modal').toggle();
		}
	});

	// 点击商品跳转到详情页
	$('.goods_list').on('tap', '.goods_item', function(){
		var id = $(this).attr('data-id');
		location.href = 'deal_details.html?from=web&id=' + id;
	});
});