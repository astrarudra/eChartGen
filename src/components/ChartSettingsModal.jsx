
import React, { Component } from "react";
import { ModalBody } from 'reactstrap';
import _ from 'lodash'

import { CHART_LIST , METRIC , BAR , CHART_CUSTOM_LIST , POS_LIST } from '../utilities/functions'
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
        console.log(selected,"check selected");
        // if(property==="position"){
        //     this.props.getTitlePosition(selected.value)
        // }
        var { settings } = this.state
        settings[property] = selected
        this.setState({settings})
    }

    // getTitlePosition = (selected, property) =>{
    //     console.log(selected,"check o for props");
    //     var { settings } = this.state
    //     settings[property] = selected
    //     this.setState({settings})
    // }

    customSettings = (selected, o) => {
        var { fields } = this.state
        var selectedField = fields.filter(metric => metric.value === o.metric)[0]
        selectedField.fieldProp.chart[o.aggregate] = selected
        this.setState({fields})
    }

    axisSettings = (checked, o) => {
        var { fields } = this.state
        var selectedField = fields.filter(metric => metric.value === o.metric)[0]
        selectedField.fieldProp.yAxis[o.aggregate] = checked
        this.setState({fields})
    }

    render(){
        var { chartSettings , toggle } = this.props;
        // var alignTitle=[
        //                 {label:"Left", value:"-webkit-left" },
        //                 {label:"Center", value:"-webkit-center" },
        //                 {label:"Right", value:"-webkit-right" }
        //                ]
        
        var { settings , fields } = this.state
        var { type , position , title , subtitle, isTitle } = settings
        console.log(settings,"settings in clg cc");
        
        var AGG_LIST = []
        var metricList = _.filter(fields, o => o.ddField === METRIC)

        metricList.forEach(metric => {
            metric.aggregator.forEach(aggregate => {
                var selected = metric.fieldProp.chart[aggregate] ? metric.fieldProp.chart[aggregate] : CHART_CUSTOM_LIST[0]
                var yAxis = metric.fieldProp.yAxis[aggregate] ? metric.fieldProp.yAxis[aggregate] : false
                var o = {label: aggregate + " " + metric.value , metric: metric.value, aggregate: aggregate, selected: selected, yAxis}
                AGG_LIST.push(o)
            })
        })
        
        return (
            <ModalBody> {/* Popup div here */}
                <div>
                    <div className="m-t-10">
                        <div className="d-flex">
                                <div style={{width: '45%'}}>Chart Title </div>
                                <div style={{width: '5%'}}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isTitle, "isTitle")} isChecked={isTitle} /></div>
                                <input 
                                    value={title} 
                                    onChange={(e)=> this.changeSettings(e.target.value, "title")}>
                                </input>
                                {/* <div style={{width: '25%', height:"10px", zIndex:16}}><SelectDD data={alignTitle} onChange={(o) => this.getTitlePosition(o, "position")} selected={position}/></div> */}
                        </div>
                    </div>
                    <div className="m-t-10">
                        <div className="d-flex">
                                <div style={{width: '50%'}}>Chart Sub Title</div>
                                <input 
                                    value={subtitle} 
                                    onChange={(e)=> this.changeSettings(e.target.value, "subtitle")}>
                                </input>
                        </div>
                    </div>
                    <div className="m-t-10">
                        <div className="d-flex">
                                <div style={{width: '50%'}}>Position</div>
                                <div style={{width: '50%', zIndex:15}}><SelectDD data={POS_LIST} onChange={(o) => this.changeSettings(o, "position")} selected={position}/></div>
                        </div>
                    </div>
                    <div className="m-t-10">
                        <div className="d-flex">
                                <div style={{width: '50%'}}>Chart Type</div>
                                <div style={{width: '50%', zIndex:12}}><SelectDD data={CHART_LIST} onChange={(o) => this.changeSettings(o, "type")} selected={type} isClearable={false} /></div>
                        </div>
                    </div>

                    <div>
                        <div className="m-t-10">
                            <div className="d-flex">
                                    <div style={{width: '40%'}}>Series Name</div>
                                    <div style={{width: '20%'}}>2nd Axis</div>
                                    {type.value === 'custom' ? <div style={{width: '40%'}}>Chart Type</div> : null}
                            </div>
                        </div>
                        <div>
                            {AGG_LIST.map((o,i) => {
                                return (
                                    <div className="d-flex">
                                        <div style={{width: '40%'}}>{o.label}</div>
                                        <div style={{width: '20%', zIndex:10-i}}><Checkbox title="" styleName="default" onChange={() => this.axisSettings(!o.yAxis, o)} isChecked={o.yAxis} /></div>
                                        {type.value === 'custom' ? <div style={{width: '40%', zIndex:10-i}}><SelectDD data={CHART_CUSTOM_LIST} onChange={(selected) => this.customSettings(selected, o)} selected={o.selected} isClearable={false} /></div>: null}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="m-t-10">
                    <div className="btn btn-sm btn-primary" onClick={this.apply}>Apply</div>
                    <div className="btn btn-sm btn-primary m-l-10" onClick={toggle}>Cancel</div>
                </div>
            </ModalBody>
        )
    }
}