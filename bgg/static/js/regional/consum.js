$(function(){
	//图片懒加载
	loading()
	var page = 1
	var pagesize = 10
	var keywords = ''
	var loadall = false
	$('[name=keywords]').val(keywords)
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

	function getList(){
		$.ajax({
			url: _apiUrl + 'public/bgg/index/partner/userlist',
			data: {
				keywords: keywords,
				page: page,
				pagesize: pagesize
			},
			beforeSend: function (request) {
				request.setRequestHeader("token", getUserToken())
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
					var html = ''
					$.each(res.data, function (index, item) {
						html += '<div class="user_item clear" data-id="' + item.id + '">\
									<div class="img_wrapper">\
										<img class="haoniu-lazy-data" haoniu-lazy-data="' + item.avatar + '" />\
									</div>\
									<div class="text_wrapper">\
										<div class="name">\
											<div class="label">会员昵称:</div>\
											<div class="text">' + item.nickname + '</div>\
										</div>\
										<div class="info">\
											<div class="label">会员ID:</div>\
											<div class="text">' + item.id + '</div>\
										</div>\
										<div class="phone">\
											<div class="label">联系方式:</div>\
											<div class="text">' + item.mobile + '</div>\
										</div>\
									</div>\
								</div>'
					})
					loadall = false
					if(res.data == '' || res.data.length < pagesize){
						loadall = true
						blackHiht("没有更多数据了");
					}
					if(page == 1){
						if(res.data == ''){
							html = noneTip()
						}
						$('.user_list').html(html);
						mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
					}else{
						$('.user_list').append(html);
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}
					$('.search_btn').addClass('active')
					haoniuLazyLoading();
				}else{
					blackHiht(res.message)
				}
				loadend()
			},
			error: function () {
				blackHiht('网络错误')
			}
		})
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
			getList();
		}
	}

	/** 下拉刷新 */
	function pulldownRefresh() {
		page = 1;
		getList();
	}
	
	$('.search_btn.active').on('tap', function () {
		$(this).removeClass('active')
		keywords = $('[name=keywords]').val()
		pulldownRefresh()
	})

	$('.user_list').on('tap', '.user_item',function () {
		var id = $(this).attr('data-id')
		location.href = 'consum_detail.html?from=web&id=' + id
	})
})
