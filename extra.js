(function() {
  var Extra,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Extra = window.Extra = {};

  Extra.Column = (function(_super) {

    __extends(Column, _super);

    Column.defaults = {
      positiveColor: '#ff4400',
      negativeColor: '#bbbbbb',
      positiveTextColor: '#ff4400',
      negativeTextColor: '#777777',
      precision: 2,
      lines: 9
    };

    function Column(options) {
      this.el = $(options.element);
      this.options = $.extend({}, Extra.Column.defaults, options);
      this.update(this.options.data);
    }

    Column.prototype._createBar = function(data) {
      var category, value, ymax, ymin,
        _this = this;
      this.el.html("");
      ymin = null;
      ymax = null;
      this.data = [];
      for (category in data) {
        value = data[category];
        value = parseFloat((value * 100).toFixed(this.options.precision));
        ymin = Math.min(ymin, value);
        ymax = Math.max(ymax, value);
        this.data.push({
          x: category,
          y: value
        });
      }
      ymax = Math.abs(this.nearestTen(ymax));
      ymin = Math.abs(this.nearestTen(ymin));
      ymax = Math.max(ymax, ymin);
      ymin = -ymax;
      return this.bar = new Morris.Bar({
        element: this.el,
        data: this.data,
        ymin: ymin,
        ymax: ymax,
        barGap: 50,
        barSizeRatio: .5,
        hideHover: 'always',
        numLines: this.options.lines,
        numYLabels: Math.floor(this.options.lines / 2) + 1,
        xkey: 'x',
        ykeys: ['y'],
        labels: ['Y'],
        gridTextColor: '#444',
        gridTextWeight: 'bold',
        gridTextSize: 10.5,
        gridLineColor: '#bbb',
        goals: [0],
        goalStrokeWidth: 0.5,
        goalLineColors: ['#999'],
        eventLineColors: ['#999'],
        xLabelMargin: 0,
        barColors: function(row) {
          if (row.y > 0) {
            return _this.options.positiveColor;
          }
          return _this.options.negativeColor;
        },
        yLabelFormat: function(val) {
          return "" + val + "%";
        }
      });
    };

    Column.prototype._createValueSpans = function() {
      var barWidth, groupWidth, i, leftPadding, numBars, row, valSpan, x, _i, _len, _ref, _results;
      _ref = this.data;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        row = _ref[i];
        groupWidth = this.bar.width / this.bar.options.data.length;
        leftPadding = groupWidth * (1 - this.bar.options.barSizeRatio) / 2;
        numBars = this.bar.options.ykeys.length;
        barWidth = (groupWidth * this.bar.options.barSizeRatio - this.bar.options.barGap * (numBars - 1)) / numBars;
        valSpan = $('<span/>').text("" + row.y + "%").addClass('value-span');
        x = this.bar.left + i * groupWidth + leftPadding;
        if (row.y > 0) {
          valSpan.css('top', this.bar.transY(0) + 5 + 'px');
          valSpan.css('color', this.options.positiveTextColor);
        } else {
          valSpan.css('top', this.bar.transY(0) - 15 + 'px');
          valSpan.css('color', this.options.negativeTextColor);
        }
        valSpan.css({
          font: 'bold 10px Arial, sans-serif',
          display: 'block',
          position: 'absolute',
          width: barWidth + 'px',
          textAlign: 'center',
          left: Math.round(x) + 'px'
        });
        _results.push(this.el.append(valSpan));
      }
      return _results;
    };

    Column.prototype._createSplitLine = function() {
      var splitLine;
      splitLine = $('<span/>');
      splitLine.css({
        position: 'absolute',
        display: 'block',
        width: '1px',
        height: this.bar.height + 40 + 'px',
        top: this.bar.top - 20 + 'px',
        left: this.bar.left + 'px',
        background: '#bbb'
      });
      return this.el.append(splitLine);
    };

    Column.prototype.update = function(data) {
      this._createBar(data);
      this._createValueSpans();
      return this._createSplitLine();
    };

    Column.prototype.nearestTen = function(val) {
      var neg;
      neg = val < 0 ? -1 : 1;
      val = 10 + 10 * Math.floor(Math.abs(val) / 10);
      return neg * val;
    };

    return Column;

  })(Morris.EventEmitter);

}).call(this);
