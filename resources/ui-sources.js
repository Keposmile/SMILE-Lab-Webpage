(function() {
  window.clusterWidget = function(proxies, rest, e1, e2, relId, tagsBySentence) {
    var widget;
    widget = "";
    $.each(proxies, function(i, proxy) {
      return widget += sourceWidget(proxy, e1, e2, relId, tagsBySentence[proxy.sentence.id]);
    });
    widget += rest.length > 0 ? hiddenSources(rest, e1, e2, relId, tagsBySentence) : '';
    return '<div class="sources-cluster">' + widget + '</div>';
  };
  window.sourceWidget = function(source, e1, e2, relId, tags, hidden) {
    return '<blockquote>' + source.sentence.text.replace(e1.name, "<strong>" + e1.name + "</strong>").replace(e2.name, "<strong>" + e2.name + "</strong>") + '<small class="cite"><a href="' + source.source + '" target="_blank">' + source.source + '</a> on ' + source.date + '</small>' + tagWidget(source, e1, e2, relId, tags, hidden) + '</blockquote>';
  };
  window.hiddenSources = function(rest, e1, e2, relId, tagsBySentence) {
    var hiddenId, sources;
    hiddenId = 'hidden' + relId + '-' + rest[0].sentence.id;
    sources = "";
    $.each(rest, function(i, source) {
      return sources += sourceWidget(source, e1, e2, relId, tagsBySentence[source.sentence.id], true);
    });
    return '<div id="' + hiddenId + '" class="accordion">\
    <div class="accordion-group">\
      <div class="accordion-heading">\
        <a class="accordion-toggle" data-toggle="collapse" data-parent="#' + hiddenId + '" style="text-align:center;" href="#' + hiddenId + '-content">\
          and ' + rest.length + ' similar sentence' + (rest.length > 1 ? "s" : "") + '\
        </a>\
      </div>\
      <div id="' + hiddenId + '-content" class="accordion-body collapse">\
        <div class="accordion-inner">' + sources + '</div>\
      </div>      \
    </div>\
  </div>';
  };
  window.tagWidget = function(source, e1, e2, relId, tags, hidden) {
    var existingTags, tagsId;
    tagsId = 'tags' + relId + '-' + source.sentence.id;
    existingTags = "";
    if (tags) {
      $.each(tags, function(i, tag) {
        return existingTags += renderTag(tag);
      });
    }
    return '<div class="tagging-widget">\
    <ul id="' + tagsId + '" name="' + tagsId + '-tags" class="tag-box">' + existingTags + '<li class="tag-input">\
        <table><tr>\
          <td class="tag-cell-left">' + e1.name + '</td>\
          <td class="tag-cell-center">\
            <span class="tag-direction tag-direction-left" style="visibility: hidden;">&#9668;</span>\
            <input type="hidden" id="' + tagsId + '-direction" value="r" />\
            <input type="text" id="' + tagsId + '" name="' + tagsId + '" placeholder="add tag" class="input-small add-tag-input" />\
            <span class="tag-direction tag-direction-right">&#9658;</span><br />\
            <button class="btn btn-mini tag-direction-toggle">toggle direction</button>\
          </td>\
          <td class="tag-cell-right">' + e2.name + '</td>\
        </tr></table>\
      </li>\
    </ul>\
  </div>';
  };
}).call(this);
