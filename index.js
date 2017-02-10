/**
 *
 *
 *page 依赖 文件的依赖，page也要添加
 *
 *
 *
 *
 * 
 */
var cheerio=require("cheerio");
var cc_deps_arr=[],
	cc_deps_obj={};

//获取page js 的依赖	
var getdependence=function(file,has_self,files){
	if(has_self && !cc_deps_obj[file.id]){
		cc_deps_arr.push(file.id);
	}

	fis.util.map(file.map.deps,function(index,item){
		if(/\.js/g.test(item)){
			if(!cc_deps_obj[item]){
				cc_deps_obj[item]=true;
				cc_deps_arr.concat(getdependence(files[item],true,files));
				has_self && cc_deps_arr.push(item);

			}
		}
	});
	return cc_deps_arr;
};
var html_deps={};
module.exports = function (ret, conf, settings, opt) {
    // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
    // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
    // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，
    //         可以修改静态资源列表或者其他
    
    fis.util.map(ret.ids,function(index,item){
    	if(item.isHtmlLike){
    		var $=cheerio.load(item.getContent());
    		var cc_script_arr=[];
    		var add_deps=getdependence(item,false,ret.ids);
    		fis.util.map(add_deps,function(index,item){
    			cc_script_arr.push('<script type="text/javascript" src="'+ret.ids[item].map.uri+'"></script>\n')
    		});
    		$('script').last().prev().before(cc_script_arr.join(""));

    		item.setContent($.html());
    	}
    });
}