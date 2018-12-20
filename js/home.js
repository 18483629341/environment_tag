$(document).ready(function() {

    
    var featuresNum = 5;//特征词的种类
    var allFeatures = [];//存放五种类别的特征词
	var featureWords = [];//用于渲染echarts图的所有特征词
	var noSeletfeatureWords = [];//用于存储没有选中特征时将所有特征词渲染echarts
	var selectFeatureNum = 5;//选中的特征数量
	
	var selectFlags = [1, 1, 1, 1, 1];//标记某一类特征词是否选中
	var wordChart = echarts.init(document.getElementById("wordCloud"));
	
	//浏览器窗口大小改变时，重新渲染echarts图
    $(window).resize(function(){
	    wordChart.resize();
	});
	
	getAllKeyWords();
		
	//头部标签的点击事件
	$('.containter-title-nav li').click(function() {
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
	})
	
	//头部用户角色的点击事件
	$('.containter-title-role').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
		
	})
	
	//左侧列表的点击事件
//	$('.containter-left ul li').click(function() {
//		$(this).addClass('active');
//		$(this).siblings().removeClass('active');
//	})
	
	//标签频率排行时间切换
	$('.time-tabs span').click(function(){
		if($(this).hasClass('col-line')){
			return;
		}else{
			$(this).addClass('active');
			$(this).siblings().removeClass('active');
		}
		
	})
	//特征统计复选框的点击事件
	$('.word-check-boxs li').click(function() {
		var index = $(this).index();
		if($(this).hasClass('active')){
			if(index > 0){
				selectFlags[index-1] = -1;
				selectFeatureNum--;
			}
			$(this).removeClass('active');
		}else{
			if(index > 0){
				selectFlags[index] = 1;
				selectFeatureNum++;
			}
			$(this).addClass('active');
		}
		
		if(index > 0){			
			//特征全部选中
			if(selectFeatureNum == featuresNum){
				$('.check-all').addClass('active');
				wordCloudGo(noSeletfeatureWords);
			}else{
				$('.check-all').removeClass('active');
				if(selectFeatureNum == 0){
					wordCloudGo(noSeletfeatureWords);
				}else{
					getFeatureWords();
				}
			}
			console.log(selectFlags)
		}

	})
	//特征统计复选框全选
	$('.check-all').click(function() {
		
		if($(this).hasClass('active')){
			$(this).siblings().addClass('active');
			selectFeatureNum = 5;
			for(var i = 0;i < featuresNum;i++){
				selectFlags[i] = 1;
			}
		}else{
			$(this).siblings().removeClass('active');
			selectFeatureNum = 0;
			for(var i = 0;i < featuresNum;i++){
				selectFlags[i] = -1;
			}
		}
		
		wordCloudGo(noSeletfeatureWords);

	})
	
	/**
	 * 从所有特征词中取出用户选择的特征词
	 */
	function getFeatureWords(){
		featureWords = [];
		for(var i = 0;i < featuresNum;i++){
			if(selectFlags[i] == 1){
				featureWords = featureWords.concat(allFeatures[i]);
			}
		}
		wordCloudGo(featureWords);
	}
	
	/**
	 * 获取所有特征统计云图特征词
	 */
	function getAllKeyWords() {
		$.getJSON("words.json", "", function(data) {
			allFeatures[0] = data.basicFeature;
			allFeatures[1] = data.emissionFeature;
			allFeatures[2] = data.superviseFeature;
			allFeatures[3] = data.valueFeature;
			allFeatures[4] = data.riskFeature;
			
			for(var j = 0;j < featuresNum;j++){
				noSeletfeatureWords = noSeletfeatureWords.concat(allFeatures[j]);
			}
			wordCloudGo(noSeletfeatureWords);
		});
	}
	

	/**
	 * 渲染特征词云图
	 */
	function wordCloudGo(data){

		var wordOption = {
			series: [{
		        type: 'wordCloud',
		        left: 'center',
		        top: 'center',
		        size: ['100%', '100%'],
		        rotationRange: [0, 90,-90],
		        autoSize:{
				    "enable": true,
				    "minSize": 16
				},
		        data: data.map(function(item){
		        	var cr;
		        	if(selectFeatureNum!=0){
		        		if(item.type == 'b'){
	        				cr = '#14b4a8';
	            		}else if(item.type == 'e'){
	            			cr = '#fe9b48';
	            		}else if(item.type == 's'){
	            			cr = '#e84c4d';
	            		}else if(item.type == 'v'){
	            			cr = '#5197ed';
	            		}else{
	            			cr = '#5572fb';
	            		}
		        	}else{
		        		cr = '#e0e0e0';
		        	}
		        	
            		return{
            			name:item.name,
            			value:item.value,
            			itemStyle:{
            				normal: {
	            				color:cr
	            			}
            			}
            		}
		        })
		    }]
		}
		wordChart.setOption(wordOption,true);
	}
});