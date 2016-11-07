/**
 * [clean description]
 * @type {[type]}
 */
$(function() {

    setUp_keyword_table_column(5);
    avalon.filters.clean = function(str) {
        var keywords_pattern = new RegExp(/[a-zA-Z\s]+/g);
        str = str.match(keywords_pattern);
        return str;
    };
    /**
     * [vm avalon框架的view model]
     */
    var vm = avalon.define({
        $id: "body-columns",
        /**
         * [head 关键词列表的表头数据]
         */
        head: [{
            title: "Syria refugee crisis",
            groupId: 1,
            disabled: false
        }, {
            title: "Iran nuclear",
            groupId: 2,
            disabled: false
        }, {
            title: "Volkswagen scandal",
            groupId: 3,
            disabled: false
        }, {
            title: "US presidential election",
            groupId: 4,
            disabled: false
        }, {
            title: "China cooperation with Sudan",
            groupId: 5,
            disabled: false
        }],


        /**
         * [keywords_*  关键词数据]
         * 注意！！关键词不同的分类中可以出现相同的keyword，但是，在关键词数组中的位置绝对不能相同，否则会出错！
         */
        keywords_1: [
            "civil war",
            "ISIS",
            "air strike",
            "humanitarian crisis",
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
            "humanitarian assistance aid",
        ],
        keywords_2: [
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
        keywords_3: [
            "Martin Winterkorn",
            "models",
            "Porsche",
            "Audi",
            "emission",
            "tests",
            "German",
            "EPA"
        ],
        keywords_4: [
            "candidate",
            "Hillary Clinton",
            "Donald Trump",
            "Democratic PDP",
            "Republican GOP"
        ],
        keywords_5: [
            "petroleum oil",
            "economic trade",
            "cooperation",
            "Omar al Bashir",
            "Xi Jinping",
            "Chinese Peoples\'s War 70th Anniversary",
            "investor investment",
            "bilateral"
        ],
        //选择的关键词数组
        selected: {
            TopicId: "",
            TopicName: "",
            column: []
        },
        /**
         * [disabled_other_columns 选择关键词时禁用其他列]
         * @method disabled_other_columns
         * @param  {[type]}               e [description]
         * @return {[type]}                 [description]
         */
        disabled_other_columns: function(e) {
            var _this = $(e.target);
            if (_this.find("input[type=checkbox]:eq(0)").attr("disabled")) {
                return false;
            }
            // label样式设置
            var _thisColumnClass = $(e.target).attr("class");
            if (_this.attr("data-selected") == "selected") {
                _this.attr("data-selected", "");
            } else {
                _this.attr("data-selected", "selected");
            }
            var pattern = /(keywords_)([0-9])+/;
            var _thisGroupIndex = _thisColumnClass.match(pattern)[2];
            vm.selected.TopicId = vm.head[_thisGroupIndex - 1].groupId;
            vm.selected.TopicName = vm.head[_thisGroupIndex - 1].title;
            var otherColumnInput = $("#hide-tab-1 table input[type=checkbox]:not(." + _thisColumnClass + ")"); //获取非本列的input checkbox
            otherColumnInput.attr("disabled", true).parent().addClass("checkbox-disabled"); //禁用其他列
            if (this.selected.column.length === 0) { //检测到本列数据为空时，还原其他列,并清空已有数据
                otherColumnInput.attr("disabled", false).parent().removeClass("checkbox-disabled");
                vm.selected.TopicId = "";
                vm.selected.TopicName = "";
            }

            // 点击页面的keyword后，自动跳转到search TAB下
            $("#left-menu li a:eq(0)").trigger("click");
            this.left_menu_trigger(0);
        },
        /**
         * [remove_from_table_selected 移除单个keyword的选中]
         * @method remove_from_table_selected
         * @param  {[type]}                   e [description]
         * @return {[type]}                     [description]
         */
        remove_from_table_selected: function(e) {
            var thisKeyword = $(e.target).parent().parent().find("span:eq(1)").text();
            $("label[for^=\"" + thisKeyword + "\"][data-selected=selected]").trigger("click").attr("data-selected", "");
        },
        /**
         * [remove_all_selected 移除所有keyword的选中]
         * @method remove_all_selected
         * @return {[type]}            [description]
         */
        remove_all_selected: function() {
            var selected = this.selected;
            $("#hide-tab-1 table input[type=checkbox]:checked").parent().trigger("click").attr("data-selected", "");
            selected.column = [];
            selected.TopicId = "";
            selected.TopicName = "";
            this.result.content = [];
            $("#right-tabs>li:not(:first)").remove();
            if ($("#hide-tab-2").css("bottom") === "0px") {
                $("#hide-tab-2>.tabs-handle>p").trigger("click");
            }
            $("#hide-tab-2>.tabs-handle").addClass("disabled");
            this.guide_show_status = true;
            this.content_show_status = false;
            this.content_slider_show_status = false;
            $("#home-tab").trigger("click");
            vm.show_bottom_tabs();
            disabled_parameter();
            disabled_change_right_menu(vm);
        },
        /**
         * [submit_all_keywords 提交所有选中的keyword]
         * @method submit_all_keywords
         * @return {[type]}            [description]
         */
        submit_all_keywords: function() {
            var keywords_data = {
                status: 0,
                message: "NewTopicQuery",
                data: {
                    TopicId: "",
                    TopicName: "",
                    KeywordsList: []
                }
            };
            if (vm.onExamlpe || vm.onExecute) {
                vm.onExamlpe = false;
                vm.onExecute = false;
            }
            $("div.carousel-inner:first>div.item").removeClass("active");
            $("li[data-target='#carousel']").removeClass("active");
            $("div.carousel-inner:first>div.item:first").addClass("active");
            $("li[data-target='#carousel']:first").addClass("active");

            var _keywords = this.selected.column;
            var keywords_pattern = new RegExp(/[a-zA-Z\s]+/g);
            for (var i = 0; i < _keywords.length; i++) {
                keywords_data.data.KeywordsList[i] = {
                    KeywordOrder: i,
                    Keyword: _keywords[i].match(keywords_pattern)[0]
                };
            }
            keywords_data.data.TopicId = vm.selected.TopicId;
            keywords_data.data.TopicName = vm.selected.TopicName;
            if (keywords_data.data.KeywordsList.length === 0) {
                alert("Please select keywords first!");
            } else {
                if ($("#hide-tab-1").css("bottom") == "0px") {
                    $("#hide-tab-1>div.tabs-handle>p").trigger("click");
                }
                // if (this.onExamlpe) {
                //     this.onExamlpe = !this.onExamlpe;
                //     this.exampleInfo.page = 0;
                // }
                // console.log(this.onExamlpe);
                // postAjax("../data/search_result",keywords_data,function(data){

                /**
                 *ajax获取文章查询结果
                 */
                getAjax("../data/search_result/result.json", null, function(data) { //
                    if (data.status === 0) {
                        // $("#right-tabs>li:not(:first)").;
                        $("#hide-tab-2>.disabled").removeClass("disabled");
                        vm.result.content = [];
                        $(".tab-title>button").trigger("click");
                        vm.chartsData.labels = [];
                        vm.chartsData.data = [];
                        vm.result.centent = data.data.News;
                        var result_content_model = {
                            title: "",
                            id: "",
                            confident: ""
                        };
                        disabled_parameter();
                        disabled_change_right_menu(vm);
                        for (var j = 0; j < data.data.News.length; j++) {
                            vm.result.content.push(result_content_model);
                            vm.result.content[j].title = data.data.News[j].NewsTitle;
                            vm.result.content[j].id = data.data.News[j].NewsId;
                            vm.result.content[j].confident = data.data.News[j].confident;
                        }
                        for (var i = 0; i < data.data.DateNum.length; i++) {
                            vm.chartsData.labels.push(data.data.DateNum[i].Date);
                            vm.chartsData.data.push(data.data.DateNum[i].Count);
                        }
                        chart_setup(vm.chartsData);
                    }
                });
            }
        },
        /**
         * [chartsData 查询结果的柱状图数据]
         */
        chartsData: {
            labels: [],
            data: []
        },
        /**
         * [result 查询结果的数据]
         * @type {Object}
         */
        result: {
            content: []
        },
        /**
         * [show_result 展示查询结果]
         * @method show_result
         * @return {[type]}    [description]
         */
        show_result: function() {
            return (this.left_menu_status === 0) && (!isEmpty(this.result)) && (this.result.content.length !== 0);
        },
        /**
         * [guide_show_status 引导tab显示状态]
         * @type {Boolean}
         */
        guide_show_status: true,
        /**
         * [show_guide 页面中的引导tab显示控制器]
         * @method show_guide
         * @return {[type]}   [description]
         */
        show_guide: function() {
            return this.guide_show_status;
        },
        /**
         * [content 文章数据]
         * @type {Object}
         */
        content: {

        },
        /**
         * [content1 指代消解后的文章数据]
         * @type {Object}
         */
        content1: {

        },
        /**
         * [content_show_status 文章tab的显示状态]
         * @type {Boolean}
         */
        content_show_status: false,
        /**
         * [show_content 页面中的文章tab显示控制器]
         * @method show_content
         * @return {[type]}     [description]
         */
        show_content: function() {
            return this.content_show_status;
        },
        /**
         * [update_content_parameter 更新页面content的内容]
         * @method update_content_parameter
         * @param  {[type]}                 data_id [文章数据的id]
         * @return {[type]}                         [description]
         */
        update_content_parameter: function(data_id) {
            var data1 = {
                "status": 1,
                "message": " NewsDetailQuery",
                "newsId": data_id
            };
            // console.log(data_id);
            if (data1.newsId !== "home-tab") {
                getAjax("../data/content/" + data_id + ".json", null, function(data) { //文章内容和slider第一页
                    // postAjax(url,data,function(data){
                    if (data.NewsId == data_id) {
                        if (data.status == 2) {
                            //更新文章内容
                            data.NewsContent = data.NewsContent.replace(/([\"])/g, " ”");
                            data.NewsContent = data.NewsContent.replace(/(['])/g, " ’");
                            vm.content = data;
                            this.guide_show_status = false;
                            this.content_show_status = true;
                            //更新参数内容
                            // vm.sliderData = data.sliderData;
                            // setup_slider_group("slider", vm.sliderData);
                        }
                    }
                });
            }

        },
        /**
         * [update_content_parameter_after 更新slider content指代消解后的的内容]
         * @method update_content_parameter_after
         * @param  {[type]}                       data_id [文章数据的id]
         * @return {[type]}                               [description]
         */
        update_content_parameter_after: function(data_id) {
            var data1 = {
                "status": 1,
                "message": " NewsDetailQuery",
                "newsId": data_id
            };
            // console.log(data_id);
            if (data1.newsId !== "home-tab") {
                getAjax("../data/after/" + data_id + ".json", null, function(data) { //指代消解后
                    // postAjax(url,data,function(data){
                    if (data.NewsId == data_id) {
                        if (data.status == 3) {
                            //更新文章内容
                            data.NewsContent = data.NewsContent.replace(/([\"])/g, " ”");
                            data.NewsContent = data.NewsContent.replace(/(['])/g, " ’");
                            vm.content1 = data;
                            this.guide_show_status = false;
                            this.content_show_status = true;
                        }
                    }
                });
            }

        },
        /**
         * [open_content_tab 左侧文章查询结果和对应右侧文章tab打开关闭控制]
         * @method open_content_tab
         * @param  {[type]}         e [description]
         * @return {[type]}           [description]
         */
        open_content_tab: function(e) {
            var _this = $(e.target);
            var _thisLink = _this.parent();
            var data_id = _thisLink.attr("data-id");
            if ($("#" + data_id)[0]) { //关闭文章tab
                $("#" + data_id + " button").trigger("click");
                disabled_change_right_menu(vm);
                // this.update_selected_content();
            } else if (!$("#" + data_id)[0]) { //打开新的文章tab
                change_folder_icon(_thisLink);
                addTab(_this.text(), data_id);
                disabled_change_right_menu(vm);
                data_id = $("#right-tabs>li.active").attr("id");
                vm.executeInfo.id = data_id;
                vm.update_content_parameter(data_id);
                vm.update_content_parameter_after(data_id);
                vm.update_triplets_data(data_id);
                //打开新的标签页时初始化轮播器为第一页
                $("#content .item").removeClass("active");
                $("#content .item:first").addClass("active");
                $("li[data-target='#content']").removeClass("active");
                $("li[data-target='#content']:first").addClass("active");
            }
            if ($("#hide-tab-2").css("bottom") === "0px") {
                $("#hide-tab-2>div.tabs-handle>p").trigger("click");
            }
        },
        /**
         * [TripletsData 运行时轮播的三元组数据]
         * @type {Object}
         */
        TripletsData: {
            "winSize": null,
            "step": null,
            "SentenceNum": null,
            "Sentences": [{
                "SentenceOrder": null,
                "Sentence": "",
                "TripletsNum": null,
                "Triplets": [{
                    "TripletOrder": null,
                    "Confidence": "",
                    "Subject": "",
                    "Relation": "",
                    "Object": "",
                    "Attribute": ""
                }]
            }]
        },
        /**
         * [update_triplets_data 抽取新闻中有效的三元组]
         * @method update_triplets_data
         * @param  {[type]}             NewsId [文章数据id]
         * @return {[type]}                    [description]
         */
        update_triplets_data: function(NewsId) {
            var data = {
                "status": 1,
                "message": " NewsTripletsExtraction",
                "newsId": NewsId
            };
            // postAjax(url,data,function(data){
            if (data.newsId !== "home-tab") {
                console.log(data.newsId);
                getAjax("../data/triplets/" + data.newsId + ".json", null, function(data) { //slider3-4页三元组部分
                    console.log(vm.TripletsData1);
                    console.log(data.Data);
                    vm.TripletsData.Sentences = [];
                    vm.TripletsData = data.Data;
                    vm.sliderData = data.sliderData;
                    setup_slider_group("slider", vm.sliderData);
                    // vm.
                });
            }
        },
        /**
         * [show_slider_win_effect 开启轮播中的滑动窗口效果]
         * @method show_slider_win_effect
         * @return {[type]}               [description]
         */
        show_slider_win_effect: function() {
            var totalTriGroup = $(".Sentences1");
            var winSize = this.TripletsData.winSize;
            var firstIndex = -1;
            var step = this.TripletsData.step;
            var nowFinalIndex = winSize - step;

            var timer = setInterval(function() {
                if (nowFinalIndex == (-1)) {
                    //回调点
                    clearInterval(timer);
                    totalTriGroup.removeClass("in-win");
                } else {
                    nowFinalIndex += step;
                    var nowInWin = getItemsBetween(firstIndex, winSize, ".Sentences1");
                    totalTriGroup.removeClass("in-win");
                    nowInWin.addClass("in-win");
                    firstIndex += step;
                    if (nowFinalIndex >= totalTriGroup.length) {
                        nowFinalIndex = (-1);
                    }
                }
            }, 500);
        },
        /**
         * [left_menu_status 左侧页面菜单的选择状态]
         * @type {Number}
         */
        left_menu_status: 0,

        /**
         * [left_menu_trigger 左侧页面菜单的选择状态控制器]
         * @method left_menu_trigger
         * @param  {[type]}          status [description]
         * @return {[type]}                 [description]
         */
        left_menu_trigger: function(status) {
            // console.log(status);
            this.left_menu_status = status;
            if (status === 0) {
                this.enabled_left_part();
            } else if (status == 1) {}
        },
        /**
         * [show_search 左侧显示搜索结果页面tab]
         * @method show_search
         * @return {[type]}    [description]
         */
        show_search: function() {
            // console.log(this.left_menu_status===0);
            return this.left_menu_status === 0;
        },
        /**
         * [show_parameter 左侧显示属性设置页面tab]
         * @method show_parameter
         * @return {[type]}       [description]
         */
        show_parameter: function() {
            return this.left_menu_status === 1;
        },
        /**
         * [content_slider_show_status 右侧页面轮播分页控制]
         * @type {Boolean}
         */
        content_slider_show_status: false,
        /**
         * [show_content_slider 页面上的右侧页面轮播分页显示控制器]
         * @method show_content_slider
         * @return {[type]}            [description]
         */
        show_content_slider: function() {
            return vm.content_slider_show_status;
        },
        /**
         * [sliderData 属性滑动块控制]
         * @type {Array}
         */
        sliderData: [{
            parameter: "parameter0",
            min: 0,
            max: 100,
            val: 20
        }, {
            parameter: "parameter1",
            min: 0,
            max: 100,
            val: 30
        }, {
            parameter: "parameter2",
            min: 0,
            max: 100,
            val: 40
        }, {
            parameter: "parameter3",
            min: 0,
            max: 100,
            val: 50
        }, {
            parameter: "parameter4",
            min: 0,
            max: 100,
            val: 60
        }],
        /**
         * [onExecute 运行状态（是否在运行中）]
         * @type {Boolean}
         */
        onExecute: false,
        /**
         * [executeInfo 运行数据信息]
         * @type {Object}
         */
        executeInfo: {
            id: ""
        },
        /**
         * [example_img example轮播的图片信息，这部分功能尚未开发]
         * @type {Object}
         */
        example_img: {
            first: "1",
            list: ["2", "3", "4", "5", "6"]
        },
        /**
         * [showExampleSlider 示例轮播展示状态]
         * @type {Boolean}
         */
        showExampleSlider: false,
        /**
         * [show_example  示例轮播展示控制]
         * @method show_example
         * @param  {[type]}     index [示例序号]
         * @return {[type]}           [description]
         */
        show_example: function(index) {
            $("#home-tab").trigger("click");
            vm.showExampleSlider = true;
            $("li[data-target='#example'].active").removeClass("active");
            $("li[data-target='#example']:first").addClass("active");
            $("div.example-items").removeClass("active");
            $("div.example-items:first").addClass("active");
            if (index == 1) {
                vm.example_img = {
                    first: "1",
                    list: ["2", "3", "4", "5", "6"]
                }; //example1图集
            } else if (index == 2) {
                vm.example_img = {
                    first: "8",
                    list: ["9", "10", "11", "12", "13"]
                }; //example2图集
            }

        },
        /**
         * [GoExecute 开始运行]
         * @method GoExecute
         */
        GoExecute: function() {
            vm.execute(vm.executeInfo.id);
        },
        /**
         * [execute 实际执行方法]
         * @method execute
         * @param  {[type]} id        [执行的数据id]
         * @return {[type]}           [description]
         */
        execute: function(id) {
            var data = {};
            vm.onExecute = true;

            this.disabled_left_part();

            this.hide_bottom_tabs();
            $("#execute").addClass("disable-execute");
            vm.executeInfo.id = id;
            data = {
                id: id,
                parameters: []
            };
            var sliderData = vm.sliderData;
            for (var i = 0; i < sliderData.length; i++) {
                var sliderObj = {
                    parameter: sliderData[i].parameter,
                    val: sliderData[i].val
                };
                data.parameters.push(sliderObj);
                sliderObj = {};
            }

            // }


            this.content_slider_show_status = true;
            this.content_show_status = false;
            this.guide_show_status = false;

            $("div.carousel-inner:first>div.item").removeClass("active");
            $("li[data-target='#carousel']").removeClass("active");
            $("div.carousel-inner:first>div.item:first").addClass("active");
            $("li[data-target='#carousel']:first").addClass("active");

            $("a.carousel-control").addClass("disabled");

            // postAjax(url,data,function(data){
            //   if(data.status===0){
            //     // 提交文章id和属性完成后
            // if()
            disabled_change_right_menu(vm);
            vm.TripletsData.winSize = parseInt(vm.sliderData[0].val);
            vm.TripletsData.step = parseInt(vm.sliderData[1].val);

            console.log(vm.TripletsData.winSize);
            console.log(vm.TripletsData.step);
            vm.show_slider_win_effect();
            vm.right_slider_ctn();
            //   }
            // });
        },
        /**
         * [finish_execute 结束执行后调用，改变状态]
         * @method finish_execute
         * @return {[type]}       [description]
         */
        finish_execute: function() {
            this.onExecute = false;
            this.onExamlpe = false;
            this.enabled_left_part();
            vm.exampleInfo.page = 0;

            $("#right-menu>li,ul.dropdown-menu>li").removeClass("disabled").find("a").attr("disabled", false);
            $("#dropdown-toggle").attr({
                "data-toggle": "dropdown"
            });
            $("#modal-trigger").attr({
                "data-toggle": "modal",
                "data-target": "#myModal"
            });

            $(".bottom-hide-tabs").css("display", "block");
            for (var i = 0; i < $(".bottom-hide-tabs").length; i++) {
                var _thisTab = $(".bottom-hide-tabs").eq(i);
                if (_thisTab.css("bottom") == "0px") {
                    _thisTab.find(".tabs-handle>p").trigger("click");
                }
            }
            // vm.show_bottom_tabs();
            // $("body").scrollLeft($("body").css(height));
            // disabled_change_right_menu(this);

        },
        // update_parameter:function(contentId){
        //   // $("li[role=presentation][class=active]").attr("id");
        //   // postAjax(url,data,function(){
        //   if(contentId!=="home-tab"){
        //     postAjax("../data/parameter/"+contentId+".json",null,function(data){
        //       if(data.status===0){
        //
        //       }
        //     });
        //   }
        // },
        /**
         * [open_content 右侧tab打开文章的数据]
         * @type {Array}
         */
        open_content: [
            // {
            //   title:11,
            //   id:22
            // },{
            //   title:33,
            //   id:44
            // }
        ],
        /**
         * [selected_content 选中文章（待提交文章）的数据]
         * @type {Array}
         */
        selected_content: [],
        /**
         * [update_selected_content 更新选中的文章id]
         * @method update_selected_content
         * @return {[type]}                [description]
         */
        update_selected_content: function() {
            vm.open_content = [];
            var _content_tabs = $("#right-tabs>li:not(#home-tab)");
            var _content_tabs_num = _content_tabs.length;
            $("#myModal ul.list-group").html("");
            for (var i = 0; i < _content_tabs_num; i++) {
                vm.open_content[i] = {
                    title: $(_content_tabs[i]).find("span:eq(0)").text(),
                    id: $(_content_tabs[i]).attr("id")
                };
                $("#myModal ul.list-group").append("<li class=\" list-group-item\"><label for=\"" + vm.open_content[i].title + "\"><input id=\"" + vm.open_content[i].title + "\" type=\"checkbox\" name=\"name\"  value=\"" + vm.open_content[i].id + "\">" + vm.open_content[i].title + "</label></li>");
            }
        },
        /**
         * [upload_selected_content 提交选中的文章]
         * @method upload_selected_content
         * @return {[type]}                [description]
         */
        upload_selected_content: function() {
            this.selected_content = $("#myModal li.list-group-item input[type=checkbox]").val();
            var _selected_content = [];
            $("#myModal li.list-group-item input[type=checkbox]:checked").each(function() {
                _selected_content.push($(this).val());
            });
            this.selected_content = _selected_content;
            //ajax提交选中的数据

            // postAjax(url,this.selected_content,function(){
            window.location = "./result.html";
            // });
        },
        /**
         * [change_keywords_slider_up 底部tab分页滑动控制]
         * @method change_keywords_slider_up
         * @param  {[type]}                  e [description]
         * @return {[type]}                    [description]
         */
        change_keywords_slider_up: function(e) { //向上滑动
            var thisSlide = $(e.target).parent();
            var index = $(".keywords_slider").index(thisSlide);
            var prev = index - 1;
            $(".keywords_slider_btn").eq(index).animate({
                opacity: "0"
            }, 1000);
            $(".keywords_slider").eq(index).slideUp(1000);
            // console.log($(".keywords_slider").eq(index));
            $(".keywords_slider").eq(prev).slideDown(1000);
            // return false;
            $(".keywords_slider_btn").eq(prev).animate({
                opacity: "0.5"
            }, 1000);
        },
        /**
         * [change_keywords_slider_down 底部tab分页滑动控制]
         * @method change_keywords_slider_down
         * @param  {[type]}                    e [description]
         * @return {[type]}                      [description]
         */
        change_keywords_slider_down: function(e) { //向下滑动
            var thisSlide = $(e.target).parent();
            var index = $(".keywords_slider").index(thisSlide);
            var next = index + 1;
            // console.log($(".keywords_slider").eq(index));
            $(".keywords_slider").eq(index).slideUp(1000);
            $(".keywords_slider").eq(next).slideDown(1000);
            $(".keywords_slider_btn").eq(index).animate({
                opacity: "0"
            }, 1000);
            $(".keywords_slider_btn").eq(next).animate({
                opacity: "0.5"
            }, 1000);
            // return false;
        },
        /**
         * [show_bottom_tabs 底部tab开关显示隐藏控制]
         * @method show_bottom_tabs
         * @return {[type]}         [description]
         */
        show_bottom_tabs: function() {
            $(".bottom-hide-tabs").show(1000);
        },
        /**
         * [hide_bottom_tabs 底部tab开关显示隐藏控制]
         * @method hide_bottom_tabs
         * @return {[type]}         [description]
         */
        hide_bottom_tabs: function() {
            $(".bottom-hide-tabs").hide(1000);
        },
        /**
         * [disabled_left_part 提交属性执行程序后，禁用左侧菜单]
         * @method disabled_left_part
         * @return {[type]}           [description]
         */
        disabled_left_part: function() {
            // alert($("body").css("height"));
            $("#coverDiv").css({
                "height": $("body").height(),
                "width": $(".ui-layout-west").width() + 35
            }).show();
            $("div.ui-layout-resizer .ui-layout-resizer-west .ui-draggable-handle .ui-layout-resizer-open .ui-layout-resizer-west-open").removeClass("ui-draggable-handle");
            $(window).resize(function() {
                $("#coverDiv").css({
                    "height": $("body").height(),
                    "width": $(".ui-layout-west").width() + 35
                }).show();
            });
        },
        /**
         * [enabled_left_part 启用左侧菜单]
         * @method enabled_left_part
         * @return {[type]}          [description]
         */
        enabled_left_part: function() {
            $("#coverDiv").hide();
            $("#execute").removeClass("disable-execute");
        },
        /**
         * [disabled_parameter_panel 禁用属性面板]
         * @method disabled_parameter_panel
         * @return {[type]}                 [description]
         */
        disabled_parameter_panel: function() {
            $("#coverDiv").show();
            $("#coverDiv").css({
                "height": $("body").height() - 60,
                "width": $(".ui-layout-west").width() + 35
            }).show();
            // $("div.ui-layout-resizer .ui-layout-resizer-west .ui-draggable-handle .ui-layout-resizer-open .ui-layout-resizer-west-open").removeClass("ui-draggable-handle");
            $("#execute").addClass("disable-execute");
            console.log($("#execute").attr("class"));
            $(window).resize(function() {
                $("#coverDiv").css({
                    "height": $("body").height() - 60,
                    "width": $(".ui-layout-west").width() + 35
                }).show();
            });
        },

        // exampleInfo: {
        //     page: 1,
        //     example_id: ""
        // },

        onExamlpe: false,
        /**
         * [right_slider_ctn 运行轮播向右滚动控制]
         * @method right_slider_ctn
         * @return {[type]}         [description]
         */
        right_slider_ctn: function() {
            // if (this.onExamlpe) {
            //     var timer = setInterval(function() {
            //         $("a.right.carousel-control").trigger("click");
            //         vm.switch_slider_ajax(vm.exampleInfo.example_id, vm.exampleInfo.page);
            //         vm.exampleInfo.page++;
            //         if (vm.exampleInfo.page == 3) {
            //             $("#carousel>a.carousel-control").removeClass("disabled");
            //             clearInterval(timer);
            //             vm.finish_execute();
            //         }
            //     }, 3000); //example切换时间
            // } else if (this.onExecute) {
            var timer = setInterval(function() {
                $("a.right.carousel-control").trigger("click");
                vm.switch_slider_ajax(vm.executeInfo.id, vm.exampleInfo.page);
                vm.exampleInfo.page++;
                if (vm.exampleInfo.page == 3) {
                    $("#carousel>a.carousel-control").removeClass("disabled");
                    clearInterval(timer);
                    vm.finish_execute();
                }
            }, 15000); //execute切换时间
            // }

        },
        /**
         * [switch_slider_ajax 根据当前slider的index执行不同的ajax请求]
         * @method switch_slider_ajax
         * @param  {[type]}           id        [description]
         * @param  {[type]}           pageindex [description]
         * @return {[type]}                     [description]
         */
        switch_slider_ajax: function(id, pageindex) {
            console.log(pageindex);
            console.log(id);
            if (pageindex > 3) {
                vm.exampleInfo.example_id = 0;
            }
            switch (pageindex) {
                // case 0:
                //   vm.execute();
                //   break;
                // case 1:
                //     vm.update_content_parameter_after(id);
                //     break;
                // case 2:
                //     vm.update_triplets_data(id);
                //     break;
                // case 3:
                //     vm.update_triplets_data(id);
                //     // setTimeout(function(){
                //     vm.show_slider_win_effect();
                //     // },1000);
                //     break;
                case 1:
                    vm.setUpCharts1(id);
                    break;
                case 2:
                    vm.setUpCharts2(id);
                    break;
                default:

            }
            // $("#carousel").carousel("pause");
        },
        /**
         * [relationChartData1 轮播关系图一的数据]
         * @type {Object}
         */
        relationChartData1: {
            nodes: [],
            links: []
        },
        /**
         * [relationTripletData1 对应轮播关系图一的三元组的数据]
         * @type {Array}
         */
        relationTripletData1: [],
        /**
         * [relationChartData2 轮播关系图二的数据]
         * @type {Object}
         */
        relationChartData2: {
            nodes: [],
            links: []
        },
        /**
         * [relationTripletData1 对应轮播关系图二的三元组的数据]
         * @type {Array}
         */
        relationTripletData2: {

        },
        /**
         * [setUpCharts1 初始化轮播图表一]
         * @method setUpCharts1
         * @param  {[type]}     id [description]
         */
        setUpCharts1: function(id) {
            getAjax("../data/chartsData1/" + id + ".json", null, function(data) { //设置图表1
                if (data.Status === 5) {
                    vm.relationChartData1 = {
                        nodes: [],
                        links: []
                    };
                    vm.relationTripletData1 = [];
                    vm.relationTripletData1 = data.Data.WindowsGroup;
                    // console.log(vm.relationTripletData1);
                    vm.relationChartData1 = setNodesAndLinks1(data.EffTriples);
                    relation_chart_setup("relation-chart-1", vm.relationChartData1);
                }
            });
            // console.log(JSON.parse(JSON.stringify(vm.relationTripletData1)));
        },
        /**
         * [setUpCharts2 初始化轮播图表二]
         * @method setUpCharts2
         * @param  {[type]}     id [description]
         */
        setUpCharts2: function(id) {
            //设置图表二
            getAjax("../data/chartsData2/" + id + ".json", null, function(data) { //设置图表2
                if (data.Status === 6) {
                    vm.relationChartData2 = {
                        nodes: [],
                        links: []
                    };
                    vm.relationTripletData2 = [];
                    vm.relationTripletData2 = data.Data.Groups;
                    console.log(data.Data.Groups);
                    vm.relationChartData2 = setNodesAndLinks1(data.EffTriples);
                    // console.log(JSON.stringify(vm.relationChartData2));
                    relation_chart_setup("relation-chart-2", vm.relationChartData2);
                }
            });

        },
        /**
         * [update_slider_info 更新属性值信息]
         * @method update_slider_info
         * @return {[type]}           [description]
         */
        update_slider_info: function() {
            var leftBtn = $("#carousel a.left");
            var rightBtn = $("#carousel a.right");
            var sliderIndexNow = $("li[data-target=#carousel].active").attr("data-slide-to");
        }
    });

    avalon.scan(document.body);

    menu_active_effect("left");
    menu_active_effect("right");
    change_tabs_on_right(vm);
    setUp_hide_tabs();
    show_hide_tabs();
    disabled_change_right_menu(vm);
    $(window).resize(function() {
        setUp_hide_tabs();
    });
    setup_slider_group("slider", vm.sliderData);
    toggle_left_menu(vm);
    delete_tab(vm);
    $("#carousel").on('slid.bs.carousel', function() {
        $("#carousel").carousel("pause");
    });
});
/**
 * [setUp_keyword_table_column 初始化关键词]
 * @method setUp_keyword_table_column
 * @param  {[type]}                   columnNum [description]
 */
function setUp_keyword_table_column(columnNum) {
    $("#hide-tab-1 table>thead>tr").append("<th ms-for=\"(key,el) in @head | limitBy(" + columnNum + ")\" ms-attr=\"{id:@head[key].groupId}\">{{el.title}}</th>");
    for (var i = 1; i <= columnNum; i++) {
        $("#hide-tab-1 table>tbody>tr").append("<td><label ms-for=\"(key,el) in @keywords_" + i + "\"   ms-on-click=\"@disabled_other_columns\"  ms-attr=\"{for:el+'_'+key,class:'keywords_" + i + "'}\"><input  type=\"checkbox\" ms-duplex=\"@selected.column\" ms-attr=\"{id:el+'_'+key,value:el+'_'+key,class:'keywords_" + i + "'}\">{{el}}</label></td>");
    }
}

function isEmpty(obj) {
    for (var name in obj) {
        return false;
    }
    return true;
}
/**
 * [chart_setup 初始化查询结果图表]
 * @method chart_setup
 * @param  {[type]}    data [包含links和nodes的数据]
 * @return {[type]}         [description]
 */
function chart_setup(data) {
    var myChart = echarts.init(document.getElementById('chartPosition'), 'macarons');
    var option = {
        title: {
            text: 'News Statistics',
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['The items of News']
        },

        toolbox: {
            show: true,
            feature: {
                // mark : {show: true},
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: {
                    show: true,
                    type: ['line', 'bar']
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            data: data.labels
                //  ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: 'The items of News',
            type: 'bar',
            data: data.data,
            // [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            markPoint: {
                data: [{
                    type: 'max',
                    name: '最大值'
                }, {
                    type: 'min',
                    name: '最小值'
                }]
            },
            markLine: {
                data: [{
                    type: 'average',
                    name: '平均值'
                }]
            }
        }]
    };
    myChart.setOption(option);
    if ($("#hide-tab-2").css("bottom") !== "0px") {
        $("#hide-tab-2>div.tabs-handle>p").trigger("click");
    }

}

/**
 * [relation_chart_setup 关系图表初始化]
 * @method relation_chart_setup
 * @param  {[type]}             id   [图表dom节点的id]
 * @param  {[type]}             data [图表数据]
 * @return {[type]}                  [description]
 */
function relation_chart_setup(id, data) {
    var myChart = echarts.init(document.getElementById(id), 'macarons');
    var option = {
        title: {
            // text: '人物关系：乔布斯',
            // subtext: '数据来自人立方',
            x: 'right',
            y: 'bottom'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} : {b}'
        },
        toolbox: {
            show: true,
            feature: {
                restore: {
                    show: true
                },
                // magicType: {show: true, type: ['force', 'chord']},
                saveAsImage: { show: true }
            }
        },
        // legend: {
        //   x: 'left',
        //   data:['家人','朋友']
        // },
        series: [{
            type: 'force',
            name: null,
            ribbonType: false,
            categories: [{
                // name: ''
            }, {
                // name: ''
            }, {
                // name: ''
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
                    nodeStyle: {
                        brushType: 'both',
                        borderColor: 'rgba(255,215,0,0.4)',
                        borderWidth: 1
                    },
                    linkStyle: {
                        type: 'curve',
                        width: 4
                    }
                },
                emphasis: {
                    label: {
                        show: true
                            // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    },
                    nodeStyle: {
                        r: 20
                    },
                    linkStyle: {}
                }
            },
            useWorker: true,
            minRadius: 15,
            maxRadius: 20,
            gravity: 1.1,
            scaling: 1.5,
            roam: true,
            nodes: data.nodes,
            links: data.links
        }]
    };

    myChart.setOption(option);
}
/**
 * [setNodesAndLinks1 格式化处理关系图一的数据]
 * @method setNodesAndLinks1
 * @param  {[type]}          data [description]
 */
function setNodesAndLinks1(data) {
    var nodes = [];
    var links = [];
    for (var i = 0; i < data.length; i++) {
        var _thisTriplet = data[i];
        var nodeObj_1 = {};
        nodeObj_1.category = 1;
        // nodeObj_1.name ="Subject :"+data[i].Subject;
        nodeObj_1.name = data[i].Subject;
        // nodeObj_1.label = i + "-1";
        nodeObj_1.value = 1;
        var nodeObj_2 = {};
        nodeObj_2.category = 1;
        // nodeObj_2.name ="Object :"+data[i].Object;
        nodeObj_2.name = data[i].Object;
        // nodeObj_2.label = i + "-2";
        nodeObj_2.value = 2;
        // {category:1, name: '1-1',value : 2,label:'2'},

        var linkObj = {};
        linkObj.source = nodeObj_1.name;
        linkObj.target = nodeObj_2.name;
        linkObj.weight = 1;
        linkObj.name = "Relation : " + data[i].Relation;
        var nodeSame1 = 0;
        var nodeSame2 = 0;
        for (var j = 0; j < nodes.length; j++) {
            if (nodes[j].name == data[i].Subject) {
                nodeSame1++;
                nodes[j].value++;
            }
            if (nodes[j].name == data[i].Object) {
                nodeSame2++;
                nodes[j].value++;
            }
        }
        if (nodeSame1 === 0) {
            nodes.push(nodeObj_1);
        }
        if (nodeSame2 === 0) {
            nodes.push(nodeObj_2);
        }
        links.push(linkObj);
    }
    console.log(nodes);
    console.log(links);
    return {
        links: links,
        nodes: nodes
    };
}

/**
 * [setNodesAndLinks2 格式化处理关系图二的数据]
 * @method setNodesAndLinks2
 * @param  {[type]}          data      [图表数据]
 * @param  {[type]}          coverSame [覆盖处理相同节点]
 */
function setNodesAndLinks2(data, coverSame) {
    var nodes = [];
    var links = [];
    for (var i = 0; i < data.Groups.length; i++) {
        var _thisGroup = data.Groups[i];
        var nodeObj = {};
        var linkObj = {};
        for (var j = 0; j < _thisGroup.Triplets.length; j++) {
            var _thisTriplets = _thisGroup.Triplets[j];
            nodeObj.category = i;
            if (!_thisTriplets.Context) {
                nodeObj.name = "( " + _thisTriplets.Subject + "," + _thisTriplets.Relation + "," + _thisTriplets.Object + " )";
            } else {
                nodeObj.name = "( " + _thisTriplets.Context + " )";
            }
            if (j === 0) {
                linkObj.source = nodeObj.name;
            } else if (j == 1) {
                linkObj.target = nodeObj.name;
                linkObj.weight = 1;
                linkObj.name = _thisGroup.Similarity;
                links.push(linkObj);
            }
            nodeObj.value = _thisGroup.Similarity;
            nodeObj.label = i + "-" + _thisTriplets.TripletOrder;

            if (coverSame === true) {
                var nodeSame = 0;
                for (var k = 0; k < nodes.length; k++) {
                    if (nodes[k].name == nodeObj.name) { //不存在重名
                        nodeSame++;
                    }
                }
                if (nodeSame === 0) {
                    nodes.push(nodeObj);
                }
            } else {
                nodes.push(nodeObj);
            }
            nodeObj = {};
        }
    }
    console.log(nodes);
    console.log(links);
    return {
        links: links,
        nodes: nodes
    };
}
/**
 * [menu_active_effect 激活菜单]
 * @method menu_active_effect
 * @param  {[type]}           position [确定位置的字符串]
 * @return {[type]}                    [description]
 */
function menu_active_effect(position) {
    $("#" + position + "-menu>li").on("click", function() {
        $("#" + position + "-menu>li").removeClass("active");
        $(this).addClass("active");
        if (position == "right") {
            $("li.dropdown").removeClass("active");
        }
    });

}
/**
 * [change_tabs_on_left_menu 切换左侧tab]
 * @method change_tabs_on_left_menu
 * @return {[type]}                 [description]
 */
function change_tabs_on_left_menu() {
    var menu_links = $("#left-menu>li");
    menu_links.eq(0).on("click", function() {
        show_left_tab("search");
    });
    menu_links.eq(1).on("click", function() {
        show_left_tab("parameters");
    });
}
/**
 * [show_left_tab 显示左侧的tab]
 * @method show_left_tab
 * @param  {[type]}      id [确定tab的dom节点的id]
 * @return {[type]}         [description]
 */
function show_left_tab(id) {
    $(".left-tabs").addClass("hide");
    $("#" + id + "-tab").removeClass("hide");
}
/**
 * [setup_slider_group 初始化属性滑动条]
 * @method setup_slider_group
 * @param  {[type]}           groupId    [description]
 * @param  {[type]}           sliderData [description]
 * @return {[type]}                      [description]
 */
function setup_slider_group(groupId, sliderData) {
    for (var i = 0; i < sliderData.length; i++) {
        setup_parameter_slider(groupId + "-" + i, sliderData[i].min, sliderData[i].max, sliderData[i].val);
    }
}
/**
 * [setup_parameter_slider 初始化属性滑动条]
 * @method setup_parameter_slider
 * @param  {[type]}               id  [description]
 * @param  {[type]}               min [description]
 * @param  {[type]}               max [description]
 * @param  {[type]}               val [description]
 * @return {[type]}                   [description]
 */
function setup_parameter_slider(id, min, max, val) {
    $("#" + id).slider({
        range: "min",
        min: min,
        max: max,
        value: val,
        slide: function(event, ui) {
            $("#amount-" + id).val(ui.value);
        }
    });
    $("#amount-" + id).val($("#" + id).slider("value"));
}
/**
 * [change_folder_icon 切换左侧文件打开关闭的图标]
 * @method change_folder_icon
 * @param  {[type]}           _this [description]
 * @return {[type]}                 [description]
 */
function change_folder_icon(_this) {
    // console.log(_this);
    var openIcon = _this.find("p.open-folder");
    var closeIcon = _this.find("p.close-folder");
    openIcon.removeClass("open-folder").addClass("close-folder");
    closeIcon.removeClass("close-folder").addClass("open-folder");
}
/**
 * [addTab 打开新的文章时，添加新tab]
 * @method addTab
 * @param  {[type]} tabTitle [description]
 * @param  {[type]} tabId    [description]
 */
function addTab(tabTitle, tabId) {
    if (!$("#" + tabId)[0]) {
        $("#right-tabs").append("<li id=\"" + tabId + "\" role='presentation'><a  class='tab-title'  href='#'><span>" + tabTitle + "</span><button class='close tab-delete' data-dismiss='alert' aria-label='Close' type='button'><span>&times;</span></button></a></li>");
        $("#right-tabs>li").removeClass("active");
        $("#right-tabs>li:last-child").addClass("active");
    }
    // enabled_parameter();
}
/**
 * [active_tabs_on_right 解除左侧tab禁用]
 * @method active_tabs_on_right
 * @param  {[type]}             index [tab序号]
 * @param  {[type]}             vm    [description]
 * @return {[type]}                   [description]
 */
function active_tabs_on_right(index, vm) {
    $("#right-tabs>li").removeClass("active");
    console.log("index:" + index);
    if (index == -1) {
        index = $("#right-tabs>li").length - 1;
    }
    console.log("index_af:" + index);
    $("#right-tabs>li:eq(" + index + ")").addClass("active");
    vm.executeInfo.id = $("#right-tabs>li.active").attr("id");
    // console.log(vm.executeInfo.id);
}
/**
 * [change_tabs_on_right 切换文章的tab]
 * @method change_tabs_on_right
 * @param  {[type]}             vm [description]
 * @return {[type]}                [description]
 */
function change_tabs_on_right(vm) {
    $(document).on("click", "#right-tabs>li", function() {
        var _this = $(this);
        var index = $("#right-tabs>li").index(_this);
        if (!vm.onExecute) { //未在执行中时切换页面
            // console.log("index:"+index);

            if (index === 0) {
                vm.guide_show_status = true;
                vm.content_show_status = false;
                vm.content_slider_show_status = false;
                vm.showExampleSlider = false;
                disabled_parameter();
            } else {
                vm.guide_show_status = false;
                vm.content_show_status = true;
                vm.content_slider_show_status = false;
                // enabled_parameter();
            }
            active_tabs_on_right(index, vm);
            var _thisContentId = $("#right-tabs>li.active").attr("id");
            vm.update_content_parameter(_thisContentId);
            vm.update_content_parameter_after(_thisContentId);
            vm.update_triplets_data(_thisContentId);
            //切换右侧选项卡时，初始化轮播器为第一页
            $("#content .item").removeClass("active");
            $("#content .item:first").addClass("active");
            $("li[data-target='#content']").removeClass("active");
            $("li[data-target='#content']:first").addClass("active");

        }
    });
}
/**
 * [delete_tab 右侧关闭tab时删除对应tab]
 * @method delete_tab
 * @param  {[type]}   vm [description]
 * @return {[type]}      [description]
 */
function delete_tab(vm) {
    $(document).on("click", ".tab-delete", function() {
        if (!vm.onExecute) {
            var thisLi = $(this).parent().parent();
            var index = $("#right-tabs>li").index(thisLi);
            if (index == 1) {
                if ($("#right-tabs>li").length == 2) {
                    index = index - 1;
                } else {
                    index = $("#right-tabs>li").length - 1;
                }
            }
            active_tabs_on_right(index, vm);
            thisLi.remove();
            var thisId = thisLi.attr("id");
            disabled_change_right_menu(vm);
            change_folder_icon($("a[data-id=" + thisId + "]"));
            // console.log($("#"));
            if (index === 0 && $("#right-tabs>li").length == 1) {
                $("#home-tab").trigger("click");
            }
        }
    });
}
/**
 * [show_hide_tabs 底部tab控制]
 * @method show_hide_tabs
 * @return {[type]}       [description]
 */
function show_hide_tabs() {
    $(document).on("click", ".tabs-handle:not(.disabled)>p", function() {
        var hide_tab = $(this).parent().parent();
        if (hide_tab.css("bottom") != "0px") {
            hide_tab.css("z-index", "200").stop().animate({
                bottom: "0px"
            }, 500);
        } else if (hide_tab.css("bottom") == "0px") {
            var index = $(".bottom-hide-tabs").index(hide_tab);
            var z_index = 100 + index;
            hide_tab.stop().animate({
                bottom: "-" + hide_tab.find(".bottom-hide-tabs-container").eq(0).css("height")
            }, 500).css("z-index", z_index);
        }
    });
}

/**
 * [setUp_hide_tabs 底部tab控制]
 * @method setUp_hide_tabs
 */
function setUp_hide_tabs() {
    // $(".bottom-hide-tabs").css("bottom","-"+$(this).find(".bottom-hide-tabs-container").eq(0).css("height"));
    var tabs = $(".bottom-hide-tabs");
    for (var i = 0; i < tabs.length; i++) {
        var _this = tabs.eq(i);
        var index = tabs.index(_this);
        var z_index = 100 + index;
        _this.css("bottom", "-" + _this.find(".bottom-hide-tabs-container").eq(0).css("height")).css("z-index", z_index);
    }
}
/**
 * [disabled_change_right_menu 控制右侧的顶部菜单的禁用/启用]
 * @method disabled_change_right_menu
 * @param  {[type]}                   vm [description]
 * @return {[type]}                      [description]
 */
function disabled_change_right_menu(vm) {
    if ($("#right-tabs>li").length == 1) {
        // console.log("yes");
        $("#right-menu>li,ul.dropdown-menu>li").addClass("disabled").find("a").attr("disabled", true);
        $("#dropdown-toggle").attr({
            "data-toggle": ""
        });
        $("#modal-trigger").attr({
            "data-toggle": "",
            "data-target": ""
        });

        $("#home-tab").trigger("click");
        // console.log(vm.guide_show_status);
        vm.guide_show_status = true;
        vm.content_show_status = false;
        vm.content_slider_show_status = false;
        disabled_parameter();
    } else if (vm.onExecute) {
        $("#right-menu>li,ul.dropdown-menu>li").addClass("disabled").find("a").attr("disabled", true);
        $("#dropdown-toggle").attr({
            "data-toggle": ""
        });
        $("#modal-trigger").attr({
            "data-toggle": "",
            "data-target": ""
        });
        // vm.guide_show_status=false;
        // vm.content_show_status=false;
        // vm.content_slider_show_status=true;
    } else {
        vm.guide_show_status = false;
        vm.content_show_status = true;
        vm.content_slider_show_status = false;
        $("#right-menu>li,ul.dropdown-menu>li").removeClass("disabled").find("a").attr("disabled", false);
        $("#dropdown-toggle").attr({
            "data-toggle": "dropdown"
        });
        $("#modal-trigger").attr({
            "data-toggle": "modal",
            "data-target": "#myModal"
        });
        // enabled_parameter();
    }
    avalon.scan(document.body);
}
/**
 * [toggle_left_menu 打开result的tab后，点击右侧的tab，左侧的menu随之切换]
 * @method toggle_left_menu
 * @param  {[type]}         vm [description]
 * @return {[type]}            [description]
 */
function toggle_left_menu(vm) {
    $(document).on("click", "#right-tabs>li:not(:first)", function() {
        if ($("#right-tabs>li:not(:first)").length !== 0) {
            // vm.left_menu_trigger(1);
            // $("#left-menu>li:eq(1)").trigger("click");
        }
    });
    $(document).on("click", "#content a.carousel-control.right", function() {
        var ContentCarouselItems = $("#content div.item");
        var activeItem = $("#content div.active");
        console.log(activeItem);
        // var index=activeItem.index(ContentCarouselItems);
        var index = ContentCarouselItems.index(activeItem);
        console.log(index);
        if (index == 1 || index == 2) {
            enabled_parameter();
            vm.left_menu_trigger(1);
            $("#left-menu>li:eq(1)").trigger("click");

        } else {
            vm.left_menu_trigger(0);
            $("#left-menu>li:eq(0)").trigger("click");
            disabled_parameter();
        }
    });
    $(document).on("click", "#content a.carousel-control.left", function() {
        // var ContentCarouselItems=$("#content div.item");
        // var activeItem=$("#content div.active");
        // console.log(activeItem);
        // // var index=activeItem.index(ContentCarouselItems);
        // var index=ContentCarouselItems.index(activeItem);
        // console.log(index);
        // if(index==1||index==2){
        //   vm.left_menu_trigger(1);
        //   $("#left-menu>li:eq(1)").trigger("click");
        // }else {
        disabled_parameter();
        vm.left_menu_trigger(0);
        $("#left-menu>li:eq(0)").trigger("click");
        // }
    });
    // $(document).on("click", "#right-tabs>li:first", function() {
    $(document).on("click", "#right-tabs>li", function() {
        if (!vm.onExecute) {
            vm.left_menu_trigger(0);
            // console.log("vm.left_menu_status:"+vm.left_menu_status);
            $("#left-menu>li:eq(0)").trigger("click");
        }

    });
}
/**
 * [disabled_parameter 禁用left_menu的parameter]
 * @method disabled_parameter
 * @return {[type]}           [description]
 */
function disabled_parameter() {
    $("#left-menu>li:eq(1)").addClass("disabled");
    // console.log($("#execute").attr("class"));
    var parameter_offset = $("#left-menu>li:eq(1)").offset();
    $("#cover").removeClass("hide").css({
        "left": parameter_offset.left,
        "top": parameter_offset.top,
        "width": "113px",
        "position": "fixed",
        "height": "50px",
        "z-index": "1000"
    });

}
/**
 * [enabled_parameter 启用left_menu的parameter]
 * @method enabled_parameter
 * @return {[type]}          [description]
 */
function enabled_parameter() {
    $("#left-menu>li:eq(1)").removeClass("disabled");
    $("#cover").addClass("hide");
}

/**
 * [getItemsBetween  用于滑动窗口效果 firstIndex是第一个元素的index，lastIndex是最后一个的后面一个的index;]
 * @method getItemsBetween
 * @param  {[type]}        firstIndex [description]
 * @param  {[type]}        lastIndex  [description]
 * @param  {[type]}        selecter   [description]
 * @return {[type]}                   [description]
 */
function getItemsBetween(firstIndex, lastIndex, selecter) {
    if (firstIndex == (-1)) {
        return $(selecter + ":lt(" + lastIndex + ")");
    }
    // console.log($(selecter+":gt("+firstIndex+"):lt("+lastIndex+")"));
    return $(selecter + ":gt(" + firstIndex + "):lt(" + lastIndex + ")");
}
/**
 * [postAjax post提交封装]
 * @method postAjax
 * @param  {[type]} url     [description]
 * @param  {[type]} data    [description]
 * @param  {[type]} success [description]
 * @return {[type]}         [description]
 */
function postAjax(url, data, success) {
    $.ajax({
        type: 'POST',
        url: url,
        content: "application/json",
        dataType: 'json',
        data: data,
        success: success,
        error: function() {
            alert("服务器好像不太给力～");
        }
    });

}
/**
 * [getAjax get提交封装]
 * @method getAjax
 * @param  {[type]} url     [description]
 * @param  {[type]} data    [description]
 * @param  {[type]} success [description]
 * @return {[type]}         [description]
 */
function getAjax(url, data, success) {
    $.ajax({
        type: 'GET',
        url: url,
        content: "application/json",
        dataType: 'json',
        data: JSON.stringify(data),
        success: success,
        error: function(xhr, error) {
            alert("服务器好像不太给力～\n" + error);
        }
    });
}
