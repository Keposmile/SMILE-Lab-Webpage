$(function () {
    var myLayout = $("body").layout(
    {
        applyDefaultStyles: false,//应用默认样式
        scrollToBookmarkOnLoad: false,//页加载时滚动到标签
        showOverflowOnHover: false,//鼠标移过显示被隐藏的，只在禁用滚动条时用。
        north__closable: false,//可以被关闭
        north__resizable: false,//可以改变大小
        north__size: 100,//pane的大小
        spacing_open: 15,//边框的间隙
        spacing_closed: 15,//关闭时边框的间隙
        resizerTip: "可调整大小",//鼠标移到边框时，提示语
        resizerCursor:"resize-p",// 鼠标移上的指针样式
        resizerDragOpacity: 0.9,//调整大小边框移动时的透明度
        maskIframesOnResize: "#ifa",//在改变大小的时候，标记iframe（未通过测试）
        sliderTip: "点击显示侧边栏",//在某个Pane隐藏后，当鼠标移到边框上显示的提示语。
        sliderCursor: "pointer",//在某个Pane隐藏后，当鼠标移到边框上时的指针样式。
        slideTrigger_open: "dblclick",//在某个Pane隐藏后，鼠标触发其显示的事件。(click", "dblclick", "mouseover)
        slideTrigger_close: "click",//在某个Pane隐藏后，鼠标触发其关闭的事件。("click", "mouseout")
        togglerTip_open: "关闭",//pane打开时，当鼠标移动到边框上按钮上，显示的提示语
        togglerTip_closed: "打开",//pane关闭时，当鼠标移动到边框上按钮上，显示的提示语
        togglerLength_open: 100,//pane打开时，边框按钮的长度
        togglerLength_closed: 100,//pane关闭时，边框按钮的长度
        hideTogglerOnSlide: true,//在边框上隐藏打开/关闭按钮(测试未通过)
        togglerAlign_open: "center",//pane打开时，边框按钮显示的位置
        togglerAlign_closed: "center",//pane关闭时，边框按钮显示的位置
        togglerContent_open: "<div><</div>",//pane打开时，边框按钮中需要显示的内容可以是符号"<"等。需要加入默认css样式.ui-layout-toggler .content
        togglerContent_closed: "<div>></div>",//pane关闭时，同上。
        enableCursorHotkey: true,//启用快捷键CTRL或shift + 上下左右。
        customHotkeyModifier: "shift",//自定义快捷键控制键("CTRL", "SHIFT", "CTRL+SHIFT"),不能使用alt
        south__customHotkey: "shift+0",//自定义快捷键（测试未通过）
        fxName: "drop",//打开关闭的动画效果
        fxSpeed: "medium"//动画速度
        //fxSettings: { duration: 500, easing: "bounceInOut" }//自定义动画设置(未通过测试)
        //initClosed:true,//初始时，所有pane关闭
        //initHidden:true //初始时，所有pane隐藏
        //onresize: ons,//调整大小时调用的函数
        //onshow_start: start,
        //onshow_end: end
        /*
        其他回调函数
        显示时调用
        onshow = ""
        onshow_start = ""
        onshow_end = ""
        隐藏时调用
        onhide = ""
        onhide_start = ""
        onhide_end = ""
        打开时调用
        onopen = ""
        onopen_start = ""
        onopen_end = ""
        关闭时调用
        onclose = ""
        onclose_start = ""
        onclose_end = ""
        改变大小时调用
        onresize = ""
        onresize_start = ""
        onresize_end = ""
        */
    }
    );
    myLayout.sizePane("west", 350);//设置左边分栏宽度
});

// $(document).ready(function() {
//       $("body").layout({
//       /*
//          east & west panes require 'ID' selectors
//          because they are 'nested inside a div'
//       */
//          west__paneSelector:   "#west",
//         east__paneSelector:   "#east",
//       /*
//          north & south panes are 'children of body'
//       */
//       north__paneSelector:  ".ui-layout-north",//默认配置，可省略
//       south__paneSelector:  ".myclass-south",
//       /*
//          center pane is a 'child of the first form'
//          default-selector shown just for reference
//       */
//       center__paneSelector: ".ui-layout-center"//默认配置，可省略
//       });
//    });
//
//    var myLayout = $('body').layout();
//
//    // 读取布局配置选项
//    var is_west_resizable = myLayout.options.west.resizable;
//    var north_maxHeight   = myLayout.options.north.maxSize;
//
//    // 调用布局函数
//    myLayout.toggle("north");
  //  myLayout.sizePane("west", 300);
//
//    // 调用布局工具
//    myLayout.addPinBtn("#myPinButton", "west");
//    myLayout.allowOverflow("north");
