Extra = window.Extra = {}

class Extra.Column extends Morris.EventEmitter
  @defaults =
    positiveColor: '#ff4400'
    negativeColor: '#bbbbbb'
    positiveTextColor: '#ff4400'
    negativeTextColor: '#777777'
    precision: 2
    lines: 9

  constructor: (options) ->
    @el = $ options.element
    @options = $.extend {}, Extra.Column.defaults, options

    @update @options.data

  _createBar: (data) ->
    @el.html ""

    ymin = null
    ymax = null
    
    @data = []
    for category, value of data
      value = parseFloat (value * 100).toFixed(@options.precision)
      ymin = Math.min ymin, value
      ymax = Math.max ymax, value
      @data.push
        x: category
        y: value

    ymax = Math.abs @nearestTen(ymax)
    ymin = Math.abs @nearestTen(ymin)

    ymax = Math.max ymax, ymin
    ymin = -ymax

    @bar = new Morris.Bar
      element: @el
      data: @data
      ymin: ymin
      ymax: ymax
      barGap: 50
      barSizeRatio: .5
      hideHover: 'always'
      numLines: @options.lines
      numYLabels: Math.floor(@options.lines/2) + 1
      xkey: 'x'
      ykeys: ['y']
      labels: ['Y']
      gridTextColor: '#444'
      gridTextWeight: 'bold'
      gridTextSize: 10.5
      gridLineColor: '#bbb'
      goals: [0]
      goalStrokeWidth: 0.5
      goalLineColors: ['#999']
      eventLineColors: ['#999']
      xLabelMargin: 0
      barColors: (row) =>
        if row.y > 0
          return @options.positiveColor
        return @options.negativeColor
      yLabelFormat: (val) -> "#{val}%"

  _createValueSpans: ->
    for row, i in @data
      groupWidth = @bar.width / @bar.options.data.length
      leftPadding = groupWidth * (1 - @bar.options.barSizeRatio) / 2
      numBars = @bar.options.ykeys.length
      barWidth = (groupWidth * @bar.options.barSizeRatio - @bar.options.barGap * (numBars - 1)) / numBars

      valSpan = $('<span/>').text("#{row.y}%").addClass('value-span')

      x = @bar.left + i * groupWidth + leftPadding

      if row.y > 0
        valSpan.css 'top', @bar.transY(0) + 5 + 'px'
        valSpan.css 'color', @options.positiveTextColor
      else
        valSpan.css 'top', @bar.transY(0) - 15 + 'px'
        valSpan.css 'color', @options.negativeTextColor

      valSpan.css
        font: 'bold 10px Arial, sans-serif'
        display: 'block'
        position: 'absolute'
        width: barWidth + 'px'
        textAlign: 'center'
        left: Math.round(x) + 'px'

      @el.append valSpan

  _createSplitLine: ->
    splitLine = $('<span/>')
    splitLine.css
      position: 'absolute'
      display: 'block'
      width: '1px'
      height: @bar.height + 40 + 'px'
      top: @bar.top - 20 + 'px'
      left: @bar.left + 'px'
      background: '#bbb'
    @el.append splitLine

  update: (data) ->
    @_createBar data
    @_createValueSpans()
    @_createSplitLine()

  nearestTen: (val) ->
    neg = if val < 0 then -1 else 1
    val = 10 + 10 * Math.floor Math.abs(val)/10
    return neg * val