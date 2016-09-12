$(function(){

  setUp_keyword_table_column(5);
  avalon.filters.clean=function(str){
    var keywords_pattern=new RegExp(/[a-zA-Z\s]+/g);
    str=str.match(keywords_pattern);
    return str;
  };
  var vm_body_columns=avalon.define({
    $id:"body-columns",
    head:[{
        title:"Syria refugee crisis",
        groupId:1,
        disabled:false
      },{
        title:"Iran nuclear",
        groupId:2,
        disabled:false
      },{
        title:"Volkswagen scandal",
        groupId:3,
        disabled:false
      },{
        title:"US presidential election",
        groupId:4,
        disabled:false
      },{
        title:"China cooperation with Sudan",
        groupId:5,
        disabled:false
      }
    ],
    //注意！！关键词不同的中可以出现相同的keyword，但是，在关键词数组中的位置绝对不能相同，否则会出错！
    keywords_1:[
      "civil war",
      "ISIS",
      "air strike",
      "humanitarian crisis",
      "aid",
      "Austria",
      "European EU",
      "Russia",
      "Assad",
      "Obama",
      "United States US america",
      "government army",
      "John Kerry",
      "Netanyahu",
      "Hungary",
      "Balkans Balkan",
      "humanitarian assistance",
    ],
    keywords_2:[
      "nuclear deal",
      "Hezbollah",
      "Obama",
      "Tehran",
      "Israe",
      "United States US america",
      "Saudi Arabia",
      "ISIS",
      "terrorist",
      "uranium",
      "Trump",
      "Rouhani",
      "Jewish",
      "negotiate"
    ],
    keywords_3:[
      "Martin Winterkorn",
      "models",
      "Porsche",
      "Audi",
      "Skoda",
      "vehicle",
      "emission",
      "tests",
      "America",
      "Europe",
      "EPA"
    ],
    keywords_4:[
      "candidate",
      "Hillary Clinton",
      "Donald Trump",
      "Democratic Party GOP",
      "Republican Party"
    ],
    keywords_5:[
      "petroleum",
      "oil",
      "trade",
      "economic",
      "cooperation",
      "Omar al Bashir",
      "investor",
      "Xi Jinping",
      "investment",
      "Chinese Peoples\'s War",
      "70th Anniversary",
      "bilateral"
    ],
    //选择的关键词数组
    selected:{
      TopicId:"",
      TopicName:"",
      column:[]
    },
    //选择关键词时禁用其他列
    disabled_other_columns:function(e){
      var _this=$(e.target);
      if(_this.find("input[type=checkbox]:eq(0)").attr("disabled")){
        console.log("out");
        return false;
      }
      // label样式设置
      var _thisColumnClass=$(e.target).attr("class");
      if(_this.attr("data-selected")=="selected"){
        _this.attr("data-selected","");
      }else {
        _this.attr("data-selected","selected");
      }
      var pattern=/(keywords_)([0-9])+/;
      var _thisGroupIndex=_thisColumnClass.match(pattern)[2];
      // console.log(_thisGroupIndex);
      vm_body_columns.selected.TopicId=vm_body_columns.head[_thisGroupIndex-1].groupId;
      vm_body_columns.selected.TopicName=vm_body_columns.head[_thisGroupIndex-1].title;
      var otherColumnInput=$("#hide-tab-1 table input[type=checkbox]:not(."+_thisColumnClass+")");//获取非本列的input checkbox
      otherColumnInput.attr("disabled",true).parent().addClass("checkbox-disabled");//禁用其他列
      if(this.selected.column.length===0){//检测到本列数据为空时，还原其他列,并清空已有数据
        otherColumnInput.attr("disabled",false).parent().removeClass("checkbox-disabled");
        vm_body_columns.selected.TopicId="";
        vm_body_columns.selected.TopicName="";
      }

      // 点击页面的keyword后，自动跳转到search TAB下
      $("#left-menu li a:eq(0)").trigger("click");
      this.left_menu_trigger(0);
    },
    //移除单个keyword的选中
    remove_from_table_selected:function(e){
      var thisKeyword=$(e.target).parent().parent().find("span:eq(1)").text();
      $("label[for^=\""+thisKeyword+"\"][data-selected=selected]").trigger("click").attr("data-selected","");
    },
    //移除所有keyword的选中
    remove_all_selected:function(){
      var selected= this.selected;
      $("#hide-tab-1 table input[type=checkbox]:checked").parent().trigger("click").attr("data-selected","");
      selected.column=[];
      selected.TopicId="";
      selected.TopicName="";
      this.result.content=[];
      $("#right-tabs>li:not(:first)").remove();
      if($("#hide-tab-2").css("bottom")==="0px"){
        $("#hide-tab-2>.tabs-handle>p").trigger("click");
      }
      $("#hide-tab-2>.tabs-handle").addClass("disabled");
      this.guide_show_status=true;
      this.content_show_status=false;
      this.content_slider_show_status=false;
      $("#home-tab").trigger("click");
      disabled_parameter();
      disabled_change_right_menu(vm_body_columns);
    },
    //提交所有选中的keyword
    submit_all_keywords:function(){
      var keywords_data={
        status:0,
        message:"NewTopicQuery",
        data:{
          TopicId:"",
          TopicName:"",
          KeywordsList:[]
        }
      };
      var _keywords=this.selected.column;
      var keywords_pattern=new RegExp(/[a-zA-Z\s]+/g);
      for(var i=0;i<_keywords.length;i++){
        keywords_data.data.KeywordsList[i]={
          KeywordOrder:i,
          Keyword:_keywords[i].match(keywords_pattern)[0]
        };
      }
      keywords_data.data.TopicId=vm_body_columns.selected.TopicId;
      keywords_data.data.TopicName=vm_body_columns.selected.TopicName;
      if(keywords_data.data.KeywordsList.length===0){
        alert("Please select keywords first!");
      }else{
        if($("#hide-tab-1").css("bottom")=="0px"){
          $("#hide-tab-1>div.tabs-handle>p").trigger("click");
        }
        if(this.onExamlpe){
          this.onExamlpe=!this.onExamlpe;
        }
        console.log(this.onExamlpe);
        // postAjax("",keywords_data,function(data){
        getAjax("../data/result.json",null,function(data){
          if (data.status===0) {
            // $("#right-tabs>li:not(:first)").;
            $("#hide-tab-2>.disabled").removeClass("disabled");
            vm_body_columns.result.content=[];
            $(".tab-title>button").trigger("click");
            vm_body_columns.chartsData.labels=[];
            vm_body_columns.chartsData.data=[];
            vm_body_columns.result.centent=data.data.News;
            var result_content_model={
              title:"",
              id:"",
              confident:""
            };
            for (var j= 0; j < data.data.News.length; j++) {
              vm_body_columns.result.content.push(result_content_model);
              vm_body_columns.result.content[j].title=data.data.News[j].NewsTitle;
              vm_body_columns.result.content[j].id=data.data.News[j].NewsId;
              vm_body_columns.result.content[j].confident=data.data.News[j].confident;
            }
            for (var i = 0; i < data.data.DateNum.length; i++) {
              vm_body_columns.chartsData.labels.push(data.data.DateNum[i].Date);
              vm_body_columns.chartsData.data.push(data.data.DateNum[i].Count);
            }
            chart_setup(vm_body_columns.chartsData);
          }
        });
      }
    },
    chartsData:{
      labels : [],
      data : []
    },

    result:{
      content:[
      ]
    },
    show_result:function(){
      return (this.left_menu_status===0)&&(!isEmpty(this.result))&&(this.result.content.length!==0);
    },
    guide_show_status:true,
    show_guide:function(){
      return this.guide_show_status;
    },
    content:{},
    content_show_status:false,
    show_content:function(){
      return this.content_show_status;
    },
    update_content_parameter:function(data_id){//更新页面content的内容
      var data={
        "status":1,
        "message":" NewsDetailQuery",
        "newsId":data_id
      };
      console.log(data_id);
      getAjax("../data/content.json",null,function(data){
      // postAjax(url,data,function(data){
        if(data.status==1){
          //更新文章内容
          vm_body_columns.content=data;
          this.guide_show_status=false;
          this.content_show_status=true;
          //更新参数内容
          vm_body_columns.sliderData=data.sliderData;
          setup_slider_group("slider",vm_body_columns.sliderData);
        }
      });
    },
    //左侧文章查询结果和对应tab打开关闭控制
    open_content_tab:function(e){
      var _this=$(e.target);
      var _thisLink=_this.parent();
      var data_id=_thisLink.attr("data-id");
      if($("#"+data_id)[0]){//关闭文章tab
        $("#"+data_id+" button").trigger("click");
        disabled_change_right_menu(vm_body_columns);
        // this.update_selected_content();
      }
      else if (!$("#"+data_id)[0]) {//打开新的文章tab
        change_folder_icon(_thisLink);
        addTab(_this.text(),data_id);
        disabled_change_right_menu(vm_body_columns);
        data_id=$("#right-tabs>li.active").attr("id");
        this.update_content_parameter(data_id);
      }
      if($("#hide-tab-2").css("bottom")==="0px"){
        $("#hide-tab-2>div.tabs-handle>p").trigger("click");
      }
    },

    TripletsData:{
      "winSize":6,
      "step":1,
      "SentenceNum":10,
      "EffectTripletsNum":30,
      "Sentences":[
        {
          "SentenceOrder":1,
          "Sentence":"Comcast is bringing a couple of new third-party connected devices to Xfinity Home, Comcast subscription-based home-security and home-automation platform.",
          "TripletsNum":3,
          "Triplets":[{
            "TripletOrder":1,
            "Confidence":0.93,
            "Subject":"Comcast",
            "Relation":" is bringing",
            "Object":"a couple of new third-party connected devices",
            "Attribute":"attri"
          },{
            "TripletOrder":2,
            "Confidence":0.97,
            "Subject":"One of them",
            "Relation":"is",
            "Object":"the garage door",
            "Attribute":"attri"
          },{
            "TripletOrder":3,
            "Confidence":0.82,
            "Context":"Context(this latest move will allow,List([32, 59))):(both products; to be controlled; )"
          }]
        },{
          "SentenceOrder":2,
          "Sentence":"Comcast is bringing a couple of new third-party connected devices to Xfinity Home, Comcast subscription-based home-security and home-automation platform.",
          "TripletsNum":2,
          "Triplets":[{
            "TripletOrder":1,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"aa",
            "Object":"bb",
            "Attribute":"attri"
          },{
            "TripletOrder":2,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"cc",
            "Object":"dd",
            "Attribute":"attri"
          }]
        },{
          "SentenceOrder":2,
          "Sentence":"Comcast is bringing a couple of new third-party connected devices to Xfinity Home, Comcast subscription-based home-security and home-automation platform.",
          "TripletsNum":2,
          "Triplets":[{
            "TripletOrder":1,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"aa",
            "Object":"bb",
            "Attribute":"attri"
          },{
            "TripletOrder":2,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"cc",
            "Object":"dd",
            "Attribute":"attri"
          }]
        },{
          "SentenceOrder":2,
          "Sentence":"Comcast is bringing a couple of new third-party connected devices to Xfinity Home, Comcast subscription-based home-security and home-automation platform.",
          "TripletsNum":2,
          "Triplets":[{
            "TripletOrder":1,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"aa",
            "Object":"bb",
            "Attribute":"attri"
          },{
            "TripletOrder":2,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"cc",
            "Object":"dd",
            "Attribute":"attri"
          }]
        },{
          "SentenceOrder":2,
          "Sentence":"Comcast is bringing a couple of new third-party connected devices to Xfinity Home, Comcast subscription-based home-security and home-automation platform.",
          "TripletsNum":2,
          "Triplets":[{
            "TripletOrder":1,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"aa",
            "Object":"bb",
            "Attribute":"attri"
          },{
            "TripletOrder":2,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"cc",
            "Object":"dd",
            "Attribute":"attri"
          }]
        },{
          "SentenceOrder":2,
          "Sentence":"Comcast is bringing a couple of new third-party connected devices to Xfinity Home, Comcast subscription-based home-security and home-automation platform.",
          "TripletsNum":2,
          "Triplets":[{
            "TripletOrder":1,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"aa",
            "Object":"bb",
            "Attribute":"attri"
          },{
            "TripletOrder":2,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"cc",
            "Object":"dd",
            "Attribute":"attri"
          }]
        },{
          "SentenceOrder":2,
          "Sentence":"Comcast is bringing a couple of new third-party connected devices to Xfinity Home, Comcast subscription-based home-security and home-automation platform.",
          "TripletsNum":2,
          "Triplets":[{
            "TripletOrder":1,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"aa",
            "Object":"bb",
            "Attribute":"attri"
          },{
            "TripletOrder":2,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"cc",
            "Object":"dd",
            "Attribute":"attri"
          }]
        },{
          "SentenceOrder":2,
          "Sentence":"Comcast is bringing a couple of new third-party connected devices to Xfinity Home, Comcast subscription-based home-security and home-automation platform.",
          "TripletsNum":2,
          "Triplets":[{
            "TripletOrder":1,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"aa",
            "Object":"bb",
            "Attribute":"attri"
          },{
            "TripletOrder":2,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"cc",
            "Object":"dd",
            "Attribute":"attri"
          }]
        },{
          "SentenceOrder":2,
          "Sentence":"Comcast is bringing a couple of new third-party connected devices to Xfinity Home, Comcast subscription-based home-security and home-automation platform.",
          "TripletsNum":2,
          "Triplets":[{
            "TripletOrder":1,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"aa",
            "Object":"bb",
            "Attribute":"attri"
          },{
            "TripletOrder":2,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"cc",
            "Object":"dd",
            "Attribute":"attri"
          }]
        },{
          "SentenceOrder":2,
          "Sentence":"Comcast is bringing a couple of new third-party connected devices to Xfinity Home, Comcast subscription-based home-security and home-automation platform.",
          "TripletsNum":2,
          "Triplets":[{
            "TripletOrder":1,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"aa",
            "Object":"bb",
            "Attribute":"attri"
          },{
            "TripletOrder":2,
            "Confidence":0.82,
            "Subject":"Comcast",
            "Relation":"cc",
            "Object":"dd",
            "Attribute":"attri"
          }]
        }
      ]
    },
    update_triplets_data:function(NewsId){
      var data={
        "status":1,
        "message":" NewsTripletsExtraction",
        "newsId":NewsId
      };
      // postAjax(url,data,function(data){
      getAjax("../data/triplets.json",null,function(data){
        data.Data=vm_body_columns.TripletsData;
      });
    },
    show_slider_win_effect:function(){
      var totalTriGroup=$(".Sentences1");
      var winSize=this.TripletsData.winSize;
      var firstIndex=-1;
      var step=this.TripletsData.step;
      var nowFinalIndex=winSize-step;
      var timer=setInterval(function(){
        if(nowFinalIndex==(-1)){
          //回调点
          clearInterval(timer);
          totalTriGroup.removeClass("in-win");
        }else{
          nowFinalIndex+=step;
          var nowInWin=getItemsBetween(firstIndex,winSize,".Sentences1");
          totalTriGroup.removeClass("in-win");
          nowInWin.addClass("in-win");
          firstIndex+=step;
          if(nowFinalIndex>=totalTriGroup.length){
            nowFinalIndex=(-1);
          }
        }
      },1000);
    },
    left_menu_status:0,//左侧页面菜单的选择状态
    //左侧页面菜单的选择状态控制器
    left_menu_trigger:function(status){
      // console.log(status);
      this.left_menu_status=status;
      if(status===0&&this.onExamlpe){
        console.log("1:1");
        this.enabled_left_part();
      }else if (status==1&&this.onExamlpe) {
        console.log("1:2");
        this.disabled_parameter_panel();
      }
    },
    show_search:function(){
      // console.log(this.left_menu_status===0);
      return this.left_menu_status===0;
    },
    show_parameter:function(){
      return this.left_menu_status===1;
    },
    // 右侧页面轮播分页控制
    content_slider_show_status:false,
    show_content_slider:function(){
      return vm_body_columns.content_slider_show_status;
    },
    // 属性滑动块控制
    sliderData:[{
      parameter:"parameter0",
      min:0,
      max:100,
      val:20
    },{
      parameter:"parameter1",
      min:0,
      max:100,
      val:30
    },{
      parameter:"parameter2",
      min:0,
      max:100,
      val:40
    },{
      parameter:"parameter3",
      min:0,
      max:100,
      val:50
    },{
      parameter:"parameter4",
      min:0,
      max:100,
      val:60
    }],
    onExecute:false,
    execute:function(){
      this.onExecute=true;
      this.hide_bottom_tabs();
      this.disabled_left_part();
      // postAjax(url,_keywords,function(){
      // });
      // setTimeout(function(){
      //   // console.log(this);
      //   vm_body_columns.enabled_left_part();
      //   vm_body_columns.show_bottom_tabs();
      // },1000);
      vm_body_columns.guide_show_status=false;
      vm_body_columns.content_show_status=false;
      vm_body_columns.content_slider_show_status=true;
      disabled_change_right_menu(this);
    },
    finish_execute:function(){
      this.onExecute=false;
      this.enabled_left_part();
      disabled_change_right_menu(this);
    },
    update_parameter:function(contentId){
      // $("li[role=presentation][class=active]").attr("id");
      // postAjax(url,data,function(){
      getAjax("../data/parameter.json",null,function(data){
        if(data.status===0){

        }
      });
    },
    open_content:[
      // {
      //   title:11,
      //   id:22
      // },{
      //   title:33,
      //   id:44
      // }
    ],
    selected_content:[],
    // 更新选中的文章id
    update_selected_content:function(){
      vm_body_columns.open_content=[];
      var _content_tabs=$("#right-tabs>li:not(#home-tab)");
      var _content_tabs_num=_content_tabs.length;
      $("#myModal ul.list-group").html("");
      for(var i=0;i<_content_tabs_num;i++){
        vm_body_columns.open_content[i]={
          title:$(_content_tabs[i]).find("span:eq(0)").text(),
          id:$(_content_tabs[i]).attr("id")
        };
        $("#myModal ul.list-group").append("<li class=\" list-group-item\"><label for=\""+vm_body_columns.open_content[i].title+"\"><input id=\""+vm_body_columns.open_content[i].title+"\" type=\"checkbox\" name=\"name\"  value=\""+vm_body_columns.open_content[i].id+"\">"+vm_body_columns.open_content[i].title+"</label></li>");
      }
    },
    //提交选中的文章
    upload_selected_content:function(){
      this.selected_content=$("#myModal li.list-group-item input[type=checkbox]").val();
      var _selected_content=[];
      $("#myModal li.list-group-item input[type=checkbox]:checked").each(function(){
        _selected_content.push($(this).val());
      });
      this.selected_content=_selected_content;
      //ajax提交选中的数据

      // postAjax(url,this.selected_content,function(){
        window.location="./result.html";
      // });
    },
    //底部tab分页滑动控制
    change_keywords_slider_up:function(e){//向上滑动
      var thisSlide=$(e.target).parent();
      var index=$(".keywords_slider").index(thisSlide);
      var prev=index-1;
      $(".keywords_slider_btn").eq(index).animate({opacity:"0"},1000);
      $(".keywords_slider").eq(index).slideUp(1000);
      // console.log($(".keywords_slider").eq(index));
      $(".keywords_slider").eq(prev).slideDown(1000);
      // return false;
      $(".keywords_slider_btn").eq(prev).animate({opacity:"0.5"},1000);
    },
    change_keywords_slider_down:function(e){//向下滑动
      var thisSlide=$(e.target).parent();
      var index=$(".keywords_slider").index(thisSlide);
      var next=index+1;
      // console.log($(".keywords_slider").eq(index));
      $(".keywords_slider").eq(index).slideUp(1000);
      $(".keywords_slider").eq(next).slideDown(1000);
      $(".keywords_slider_btn").eq(index).animate({opacity:"0"},1000);
      $(".keywords_slider_btn").eq(next).animate({opacity:"0.5"},1000);
      // return false;
    },
    //底部tab控制
    show_bottom_tabs:function(){
      $(".bottom-hide-tabs").show(1000);
    },
    //底部tab控制
    hide_bottom_tabs:function(){
      $(".bottom-hide-tabs").hide(1000);
    },
    //提交属性执行程序后，禁用左侧菜单
    disabled_left_part:function(){
      // alert($("body").css("height"));
        $("#coverDiv").css({"height":$("body").height(),"width":$(".ui-layout-west").width()+35}).show();
        $("div.ui-layout-resizer .ui-layout-resizer-west .ui-draggable-handle .ui-layout-resizer-open .ui-layout-resizer-west-open").removeClass("ui-draggable-handle");
      $(window).resize(function(){
        $("#coverDiv").css({"height":$("body").height(),"width":$(".ui-layout-west").width()+35}).show();
      });
    },
    //提交属性执行程序后，禁用左侧菜单
    enabled_left_part:function(){
      $("#coverDiv").hide();
    },
    disabled_parameter_panel:function(){
      $("#coverDiv").show();
      $("#coverDiv").css({"height":$("body").height()-60,"width":$(".ui-layout-west").width()+35}).show();
      // $("div.ui-layout-resizer .ui-layout-resizer-west .ui-draggable-handle .ui-layout-resizer-open .ui-layout-resizer-west-open").removeClass("ui-draggable-handle");
      $(window).resize(function(){
        $("#coverDiv").css({"height":$("body").height()-60,"width":$(".ui-layout-west").width()+35}).show();
      });
    },
    example_info:{
      page:"1",
      example_index:"1"
    },
    onExamlpe:false,
    show_example:function(example_index){
      if(!this.onExecute){
        this.onExamlpe=true;
        $("#home-tab>a").trigger("click");
        enabled_parameter();
        vm_body_columns.left_menu_trigger(1);
        $("#left-menu>li:eq(1)").trigger("click");
        this.content_slider_show_status=true;
        this.content_show_status=false;
        this.guide_show_status=false;
        this.disabled_parameter_panel();
      }

      // var data={
      //
      // };
      // //拉取example的数据
      // postAjax(url,data,function(){
      //
      // });
    },
    get_example_page_info:function(){
    },
    relationChartData1:{
      nodes:[
        {category:1, name: '乔布斯', value : 10, label: '乔布斯\n（主要）'},
        {category:1, name: '1-1',value : 2},
        {category:1, name: '1-2',value : 3},
        {category:1, name: '克拉拉-乔布斯',value : 3},
        {category:1, name: '劳伦-鲍威尔',value : 7},
        {category:1, name: '史蒂夫-沃兹尼艾克',value : 5},
        {category:2, name: '奥巴马',value : 8},
        {category:2, name: '比尔-盖茨',value : 9},
        {category:2, name: '乔纳森-艾夫',value : 4},
        {category:2, name: '蒂姆-库克',value : 4},
        {category:2, name: '龙-韦恩',value : 1},
      ],
      links:[],
    },
    relationTripletData1:{},
    relationChartData2:{
      nodes:[
        {category:1, name: '乔布斯', value : 10, label: '乔布斯\n（主要）'},
        {category:1, name: '1-1',value : 2},
        {category:1, name: '1-2',value : 3},
        {category:1, name: '克拉拉-乔布斯',value : 3},
        {category:1, name: '劳伦-鲍威尔',value : 7},
        {category:1, name: '史蒂夫-沃兹尼艾克',value : 5},
        {category:2, name: '奥巴马',value : 8},
        {category:2, name: '比尔-盖茨',value : 9},
        {category:2, name: '乔纳森-艾夫',value : 4},
        {category:2, name: '蒂姆-库克',value : 4},
        {category:2, name: '龙-韦恩',value : 1},
      ],
      links:[
        {source : '丽萨-乔布斯', target : '乔布斯', weight : 1, name: '女儿'},
        {source : '保罗-乔布斯', target : '乔布斯', weight :2 , name: '父亲'},
        {source : '克拉拉-乔布斯', target : '乔布斯', weight : 1, name: '母亲'},
        {source : '蒂姆-库克', target : '奥巴马', weight : 1}
      ]
    },
    relationTripletData2:{},
    setUpCharts1:function(){
      getAjax("../data/chartData1",null,function(data){
        this.relationTripletData1=data.Data;
        this.relationChartData1=setNodesAndLinks(data.Data);
      });
      relation_chart_setup("relation-chart-1",this.relationChartData1);
    },
    setUpCharts2:function(){
      relation_chart_setup("relation-chart-2",this.relationChartData2);
    },
    update_slider_info:function(){
      var leftBtn=$("#carousel a.left");
      var rightBtn=$("#carousel a.right");
      var sliderIndexNow=$("li[data-target=#carousel].active").attr("data-slide-to");
    }

  });
  avalon.scan(document.body);

  menu_active_effect("left");
  menu_active_effect("right");
  change_tabs_on_right(vm_body_columns);
  setUp_hide_tabs();
  show_hide_tabs();
  disabled_change_right_menu(vm_body_columns);
  $(window).resize(function(){
    setUp_hide_tabs();
  });
  setup_slider_group("slider",vm_body_columns.sliderData);
  toggle_left_menu(vm_body_columns);
  delete_this_tab(vm_body_columns);
  // switch_tabs_right(vm_body_columns);

  $("#carousel").on('slid.bs.carousel', function () {
  	$("#carousel").carousel("pause");
  });

});

function setUp_keyword_table_column(columnNum){
  $("#hide-tab-1 table>thead>tr").append("<th ms-for=\"(key,el) in @head | limitBy("+columnNum+")\" ms-attr=\"{id:@head[key].groupId}\">{{el.title}}</th>");
  for (var i = 1; i <= columnNum; i++) {
    $("#hide-tab-1 table>tbody>tr").append("<td><label ms-for=\"(key,el) in @keywords_"+i+"\"   ms-on-click=\"@disabled_other_columns\"  ms-attr=\"{for:el+'_'+key,class:'keywords_"+i+"'}\"><input  type=\"checkbox\" ms-duplex=\"@selected.column\" ms-attr=\"{id:el+'_'+key,value:el+'_'+key,class:'keywords_"+i+"'}\">{{el}}</label></td>");
  }
}

function isEmpty(obj){
  for (var name in obj)
  {
    return false;
  }
  return true;
}

function chart_setup(data){
  var myChart = echarts.init(document.getElementById('chartPosition'),'macarons');
  var option = {
      title : {
        text: 'News Title',
        // subtext: '纯属虚构'
      },
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data:['新闻条数']
      },

      toolbox: {
        show : true,
        feature : {
          // mark : {show: true},
          dataView : {show: true, readOnly: false},
          magicType : {show: true, type: ['line', 'bar']},
          restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      calculable : true,
      xAxis : [
        {
          type : 'category',
          data :data.labels
          //  ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name:'新闻条数',
          type:'bar',
          data:data.data,
          // [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
          markPoint : {
            data : [
              {type : 'max', name: '最大值'},
              {type : 'min', name: '最小值'}
            ]
          },
          markLine : {
            data : [
              {type : 'average', name: '平均值'}
            ]
          }
        }
      ]
  };
  myChart.setOption(option);
  if($("#hide-tab-2").css("bottom")!=="0px"){
    $("#hide-tab-2>div.tabs-handle>p").trigger("click");
  }

}

function relation_chart_setup(id,data){
  var myChart = echarts.init(document.getElementById(id),'macarons');
  var option = {
      title : {
        text: '人物关系：乔布斯',
        subtext: '数据来自人立方',
        x:'right',
        y:'bottom'
      },
      tooltip : {
        trigger: 'item',
        formatter: '{a} : {b}'
      },
      toolbox: {
        show : true,
        feature : {
          restore : {show: true},
          // magicType: {show: true, type: ['force', 'chord']},
          // saveAsImage : {show: true}
        }
      },
      legend: {
        x: 'left',
        data:['家人','朋友']
      },
      series : [{
          type:'force',
          name : "三元组",
          ribbonType: false,
          categories : [{
            name: '人物'
          },
          {
            name: '家人'
          },
          {
            name:'朋友'
          }],
          itemStyle: {
            normal: {
              label: {
                show: true,
                // position:'outer',
                textStyle: {
                  color: '#333'
                }
              },
              nodeStyle : {
                brushType : 'both',
                borderColor : 'rgba(255,215,0,0.4)',
                borderWidth : 1
              },
              linkStyle: {
                type: 'curve',
                width:4
              }
            },
            emphasis: {
              label: {
                show: true
                // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
              },
              nodeStyle : {
                //r: 30
              },
              linkStyle : {}
            }
          },
          useWorker: true,
          minRadius : 15,
          maxRadius :20,
          gravity: 5.1,
          scaling: 1.5,
          roam: 'move',
          nodes:data.nodes,
            // {category:1, name: '乔布斯', value : 10, label: '乔布斯\n（主要）'},
            // {category:1, name: '1-1',value : 2},
            // {category:1, name: '1-2',value : 3},
            // {category:1, name: '克拉拉-乔布斯',value : 3},
            // {category:1, name: '劳伦-鲍威尔',value : 7},
            // {category:1, name: '史蒂夫-沃兹尼艾克',value : 5},
            // {category:2, name: '奥巴马',value : 8},
            // {category:2, name: '比尔-盖茨',value : 9},
            // {category:2, name: '乔纳森-艾夫',value : 4},
            // {category:2, name: '蒂姆-库克',value : 4},
            // {category:2, name: '龙-韦恩',value : 1},

          links : data.links
            // {source : '丽萨-乔布斯', target : '乔布斯', weight : 1, name: '女儿'},
            // {source : '保罗-乔布斯', target : '乔布斯', weight :2 , name: '父亲'},
            // {source : '克拉拉-乔布斯', target : '乔布斯', weight : 1, name: '母亲'},
            // {source : '蒂姆-库克', target : '奥巴马', weight : 1}

        }
      ]
    };

  myChart.setOption(option);
  // if($("#hide-tab-2").css("bottom")!=="0px"){
  //   $("#hide-tab-2>div.tabs-handle>p").trigger("click");
  // }
}
function  setNodesAndLinks(data){
  var nodes=[];
    // {category:1, name: '1-1',value : 2,label:'2'},
  var links=[];
    // {source : '保罗-乔布斯', target : '乔布斯', weight :2 , name: '父亲'},
  for(var i=0;i<data.Groups.length;i++){
    var _thisGroup=data.Groups[i];
    var nodeObj={};
    var linksObj={};
    for (var j = 0; j < _thisGroup.Triplets.length; j++) {
      var _thisTriplets=_thisGroup.Triplets[j];
      nodeObj.category=i;
      if(!_thisTriplets.Context){
        nodeObj.name="( "+_thisTriplets.Subject+","+_thisTriplets.Relation+","+_thisTriplets. Object+" )";
      }else{
        nodeObj.name="( "+_thisTriplets.Context+" )";
      }
      if(j===0){
        linkObj.source=nodeObj.name;
      }else if (j==1) {
        linkObj.target=nodeObj.name;
        linksObj.weight=1;
        linkObj.name=_thisGroup.Similarity;
        links.push(linkObj);
      }
      nodeObj.value=j;
      nodeObj.label=i+"-"+_thisTriplets.TripletOrder;
      nodes.push(nodeObj);
    }
  }
  return {
    links:links,
    nodes:nodes
  };
}
function menu_active_effect(position){
  $("#"+position+"-menu>li").on("click",function(){
    $("#"+position+"-menu>li").removeClass("active");
    $(this).addClass("active");
    if(position=="right"){
      $("li.dropdown").removeClass("active");
    }
  });

}

function change_tabs_on_left_menu(){
  var menu_links=$("#left-menu>li");
  menu_links.eq(0).on("click",function(){
    show_left_tab("search");
  });
  menu_links.eq(1).on("click",function(){
    show_left_tab("parameters");
  });
}

function show_left_tab(id){
  $(".left-tabs").addClass("hide");
  $("#"+id+"-tab").removeClass("hide");
}

function setup_slider_group(groupId,sliderData){
  for(var i=0;i<sliderData.length;i++){
    setup_parameter_slider(groupId+"-"+i,sliderData[i].min,sliderData[i].max,sliderData[i].val);
  }
}

function setup_parameter_slider(id,min,max,val){
  $("#"+id).slider({
    range: "min",
    min: min,
    max: max,
    value: val,
    slide: function (event, ui) {
      $("#amount-"+id).val(ui.value);
    }
  });
  $("#amount-"+id).val($("#"+id).slider("value"));
}

function change_folder_icon(_this){
  // console.log(_this);
  var openIcon=_this.find("p.open-folder");
  var closeIcon=_this.find("p.close-folder");
  openIcon.removeClass("open-folder").addClass("close-folder");
  closeIcon.removeClass("close-folder").addClass("open-folder");
}

function addTab(tabTitle,tabId){
  if (!$("#"+tabId)[0]) {
    $("#right-tabs").append("<li id=\""+tabId+"\" role='presentation'><a  class='tab-title'  href='#'><span>"+tabTitle+"</span><button class='close tab-delete' data-dismiss='alert' aria-label='Close' type='button'><span>&times;</span></button></a></li>");
    $("#right-tabs>li").removeClass("active");
    $("#right-tabs>li:last-child").addClass("active");
  }
  enabled_parameter();
}

function active_tabs_on_right(index){
  $("#right-tabs>li").removeClass("active");
  $("#right-tabs>li:eq("+index+")").addClass("active");
}

function change_tabs_on_right(vm_body_columns){
  $(document).on("click","#right-tabs>li",function(){
    var _this=$(this);
    var index = $("#right-tabs>li").index(_this);
    if(!vm_body_columns.onExecute){//未在执行中时切换页面
      if(index===0){
        vm_body_columns.guide_show_status=true;
        vm_body_columns.content_show_status=false;
        vm_body_columns.content_slider_show_status=false;
        disabled_parameter();
      }else{
        vm_body_columns.guide_show_status=false;
        vm_body_columns.content_show_status=true;
        vm_body_columns.content_slider_show_status=false;
        enabled_parameter();
      }
      active_tabs_on_right(index);
      var _thisContentId=$("#right-tabs>li.active").attr("id");
      vm_body_columns.update_content_parameter(_thisContentId);
    }
  });
}

function delete_this_tab(vm_body_columns){
  $(document).on("click",".tab-delete",function(){
    // alert("!");
    if(!vm_body_columns.onExecute){
      var thisLi=$(this).parent().parent();
      var index=$("#right-tabs>li").index(thisLi);
      index=index-1;
      active_tabs_on_right(index);
      thisLi.remove();
      var thisId=thisLi.attr("id");
      disabled_change_right_menu(vm_body_columns);
      change_folder_icon($("a[data-id="+thisId+"]"));
    }
  });
}

//底部tab控制
function show_hide_tabs(){
  $(document).on("click", ".tabs-handle:not(.disabled)>p",function(){
    var hide_tab=$(this).parent().parent();
    if(hide_tab.css("bottom")!="0px"){
      hide_tab.css("z-index","200").stop().animate({bottom:"0px"},500);
    }else if(hide_tab.css("bottom")=="0px"){
      var index=$(".bottom-hide-tabs").index(hide_tab);
      var z_index=100+index;
      hide_tab.stop().animate({bottom:"-"+hide_tab.find(".bottom-hide-tabs-container").eq(0).css("height")},500).css("z-index",z_index);
    }
  });
}

//底部tab控制
function setUp_hide_tabs(){
  // $(".bottom-hide-tabs").css("bottom","-"+$(this).find(".bottom-hide-tabs-container").eq(0).css("height"));
  var tabs=$(".bottom-hide-tabs");
  for(var i=0;i<tabs.length;i++){
    var _this=tabs.eq(i);
    var index=tabs.index(_this);
    var z_index=100+index;
    _this.css("bottom","-"+_this.find(".bottom-hide-tabs-container").eq(0).css("height")).css("z-index",z_index);
  }
}
//控制右侧的顶部菜单的禁用/启用
function disabled_change_right_menu(vm_body_columns){
  if($("#right-tabs>li").length==1){
    $("#right-menu>li,ul.dropdown-menu>li").addClass("disabled").find("a").attr("disabled",true);
    $("#dropdown-toggle").attr({"data-toggle":""});
    $("#modal-trigger").attr({"data-toggle":"","data-target":""});
    $("#right-tabs>li:first").trigger("click");
    // $("#left-menu>li:eq(0)").trigger("click");
    // console.log(vm_body_columns.guide_show_status);
    vm_body_columns.guide_show_status=true;
    vm_body_columns.content_show_status=false;
    vm_body_columns.content_slider_show_status=false;
    disabled_parameter();
  }else if (vm_body_columns.onExecute) {
    $("#right-menu>li,ul.dropdown-menu>li").addClass("disabled").find("a").attr("disabled",true);
    $("#dropdown-toggle").attr({"data-toggle":""});
    $("#modal-trigger").attr({"data-toggle":"","data-target":""});
    vm_body_columns.guide_show_status=false;
    vm_body_columns.content_show_status=false;
    vm_body_columns.content_slider_show_status=true;
  }
  else{
    vm_body_columns.guide_show_status=false;
    vm_body_columns.content_show_status=true;
    vm_body_columns.content_slider_show_status=false;
    $("#right-menu>li,ul.dropdown-menu>li").removeClass("disabled").find("a").attr("disabled",false);
    $("#dropdown-toggle").attr({"data-toggle":"dropdown"});
    $("#modal-trigger").attr({"data-toggle":"modal","data-target":"#myModal"});
    enabled_parameter();
  }
}
//打开result的tab后，点击右侧的tab，左侧的menu随之切换
function toggle_left_menu(vm_body_columns){
  $(document).on("click","#right-tabs>li:not(:first)",function() {
    if($("#right-tabs>li:not(:first)").length!==0){
      vm_body_columns.left_menu_trigger(1);
      $("#left-menu>li:eq(1)").trigger("click");
    }
  });
  $(document).on("click","#right-tabs>li:first",function(){
    if(!vm_body_columns.onExecute){
      vm_body_columns.left_menu_trigger(0);
      // console.log("vm_body_columns.left_menu_status:"+vm_body_columns.left_menu_status);
      $("#left-menu>li:eq(0)").trigger("click");
    }

  });
}
//禁用left_menu的parameter
function disabled_parameter(){
  $("#left-menu>li:eq(1)").addClass("disabled");
  var parameter_offset=$("#left-menu>li:eq(1)").offset();
  $("#cover").removeClass("hide").css({"left":parameter_offset.left,"top":parameter_offset.top,"width": "113px","position":"fixed","height": "50px","z-index":"1000"});

}
//启用left_menu的parameter
function enabled_parameter(){
  $("#left-menu>li:eq(1)").removeClass("disabled");
  $("#cover").addClass("hide");
}

// firstIndex是第一个元素的index，lastIndex是最后一个的后面一个的index;
function getItemsBetween(firstIndex,lastIndex,selecter){
  if(firstIndex==(-1)){
    return $(selecter+":lt("+lastIndex+")");
  }
  // console.log($(selecter+":gt("+firstIndex+"):lt("+lastIndex+")"));
  return $(selecter+":gt("+firstIndex+"):lt("+lastIndex+")");
}

function postAjax(url,data,success){
  $.ajax({
    type: 'POST',
    url: url,
    content:"application/json",
    dataType: 'json',
    data: data,
    success: success,
    error:function () {
      alert("服务器好像不太给力～");
    }
  });

}

function getAjax(url,data,success) {
  $.ajax({
    type: 'GET',
    url: url,
    content:"application/json",
    dataType: 'json',
    data: JSON.stringify(data),
    success: success,
    error:function () {
      alert("服务器好像不太给力～");
    }
  });
}
