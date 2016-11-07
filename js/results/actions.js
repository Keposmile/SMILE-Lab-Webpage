(function() {
  var currentExpander, currentFrom, currentTo, currentVis, drawSources, getFile, makeJsonCall, registerMouseHandlers, rememberCurrent, showResultsStats, visElement;
  visElement = '#vis';
  currentVis = null;
  currentExpander = null;
  currentFrom = void 0;
  currentTo = void 0;
  window.showRelationship = function(url,graphData) {
    var name1, name2, expander, num, from, to;
    var entityUrl, fromQ, numQ, toQ;
    console.log(graphData);
    graphData=JSON.parse(JSON.stringify(graphData.$model));
    console.log(graphData);
    clearGraph();
    // entityUrl = jsRoutes.controllers.Graphs.relationship(name1, name2, expander).url;
    // fromQ = from ? "&from=" + from : "";
    // toQ = to ? "&to=" + to : "";
    // numQ = num ? "&num=" + num : "";
    // showGlobalLoading();
    return $.getJSON(url, function(graph) {
    //   for(var i = 0;i<graph.nodes.length;i++){
    //     var flag=0;
    //     for(var k1=0;k1<graphData.nodes.length;k1++){
    //         var node=graphData.nodes[k1];
    //         if(node == graph.nodes[i]||node.id==graph.nodes[i].id||node.name== graph.nodes[i].name){
    //             flag=1;
    //         }
    //     }
    //     if(flag===0){
    //         graphData.nodes.push(graph.nodes[i]);
    //     }
    //   }
    //   for(var j = 0;j<graph.links.length;j++){
    //     var flag=0;
    //     for(var k2=0;k2<graphData.links.length;k2++){
    //         var link=graphData.links[k2];
    //         if(link == graph.links[j]||link.id==graph.links[j].id||link.tag== graph.links[j].tag){
    //             flag=1;
    //         }
    //     }
    //     if(flag===0){
    //         graphData.links.push(graph.links[j]);
    //     }
    //   }
    //   console.log(graphData);
    //   graph=graphData;
      var focusNodes, vis;
      focusNodes = $.grep(graph.nodes, function(n, i) {
        return n.name === name1 || n.name === name2;
      });
      vis = NetworksOfNames().dom(visElement).graph(graph).highlight(focusNodes);
      rememberCurrent(vis, expander, from, to);
      registerMouseHandlers();
    //   console.log(vm_result.graphData);
      return vis();
    }).success(function() {
      return hideGlobalError();
    }).fail(function() {
      return showGlobalError("No connection found between " + name1 + " and " + name2 + ".");
    }).always(function() {
      return hideGlobalLoading();
    });
  };
  window.showEntity = function(name, expander, num, from, to) {
    var entityUrl, fromQ, numQ, toQ;
    clearGraph();
    entityUrl = jsRoutes.controllers.Graphs.entity(name, expander).url;
    fromQ = from ? "&from=" + from : "";
    toQ = to ? "&to=" + to : "";
    numQ = num ? "&num=" + num : "";
    showGlobalLoading();
    return $.getJSON(entityUrl + numQ + fromQ + toQ, function(graph) {
      var focusNodes, vis;
      focusNodes = $.grep(graph.nodes, function(n, i) {
        return n.name === name;
      });
      vis = NetworksOfNames().dom(visElement).graph(graph).highlight(focusNodes);
      rememberCurrent(vis, expander, from, to);
      registerMouseHandlers();
      return vis();
    }).success(function() {
      return hideGlobalError();
    }).fail(function() {
      return showGlobalError("" + name + " not found.");
    }).always(function() {
      return hideGlobalLoading();
    });
  };
  registerMouseHandlers = function(vis) {
    if (!vis) {
      vis = currentVis;
    }
    return vis.onNodeContextmenu(showNodeContextmenu).onLinkClick(function(l) {
      return showSources(l.id);
    }).onLabelClick(function(l) {
      return showSources(l.id);
    }).onLinkContextmenu(showLinkContextmenu).onLabelContextmenu(showLinkContextmenu);
  };
  rememberCurrent = function(vis, expander, from, to) {
    currentVis = vis;
    currentExpander = expander;
    currentFrom = from ? from : void 0;
    return currentTo = to ? to : void 0;
  };
  window.expandMoreNeighbors = function(node) {
    var expanded, fromQ, ignore, toQ, url;
    expanded = currentVis.nodeIds();
    ignore = currentVis.removedNodeIds();
    fromQ = currentFrom ? "&from=" + currentFrom : "";
    toQ = currentTo ? "&to=" + currentTo : "";
    url = jsRoutes.controllers.Graphs.expandNeighbors(node.id, expanded, ignore, currentExpander).url;
    return $.getJSON(url + fromQ + toQ, function(json) {
      return currentVis.updateAdd(json);
    });
  };
  window.expandNeighbors = function(nodeId, neighbors) {
    var exclude, fromQ, toQ, url;
    exclude = currentVis.nodeIds();
    fromQ = currentFrom ? "&from=" + currentFrom : "";
    toQ = currentTo ? "&to=" + currentTo : "";
    url = jsRoutes.controllers.Graphs.expandNeighborsById(nodeId, exclude, neighbors).url;
    return $.getJSON(url + fromQ + toQ, function(json) {
      return currentVis.updateAdd(json);
    });
  };
  window.removeLink = function(linkId) {
    return currentVis.removeLink(linkId);
  };
  window.removeNode = function(node) {
    return removeNodes([node]);
  };
  window.removeNodes = function(nodes) {
    return currentVis.updateRemove(nodes);
  };
  window.clearGraph = function() {
    return $(visElement + ' > svg').remove();
  };
  window.showSources = function(linkId) {
    var clusteredSourcesUrl;
    showResultsStats("", "");
    clusteredSourcesUrl = jsRoutes.controllers.Graphs.clusteredSources(linkId, currentFrom, currentTo).url;
    emptySourcesModal();
    $('#modal-sources .loading').show();
    $('#modal-sources').modal({
      backdrop: false
    });
    return $.getJSON(clusteredSourcesUrl, function(json) {
      $('#modal-sources .loading').hide();
      return drawSources(linkId, json);
    });
  };
  drawSources = function(linkId, json) {
    if (json.numSources < json.numAllSources) {
      $('#sources-list').prepend('<li class="alert alert-info">\
        <button type="button" class="close" data-dismiss="alert">&times;</button>\
        <strong>Note.</strong> ' + json.numSources + ' of ' + json.numAllSources + ' sources are shown here. You might consider\
        limiting the timeframe of your search to reduce the number of sources.\
      </li>');
    }
    $.each(json.clusters, function(i, cluster) {
      return $('#sources-list').append('<li class="source">' + clusterWidget(cluster.proxies, cluster.rest, json.entity1, json.entity2, linkId, json.tags) + '</li>');
    });
    return showResultsStats(json.numSources, json.numClusters);
  };
  makeJsonCall = function(url) {
    return $.ajax({
      dataType: "json",
      url: url
    });
  };
  showResultsStats = function(numSources, numClusters) {
    var stats;
    stats = "" + numSources + " sources in " + numClusters + " clusters";
    return $('#sources-results-stats').html(stats);
  };
  window.showNeighbors = function(node) {
    var exclude, fromQ, toQ, url;
    exclude = currentVis.nodeIds();
    url = jsRoutes.controllers.Graphs.neighbors(node.id, exclude, currentExpander).url;
    fromQ = currentFrom ? "&from=" + currentFrom : "";
    toQ = currentTo ? "&to=" + currentTo : "";
    emptyNeighborsModal();
    $('#modal-neighbors .loading').show();
    $('#modal-neighbors').modal({
      backdrop: false
    });
    return $.getJSON(url + fromQ + toQ, function(json) {
      $('#modal-neighbors .loading').hide();
      $('#modal-neighbors #neighbors-of-name').html(node.name);
      $('#modal-neighbors #neighbors-of-id').val(node.id);
      return $.each(json.neighbors, function(i, neighbor) {
        return $('#modal-neighbors #neighbors-list').append('<li class="neighbor">\
          <label class="checkbox">\
            <input type="checkbox" value="' + neighbor.id + '">\
            ' + neighbor.name + '\
          </label>\
        </li>');
      });
    });
  };
  window.setLabel = function(linkId, label) {
    currentVis.setLabel(linkId, label);
    if (label) {
      return confirmLabel(linkId, label);
    }
  };
  window.confirmLabel = function(linkId, label) {
    $.get(jsRoutes.controllers.Tags.castPositiveVoteByLabel(linkId, label).url);
    return checkTagsWithLabel(linkId, label);
  };
  window.removeLabel = function(linkId, label) {
    currentVis.removeLabel(linkId, label);
    return rejectLabel(linkId, label);
  };
  window.rejectLabel = function(linkId, label) {
    $.get(jsRoutes.controllers.Tags.castNegativeVoteByLabel(linkId, label).url);
    return removeTagsWithLabel(linkId, label);
  };
  window.addTag = function(relationship, sentence, label, direction, callback) {
    var url;
    url = jsRoutes.controllers.Tags.add(relationship, sentence, label, direction).url;
    return $.getJSON(url, function(tag) {
      if (tag) {
        callback(tag);
        if (currentVis) {
          currentVis.addTag(tag.relationship, tag);
          return confirmLabel(tag.relationship, tag.label);
        }
      }
    });
  };
  window.pauseLayout = function() {
    if (currentVis) {
      return currentVis.pauseLayout();
    }
  };
  window.resumeLayout = function() {
    if (currentVis) {
      return currentVis.resumeLayout();
    }
  };
  window.applyForceSettings = function() {
    return currentVis.forceParameters($("#fs-linkDistance").val(), $("#fs-linkStrength").val(), $("#fs-friction").val(), $("#fs-charge").val(), $("#fs-theta").val(), $("#fs-gravity").val());
  };
  window.exportToSVG = function() {
    var blob, serializer, svg;
    if (currentVis) {
      showGlobalLoading();
      serializer = new XMLSerializer();
      svg = serializer.serializeToString($('svg')[0]);
      blob = new Blob([svg], {
        type: "image/svg+xml;charset=utf-8"
      });
      hideGlobalLoading();
      return saveAs(blob, "non-export.svg");
    }
  };
  window.exportToPNG = function() {
    var serializer, svg, url;
    if (currentVis) {
      showGlobalLoading();
      serializer = new XMLSerializer();
      svg = serializer.serializeToString($('svg')[0]);
      url = jsRoutes.controllers.Application.svgToPNG().url;
      return $.ajax({
        url: url,
        processData: false,
        type: "POST",
        data: svg,
        contentType: "text/plain;charset=UTF-8",
        dataType: "json",
        success: function(result) {
          return getFile(result.uuid);
        }
      }).success(function() {
        return hideGlobalError();
      }).fail(function() {
        return showGlobalError("Error converting the visualization to PNG.");
      }).always(function() {
        return hideGlobalLoading();
      });
    }
  };
  getFile = function(uuid) {
    var url;
    url = jsRoutes.controllers.Application.serveFile(uuid).url;
    return $('#downloader-iframe').attr("src", url);
  };
}).call(this);
