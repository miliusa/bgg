$(function(){
	var id = getUrl('id');
	var page = 1;
	var pagesize = 10;
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

	// 获取评价列表
	function getRateList(){
		$.ajax({
			url: _apiUrl + 'public/bgg/index/index/goodscomment',
			data: {
				id: id,
				page: page,
				pagesize: pagesize
			},
			dataType: 'JSON',
			type: 'GET',
			success: function(resstr){
				var res = null;
				if (typeof resstr.result == "undefined") {
					res = JSON.parse(resstr);
				} else {
					res = resstr;
				}
				if(res.code == 200){
					var html = ''
					$.each(res.data, function(index, item){
						var time = getTime2(item.commenttime)
						html += '<div class="rate_item">\
									<div class="user_info clear">\
										<div class="avatar_box fl">\
											<img class="haoniu-lazy-data" haoniu-lazy-data="' + item.avatar + '" />\
										</div>\
										<div class="right_info fl">\
											<p class="user_nickname">' + item.nickname + '</p>\
											<p class="rate_time color_999">' + time + '</p>\
										</div>\
									</div>\
									<div class="rate_info">\
										<p class="rate_text">' + item.commenttext + '</p>\
										<div class="rate_img_list clear">';
						$.each(item.commentmedia,function (index2,item2) {
							html +='<div class="img_box fl">\
									<img class="haoniu-lazy-data" haoniu-lazy-data="' + item2 + '" />\
								</div>';
						})
						html += '</div></div></div>';
					})
					loadall = false
					if(res.data == '' || res.data.length < 10){
						loadall = true
						// blackHiht("没有更多数据了");
					}
					if(page == 1){
						if(res.data == ''){
							html = noneTip()
						}
						$('.rate_list').html(html);
						mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
					}else{
						$('.rate_list').append(html);
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}
					haoniuLazyLoading()
				}else{
					blackHiht(res.message)
				}
			},
			error:  function(){
				blackHiht('网络错误')
			}
		})
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
			getRateList();
		}
	}

	/** 下拉刷新 */
	function pulldownRefresh() {
		page = 1;
		getRateList();
	}
})