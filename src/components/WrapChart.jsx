import React, { Component } from 'react'
import _ from 'lodash'

import { Modal } from 'reactstrap'
import ChartSettingsModal from './ChartSettingsModal';
import { genUniqueList , genData, genEyeFilter, initilize } from '../utilities/functions'
import EchartGen from './EchartGen'
import ButtonGroup from './ButtonGroup'

var getSeries = (array, property, property2, type, labels) => {
    var data = []
    if(type === 'pie'){        
        if(property2) {
            array.forEach((o, i) => {
                data.push({value: o[property][property2], name: labels[i]})
            })
        }
        else {
            array.forEach((o, i) => {
                data.push({value: o[property], name: labels[i]})
            })
        }
    }
    else {
        if(property2) {
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
        buttons = buttons.slice(0 , index + 1)
        while(selected.isGroup){
            buttons.push({list: selected.children, selected: selected.children[0]})
            selected = selected.children[0]
        }
        this.setState({buttons})
    }
    
    applyChartSettings = (state) => {
         state.popup = false;
         this.setState(state)
      //  var {popup}=this.state
      //  this.setState({popup:false})
    }
     
    cancelChartSettings = () => {
        this.setState({popup:false})
    }

    getChartOptions = (settings, labels, series, selected, gridX, gridY, gridXa, gridYa,isXaxis, isYaxis, isLegend, backgroundColor) => {
        var options = {}
        console.log(settings, "CHART settings")
        var type = settings.type.value
        var legend = {
            show:isLegend,
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
            backgroundColor=backgroundColor,
            yAxis = [{
                type: 'value',
                show: isYaxis,
                showGrid: false,
                splitLine: {
                    show: gridY,
                 },
                 splitArea:{
                    show: gridYa,
                }
            },{
                type: 'value',
                show:isYaxis,
                showGrid: false,
                splitLine: {
                    show: gridY
                 },
                 splitArea:{
                    show: gridYa,
                }
            }
        ],
            xAxis = {
                type: 'category',
                data: labels,
                name: selected.label,
                show:isXaxis,
                showGrid:true,
                splitLine: {
                    show: gridX,
                 },
                 splitArea:{
                     show: gridXa,
                 }
            }

        options.title = title
        options.legend = legend
        if ( type !== 'pie') {
            options.dataZoom = dataZoom
            options.yAxis = yAxis
            options.xAxis = xAxis
            options.backgroundColor = backgroundColor
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
        if(type === 'area') {
            _obj = {
                type: 'line',
                areaStyle: {}
            }
        }
        else if(type === 'pie') {
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

    genChartData = (dispTableData, dispTableConfig, gridX, gridY, gridXa, gridYa,isXaxis, isYaxis, isLegend, backgroundColor) => {
        var { buttons , tableConfig , settings } = this.state
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
                if(type !== 'custom') seriesType = this.getChartSeriesProp(type, metrics, count++)
                else {
                    if(o.fieldProp.chart[p]) seriesType = this.getChartSeriesProp(o.fieldProp.chart[p].value, metrics)
                    else seriesType = this.getChartSeriesProp('bar', metrics)
                }
                var obj = _.cloneDeep(seriesType)

                if(o.fieldProp.yAxis[p]) obj.yAxisIndex = 1
                obj.data = getSeries(dispTableData, o.value, p, type, labels)
                obj.name = p + " " + o.label
                series.push(obj)
                }
            )
        })

        return this.getChartOptions(settings, labels, series, selected, gridX, gridY, gridXa, gridYa,isXaxis, isYaxis, isLegend, backgroundColor);
    }
    render() {
        console.log("STATE = ", this.state)
        var { tableData, tableConfig, filterState, negFilterState, eyeFilter, 
            buttons, lists, popup, settings, chartTitleParams, showTitleDiv, position} = this.state
        var backgroundColor=!settings.theme?"white":settings.theme.chartBackGround
        var gridX = !settings.isXGrid ? false : settings.isXGrid
        var gridY = !settings.isYGrid ? false : settings.isYGrid   
        var gridXa = !settings.isXGrida ? false : settings.isXGrida
        var gridYa = !settings.isYGrida ? false : settings.isYGrida 
        var isXaxis = settings.isXaxis === undefined ? true : settings.isXaxis
        var isYaxis = settings.isYaxis === undefined ? true : settings.isYaxis
        var isLegend = settings.isLegend===undefined ? true : settings.isLegend
          
        var { dispTableData = [] , dispTableConfig } = genData(tableData , tableConfig , buttons , filterState , negFilterState, genEyeFilter(lists) , lists)
        var chartOption = this.genChartData(dispTableData, dispTableConfig, gridX, gridY, gridXa, gridYa, isXaxis, isYaxis, isLegend, backgroundColor)
     //   chartOption["backgroundColor"]=!settings.theme?"white":settings.theme.chartBackGround
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
                                //     show : true,
                                //     feature : {
                                //         mark : {show: true},
                                //         dataView : {show: true, readOnly: false},
                                //         magicType : {show: true, type: ['line', 'bar']},
                                //         restore : {show: true},
                                //         saveAsImage : {show: true}
                                //     }
                                // }

        var showdiv = settings.title || settings.subtitle 
        var position = settings.position===undefined ? "-webkit-center" : settings.position.value
        var isMainTitle = settings.isMainTitle===undefined ? true : settings.isMainTitle
        var isTitle = settings.isTitle===undefined ? true : settings.isTitle
        var isSubTitle = settings.isSubTitle===undefined ? true : settings.isSubTitle
        var titleFont = settings.fontTitle===undefined ? "20px" : settings.fontTitle + "px"
        var subTitleFont = settings.fontSubtitle===undefined ? "15px" : settings.fontSubtitle + "px"
        var backgroundColor = settings.theme===undefined ? "none" : settings.theme.backGroundColor
        var color = settings.theme===undefined ? "black" : settings.theme.color
       
      //  console.log(backgroundColor,"backgroundColorbackgroundColor");
        return (
            <div className="wrap-table p-t-10" style={{padding:"30px", backgroundColor:backgroundColor, borderRadius:"5px", border:"1px solid grey", width:"95%", marginLeft:"2.5%", marginTop:"1vh", padding:"3px"}}>
            {/* <div style={{height:"2vh"}}></div> */}
            <div style={{}}>
                {showdiv && isMainTitle ? <div style={{ }}>
                 <div style={{width:"100%",backgroundColor:backgroundColor, textAlign:position }}>
                     <div style={{ color:color, width:"20%",  textAlign:"center", border:"1px solid darkgrey"}}>
                {settings.title && isTitle ? <div style={{fontSize:titleFont, fontWeight:"bold" }}>{settings.title}</div>:null}
                {settings.subtitle && isSubTitle ? <div style={{fontSize:subTitleFont }}>{settings.subtitle}</div>:null}
                </div>
                </div>
            </div>: null }
                 {/* <div style={{height:"2vh"}}></div> */}
              
               </div>
               <div style={{backgroundColor:backgroundColor}}>
                {buttons ? buttons.map((buttonList, index) => {
                    return (
                        <ButtonGroup 
                            buttonList={buttonList.list} 
                            selectedFilter={buttonList.selected}
                            tabChange={(filter) => this.tabChange(filter, index)}
                        />
                )}): null
                }
                </div>
                 <div style={{borderRadius:"50px", zIndex:2}}> <EchartGen option={chartOption} /> </div>
                
                <div className="btn btn-primary" onClick={() => this.setState({popup: true})}>Settings</div>
                

                
                <Modal isOpen={popup} toggle={() => this.setState({popup: !popup})} centered backdrop={true} size='lg'>
                    <ChartSettingsModal chartSettings={this.chartSettings} getTitlePosition={this.getTitlePosition} toggle={() => this.setState({popup: !popup})} getChartTitle={this.getChartTitle} applySettings={this.applyChartSettings} chart={this.state}/>
                </Modal>
            </div>
        )
    }
}