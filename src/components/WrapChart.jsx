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

    getChartOptions = (settings, labels, series, selected) => {
        var options = {}
        console.log(settings, "CHART settings")
        var type = settings.type.value
        var legend = {},
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
            yAxis = [{
                type: 'value',
            },{
                type: 'value',
            },],
            xAxis = {
                type: 'category',
                data: labels,
                name: selected.label,
            }

        options.title = title
        options.legend = legend
        if ( type !== 'pie') {
            options.dataZoom = dataZoom
            options.yAxis = yAxis
            options.xAxis = xAxis
        }
        else tooltip.formatter = "{a} <br/>{b} : {c} ({d}%)"
        options.tooltip = tooltip
        options.series = series
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

    genChartData = (dispTableData) => {
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

        return this.getChartOptions(settings, labels, series, selected);
    }
    // getChartTitle = () =>{
    //     this.setState({showTitleDiv:true})
    // }
    // getTitlePosition = (value) =>{
    //     this.setState({position:value})
    // }


    render() {
        console.log("STATE = ", this.state)
        var { tableData, tableConfig, filterState, negFilterState, eyeFilter, 
            buttons, lists, popup, settings, chartTitleParams, showTitleDiv, position} = this.state
            
        var { dispTableData = [] , dispTableConfig } = genData(tableData , tableConfig , buttons , filterState , negFilterState, genEyeFilter(lists) , lists)

      //  console.log("dispTableData", dispTableData)
        var chartOption = this.genChartData(dispTableData, dispTableConfig)

        var showdiv = settings.title || settings.subtitle 
        var position = !settings.position ? "-webkit-center" : settings.position.value
        var isMainTitle = !settings.isMainTitle ? true : settings.isMainTitle
        var isTitle = !settings.isTitle ? true : settings.isTitle
        var isSubTitle = !settings.isSubTitle ? true : settings.isSubTitle
        var titleFont = !settings.fontTitle ? "20px" : settings.fontTitle + "px"
        var subTitleFont = !settings.fontSubtitle ? "15px" : settings.fontSubtitle + "px"
        var backgroundColor = !settings.backGroundColor ? "none" : settings.backGroundColor.value
        console.log(backgroundColor,"backgroundColorbackgroundColor");
        return (
            <div className="wrap-table p-t-10">
             {showdiv && isMainTitle ? <div style={{ }}>
                 <div style={{width:"100%",backgroundColor:backgroundColor, textAlign:position}}>
                {settings.title && isTitle ? <div style={{fontSize:titleFont, color:"#5B5B5B", width:"20%", height:"4vh",  textAlign:"center", fontWeight:"bold" }}>{settings.title}</div>:null}
                {settings.subtitle && isSubTitle ? <div style={{fontSize:subTitleFont, width:"20%", color:"#5B5B5B",  height:"4vh", textAlign:"center" }}>{settings.subtitle}</div>:null}
                </div>
            </div>: null }
                {buttons ? buttons.map((buttonList, index) => {
                    return (
                        <ButtonGroup 
                            buttonList={buttonList.list} 
                            selectedFilter={buttonList.selected}
                            tabChange={(filter) => this.tabChange(filter, index)}
                        />
                )}): null
                }
                <EchartGen option={chartOption} />
                <div className="btn btn-primary" onClick={() => this.setState({popup: true})}>Settings</div>

                
                <Modal isOpen={popup} toggle={() => this.setState({popup: !popup})} centered backdrop={true} size='lg'>
                    <ChartSettingsModal chartSettings={this.chartSettings} getTitlePosition={this.getTitlePosition} toggle={() => this.setState({popup: !popup})} getChartTitle={this.getChartTitle} applySettings={this.applyChartSettings} chart={this.state}/>
                </Modal>
            </div>
        )
    }
}