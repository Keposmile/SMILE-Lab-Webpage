(function() {
  jQuery(function() {
    var contextmenu, contextmenuList, divider, hideContextmenu, renderContextMenu;
    $("#new-sample-spenden1999").click(function() {
      return showRelationship("Walther Leisler Kiep", "Karlheinz Schreiber", "npmi", 10, "1999-01", "2004-12");
    });
    $("#new-sample-rwe2004").click(function() {
      return showRelationship("Hermann-Josef Arentz", "RWE", "npmi", 10, "2004-10", "2004-12");
    });
    $("#new-sample-liechtenstein2004").click(function() {
      return showRelationship("Liechtensteiner LGT-Bank", "BND", "npmi", 10, "2006-01", void 0);
    });
    $("#new-sample-kundus2009").click(function() {
      return showRelationship("Georg Klein", "ISAF", "npmi", 5, "2009-04", void 0);
    });
    $("#new-sample-harrypotter").click(function() {
      return showEntity("Harry Potter", "npmi", 12);
    });
    $("#new-sample-jamesbond").click(function() {
      return showEntity("James Bond", "npmi", 12);
    });
    $("#new-sample-charlesdarwin").click(function() {
      return showEntity("Charles Darwin", "npmi", 12);
    });
    $("#new-clear").click(function() {
      return clearGraph();
    });
    $("#export-svg").click(function() {
      return exportToSVG();
    });
    $("#export-png").click(function() {
      return exportToPNG();
    });
    $("#force-play").click(function() {
      resumeLayout();
      return $(this).addClass("active");
    });
    $("#force-pause").click(function() {
      pauseLayout();
      return $(this).addClass("active");
    });
    $("#uisample-sources").click(function() {
      return showSources(100824);
    });
    contextmenu = $("#contextmenu");
    contextmenuList = $("#contextmenu ul");
    contextmenu.hide();
    divider = {};
    window.showNodeContextmenu = function(node, x, y) {
      return renderContextMenu([
        {
          name: "Expand more",
          action: function() {
            return expandMoreNeighbors(node);
          }
        }, {
          name: "Expand...",
          action: function() {
            return showNeighbors(node);
          }
        }, {
          name: "Remove node",
          action: function() {
            return removeNode(node);
          }
        }
      ], x, y);
    };
    window.showLinkContextmenu = function(link, x, y) {
      var labelItems, labels, unique;
      labels = $.map(link.tags, function(tag) {
        return tag.label;
      });
      unique = labels.filter(function(elem, pos) {
        return labels.indexOf(elem) === pos;
      });
      labelItems = $.map(unique, function(label) {
        return {
          name: '<button class="close remove-label" style="position: relative;" data-link="' + link.id + '" data-label="' + label + '">&times;</button>' + label,
          action: function() {
            return setLabel(link.id, label);
          }
        };
      });
      return renderContextMenu([
        {
          name: "Select label",
          action: labelItems
        }, {
          name: "Hide label",
          action: function() {
            return setLabel(link.id, "");
          }
        }, divider, {
          name: "Remove edge",
          action: function() {
            return removeLink(link.id);
          }
        }
      ], x, y);
    };
    window.showTagContextmenu = function(tagId, linkId, label, x, y) {
      return renderContextMenu([
        {
          name: "Set this label",
          action: function() {
            return setLabel(linkId, label);
          }
        }, {
          name: "Confirm label",
          action: function() {
            return confirmLabel(linkId, label);
          }
        }, {
          name: "Remove label",
          action: function() {
            return removeLabel(linkId, label);
          }
        }
      ], x, y, true);
    };
    hideContextmenu = function() {
      contextmenu.hide();
      contextmenu.removeClass("above-modal");
      return contextmenuList.empty();
    };
    $(document).on("click", "html", function() {
      return hideContextmenu();
    });
    renderContextMenu = function(items, x, y, aboveModal) {
      hideContextmenu();
      $.each(items, function(i, item) {
        var parentList, subitems, submenu;
        if (item === divider) {
          return $('<li class="divider"></li>').appendTo(contextmenuList);
        } else {
          if ($.isArray(item.action)) {
            submenu = $('<li class="dropdown-submenu"><a tabindex="-1" href="#">' + item.name + '</a>\
                        <ul id="context-submenu' + i + '" class="dropdown-menu">\
                        </ul>\
                       </li>');
            submenu.appendTo(contextmenuList);
          }
          parentList = submenu ? submenu.find(".dropdown-menu") : contextmenuList;
          subitems = $.isArray(item.action) ? item.action : [item];
          return $.each(subitems, function(j, subitem) {
            var element;
            element = $('<li><a tabindex="-1" href="#">' + subitem.name + '</a></li>');
            element.appendTo(parentList);
            return element.on("click", "a", function(e) {
              if (e.target === this) {
                return subitem.action();
              }
            });
          });
        }
      });
      contextmenu.css({
        position: "absolute",
        left: x,
        top: y
      });
      if (aboveModal) {
        contextmenu.addClass("above-modal");
      }
      return contextmenu.show();
    };
    $('#contextmenu').on("click", ".remove-label", function(e) {
      var label, link;
      link = $(this).attr("data-link");
      label = $(this).attr("data-label");
      return removeLabel(link, label);
    });
    $(".ajax-typeahead").typeahead({
      minLength: 2,
      items: 5,
      source: function(query, process) {
        var input;
        input = $(this)[0].$element.val();
        return $.ajax({
          url: jsRoutes.controllers.Application.typeahead(input).url,
          type: "GET",
          dataType: "json",
          success: function(json) {
            if (typeof json.options === "undefined") {
              return false;
            } else {
              return process(json.options);
            }
          }
        });
      }
    });
    $("#new-r-person1, #new-r-person2, #new-n-person").change(function() {
      var cgroup, input;
      cgroup = $(this).parents("div.control-group");
      input = $.trim($(this).val());
      if (input === "") {
        cgroup.removeClass("success");
        return cgroup.removeClass("error");
      } else {
        return $.ajax({
          dataType: "json",
          url: jsRoutes.controllers.Application.nameExists(input).url,
          type: "GET",
          success: function(data) {
            if (data.exists) {
              cgroup.removeClass("error");
              return cgroup.addClass("success");
            } else {
              cgroup.removeClass("success");
              return cgroup.addClass("error");
            }
          }
        });
      }
    });
    $("modal-new").on("hidden", function() {
      return $(this).find("form")[0].reset();
    });
    $("#new-go").click(function() {
      var searchType;
      searchType = $('#tabs li.active > a').attr("href") === "#new-by-name" ? "n" : "r";
      if (searchType === "r") {
        return showRelationship($("#new-r-person1").val(), $("#new-r-person2").val(), $("#new-r-expander").val(), $("#new-r-num-nodes").val(), $("#new-r-from").val(), $("#new-r-to").val());
      } else {
        return showEntity($("#new-n-person").val(), $("#new-n-expander").val(), $("#new-n-num-nodes").val(), $("#new-n-from").val(), $("#new-n-to").val());
      }
    });
    $("#new-r-clearfrom").click(function() {
      return $("#new-r-from").val("");
    });
    $("#new-r-clearto").click(function() {
      return $("#new-r-to").val("");
    });
    $("#new-n-clearfrom").click(function() {
      return $("#new-n-from").val("");
    });
    $("#new-n-clearto").click(function() {
      return $("#new-n-to").val("");
    });
    $("#modal-sources").on("hidden", function(e) {
      if ($(e.target).hasClass("modal")) {
        return emptySourcesModal();
      }
    });
    window.emptySourcesModal = function() {
      return $("#sources-list").empty();
    };
    $("#modal-neighbors").on("hidden", function(e) {
      if ($(e.target).hasClass("modal")) {
        return emptyNeighborsModal();
      }
    });
    window.emptyNeighborsModal = function() {
      $("#neighbors-of-name").html("");
      $("#neighbors-of-id").val();
      $("#neighbors-filter").val("");
      return $("#neighbors-list").empty();
    };
    $("#neighbors-go").click(function() {
      var selected;
      selected = $("#neighbors-form input:checked").map(function() {
        return this.value;
      }).get();
      if (selected.length > 0) {
        return expandNeighbors($("#neighbors-of-id").val(), selected);
      }
    });
    $("#neighbors-filter").on("propertychange keyup input paste", function() {
      var filter;
      filter = $("#neighbors-filter").val();
      if (filter) {
        $("#neighbors-list li:icontains('" + filter + "')").show();
        return $("#neighbors-list li:not(:icontains('" + filter + "'))").hide();
      } else {
        return $("#neighbors-list li").show();
      }
    });
    $("#neighbors-filter-reset").click(function() {
      return $("#neighbors-filter").val("");
    });
    $("#modal-sources").on("keypress", ".add-tag-input", function(e) {
      var direction, input, label, ref;
      if (e.which === 13) {
        e.preventDefault();
        label = $(this).val();
        direction = $(this).closest("li").find("#" + $(this).attr("id") + "-direction").val();
        $(this).val("");
        input = $(this);
        ref = input.attr("name").substr(4).split("-");
        return addTag(ref[0], ref[1], label, direction, function(tag) {
          return input.closest("li").before(renderTag(tag));
        });
      }
    });
    $("#modal-sources").on("click", ".tag-direction-toggle", function() {
      var direction, id, widget;
      widget = $(this).closest("li");
      id = widget.find("input.add-tag-input").attr("id");
      direction = widget.find("#" + id + "-direction");
      if (direction.val() === "r") {
        direction.val("l");
        widget.find(".tag-direction-left").css("visibility", "visible");
        return widget.find(".tag-direction-right").css("visibility", "hidden");
      } else if (direction.val() === "l") {
        direction.val("b");
        widget.find(".tag-direction-left").css("visibility", "visible");
        return widget.find(".tag-direction-right").css("visibility", "visible");
      } else {
        direction.val("r");
        widget.find(".tag-direction-left").css("visibility", "hidden");
        return widget.find(".tag-direction-right").css("visibility", "visible");
      }
    });
    $("#modal-sources").on("contextmenu", ".tag", function(e) {
      var label, linkId, tagId;
      e.preventDefault();
      tagId = $(this).attr("data-tag");
      linkId = $(this).attr("data-link");
      label = $(this).find(".label-text").html();
      return showTagContextmenu(tagId, linkId, label, e.clientX, e.clientY);
    });
    window.renderTag = function(tag) {
      return '<li><span class="tag label' + (!tag.auto ? " label-info" : "") + '" data-tag="' + tag.id + '" data-link="' + tag.relationship + '">' + (tag.direction === "l" || tag.direction === "b" ? "&#9668; " : "") + '<span class="label-text">' + tag.label + '</span>' + '<span style="display: ' + (tag.hasPositive ? "inline" : "none") + '" class="label-confirmed">  &#10003;</span>' + (tag.direction === "r" || tag.direction === "b" ? " &#9658;" : "") + '</span></li>';
    };
    window.checkTagsWithLabel = function(linkId, label) {
      return $("#modal-sources").find(".tag[data-link='" + linkId + "']").closest("li").each(function() {
        if ($(this).find(".label-text").html() === label) {
          return $(this).find(".label-confirmed").css("display", "inline");
        }
      });
    };
    window.removeTagsWithLabel = function(linkId, label) {
      return $("#modal-sources").find(".tag[data-link='" + linkId + "']").closest("li").each(function() {
        if ($(this).find(".label-text").html() === label) {
          return $(this).remove();
        }
      });
    };
    window.showGlobalLoading = function() {
      return $("#global-loading").css("visibility", "visible");
    };
    window.hideGlobalLoading = function() {
      return $("#global-loading").css("visibility", "hidden");
    };
    window.showGlobalError = function(message) {
      return $("#notifications").append('<div class="alert alert-error">\
        <button type="button" class="close" data-dismiss="alert">&times;</button>\
        <strong>Error!</strong> ' + message + '\
      </div>');
    };
    return window.hideGlobalError = function() {
      return $("#notifications").empty();
    };
  });
}).call(this);
