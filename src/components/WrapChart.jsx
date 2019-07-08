import React, { Component } from 'react'
import _ from 'lodash'

import { Modal } from 'reactstrap'
import ChartSettingsModal from './ChartSettingsModal';
import { genUniqueList, genData, genEyeFilter, initilize } from '../utilities/functions'
import EchartGen from './EchartGen'
import ButtonGroup from './ButtonGroup'

var getSeries = (array, property, property2, type, labels) => {
    var data = []
    if (type === 'pie') {
        if (property2) {
            array.forEach((o, i) => {
                data.push({ value: o[property][property2], name: labels[i] })
            })
        }
        else {
            array.forEach((o, i) => {
                data.push({ value: o[property], name: labels[i] })
            })
        }
    }
    else {
        if (property2) {
            array.forEach(o => {
                data.push(o[property][property2])
            })
        }
        else {
            array.forEach(o => {
                data.push(o[property])
            })
        }
    }
    //  console.log(data,"data in getSeriesgetSeries");
    return data
}

export default class WrapChart extends Component {
    state = initilize()

    tabChange = (selected, index) => {
        var { buttons } = this.state
        buttons[index].selected = selected
        buttons = buttons.slice(0, index + 1)
        while (selected.isGroup) {
            buttons.push({ list: selected.children, selected: selected.children[0] })
            selected = selected.children[0]
        }
        this.setState({ buttons })
    }

    applyChartSettings = (state) => {
        state.popup = false;
        this.setState(state)
        //  var {popup}=this.state
        //  this.setState({popup:false})
    }

    cancelChartSettings = () => {
        this.setState({ popup: false })
    }
    //, gridX, gridY, gridXa, gridYa,isXaxis, isYaxis, isLegend, backgroundColor

    getChartOptions = (settings, labels, series, selected) => {
        var options = {}
        var { isXGrid, isYGrid, isXGrida, isYGrida, isXaxis, isYaxis, isLegend, theme, isInverse } = settings
        console.log(settings, "CHART settings")
        var type = settings.type.value
        var legend = {
            show: isLegend,
        },
            title = {
                //    text: settings.title,
                //    subtext: settings.subtitle,
                //    left: settings.position ? settings.position.value : 'left'
            },
            tooltip = {
                trigger: 'item',
            },
            dataZoom = [
                {
                    id: 'dataZoomX',
                    type: 'slider',
                    xAxisIndex: [0],
                    filterMode: 'filter',
                    start: 0,
                    end: 100
                },
                {
                    id: 'dataZoomY',
                    type: 'slider',
                    yAxisIndex: [0],
                    filterMode: 'empty',
                    start: 0,
                    end: 100
                }
            ],
            backgroundColor = !theme ? "white" : theme.chartBackGround,
            yAxis = [{
                type: 'value',
                show: true,
                axisTick: { show: isYaxis },
                axisLabel: { show: isYaxis },
                axisLine: {
                    show: isYaxis
                },
                // axisLine:true,
                 inverse: isInverse,
                showGrid: false,
                splitLine: {
                    show: isYGrid,
                },
                splitArea: {
                    show: isYGrida,
                }
            }, {
                type: 'value',
                show: true,
                axisTick: { show: isYaxis },
                axisLabel: { show: isYaxis },
                axisLine: {
                    show: isYaxis
                },
                showGrid: false,
                splitLine: {
                    show: isYGrid,
                },
                splitArea: {
                    show: isYGrida,
                }
            }
            ],
            xAxis = {
                type: 'category',
                data: labels,
                name: selected.label,
                show: true,
                axisTick: { show: isXaxis },
                axisLabel: { show: isXaxis },
                axisLine: {
                    show: isXaxis
                },
                showGrid: true,
                splitLine: {
                    show: isXGrid,
                },
                splitArea: {
                    show: isXGrida,
                }
            }

        options.title = title

        if (type !== 'pie') {
            options.dataZoom = dataZoom
            options.yAxis = yAxis
            options.xAxis = xAxis
            options.backgroundColor = backgroundColor
            options.legend = legend
        }
        else tooltip.formatter = "{a} <br/>{b} : {c} ({d}%)"
        options.tooltip = tooltip
        options.series = series
        options.backgroundColor = backgroundColor
        // console.log(options, "CHART OPTIONS")
        return options
    }

    getChartSeriesProp = (type, metrics, count) => {
        var _obj
        if (type === 'area') {
            _obj = {
                type: 'line',
                areaStyle: {}
            }
        }
        else if (type === 'pie') {
            var pieCount = _.sumBy(metrics, o => o.aggregator.length)
            _obj = {
                type: type,
                radius: 100 / pieCount + "%",
                center: [(100 / (pieCount + 1) * count) + "%", '50%'],
            }
        }
        else {
            _obj = {
                type: type,
            }
        }
        return _obj
    }

    genChartData = (dispTableData, dispTableConfig) => {
        var { buttons, tableConfig, settings } = this.state
        var selected = buttons[buttons.length - 1].selected

        var type = settings.type.value
        //  console.log(type, "type in function" );
        var metrics = tableConfig.filter(config => config.type === "Metric")
        //  console.log(metrics,"metricsmetricsmetricsmetrics");
        var series = []
        var labels = getSeries(dispTableData, selected.value)
        var count = 1;
        metrics.forEach((o, i) => {
            o.aggregator.forEach((p, j) => {
                var seriesType
                if (type !== 'custom') seriesType = this.getChartSeriesProp(type, metrics, count++)
                else {
                    if (o.fieldProp.chart[p]) seriesType = this.getChartSeriesProp(o.fieldProp.chart[p].value, metrics)
                    else seriesType = this.getChartSeriesProp('bar', metrics)
                }
                var obj = _.cloneDeep(seriesType)

                if (o.fieldProp.yAxis[p]) obj.yAxisIndex = 1
                obj.data = getSeries(dispTableData, o.value, p, type, labels)
                obj.name = p + " " + o.label
                obj.smooth = settings.isSmooth
                series.push(obj)
            }
            )
        })

        return this.getChartOptions(settings, labels, series, selected);
    }
    render() {
        console.log("STATE = ", this.state)
        var { tableData, tableConfig, filterState, negFilterState, eyeFilter,
            buttons, lists, popup, settings, chartTitleParams, showTitleDiv, position } = this.state
        // var backgroundColor=!settings.theme?"white":settings.theme.chartBackGround
        // var isXGrid = !settings.isXGrid ? false : settings.isXGrid
        // var isYGrid = !settings.isYGrid ? false : settings.isYGrid   
        // var isXGrida = !settings.isXGrida ? false : settings.isXGrida
        // var isYGrida  = !settings.isYGrida ? false : settings.isYGrida 
        // var isXaxis = settings.isXaxis === undefined ? true : settings.isXaxis
        // var isYaxis = settings.isYaxis === undefined ? true : settings.isYaxis
        // var isLegend = settings.isLegend===undefined ? true : settings.isLegend

        var { dispTableData = [], dispTableConfig } = genData(tableData, tableConfig, buttons, filterState, negFilterState, genEyeFilter(lists), lists)
        var chartOption = this.genChartData(dispTableData, dispTableConfig)

        // chartOption["axis"] = { show:true,
        //                         boundaryGap: [0,0]}
        //  
        //  }
        // width:"10px",
        // height:"20px",
        // color:'green',
        // borderWidth:10,
        // borderColor:'black'}

        // chartOption["toolbox"] = {
        //     show: true,
        //     feature: {
        //         // mark : {show: true},
        //         // dataView : {show: true, readOnly: false},
        //         magicType: { show: true, type: ['line', 'bar'] },
        //         restore: { show: true },
        //         saveAsImage: { show: true }
        //     }
        // }

        var showdiv = settings.title || settings.subtitle
        var position = settings.position === undefined ? "-webkit-center" : settings.position.value
        var isMainTitle = settings.isMainTitle === undefined ? true : settings.isMainTitle
        var isTitle = settings.isTitle === undefined ? true : settings.isTitle
        var isSubTitle = settings.isSubTitle === undefined ? true : settings.isSubTitle
        var titleFont = settings.fontTitle === undefined ? "20px" : settings.fontTitle + "px"
        var subTitleFont = settings.fontSubtitle === undefined ? "15px" : settings.fontSubtitle + "px"
        var backgroundColor = settings.theme === undefined ? "none" : settings.theme.backGroundColor
        var color = settings.theme === undefined ? "black" : settings.theme.color

        //  console.log(backgroundColor,"backgroundColorbackgroundColor");
        return (
            <div className="wrap-table p-t-10" style={{ padding: "30px", backgroundColor: backgroundColor, borderRadius: "5px", border: "1px solid grey", width: "95%", marginLeft: "2.5%", marginTop: "1vh", padding: "3px" }}>

                <div style={{}}>
                    {showdiv && isMainTitle ? <div style={{}}>
                        <div style={{ width: "100%", backgroundColor: backgroundColor}}>
                            <div style={{ color: color, border: "1px solid darkgrey", padding:"10px" }}>
                                {settings.title && isTitle ? <div style={{ fontSize: titleFont, fontWeight: "bold", textAlign: position  }}>{settings.title}</div> : null}
                                {settings.subtitle && isSubTitle ? <div style={{ fontSize: subTitleFont, textAlign: position  }}>{settings.subtitle}</div> : null}
                            </div>
                        </div>
                    </div> : null}


                </div>
                <div style={{ backgroundColor: backgroundColor }}>
                    {buttons ? buttons.map((buttonList, index) => {
                        return (
                            <ButtonGroup
                                buttonList={buttonList.list}
                                selectedFilter={buttonList.selected}
                                tabChange={(filter) => this.tabChange(filter, index)}
                            />
                        )
                    }) : null
                    }
                </div>
                <div style={{ borderRadius: "50px", zIndex: 2 }}> <EchartGen option={chartOption} /> </div>

                <div className="btn btn-primary" onClick={() => this.setState({ popup: true })}>Settings</div>



                <Modal isOpen={popup} toggle={() => this.setState({ popup: !popup })} centered backdrop={true} size='lg'>
                    <ChartSettingsModal chartSettings={this.chartSettings} getTitlePosition={this.getTitlePosition} toggle={() => this.setState({ popup: !popup })} getChartTitle={this.getChartTitle} applySettings={this.applyChartSettings} chart={this.state} />
                </Modal>
            </div>
        )
    }
}