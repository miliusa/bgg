$(function(){
	loading()
	var page = 1
	var pagesize = 10
	var loadall = false
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
				height: 50,
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});

	function initPage(){
		var data = {
			page: page,
			pagesize: pagesize,
			ishot: true
		};
		$.ajax({
			url: _apiUrl + 'public/bgg/index/index/searchgoods',
			data: data,
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
						html += '<div class="recommend_item" data-id="' + item.id + '">\
								<div class="top_banner">\
									<div class="img_box">\
										<img class="haoniu-lazy-data" haoniu-lazy-data="' + item.thumb + '"/>\
									</div>\
									<span class="order_num">TOP' + ((page - 1)*10 + index + 1) + '</span>\
								</div>\
								<div class="bottom_info">\
									<div class="info_title">' + item.title + '</div>\
									<div class="info_label color_999">品牌特卖-质量保证</div>\
									<div class="info_price clear">\
										<div class="price fl">\
											<span class="now_price price_color">￥' + item.price + '</span>\
											<span class="old_price color_999">￥' + item.originalprice + '</span>\
										</div>\
										<div class="hot_tips fr">\
											<span class="tip"></span>\
										</div>\
									</div>\
								</div>\
							</div>';
					});
					loadall = false
					if(res.data == '' || res.data.length < pagesize){
						loadall = true
						blackHiht("没有更多数据了");
					}
					if(page == 1){
						if(res.data == ''){
							html = noneTip()
						}
						$('.recommend_list').html(html);
						mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
					}else{
						$('.recommend_list').append(html);
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}
					haoniuLazyLoading();
				}else{
					blackHiht(res.message)
				}
				loadend()
			},
			error: function () {
				blackHiht('网络错误')
			}
		});
	}

	/** 上拉加载 */
	function pullupRefresh() {
		if(loadall){
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			blackHiht('没有更多数据了');
			$('.mui-pull-bottom-pocket').css('display', 'none');
			return
		}else{
			page++;
			initPage();
		}
	}

	/** 下拉刷新 */
	function pulldownRefresh() {
		page = 1;
		initPage();
	}

	$('.recommend_list').on('tap', '.recommend_item', function () {
		var id = $(this).attr('data-id')
		location.href = 'deal_details.html?from=web&id=' + id
	})
});