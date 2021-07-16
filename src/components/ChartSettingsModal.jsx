
import React, { Component } from "react";
import { ModalBody } from 'reactstrap';
import _ from 'lodash'

import { CHART_LIST, METRIC, BAR, CHART_CUSTOM_LIST, POS_LIST, THEMES, ZSCATTER } from '../utilities/functions'
import SelectDD from './SelectDD';

const Checkbox = ({ styleName, title, isChecked, onChange, style, prefix, returnObj }) => (
    <div className={`checkbox-fade fade-in-${styleName ? styleName : 'default'}`} style={style}>
        <label className='v-center cursor-pointer' style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={isChecked} onChange={() => onChange(returnObj)} />
            <span className="cr">
                <i className="cr-icon icofont icofont-ui-check txt-primary" />
            </span>
            {prefix ? prefix : null}
            <span>{title}</span>
        </label>
    </div>
);

export default class FieldSettingsModal extends Component {
    constructor(props) {
        super()
        var { chart } = props;
        this.state = _.cloneDeep(chart)

    }

    apply = () => {
        this.props.applySettings(this.state);
    }

    changeSettings = (selected, property) => {
        // console.log(selected, property, "selected, propertyselected, property");
        var { settings } = this.state
        property.map(d=>{
            settings[d] = selected
        })
        // settings[property] = selected
        this.setState({ settings })
    }

    customSettings = (selected, o) => {
        var { fields } = this.state
        var selectedField = fields.filter(metric => metric.value === o.metric)[0]
        selectedField.fieldProp.chart[o.aggregate] = selected
        this.setState({ fields })
    }

    axisSettings = (checked, o) => {
        var { fields } = this.state
        var selectedField = fields.filter(metric => metric.value === o.metric)[0]
        selectedField.fieldProp.yAxis[o.aggregate] = checked
        this.setState({ fields })
    }

    setPage = (o, page) => {
        this.setState({ [o]: page })
    }
    // changeMainSettings = (main, propertyMain, propertyParam1, propertyParam2) => {
    //     var { settings } = this.state
    //     settings[propertyMain] = main
    //     settings[propertyParam1] = main
    //     settings[propertyParam2] = main
    //     this.setState({ settings });
    // }
    // changeGridSettings = (mainGrid, propertyMainGrid, propertyXGrid, propertyYGrid, propertyGridXa, propertyGridYa) => {
    //     var { settings } = this.state
    //     settings[propertyMainGrid] = mainGrid
    //     settings[propertyXGrid] = mainGrid
    //     settings[propertyYGrid] = mainGrid
    //     settings[propertyGridXa] = mainGrid
    //     settings[propertyGridYa] = mainGrid
    //     this.setState({ settings });
    // }

    // // changeInverseSettings = (mainInverse, propertyMainInverse, propertyInverseX, propertyInverseY1, propertyInverseY2) => {
    // // var {settings} = this.state
    // // settings[propertyMainInverse]=mainInverse
    // // settings[propertyInverseX]=mainInverse
    // // settings[propertyInverseY1]=mainInverse
    // // settings[propertyInverseY2]=mainInverse   
    // // }
    // changeInverseSettings = (mainInverse, propertyMainInverse, propertyInverseX, propertyInverseY1, propertyInverseY2) => {
    //     var { settings } = this.state
    //     settings[propertyMainInverse] = mainInverse
    //     settings[propertyInverseX] = mainInverse
    //     settings[propertyInverseY1] = mainInverse
    //     settings[propertyInverseY2] = mainInverse
    //     this.setState({ settings })
    // }


    render() {
        var { chartSettings, toggle } = this.props;
        var { settings, fields, route, route1 } = this.state
        var { type, zScatter, position, title, subtitle, isXGrid = false, isYGrid = false, isXGrida = false, isYGrida = false,
            isMainCartesian = isXGrid || isYGrid, isXaxis = true, isYaxis = true, isMainAxis = isXaxis || isYaxis,
            theme, isSubTitle = true, isTitle = true, isMainTitle = isSubTitle || isTitle, fontTitle, fontSubtitle, isLegend = true, isSmooth,
            isInverse, isInverseX, isInverseY1, isInverseY2, height, width, isToolTip } = settings
        var AGG_LIST = []
        var metricList = _.filter(fields, o => o.ddField === METRIC)
        metricList.forEach(metric => {
            metric.aggregator.forEach(aggregate => {
                var selected = metric.fieldProp.chart[aggregate] ? metric.fieldProp.chart[aggregate] : CHART_CUSTOM_LIST[0]
                var yAxis = metric.fieldProp.yAxis[aggregate] ? metric.fieldProp.yAxis[aggregate] : false
                var o = { label: aggregate + " " + metric.value, metric: metric.value, aggregate: aggregate, selected: selected, yAxis }
                AGG_LIST.push(o)
            })
        })
        const TitlePage = () => <div>
            <div className="d-flex"> <Checkbox title="" styleName="default"
                onChange={() => this.changeSettings(!isMainTitle, ["isMainTitle", "isTitle", "isSubTitle"])}
                isChecked={isMainTitle} />Chart Title</div>
            <div style={{ display: !isMainTitle ? "none" : "block" }}><div className="m-t-10">
                <div className="d-flex">
                    <div style={{ width: "10%" }}></div>
                    <div style={{ width: '3%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isTitle, ["isTitle"])} isChecked={isTitle} /></div>
                    <div style={{ width: '18%' }}>Title </div>

                    <input
                        value={title}
                        onChange={(e) => this.changeSettings(e.target.value, ["title"])}>
                    </input>
                </div>
            </div>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: "13%" }}></div>
                        <div style={{ width: '18%' }}>Title Font Size</div>
                        <input
                            type='number'
                            value={fontTitle}
                            onChange={(e) => this.changeSettings(e.target.value,["fontTitle"])}>
                        </input>
                    </div>
                </div>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: "10%" }}></div>
                        <div style={{ width: '3%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isSubTitle, ["isSubTitle"])} isChecked={isSubTitle} /></div>
                        <div style={{ width: '18%' }}>Sub Title</div>

                        <input
                            value={subtitle}
                            onChange={(e) => this.changeSettings(e.target.value, ["subtitle"])}>
                        </input>
                    </div>
                </div>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: "13%" }}></div>
                        <div style={{ width: '18%' }}>Sub Title Font Size</div>
                        <input
                            type='number'
                            value={fontSubtitle}
                            onChange={(e) => this.changeSettings(e.target.value, ["fontSubtitle"])}>
                        </input>
                    </div>
                </div>

                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: "13%" }}></div>
                        <div style={{ width: '18%' }}>Position</div>
                        <div style={{ width: '50%', zIndex: 15 }}><SelectDD data={POS_LIST} onChange={(o) => this.changeSettings(o, ["position"])} selected={position} /></div>
                    </div>
                </div>
            </div>
        </div>
        const ChartType = () => <div>
            <div style={{ height: "1vh" }}></div>
            <div className="m-t-10">
                <div className="d-flex">
                    <div style={{ width: '50%' }}>Chart Type</div>
                    <div style={{ width: '50%', zIndex: 12 }}>
                        <SelectDD data={CHART_LIST} onChange={(o) => this.changeSettings(o, ["type"])} selected={type} isClearable={false} />
                    </div>
                </div>
            </div>

            {type.value !== "pie" ? <div>
                <div style={{ height: "1vh" }}></div>
                <div style={{ display: type.value === "scatter" || type.value === "custom" ? "block" : "none" }}>
                    <div className="m-t-10">
                        <div className="d-flex">
                            <div style={{ width: '50%' }}>Z-value(Scatter Chart)</div>
                            <div style={{ width: '50%', zIndex: 11 }}>
                                <SelectDD data={ZSCATTER} onChange={(o) => this.changeSettings(o, ["zScatter"])} selected={zScatter} isClearable={false} />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ height: "1vh" }}></div>
                <div style={{ display: type.value !== "pie" && type.value !== "bar" && type.value !== "scatter" ? "block" : "none" }}>
                    <div className="d-flex"> <Checkbox title="" styleName="default"
                        onChange={() => this.changeSettings(!isSmooth,["isSmooth"])}
                        isChecked={isSmooth} />Smooth</div>
                </div>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: '40%' }}>Series Name</div>
                        <div style={{ width: "10%" }}></div>
                        <div style={{ width: '20%' }}>2nd Axis</div>
                        {type.value === 'custom' ? <div style={{ width: '40%' }}>Chart Type</div> : null}
                    </div>
                </div>
                <div>


                    {AGG_LIST.map((o, i) => {
                        return (
                            <div className="d-flex">
                                <div style={{ width: "10%" }}></div>
                                <div style={{ width: '40%' }}>{o.label}</div>
                                <div style={{ width: '20%', zIndex: 10 - i }}><Checkbox title="" styleName="default" onChange={() => this.axisSettings(!o.yAxis, o)} isChecked={o.yAxis} /></div>
                                {type.value === 'custom' ? <div style={{ width: '40%', zIndex: 10 - i }}><SelectDD data={CHART_CUSTOM_LIST} onChange={(selected) => this.customSettings(selected, o)} selected={o.selected} isClearable={false} /></div> : null}
                            </div>
                        )
                    })}
                </div>
            </div> : null}
        </div>
        const AxisLines = () => <div style={{ width: "50%" }}>
            <div className="d-flex"> <Checkbox title="" styleName="default"
                onChange={() => this.changeSettings(!isMainAxis, ["isMainAxis", "isXaxis", "isYaxis"])}
                isChecked={isMainAxis} />Axis Lines</div>
            <div style={{ display: !isMainAxis ? "none" : "block" }}>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: "15%" }}></div>
                        <div style={{ width: '5%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isXaxis, ["isXaxis"])} isChecked={isXaxis} /></div>
                        <div style={{ width: '30%' }}>X-axis </div>
                    </div>
                </div>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: "15%" }}></div>
                        <div style={{ width: '5%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isYaxis, ["isYaxis"])} isChecked={isYaxis} /></div>
                        <div style={{ width: '30%' }}>Y-axis </div>
                    </div>
                </div>
            </div>



            <div className="d-flex"> <Checkbox title="" styleName="default"
                onChange={() => this.changeSettings(!isInverse, ["isInverse", "isInverseX", "isInverseY1", "isInverseY2"])}
                isChecked={isInverse} />Inverse Axis</div>
            <div style={{ display: !isInverse ? "none" : "block" }}>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: "15%" }}></div>
                        <div style={{ width: '5%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isInverseX, ["isInverseX"])} isChecked={isInverseX} /></div>
                        <div style={{ width: '30%' }}>X-axis </div>
                    </div>
                </div>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: "15%" }}></div>
                        <div style={{ width: '5%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isInverseY1, ["isInverseY1"])} isChecked={isInverseY1} /></div>
                        <div style={{ width: '30%' }}>Y1-axis </div>
                    </div>
                </div>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: "15%" }}></div>
                        <div style={{ width: '5%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isInverseY2, ["isInverseY2"])} isChecked={isInverseY2} /></div>
                        <div style={{ width: '30%' }}>Y2-axis </div>
                    </div>
                </div>
            </div>
            {/* <div className="d-flex"> <Checkbox title="" styleName="default"
            onChange={() => this.changeSettings(!isLegend, "isLegend")}
            isChecked={isLegend} />Legends</div> */}

        </div>
        // Axis line option default axis lines are true
        const Grids = () => <div className="d-flex">
                <div style={{ width: "50%" }}>
                    {/* <div className="d-flex"> <Checkbox title="" styleName="default"
                        onChange={() => this.changeMainSettings(!isMainAxis, "isMainAxis", "isXaxis", "isYaxis")}
                        isChecked={isMainAxis} />Axis Lines</div> */}
                    <div style={{ width: "100%" }}>
                        <div className="d-flex"> <Checkbox title="" styleName="default"
                            onChange={() => this.changeSettings(!isMainCartesian, ["isMainCartesian", "isXGrid", "isYGrid", "isXGrida", "isYGrida"])}
                            isChecked={isMainCartesian} />Cartesian Grid</div>
                        <div style={{ display: !isMainCartesian ? "none" : "block" }}>
                            <div className="m-t-10">
                                <div className="d-flex">
                                    <div style={{ width: "15%" }}></div>
                                    <div style={{ width: '5%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isXGrid, ["isXGrid"])} isChecked={isXGrid} /></div>
                                    <div style={{ width: '30%' }}>X-axis grid lines</div>
                                </div>
                            </div>
                            <div className="m-t-10">
                                <div className="d-flex">
                                    <div style={{ width: "15%" }}></div>
                                    <div style={{ width: '5%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isXGrida, ["isXGrida"])} isChecked={isXGrida} /></div>
                                    <div style={{ width: '30%' }}>X-axis grid area</div>
                                </div>
                            </div>
                            <div className="m-t-10">
                                <div className="d-flex">
                                    <div style={{ width: "15%" }}></div>
                                    <div style={{ width: '5%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isYGrid, ["isYGrid"])} isChecked={isYGrid} /></div>
                                    <div style={{ width: '30%' }}>Y-axis grid lines</div>
                                </div>
                            </div>
                            <div className="m-t-10">
                                <div className="d-flex">
                                    <div style={{ width: "15%" }}></div>
                                    <div style={{ width: '5%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isYGrida, ["isYGrida"])} isChecked={isYGrida} /></div>
                                    <div style={{ width: '30%' }}>Y-axis grid area</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex"> <Checkbox title="" styleName="default"
                        onChange={() => this.changeSettings(!isLegend, ["isLegend"])}
                        isChecked={isLegend} />Legends</div>


                </div>


                {/* // Cartesian grid line and area option default only lines are checked*/}


            </div>
        const OtherSettings = () => <div>
            <div>Other Settings</div>
            <div className="d-flex">
                <div style={{ width: "15%" }}></div>
                <Checkbox title="" styleName="default"
                    onChange={() => this.changeSettings(!isToolTip, ["isToolTip"])}
                    isChecked={isToolTip} />Tooltip</div>
        </div>
        const ThemePage = () => <div className="m-t-10">
            <div className="d-flex">
                <div style={{ width: '50%' }}>Theme</div>
                <div style={{ width: '50%', zIndex: 14 }}>
                    <SelectDD data={THEMES} onChange={(o) => this.changeSettings(o, ["theme"])} selected={theme} />
                </div>
            </div>
            <div style={{height:"3vh"}}></div>
            
            <div className="d-flex">
            <div style={{ width: "10%" }}></div>
            <div style={{ width: "25%", height:"4vh" }}>Background color</div> <div style={{width:"5%"}}></div> <div style={{height:"15px", border:"2px solid grey", width:"15px", marginTop:"7px", backgroundColor:theme.backGroundColor}}></div>
            </div>
            <div className="d-flex">
            <div style={{ width: "10%" }}></div>
            <div style={{ width: "25%", height:"4vh" }}>Chart background color</div> <div style={{width:"5%"}}></div> <div  style={{height:"15px", border:"2px solid grey", width:"15px", marginTop:"7px", backgroundColor:theme.chartBackGround}}></div>
            </div>
            <div className="d-flex">
            <div style={{ width: "10%" }}></div>
            <div style={{ width: "25%", height:"4vh" }}>Title color</div> <div style={{width:"5%"}}></div> <div  style={{height:"15px", border:"2px solid grey", width:"15px", marginTop:"7px", backgroundColor:theme.color}}></div>
            </div>
            <div className="d-flex">
            <div style={{ width: "10%" }}></div>
            <div style={{ width: "25%", height:"4vh" }}>Title background color</div> <div style={{width:"5%"}}></div> <div  style={{height:"15px", border:"2px solid grey", width:"15px", marginTop:"7px", backgroundColor:theme.titleBackGround}}></div>
            </div>
         
        </div>

        const DimensionPage = () => <div>
            <div className="d-flex">Chart Dimension</div>

            <div className="m-t-10">
                <div className="d-flex">
                    <div style={{ width: "13%" }}></div>
                    <div style={{ width: '18%' }}>Height (px)</div>
                    <input
                        type='number'
                        value={height}
                        onChange={(e) => this.changeSettings(e.target.value, ["height"])}>
                    </input> px
                </div>
            </div>
            <div className="m-t-10">
                <div className="d-flex">
                    <div style={{ width: "13%" }}></div>
                    <div style={{ width: '18%' }}>Width (%)</div>
                    <input
                        type='number'
                        value={width}
                        onChange={(e) => this.changeSettings(e.target.value, ["width"])}>
                    </input> %
                    </div>
            </div>
        </div>

        const pageMap = {
            "chartType": {name: "Chart Type", component: ChartType},
            "title": {name: "Title", component: TitlePage},
            "theme": {name: "Theme", component: ThemePage},
            "grid": {name: "Grid", component: Grids},
            "axisLines": {name: "Axis Lines", component: AxisLines},
            "others": {name: "Tooltip", component: OtherSettings},
            "dimension": {name: "Chart Dimensions", component: DimensionPage},
        }
        return (
            <div className="settings">
                <div className="main-tab d-flex">
                    {_.keys(pageMap).map(k => <div className={route === k ? "tab_button tab_button_active" : "tab_button"} onClick={this.setPage.bind(this, "route", k)}>{pageMap[k].name}</div>)}
                </div>
                <div>{pageMap[route].component()}</div>
                <div className="m-t-10">
                </div>
                <div className="btn btn-sm btn-primary" onClick={this.apply}>Apply</div>
                <span style={{ width: "10px" }}> </span>
                <div className="btn btn-sm btn-primary m-l-10" onClick={toggle}>Cancel</div>
            </div>
        )
    }
}