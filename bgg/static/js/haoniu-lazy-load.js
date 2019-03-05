/*! haoniu-lazy-load v0.1 | corn */

//好牛延迟加载框架
//需要jquery支持 建议版本：3.3.1

function haoniuLazyLoading(loadingImg){
	$('body').append('<div style="width:0px; height:0px; overflow:hidden;"><img src="" class="haoniu-lazy-img"></div>');
	if(loadingImg){
		$('.haoniu-lazy-data').attr('src',loadingImg);
	}else{
		$('.haoniu-lazy-data').attr('src','../../../static/img/white.png');
	}

	haoniuLazyLoad(0,$('.haoniu-lazy-data'));
	$('.haoniu-lazy-data').attr('class','');
}

//参数1.开始位置
//2.延迟加载的标签
//3.存储所有图片路径的数组
function haoniuLazyLoad(beginnum,nodetree,loadarr){

	var endnum = nodetree.length;
	var beginnum = beginnum;

	//获取屏幕的大小
	//var windhegiht = $(window).height();
	//var windwidth = $(window).width();

	//if(nodetree.eq(beginnum).offset()){
	//	if(nodetree.eq(beginnum).offset()['top']>windhegiht){
		//停止加载
	//	return false;
	//	}
	//}else{
	//	//停止加载
	//	return false;
	//}


    //获取的当前图片索引值大于图片总数时终止函数
	if(beginnum>endnum){

		return false;

	}else{

		//获取图片路径
		var path = nodetree.eq(beginnum).attr('haoniu-lazy-data');

        //没有新的图片需要加载，进入这块代码,给加载过的相同的图片添加加载动画效果。（同页面可能有相同的图片）
		if(loadarr){
			if(loadarr.length>0){
				var result = $.inArray(path, loadarr);		//获取路径在loadarr数组里的索引值
				if(result>=0){
					nodetree.eq(beginnum).fadeOut(500,function(){
						$(this).attr('src',$(this).attr('haoniu-lazy-data'));
						$(this).fadeIn(500);
					});

					beginnum++;
					// 从新执行函数
					haoniuLazyLoad(beginnum,nodetree,loadarr);
					return;

				}
			}
		}

		// 把当前获取的图片路径赋给中转图片
		$('.haoniu-lazy-img').attr('src',path);

		$(".haoniu-lazy-img").unbind();
        // 加载中转图片
		$('.haoniu-lazy-img').bind('load', function() {
			//记录已经加载过的图片不再加载，减少dom操作
			if(loadarr){
				loadarr[loadarr.length] = path;
			}else{
				loadarr = new Array();
				loadarr[0] = path;
			}
			//仿app特效，渐变
			nodetree.eq(beginnum).fadeOut(500,function(){
				$(this).attr('src',$(this).attr('haoniu-lazy-data'));
				$(this).fadeIn(500);
			});

			//无特效方式
			//nodetree.eq(beginnum).attr('src',nodetree.eq(beginnum).attr('haoniu-lazy-data'));

			beginnum++;
            // 从新执行函数
			haoniuLazyLoad(beginnum,nodetree,loadarr);

		}).bind('error', function() {

		})

	}
}
