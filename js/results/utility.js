(function() {
  String.prototype.dimensions = function(font) {
    var f, o;
    f = font || $('body').css("font-size") + " " + $('body').css("font-family");
    o = $('#stringbox');
    o.text(this).css({
      'font': f
    });
    return [o.width() + 1, o.height() + 1];
  };
  String.prototype.hashCode = function() {
    var c, hash, i;
    hash = 0;
    if (this.length === 0) {
      return hash;
    }
    i = 0;
    while (i < this.length) {
      c = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + c;
      hash |= 0;
      i++;
    }
    return hash;
  };
  jQuery.expr[':'].icontains = function(a, i, m) {
    return jQuery(a).text().toLowerCase().indexOf(m[3].toLowerCase()) >= 0;
  };
  Array.prototype.distinct = function() {
    return this.filter(function(elem, pos) {
      return this.indexOf(elem) === pos;
    });
  };
}).call(this);
