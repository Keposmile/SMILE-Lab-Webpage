(function() {
  var NetworksOfNames;
  NetworksOfNames = function() {
    var checkDropOn, colorByType, data, distance, dom, dragBehavior, dragInitiated, dynamicLinkOpacity, dynamicLinkWidth, fixAllNodes, force, hColorByType, height, highlightLink, highlightNode, labelClickHandler, labelContextmenuHandler, labels, layoutPaused, leftClickOnly, linkClickHandler, linkContextmenuHandler, linked, links, linksMap, maxLinkFreq, minStrokeWidth, neighborCount, neighboring, nodeClickHandler, nodeContextmenuHandler, nodeShapes, nodes, nodesMap, nodesToHighlight, non, normalFontFamily, normalFontSize, organizationColor, organizationHColor, paths, personColor, personHColor, preprocess, removedLinks, removedNodes, smallFontFamily, smallFontSize, strokeColor, strokeColorHigh, svg, tick, timeout, unhighlightLink, unhighlightNode, update, updateMouseHandlers, vis, width, zoom;
    width = 960;
    height = 800;
    minStrokeWidth = 2;
    strokeColor = "#999";
    strokeColorHigh = "#000";
    personColor = "#fa7";
    organizationColor = "#7af";
    personHColor = "#f77";
    organizationHColor = "#f77";
    normalFontFamily = "Sans-serif, Arial";
    normalFontSize = "14px";
    smallFontFamily = "Sans-serif, Arial";
    smallFontSize = "10px";
    svg = null;
    vis = null;
    dom = "body";
    data = null;
    nodesToHighlight = [];
    nodes = null;
    links = null;
    paths = null;
    labels = null;
    removedNodes = [];
    removedLinks = [];
    nodeShapes = null;
    nodesMap = d3.map();
    linksMap = d3.map();
    linked = {};
    force = d3.layout.force().linkDistance(300).linkStrength(1).friction(0.9).charge(-1000).theta(0.8).gravity(0.1).size([width, height]);
    layoutPaused = false;
    dragInitiated = false;
    maxLinkFreq = 0;
    timeout = null;
    nodeClickHandler = null;
    nodeContextmenuHandler = null;
    linkClickHandler = null;
    linkContextmenuHandler = null;
    labelClickHandler = null;
    labelContextmenuHandler = null;
    dynamicLinkWidth = function(l) {
      return minStrokeWidth;
    };
    dynamicLinkOpacity = function(l) {
      return Math.max(l.significance, 0.3);
    };
    preprocess = function(data) {
      data.nodes.forEach(function(n) {
        n.numShown = 0;
        return nodesMap.set(n.id, n);
      });
      data.links.forEach(function(l) {
        return linksMap.set(l.id, l);
      });
      data.nodes.forEach(function(n) {
        var d, initialX, initialY, nameHash;
        if (!n.preprocessed) {
          nameHash = Math.abs(n.name.hashCode());
          initialX = Math.floor(((nameHash & 0x0000FFFF) / 0xFFFF) * width);
          initialY = Math.floor(((nameHash >> 16) / 0xFFFF) * height);
          n.x = initialX;
          n.y = initialY;
          d = n.name.dimensions(normalFontSize + " " + normalFontFamily);
          n.width = d[0] + 10;
          n.height = d[1];
          return n.preprocessed = true;
        }
      });
      return data.links.forEach(function(l) {
        if (!l.preprocessed) {
          nodesMap.get(l.source).numShown = nodesMap.get(l.source).numShown + 1;
          nodesMap.get(l.target).numShown = nodesMap.get(l.target).numShown + 1;
          l.source = nodesMap.get(l.source);
          l.target = nodesMap.get(l.target);
          linked["" + l.source.id + "," + l.target.id] = true;
          maxLinkFreq = Math.max(maxLinkFreq, l.freq);
          return l.preprocessed = true;
        }
      });
    };
    update = function(data) {
      var countWidth, counts, linkGroups, nlinks, nnodes, nodesG;
      nlinks = vis.select("#links").selectAll(".link").data(data.links, function(l) {
        return l.id;
      });
      linkGroups = nlinks.enter().append("g").attr("class", "link");
      linkGroups.append("path").attr("id", function(l) {
        return "path" + l.id;
      }).attr("class", "link-path").style("stroke", strokeColor).style("stroke-width", dynamicLinkWidth).style("fill", "none").attr("opacity", dynamicLinkOpacity).attr("d", function(d) {
        var dr, dx, dy;
        dx = d.target.x - d.source.x;
        dy = d.target.y - d.source.y;
        dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
      });
      linkGroups.append("text").attr("id", function(l) {
        return "label" + l.id;
      }).attr("class", "link-label").style("text-anchor", "middle").style("cursor", "default").attr("dy", -2).attr("opacity", dynamicLinkOpacity).append("textPath").attr("startOffset", "50%").attr("xlink:href", function(l) {
        return "#path" + l.id;
      }).style("font-family", normalFontFamily).style("font-size", normalFontSize).text(function(l) {
        if (l.tags.length > 0) {
          return l.tags[0].label;
        } else {
          return "";
        }
      });
      nlinks.exit().remove();
      nnodes = vis.select("#nodes").selectAll(".node").data(data.nodes, function(n) {
        return n.id;
      });
      nodesG = nnodes.enter().append("g").attr("id", function(n) {
        return "node" + n.id;
      }).attr("class", "node").attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      }).attr("opacity", "1").call(dragBehavior);
      countWidth = function(n) {
        return ("" + (n.numNeighbors - n.numShown)).dimensions(smallFontSize + " " + smallFontFamily)[0] + 4;
      };
      nodesG.append("rect").attr("class", "node-bg").attr("x", function(n) {
        return n.width / 2 - countWidth(n) - 1;
      }).attr("y", function(n) {
        return n.height / 2 - 10;
      }).attr("rx", 3).attr("ry", 3).attr("height", 20).attr("width", function(n) {
        return countWidth(n);
      }).style("fill", function(n) {
        return colorByType(n);
      });
      nodesG.append("rect").attr("class", "node-bg").attr("x", function(n) {
        return -Math.floor(n.width / 2);
      }).attr("y", function(n) {
        return -Math.floor(n.height / 2);
      }).attr("rx", 5).attr("ry", 5).attr("height", function(n) {
        return n.height;
      }).attr("width", function(n) {
        return n.width;
      }).style("fill", colorByType);
      nodesG.append("rect").attr("class", "node-bg no-stroke").attr("x", function(n) {
        return n.width / 2 - countWidth(n);
      }).attr("y", function(n) {
        return n.height / 2 - 10;
      }).attr("rx", 3).attr("ry", 3).attr("height", 20 - minStrokeWidth).attr("width", function(n) {
        return countWidth(n) - minStrokeWidth;
      }).style("fill", function(n) {
        return colorByType(n);
      });
      nodeShapes = nnodes.selectAll(".node-bg");
      nodeShapes.style("fill", function(n) {
        if ($.inArray(n, nodesToHighlight) !== -1) {
          return hColorByType(n);
        } else {
          return colorByType(n);
        }
      }).transition().duration(3000).style("fill", colorByType);
      nodesToHighlight = [];
      nodesG.append("text").style("text-anchor", "middle").style("font-family", normalFontFamily).style("font-size", normalFontSize).style("cursor", "default").attr("dy", 5).text(function(n) {
        return n.name;
      });
      nodesG.append("text").attr("class", "node-ncount").attr("x", function(n) {
        return n.width / 2 - 4;
      }).attr("y", function(n) {
        return n.height - 4;
      }).style("font-family", smallFontFamily).style("font-size", smallFontSize).style("cursor", "default").style("text-anchor", "end").text(function(n) {
        return n.numNeighbors - neighborCount(n);
      });
      nnodes.exit().remove();
      nodes = vis.selectAll(".node");
      links = vis.selectAll(".link");
      paths = vis.selectAll(".link-path");
      labels = vis.selectAll(".link-label");
      counts = vis.selectAll(".node-ncount");
      counts.text(function(n) {
        return n.numNeighbors - neighborCount(n);
      });
      updateMouseHandlers();
      nodes.each(function(d, i) {
        return $(this).hoverIntent({
          over: (function() {
            return highlightNode(d, i);
          }),
          out: (function() {
            return unhighlightNode(d, i);
          }),
          sensitivity: 3
        });
      });
      paths.each(function(l, i) {
        return $(this).hoverIntent({
          over: (function() {
            return highlightLink(l, i);
          }),
          out: (function() {
            return unhighlightLink(l, i);
          }),
          sensitivity: 3
        });
      });
      labels.each(function(l, i) {
        return $(this).hoverIntent({
          over: (function() {
            return highlightLink(l, i);
          }),
          out: (function() {
            return unhighlightLink(l, i);
          }),
          sensitivity: 3
        });
      });
      resumeLayout();
      return setTimeout(fixAllNodes, 2000);
    };
    updateMouseHandlers = function() {
      nodes.on("click", function(n) {
        if (nodeClickHandler) {
          return nodeClickHandler(n, d3.event.layerX, d3.event.layerY);
        }
      });
      nodes.on("contextmenu", function(n) {
        if (nodeContextmenuHandler) {
          nodeContextmenuHandler(n, d3.event.layerX, d3.event.layerY);
        }
        return d3.event.preventDefault();
      });
      paths.on("click", function(l) {
        if (linkClickHandler) {
          return linkClickHandler(l, d3.event.layerX, d3.event.layerY);
        }
      });
      paths.on("contextmenu", function(l) {
        if (linkContextmenuHandler) {
          linkContextmenuHandler(l, d3.event.layerX, d3.event.layerY);
        }
        return d3.event.preventDefault();
      });
      labels.on("click", function(t) {
        if (labelClickHandler) {
          return labelClickHandler(t, d3.event.layerX, d3.event.layerY);
        }
      });
      return labels.on("contextmenu", function(t) {
        if (labelContextmenuHandler) {
          labelContextmenuHandler(t, d3.event.layerX, d3.event.layerY);
        }
        return d3.event.preventDefault();
      });
    };
    neighboring = function(n1, n2) {
      return linked["" + n1.id + "," + n2.id] || linked["" + n2.id + "," + n1.id];
    };
    colorByType = function(n) {
      if (n.type === 1) {
        return personColor;
      } else {
        return organizationColor;
      }
    };
    hColorByType = function(n) {
      if (n.type === 1) {
        return personHColor;
      } else {
        return organizationHColor;
      }
    };
    neighborCount = function(n) {
      var i;
      i = 0;
      data.nodes.forEach(function(m) {
        if (neighboring(n, m)) {
          return i = i + 1;
        }
      });
      return i;
    };
    dragBehavior = d3.behavior.drag().on("dragstart", function(d, i) {
      $(this).parent().append(this);
      if (d3.event.sourceEvent.which === 1) {
        dragInitiated = true;
        if (!layoutPaused) {
          return force.stop();
        }
      }
    }).on("drag", function(d, i) {
      if (dragInitiated) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        tick();
        return checkDropOn(d);
      }
    }).on("dragend", function(d, i) {
      if (d3.event.sourceEvent.which === 1) {
        if (!layoutPaused) {
          force.resume();
        }
        d.fixed = true;
        tick();
        return dragInitiated = false;
      }
    });
    checkDropOn = function(d) {
      var dropOn;
      return dropOn = data.nodes.filter(function(n) {
        return n !== d && distance(n, d) < 10;
      });
    };
    distance = function(a, b) {
      var dx, dy;
      dx = Math.abs(a.x - b.x);
      dy = Math.abs(a.y - b.y);
      return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    };
    tick = function(e) {
      paths.attr("d", function(d) {
        var dr, dx, dy;
        dx = d.target.x - d.source.x;
        dy = d.target.y - d.source.y;
        dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
      });
      return nodes.attr("x", function(d) {
        return d.x - Math.floor(d.width / 2);
      }).attr("y", function(d) {
        return d.y - Math.floor(d.height / 2);
      }).attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    };
    fixAllNodes = function() {
      nodes.each(function(n) {
        return n.fixed = true;
      });
      return force.gravity(0);
    };
    zoom = function() {
      return vis.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
    };
    highlightNode = function(d, i) {
      var linkSelected, nodeSelected;
      linkSelected = function(y, n) {
        return function(l) {
          if (l.source === d || l.target === d) {
            return y;
          } else {
            return n;
          }
        };
      };
      nodeSelected = function(y, n) {
        return function(e) {
          if (e === d || neighboring(d, e)) {
            return y;
          } else {
            return n;
          }
        };
      };
      labels.attr("opacity", linkSelected(1.0, 0.2));
      paths.style("stroke", linkSelected(strokeColorHigh, strokeColor)).attr("opacity", linkSelected(1.0, 0.2));
      nodeShapes.style("stroke", nodeSelected(strokeColorHigh, "none")).style("stroke-width", function() {
        if (d3.select(this).attr("class").indexOf("no-stroke") !== -1) {
          return 0;
        } else {
          return minStrokeWidth;
        }
      });
      return nodes.attr("opacity", nodeSelected(1.0, 0.2));
    };
    unhighlightNode = function(d, i) {
      labels.attr("opacity", dynamicLinkOpacity);
      paths.style("stroke", strokeColor);
      paths.attr("opacity", dynamicLinkOpacity);
      nodeShapes.style("stroke", "none");
      return nodes.attr("opacity", 1.0);
    };
    highlightLink = function(l, i) {
      var linkSelected, nodeSelected;
      linkSelected = function(y, n) {
        return function(k) {
          if (k === l) {
            return y;
          } else {
            return n;
          }
        };
      };
      nodeSelected = function(y, n) {
        return function(e) {
          if (e === l.source || e === l.target) {
            return y;
          } else {
            return n;
          }
        };
      };
      labels.attr("opacity", linkSelected(1.0, 0.2));
      paths.style("stroke", linkSelected(strokeColorHigh, strokeColor)).attr("opacity", linkSelected(1.0, 0.2));
      nodeShapes.style("stroke", nodeSelected(strokeColorHigh, "none")).style("stroke-width", function() {
        if (d3.select(this).attr("class").indexOf("no-stroke") !== -1) {
          return 0;
        } else {
          return minStrokeWidth;
        }
      });
      return nodes.attr("opacity", nodeSelected(1.0, 0.2));
    };
    unhighlightLink = function(l, i) {
      labels.attr("opacity", dynamicLinkOpacity);
      paths.style("stroke", strokeColor);
      paths.attr("opacity", dynamicLinkOpacity);
      nodeShapes.style("stroke", "none");
      return nodes.attr("opacity", 1.0);
    };
    non = function() {
      svg = d3.select(dom).append("svg").attr("xmlns", "http://www.w3.org/2000/svg").attr("xmlns:xmlns:xlink", "http://www.w3.org/1999/xlink").attr("version", "1.2").attr("width", width).attr("height", height).style("font-family", normalFontFamily).style("font-size", normalFontSize).call(d3.behavior.zoom().scaleExtent([0.5, 3]).on("zoom", zoom)).on("dblclick.zoom", leftClickOnly, true).on("mousedown", leftClickOnly, true);
      svg.append("rect").attr("width", width).attr("height", height).style("fill", "white").style("pointer-events", "all");
      vis = svg.append("g");
      vis.append("g").attr("id", "links");
      vis.append("g").attr("id", "nodes");
      preprocess(data);
      return update(data);
    };
    leftClickOnly = function() {
      if (d3.event.button) {
        d3.event.stopPropagation();
        return d3.event.preventDefault();
      }
    };
    non.dom = function(value) {
      if (!arguments.length) {
        return dom;
      }
      dom = value;
      return non;
    };
    non.graph = function(value) {
      if (!arguments.length) {
        return data;
      }
      data = value;
      return non;
    };
    non.highlight = function(nodes) {
      nodesToHighlight = nodes;
      return non;
    };
    non.updateAdd = function(addition) {
      addition.links = $.grep(addition.links, function(l, j) {
        return $.inArray(l.id, removedLinks) === -1;
      });
      $.each(addition.nodes, function(i, n) {
        if (!nodesMap.get(n.id)) {
          return data.nodes.push(n);
        } else {
          return delete addition.nodes[i];
        }
      });
      $.each(addition.links, function(i, l) {
        if (!linksMap.get(l.id)) {
          return data.links.push(l);
        }
      });
      preprocess(addition);
      return update(data);
    };
    non.updateRemove = function(nodes) {
      $.each(nodes, function(i, node) {
        removedNodes.push(node.id);
        data.nodes = $.grep(data.nodes, function(n, j) {
          return n.id !== node.id;
        });
        data.links = $.grep(data.links, function(l, j) {
          var incident;
          incident = l.source.id === node.id || l.target.id === node.id;
          if (incident) {
            linksMap.remove(l.id);
            linked["" + l.source.id + "," + l.target.id] = false;
          }
          return !incident;
        });
        return nodesMap.remove(node.id);
      });
      return update(data);
    };
    non.pauseLayout = function() {
      force.stop();
      return layoutPaused = true;
    };
    non.resumeLayout = function() {
      force.nodes(data.nodes).links(data.links).start();
      force.on("tick", tick);
      return layoutPaused = false;
    };
    non.neighbors = function(nodeId) {
      var list;
      list = "";
      data.nodes.forEach(function(n) {
        if (neighboring(nodeId, n)) {
          return list = list + ("," + n.id);
        }
      });
      return list.substring(1);
    };
    non.nodeIds = function() {
      var list;
      list = "";
      data.nodes.forEach(function(n) {
        return list = list += "," + n.id;
      });
      return list.substring(1);
    };
    non.removedNodeIds = function() {
      return removedNodes.join(",");
    };
    non.forceParameters = function(ld, ls, f, c, t, g) {
      force.linkDistance(CoffeeScript.eval(ld, {
        bare: true
      })).linkStrength(eval(ls)).friction(eval(f)).charge(eval(c)).theta(eval(t)).gravity(eval(g));
      return resumeLayout();
    };
    non.addTag = function(linkId, tag) {
      var affectedLink;
      affectedLink = linksMap.get(linkId);
      if ($.inArray(tag, affectedLink.tags) === -1) {
        affectedLink.tags.unshift(tag);
      }
      return non.setLabel(linkId, tag.label);
    };
    non.setLabel = function(linkId, label) {
      return vis.select("#label" + linkId + " > textPath").text(label);
    };
    non.removeLabel = function(linkId, label) {
      var link;
      link = linksMap.get(linkId);
      link.tags = $.grep(link.tags, function(t, j) {
        return t.label !== label;
      });
      return non.setLabel(linkId, link.tags.length > 0 ? link.tags[0].label : "");
    };
    non.removeLink = function(linkId) {
      var link;
      removedLinks.push(linkId);
      link = linksMap.get(linkId);
      data.links = $.grep(data.links, function(l, j) {
        return l.id !== link.id;
      });
      linksMap.remove(link.id);
      linked["" + link.source.id + "," + link.target.id] = false;
      return update(data);
    };
    non.onNodeClick = function(handler) {
      nodeClickHandler = handler;
      return non;
    };
    non.onNodeContextmenu = function(handler) {
      nodeContextmenuHandler = handler;
      return non;
    };
    non.onLinkClick = function(handler) {
      linkClickHandler = handler;
      return non;
    };
    non.onLinkContextmenu = function(handler) {
      linkContextmenuHandler = handler;
      return non;
    };
    non.onLabelClick = function(handler) {
      labelClickHandler = handler;
      return non;
    };
    non.onLabelContextmenu = function(handler) {
      labelContextmenuHandler = handler;
      return non;
    };
    return non;
  };
  window.NetworksOfNames = NetworksOfNames;
}).call(this);
