import React, { Component } from 'react'
import _ from 'lodash'

import { Modal } from 'reactstrap'
import ChartSettingsModal from './ChartSettingsModal';
import { genUniqueList, genData, genEyeFilter, initilize } from '../utilities/functions'
import EchartGen from './EchartGen'
import ButtonGroup from './ButtonGroup'

var getSeries = (array, property, property2, type, labels, buttonSelected, zScatter ) => {
  console.log(array,  "getSeries in Chart Data");
    var data = []
    var zScatter = zScatter
    if (type === 'pie') {
        if (property2) {
            array.forEach((o, i) => {
                //[labels[i],o[property][property2],zaxis]
                data.push({ value: o[property][property2], name: labels[i] })
            })
        }
        else {
            array.forEach((o, i) => {
                data.push({ value: o[property], name: labels[i] })
            })
        }
    }
    if (type === 'scatter'){
        if (property2) {
            array.forEach(o => {
                data.push({value: [o[buttonSelected], o[property][property2],o[zScatter.obj][zScatter.property] ]})
            })
        }  
    }
    else 
    if(type === 'themeRiver'){
        array.forEach((o, i) => {
            // data.push({ value: o[property], name: labels[i] })
            data.push([o[buttonSelected], o[property][property2]])
        })
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
  // console.log(data,"data in getSeriesgetSeries");
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
        var { isXGrid, isYGrid, isXGrida, isYGrida, isXaxis, isYaxis, isLegend, theme, isInverseX, isInverseY1, isInverseY2, isToolTip } = settings
      //  console.log(settings, "CHART settings")
    //  var singleAxis= {
    //     top: 50,
    //     bottom: 50,
    //     axisTick: {},
    //     axisLabel: {},
    //     type: 'time',
    //     axisPointer: {
    //         animation: true,
    //         label: {
    //             show: true
    //         }
    //     },
    //     splitLine: {
    //         show: true,
    //         lineStyle: {
    //             type: 'dashed',
    //             opacity: 0.2
    //         }
    //     }
    // }
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
                show:isToolTip,
                trigger: type==='pie'?'item':'axis',
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
                inverse: isInverseY1,
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
                inverse: isInverseY2,
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
            xAxis = [{
                type: 'category',
                data: labels,
                name: selected.label,
                show: true,
                inverse: isInverseX,
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
                },    
            },

           
            // {
            //     type: 'category',
            //     data: labels,
            //     name: selected.label,
            //     show: true,
            //     inverse: isInverseX,
            //     axisTick: { show: isXaxis },
            //     axisLabel: { show: isXaxis },
            //     axisLine: {
            //         show: isXaxis
            //     },
            //     showGrid: true,
            //     splitLine: {
            //         show: isXGrid,
            //     },
            //     splitArea: {
            //         show: isXGrida,
            //     },    
            // }
            ]
        var xAxisScatter =       {
                type : 'category',
                splitNumber: 4,
                scale: true,
                show: true,
                inverse: isInverseX,
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
                }, 
            }

        options.title = title
        options.tooltip = tooltip

        if (type !== 'pie' && type !=='scatter' && type !=='themeRiver') {
            options.dataZoom = dataZoom
            options.yAxis = yAxis
            options.xAxis = xAxis
            options.backgroundColor = backgroundColor
            options.legend = legend
            
        }
        else
        if (type==='scatter'){
            options.dataZoom = dataZoom
            options.yAxis = yAxis
            options.xAxis = xAxisScatter
            options.backgroundColor = backgroundColor
            options.legend = legend
            options.tooltip = tooltip
        }
        // else 
        // if(type='themeRiver')
        // {
        //     options.singleAxis = singleAxis
        //     // for(var i in temp1) {
        //     //     console.log('i',i)
        //     //     for(var j in temp1[i].data){
        //     //         console.log('j',j)
        //     //         list.push(temp1[i].data[j])
        //     //     }
        //     // }
        // }
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
        else if(type === 'waterFall'){
            _obj = {
                type: 'bar'
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
        var labels = getSeries(dispTableData, selected.value, null, null,  buttons[0].selected.value, settings.zScatter)
        var count = 1;
        var data;
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
                
                data = getSeries(dispTableData, o.value, p, type, labels,  buttons[0].selected.value, settings.zScatter)
                // if(type!=='themeRiver'){
                // obj.data = data
                // }
                obj.data = data
                // else {
                //     data.map(m=>{
                //         m.push( p + " " + o.label)
                //     })
                //     obj.data=data
                // }
                obj.symbolSize = function (data) {
                    var result;
                   if(data[2] < 1000) {
                        var d = data[2]*1000
                        var num = String(d)
                        var change = num.substring(0,2)
                        result = parseInt(change)
                     }
                     else {
                        var num = String(data[2])
                        var change = num.substring(0,2)
                        result = parseInt(change) 
                     }
                    return result;
                }
                if(type === "waterFall"){
                  obj.stack= "show"
                }
                obj.name = p + " " + o.label
                obj.smooth = settings.isSmooth
                series.push(obj)
            }
            )
        })

        return this.getChartOptions(settings, labels, series, selected);
    }
    render() {
       // console.log("STATE = ", this.state)
        var { tableData, tableConfig, filterState, negFilterState, eyeFilter,
            buttons, lists, popup, settings, chartTitleParams, showTitleDiv, position } = this.state
        var { dispTableData = [], dispTableConfig } = genData(tableData, tableConfig, buttons, filterState, negFilterState, genEyeFilter(lists), lists)
        var chartOption = this.genChartData(dispTableData, dispTableConfig)
        var showdiv = settings.title || settings.subtitle
        var position = settings.position.value
        var isMainTitle = settings.isMainTitle === undefined ? true : settings.isMainTitle
        var isTitle = settings.isTitle === undefined ? true : settings.isTitle
        var isSubTitle = settings.isSubTitle === undefined ? true : settings.isSubTitle
        var titleFont = settings.fontTitle === undefined ? "20px" : settings.fontTitle + "px"
        var subTitleFont = settings.fontSubtitle === undefined ? "15px" : settings.fontSubtitle + "px"
        var backgroundColor =  settings.theme.backGroundColor
        var color =  settings.theme.color
        var height = settings.height + "px"
        var width = settings.width + "%"
        return (
            <div className="wrap-table p-t-10" style={{ padding: "30px", backgroundColor: backgroundColor, borderRadius: "5px", border: "1px solid grey", width: width, marginLeft: "2.5%", marginTop: "1vh", padding: "3px" }}>

                <div style={{}}>
                    {showdiv && isMainTitle ? <div style={{}}>
                        <div style={{ width: "100%", backgroundColor: backgroundColor}}>
                            <div style={{ color: color, border: "1px solid darkgrey", padding:"7px" }}>
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
                <div style={{ borderRadius: "50px", zIndex: 2 }}> <EchartGen option={chartOption} height={height} width={width} /> </div>

                <div className="btn btn-primary" onClick={() => this.setState({ popup: true })}>Settings</div>



                <Modal isOpen={popup} toggle={() => this.setState({ popup: !popup })} centered backdrop={true} size='lg'>
                    <ChartSettingsModal chartSettings={this.chartSettings}  getTitlePosition={this.getTitlePosition} toggle={() => this.setState({ popup: !popup })} getChartTitle={this.getChartTitle} applySettings={this.applyChartSettings} chart={this.state} />
                </Modal>
            </div>
        )
    }
}