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
      console.log(_thisColumnClass);
      if(_this.attr("data-selected")=="selected"){
        _this.attr("data-selected","");
      }else {
        _this.attr("data-selected","selected");
      }
      var pattern=/(keywords_)([0-9])+/;
      var _thisGroupIndex=_thisColumnClass.match(pattern)[2];
      console.log(_thisGroupIndex);
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
      // console.log($("#"+thisKeyword));
      $("label[for^=\""+thisKeyword+"\"][data-selected=selected]").trigger("click").attr("data-selected","");
      // $("input[type=checkbox]["+thisKeyword+"]").trigger("click").parent().attr("data-selected","");
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
        console.log(keywords_data.data.KeywordsList[i].Keyword);
      }
      keywords_data.data.TopicId=vm_body_columns.selected.TopicId;
      keywords_data.data.TopicName=vm_body_columns.selected.TopicName;
      // postAjax("",keywords_data,function(data){
      getAjax("../data/result.json",null,function(data){
        if (data.status===0) {
          // $("#right-tabs>li:not(:first)").;
          $("#hide-tab-2>.disabled").removeClass("disabled");
          vm_body_columns.result.content=[];
          $(".tab-title>button").trigger("click");
          vm_body_columns.chartsData.labels=[];
          vm_body_columns.chartsData.datasets.data=[];
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
            vm_body_columns.chartsData.datasets[0].data.push(data.data.DateNum[i].Count);
          }
          chart_setup(vm_body_columns.chartsData);
        }
      });
    },
    chartsData:{
      labels : [],
      datasets : [{
        label: "My First dataset",
        fillColor : "rgba(151,187,205,0.5)",
        strokeColor : "rgba(151,187,205,1)",
        data : []
      }]
    },

    result:{
      content:[
        // {
        //   title:"this is result of search 1",
        //   id:"11223344"
        // },{
        //   title:"222222",
        //   id:"889919292"
        // }
      ]
    },
    show_result:function(){
      // console.log("1");
      // return (this.left_menu_status===0)&&(!isEmpty(this.result))&&(this.selected.column.length!==0);
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
    update_content:function(data_id){//更新页面content的内容
      var data={
        "status":1,
        "message":" NewsDetailQuery",
        "newsId":data_id
      };
      console.log(data);
      getAjax("../data/content.json",null,function(data){
      // postAjax(url,data,function(data){
        if(data.status==1){
          vm_body_columns.content=data;
          this.guide_show_status=false;
          this.content_show_status=true;
        }
      });
    },
    //左侧文章查询结果和对应tab打开关闭控制
    open_content_tab:function(e){
      var _this=$(e.target);
      var _thisLink=_this.parent();
      // _thisLink.parent().find("input:eq(0)").trigger("click");
      // console.log(this.open_content);
      // console.log(this.open_content.length);
      if($("#"+_thisLink.attr("data-id"))[0]){//关闭文章tab
        $("#"+_thisLink.attr("data-id")+" button").trigger("click");
        disabled_change_right_menu(vm_body_columns);
        // this.update_selected_content();
      }
      else if (!$("#"+_thisLink.attr("data-id"))[0]) {//打开新的文章tab
        change_folder_icon(_thisLink);
        addTab(_this.text(),_thisLink.attr("data-id"));
        disabled_change_right_menu(vm_body_columns);
        // this.guide_show_status=false;
        // this.content_show_status=true;
        // console.log(vm_body_columns.content_show_status);
        // this.update_selected_content();
      }
      var data_id=_thisLink.attr("data-id");
      this.update_content(data_id);
    },

    TripletsData:{

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
    left_menu_status:0,//左侧页面菜单的选择状态
    //左侧页面菜单的选择状态控制器
    left_menu_trigger:function(status){
      // console.log(status);
      this.left_menu_status=status;
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
    submit_parameter:function(){
      this.hide_bottom_tabs();
      this.disabled_left_part();
      // postAjax(url,_keywords,function(){
      // });
      // console.log(this);
      // setTimeout(function(){
      //   // console.log(this);
      //   vm_body_columns.enabled_left_part();
      //   vm_body_columns.show_bottom_tabs();
      // },1000);
    },
    update_parameter:function(contentId){
      // $("li[role=presentation][class=active]").attr("id");

      // postAjax(url,data,function(){
      getAjax("../data/parameter.json",null,function(data){
        if(data.status===0){
          vm_body_columns.sliderData=data.sliderData;
          setup_slider_group("slider",vm_body_columns.sliderData);
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




      postAjax(url,this.selected_content,function(){
        window.location="../node_page.html";
      });
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
      console.log($(".keywords_slider").eq(index));
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
    example_info:{
      page:"1",
      example_index:"1"
    },
    show_example:function(example_index){
      $("#home-tab>a").trigger("click");
      vm_body_columns.left_menu_trigger(1);
      $("#left-menu>li:eq(1)").trigger("click");
      this.content_slider_show_status=true;
      this.content_show_status=false;
      this.guide_show_status=false;
      // var data={
      //
      // };
      // //拉取example的数据
      // postAjax(url,data,function(){
      //
      // });
    },
    get_example_page_info:function(){

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
  switch_tabs_right(vm_body_columns);

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

  $("#chartPosition").empty();
  $("#chartPosition").append("<canvas id=\"myChart\" width=\"700\" height=\"400\"></canvas>");
  //Get the context of the canvas element we want to select
  var   options ={

        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero : true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,

        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth : 1,

        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,

        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,

        //Boolean - If there is a stroke on each bar
        barShowStroke : true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth : 2,

        //Number - Spacing between each of the X value sets
        barValueSpacing : 5,

        //Number - Spacing between data sets within X values
        barDatasetSpacing : 1,

        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"



  };
  //Get context with jQuery - using jQuery's .get() method.
  var ctx = $("#myChart").get(0).getContext("2d");
  //This will get the first returned node in the jQuery collection.
  var Bar = new Chart(ctx).Bar(data,options);
  // Bar.defaults = {
  //
  //   //Boolean - If we show the scale above the chart data
  //   	scaleOverlay : false,
  //
  //   	//Boolean - If we want to override with a hard coded scale
  //   	scaleOverride : false,
  //
  //   	//** Required if scaleOverride is true **
  //   	//Number - The number of steps in a hard coded scale
  //   	scaleSteps : null,
  //   	//Number - The value jump in the hard coded scale
  //   	scaleStepWidth : null,
  //   	//Number - The scale starting value
  //   	scaleStartValue : null,
  //
  //   	//String - Colour of the scale line
  //   	scaleLineColor : "rgba(0,255,0,.1)",
  //
  //   	//Number - Pixel width of the scale line
  //   	scaleLineWidth : 1,
  //
  //   	//Boolean - Whether to show labels on the scale
  //   	scaleShowLabels : false,
  //
  //   	//Interpolated JS string - can access value
  //   	scaleLabel : "<%=value%>",
  //
  //   	//String - Scale label font declaration for the scale label
  //   	scaleFontFamily : "'Arial'",
  //
  //   	//Number - Scale label font size in pixels
  //   	scaleFontSize : 12,
  //
  //   	//String - Scale label font weight style
  //   	scaleFontStyle : "normal",
  //
  //   	//String - Scale label font colour
  //   	scaleFontColor : "#666",
  //
  //   	///Boolean - Whether grid lines are shown across the chart
  //   	scaleShowGridLines : true,
  //
  //   	//String - Colour of the grid lines
  //   	scaleGridLineColor : "rgba(255,0,0,.05)",
  //
  //   	//Number - Width of the grid lines
  //   	scaleGridLineWidth : 1,
  //
  //   	//Boolean - If there is a stroke on each bar
  //   	barShowStroke : false,
  //
  //   	//Number - Pixel width of the bar stroke
  //   	barStrokeWidth : 2,
  //
  //   	//Number - Spacing between each of the X value sets
  //   	barValueSpacing : 5,
  //
  //   	//Number - Spacing between data sets within X values
  //   	barDatasetSpacing : 1,
  //
  //   	//Boolean - Whether to animate the chart
  //   	animation : true,
  //
  //   	//Number - Number of animation steps
  //   	animationSteps : 60,
  //
  //   	//String - Animation easing effect
  //   	animationEasing : "easeOutQuart",
  //
  //   	//Function - Fires when the animation is complete
  //   	onAnimationComplete : null
  //
  // };
  if($("#hide-tab-2").css("bottom")!=="0px"){
    $("#hide-tab-2>div.tabs-handle>p").trigger("click");
  }

}







function menu_active_effect(position){
  $("#"+position+"-menu>li").on("click",function(){
    // console.log(1);
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
  // console.log(1);
  for(var i=0;i<sliderData.length;i++){
    setup_parameter_slider(groupId+"-"+i,sliderData[i].min,sliderData[i].max,sliderData[i].val);
  }
}

function setup_parameter_slider(id,min,max,val){
  // console.log(2);
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
    active_tabs_on_right(index);
    if(index===0){
      vm_body_columns.guide_show_status=true;
      vm_body_columns.content_show_status=false;
      vm_body_columns.content_slider_show_status=false;
    }
    if(!vm_body_columns.onExecute){//未在执行中时切换页面


    }
  });
}

function delete_this_tab(vm_body_columns){
  $(document).on("click",".tab-delete",function(){
    // alert("!");
    var thisLi=$(this).parent().parent();
    var index=$("#right-tabs>li").index(thisLi);
    index=index-1;
    active_tabs_on_right(index);
    thisLi.remove();
    var thisId=thisLi.attr("id");
    disabled_change_right_menu(vm_body_columns);
    change_folder_icon($("a[data-id="+thisId+"]"));
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
    // console.log($("#right-menu>li").length);
    // console.log($("#right-menu>li:not(.dropdown),ul.dropdown-menu>li"));
    $("#right-menu>li,ul.dropdown-menu>li").addClass("disabled").find("a").attr("disabled",true);
    $("#dropdown-toggle").attr({"data-toggle":""});
    $("#modal-trigger").attr({"data-toggle":"","data-target":""});
    $("#right-tabs>li:first").trigger("click");
    // $("#left-menu>li:eq(0)").trigger("click");
    // console.log(vm_body_columns.guide_show_status);
    vm_body_columns.guide_show_status=true;
    vm_body_columns.content_show_status=false;
    disabled_parameter();
  }else{
    // console.log($("#right-menu>li").length);
    // console.log($("#right-menu>li:not(.dropdown),ul.dropdown-menu>li"));
    // console.log(vm_body_columns.guide_show_status);
    vm_body_columns.guide_show_status=false;
    vm_body_columns.content_show_status=true;
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
    vm_body_columns.left_menu_trigger(0);
    // console.log("vm_body_columns.left_menu_status:"+vm_body_columns.left_menu_status);
    $("#left-menu>li:eq(0)").trigger("click");
  });
}
//禁用left_menu的parameter
function disabled_parameter(){
  $("#left-menu>li:eq(1)").addClass("disabled");
  var parameter_offset=$("#left-menu>li:eq(1)").offset();
  $("#cover").removeClass("hide").css({"left":parameter_offset.left,"top":parameter_offset.top,"width": "113px","position":"fixed","height": "50px","z-index":"1000"});
  // $(window).resize(function(){
  //
  // });
}
//启用left_menu的parameter
function enabled_parameter(){
  $("#left-menu>li:eq(1)").removeClass("disabled");
  $("#cover").addClass("hide");
}

function switch_tabs_right(vm_body_columns){
  $(document).on("click","#right-tabs>li:not(:first)",function(){
    var _thisTabId=$(this).attr("id");
    // console.log(_thisTabId);
    vm_body_columns.update_content(_thisTabId);
    vm_body_columns.update_parameter(_thisTabId);

  });
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
