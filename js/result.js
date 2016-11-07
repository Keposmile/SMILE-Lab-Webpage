$(document).ready(function() {
    $("#returnBtn").on("click", function() {
        window.location = "./index.html";
    });
    // showRelationship("/data/result/tep1.json");
    var vm_result = avalon.define({
        $id: "leftDiv",
        title: "Multi-Document Semantics",
        content: [
            //     {
            //      Num:1,
            //      Entity:"aa",
            //     //  Neighbours:[{
            //     //     TripletOrder:1,
            //     //     Confidence:0.82,
            //     //     Subject:"Comcast",
            //     //     Relation:"aa",
            //     //     Object:"bb",
            //     //     Attribute:"attri"
            //     //  },{
            //     //      TripletOrder:1,
            //     //      Confidence:0.82,
            //     //      Subject:"Comcast",
            //     //      Relation:"aa",
            //     //      Object:"bb",
            //     //      Attribute:"attri"
            //     //  }]
            //     Neighbours:[{
            //         Source:"articleOne",
            //         Triplets:[{
            //             TripletOrder:1,
            //             Confidence:0.82,
            //             Subject:"Comcast",
            //             Relation:"aa",
            //             Object:"bb",
            //             Context:"attri",
            //             this:"bb"
            //         },{
            //             TripletOrder:1,
            //             Confidence:0.82,
            //             Subject:"Comcast",
            //             Relation:"aa",
            //             Object:"bb",
            //             Context:"attri"
            //         }]
            //     },{
            //         Source:"articleTwo",
            //         Triplets:[{
            //             TripletOrder:1,
            //             Confidence:0.82,
            //             Subject:"Comcast",
            //             Relation:"aa",
            //             Object:"bb",
            //             Context:"attri",
            //             this:"bb"
            //         },{
            //             TripletOrder:1,
            //             Confidence:0.82,
            //             Subject:"Comcast",
            //             Relation:"aa",
            //             Object:"bb",
            //             Context:"attri"
            //         }]
            //     }]
            //    },{
            //      Num:2,
            //      Entity:"Comcast",
            //      Neighbours:[{
            //         Source:"articleOne",
            //         Triplets:[{
            //             TripletOrder:1,
            //             Confidence:0.82,
            //             Subject:"Comcast",
            //             Relation:"aa",
            //             Object:"bb",
            //             Context:"attri"
            //         },{
            //             TripletOrder:1,
            //             Confidence:0.82,
            //             Subject:"Comcast",
            //             Relation:"aa",
            //             Object:"bb",
            //             Context:"attri"
            //         }]
            //      }]
            //    }
            {
                "Num": 1,
                "Entity": "Billionaire Donald Trump",
                "Neighbours": [{
                        "Source": "Hillary's 'favorable' number plummets to 38 percent as Ben Carson's headline-grabbing comments about Muslims have made him MORE popular",
                        "Triples": [{
                                "TripletOrder": 1,
                                "Confidence": 0.82,
                                "Subject": "Billionaire Donald Trump status as the GOP presidential front-runner",
                                "Relation": "has stayed",
                                "Object": "steady",
                                "Context": "",
                                "this": "Billionaire Donald Trump"
                            },
                            {
                                "TripletOrder": 2,
                                "Confidence": 0.82,
                                "Subject": "Billionaire Donald Trump",
                                "Relation": "entered",
                                "Object": "the 2016 presidential race",
                                "Context": ""
                            },
                            {
                                "TripletOrder": 3,
                                "Confidence": 0.82,
                                "Subject": "Billionaire Donald Trump",
                                "Relation": "has stayed",
                                "Object": "steady",
                                "Context": ""
                            }
                        ]
                    },
                    {
                        "Source": "Insider vs. Outsider Matchup Finds Clinton, Trump Near Even",
                        "Triples": [{
                            "TripletOrder": 1,
                            "Confidence": 0.82,
                            "Subject": "Ben Carson",
                            "Relation": "that total",
                            "Object": "just 8 percent behind Billionaire Donald Trump",
                            "Context": ""
                        }]
                    }
                ]
            },
            {
                "Num": 2,
                "Entity": "Democratic",
                "Neighbours": [{
                        "Source": "Democratic",
                        "Triples": [{
                                "TripletOrder": 1,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 2,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 3,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            }
                        ]
                    },
                    {
                        "Source": "articleTwo",
                        "Triples": [{
                                "TripletOrder": 1,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 2,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 3,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            }
                        ]
                    }
                ]
            }, {
                "Num": 2,
                "Entity": "Candidate",
                "Neighbours": [{
                        "Source": "Democratic",
                        "Triples": [{
                                "TripletOrder": 1,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 2,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 3,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            }
                        ]
                    },
                    {
                        "Source": "articleTwo",
                        "Triples": [{
                                "TripletOrder": 1,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 2,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 3,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            }
                        ]
                    }
                ]
            }, {
                "Num": 2,
                "Entity": "Republican",
                "Neighbours": [{
                        "Source": "Democratic",
                        "Triples": [{
                                "TripletOrder": 1,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 2,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 3,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            }
                        ]
                    },
                    {
                        "Source": "articleTwo",
                        "Triples": [{
                                "TripletOrder": 1,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 2,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 3,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            }
                        ]
                    }
                ]
            }, {
                "Num": 2,
                "Entity": "Hillary Rodem Clinton",
                "Neighbours": [{
                        "Source": "Hillary Rodem Clinton",
                        "Triples": [{
                                "TripletOrder": 1,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 2,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 3,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            }
                        ]
                    },
                    {
                        "Source": "articleTwo",
                        "Triples": [{
                                "TripletOrder": 1,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 2,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            },
                            {
                                "TripletOrder": 3,
                                "Confidence": 0.82,
                                "Subject": "Comcast",
                                "Relation": "aa",
                                "Object": "bb",
                                "Context": "attri"
                            }
                        ]
                    }
                ]
            }
        ],
        graphData: {},
        /**
         * [updateGraphData 此方法由于数据未能完成暂不使用]
         * @method updateGraphData
         * @param  {[type]}        url1 [description]
         * @param  {[type]}        url2 [description]
         * @return {[type]}             [description]
         */
        updateGraphData: function(url1, url2) {
            getAjax(url2, null, function(data) {
                data = JSON.parse(JSON.stringify(data));
                console.log("拉取数据成功！");
                var resultModel = JSON.parse(JSON.stringify(vm_result.$model));
                for (var i = 0; i < data.nodes.length; i++) {
                    var flag_node = 0;
                    console.log(resultModel.graphData.nodes);
                    for (var k = 0; k < resultModel.graphData.nodes.length; k++) {
                        var node = resultModel.graphData.nodes[k];
                        // console.log("node:");
                        // console.log(node);
                        // console.log("data.nodes["+i+"]:");
                        // console.log(data.nodes[i]);
                        if (node == data.nodes[i] || node.id == data.nodes[i].id || node.name == data.nodes[i].name) {
                            flag_node = 1;
                        }
                    }
                    if (flag_node === 0) {
                        console.log("push1");
                        vm_result.graphData.nodes.push(data.nodes[i]);
                    }
                }
                for (var j = 0; j < data.links.length; j++) {
                    var flag_link = 0;
                    for (var k = 0; k < resultModel.graphData.links.length; k++) {
                        var link = resultModel.graphData.links[k];
                        if (link == data.links[j] || link.id == data.links[j].id || link.tags == data.links[j].tags) {
                            flag_link = 1;
                            console.log("same");
                        }
                    }
                    if (flag_link === 0) {
                        console.log("push2");
                        vm_result.graphData.links.push(data.links[j]);
                    }
                }
                showRelationship(url1, vm_result.graphData);
            });

        }
    });
    showRelationship("/data/result/temp.json", vm_result.graphData);
});

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
