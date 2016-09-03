$(function(){
  var sliderData=[{
    min:0,
    max:100,
    val:20
  },{
    min:0,
    max:100,
    val:30
  },{
    min:0,
    max:100,
    val:40
  },{
    min:0,
    max:100,
    val:50
  },{
    min:0,
    max:100,
    val:60
  },{
    min:0,
    max:100,
    val:70
  },{
    min:0,
    max:100,
    val:80
  }];
  menu_active_effect("left");
  menu_active_effect("right");
  // change_tabs_on_left_menu();
  change_tabs_on_right();
  // setup_parameter_slider("slider1",0,100,60)
  setup_slider_group("slider",7,sliderData);
  // $(".result-links").on("click",function(){
  //   change_folder_icon($(this));
  //   return false;
  // });
  setUp_hide_tabs();
  // $("#addTab").on("click",function(){
  //   addTab();
  // });
  delete_this_tab();
  show_hide_tabs();
});

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

function setup_slider_group(groupId,sliderNum,sliderData){
  console.log(1);
  for(var i=0;i<sliderNum;i++){
    setup_parameter_slider(groupId+"-"+i,sliderData[i].min,sliderData[i].max,sliderData[i].val);
  }
}

function setup_parameter_slider(id,min,max,val){
  console.log(2);
  $("#"+id).slider({
    range: "min",
    min: min,
    max: max,
    value: val,
    slide: function (event, ui) {
        $("#amount-"+id).text(ui.value);
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
    $("#right-tabs").append("<li id=\""+tabId+"\" role='presentation'><a  class='tab-title' href='#'><span>"+tabTitle+"</span><button class='close tab-delete' data-dismiss='alert' aria-label='Close' type='button'><span>&times;</span></button></a></li>");
    $("#right-tabs>li").removeClass("active");
    $("#right-tabs>li:last-child").addClass("active");
  }
}
function active_tabs_on_right(index){
  $("#right-tabs>li").removeClass("active");
  $("#right-tabs>li:eq("+index+")").addClass("active");
}
function change_tabs_on_right(){
  $(document).on("click","#right-tabs>li",function(){
    var _this=$(this);
    var index = $("#right-tabs>li").index(_this);
    active_tabs_on_right(index);
  });
}
function delete_this_tab(e){
  $(document).on("click",".tab-delete",function(){
    // alert("!");
    var thisLi=$(this).parent().parent();
    var index=$("#right-tabs>li").index(thisLi);
    index=index-1;
    active_tabs_on_right(index);
    thisLi.remove();
    var thisId=thisLi.attr("id");
    // change_folder_icon($("a[data-id="+thisId+"]"));
  });
}
function show_hide_tabs(){
  $(".tabs-handle>p").on("click",function(){
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
