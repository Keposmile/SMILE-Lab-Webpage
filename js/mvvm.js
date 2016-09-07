$(function(){
  setUp_keyword_table_column(5);
  // avalon.filters.jsonit=function(str){
  //   return JSON.parse(str);
  // };
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
    selected:{
      // column1:[],
      // column2:[],
      // column3:[],
      // column4:[],
      column:[]
    },
    disabled_other_columns:function(e){
      //禁用其他列的方法
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
      var otherColumnInput=$("#hide-tab-1 table input[type=checkbox]:not(."+_thisColumnClass+")");//获取非本列的input checkbox
      otherColumnInput.attr("disabled",true).parent().addClass("checkbox-disabled");//禁用其他列
      if(this.selected.column.length===0){//检测到本列数据为空时，还原其他列
        otherColumnInput.attr("disabled",false).parent().removeClass("checkbox-disabled");
      }

      // 点击页面的leyword后，自动跳转到search TAB下
      $("#left-menu li a:eq(0)").trigger("click");
      this.left_menu_trigger(0);
    },
    remove_from_table_selected:function(e){
      var thisKeyword=$(e.target).parent().parent().find("span:eq(1)").text();
      // console.log($("#"+thisKeyword));
      $("label[for^=\""+thisKeyword+"\"][data-selected=selected]").trigger("click").attr("data-selected","");
      // $("input[type=checkbox]["+thisKeyword+"]").trigger("click").parent().attr("data-selected","");
    },
    remove_all_selected:function(){
      var selected= this.selected.column;
      $("#hide-tab-1 table input[type=checkbox]:checked").parent().trigger("click").attr("data-selected","");
      selected=[];
    },
    submit_all_keywords:function(){
      var _keywords=this.selected.column;
      var keywords_pattern=new RegExp(/[a-zA-Z\s]+/g);
      for(var i=0;i<_keywords.length;i++){
        _keywords[i]=_keywords[i].match(keywords_pattern);
      }
    },
    result:{
      content:[
        {
          title:"this is result of search 1",
          id:"11223344"
        },{
          title:"222222",
          id:"889919292"
        }
      ]
    },
    //左侧文章查询结果和对应tab打开关闭控制
    open_content_tab:function(e){
      var _this=$(e.target);
      var _thisLink=_this.parent();
      // _thisLink.parent().find("input:eq(0)").trigger("click");
      console.log(this.open_content);
      // console.log(this.open_content.length);
      if($("#"+_thisLink.attr("data-id"))[0]){
        $("#"+_thisLink.attr("data-id")+" button").trigger("click");
        disabled_change_right_menu();
        // this.update_selected_content();
      }
      else if (!$("#"+_thisLink.attr("data-id"))[0]) {
        change_folder_icon(_thisLink);
        addTab(_this.text(),_thisLink.attr("data-id"));
        disabled_change_right_menu();
        // this.update_selected_content();
      }
    },
    left_menu_status:0,//左侧页面菜单的选择状态
    //左侧页面菜单的选择状态控制器
    left_menu_trigger:function(status){
      this.left_menu_status=status;
    },
    show_search:function(){
      // console.log(this.left_menu_status===0);
      return this.left_menu_status===0;
    },
    show_result:function(){
      // console.log();
      return (this.left_menu_status===0)&&(!isEmpty(this.result))&&(this.selected.column.length!==0);
    },
    show_parameter:function(){
      // console.log(this.left_menu_status===1);
      return this.left_menu_status===1;
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
    },{
      parameter:"parameter5",
      min:0,
      max:100,
      val:70
    },{
      parameter:"parameter6",
      min:0,
      max:1000  ,
      val:80
    }],
    disabled_left_part:function(){
      // alert($("body").css("height"));
        $("#coverDiv").css({"height":$("body").height(),"width":$(".ui-layout-west").width()+35}).show();
        $("div.ui-layout-resizer .ui-layout-resizer-west .ui-draggable-handle .ui-layout-resizer-open .ui-layout-resizer-west-open").removeClass("ui-draggable-handle");
      $(window).resize(function(){
        $("#coverDiv").css({"height":$("body").height(),"width":$(".ui-layout-west").width()+35}).show();
      });
    },
    enabled_left_part:function(){
      $("#coverDiv").hide();
    },
    show_bottom_tabs:function(){
      $(".bottom-hide-tabs").show(1000);
    },
    hide_bottom_tabs:function(){
      $(".bottom-hide-tabs").hide(1000);
    },
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
    get_parameter:function(contentId){
      $("li[role=presentation][class=active]").attr("id");
    },
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
    open_content:[
      // {
      //   title:11,
      //   id:22
      // },{
      //   title:33,
      //   id:44
      // }
    ],
    selected_content:[
    ],
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
    }
  });
  var vm_result=avalon.define({
    $id:"result"
  });
  avalon.scan(document.body);
  setup_slider_group("slider",7,vm_body_columns.sliderData);

});
function setUp_keyword_table_column(columnNum){
  $("#hide-tab-1 table>thead>tr").append("<th ms-for=\"(key,el) in @head | limitBy("+columnNum+")\" ms-attr=\"{id:@head[key].groupId}\">{{el.title}}</th>");
  for (var i = 1; i <= columnNum; i++) {
    // $("#hide-tab-1 table>tbody>tr").append("<td><label ms-for=\"(key,el) in @keywords_"+i+"\" onselectstart=\"return false\"  ms-on-click=\"@disabled_other_columns\"  ms-attr=\"{for:@keywords_"+i+"[key],class:'keywords_"+i+"'}\"><input  type=\"checkbox\" ms-duplex=\"@selected.column"+i+"\" ms-attr=\"{id:@keywords_"+i+"[key],value:@keywords_"+i+"[key],class:'keywords_"+i+"'}\">{{el}}</label><!-- <div>{{@selected.column1}}</div> --></td>");
    // $("#hide-tab-1 table>tbody>tr").append("<td><label ms-for=\"(key,el) in @keywords_"+i+"\" onselectstart=\"return false\"  ms-on-click=\"@disabled_other_columns\"  ms-attr=\"{for:el,class:'keywords_"+i+"'}\"><input  type=\"checkbox\" ms-duplex=\"@selected.column"+i+"\" ms-attr=\"{id:el,value:el,class:'keywords_"+i+"'}\">{{el}}</label><!-- <div>{{@selected.column1}}</div> --></td>");
    // if($("#"))
    $("#hide-tab-1 table>tbody>tr").append("<td><label ms-for=\"(key,el) in @keywords_"+i+"\"   ms-on-click=\"@disabled_other_columns\"  ms-attr=\"{for:el+'_'+key,class:'keywords_"+i+"'}\"><input  type=\"checkbox\" ms-duplex=\"@selected.column\" ms-attr=\"{id:el+'_'+key,value:el+'_'+key,class:'keywords_"+i+"'}\">{{el}}</label><!-- <div>{{@selected.column1}}</div> --></td>");
    // $("#hide-tab-1 table>tbody>tr").append("<td><label ms-for=\"(key,el) in @keywords_"+i+"\"   ms-on-click=\"@disabled_other_columns\"  ms-attr=\"{for:el,class:'keywords_"+i+"'}\"><input  type=\"checkbox\" ms-duplex=\"@selected.column\" ms-attr=\"{keyword-id:el,value:el,class:'keywords_"+i+"'}\">{{el}}</label><!-- <div>{{@selected.column1}}</div> --></td>");
  }
}
function isEmpty(obj){
  for (var name in obj)
  {
    return false;
  }
  return true;
}
