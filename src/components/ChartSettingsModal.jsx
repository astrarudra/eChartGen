
import React, { Component } from "react";
import { ModalBody } from 'reactstrap';
import _ from 'lodash'

import { CHART_LIST, METRIC, BAR, CHART_CUSTOM_LIST, POS_LIST } from '../utilities/functions'
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
        console.log(selected, property, "selected, propertyselected, property");
        var { settings } = this.state
        settings[property] = selected
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

    setPage = (o) => {
        this.setState({ route: o })
    }
    changeMainSettings = (m, pm, t, pt, st, pst) => {
        this.changeSettings(m, pm);
        this.changeSettings(t, pt);
        this.changeSettings(st, pst);

    }


    render() {
        var { chartSettings, toggle } = this.props;
        var { settings, fields, route } = this.state
        var { type, position, title, backGroundColor, subtitle, isSubTitle = true, isTitle = true, isMainTitle = isSubTitle || isTitle, fontTitle, fontSubtitle } = settings
        // console.log(settings, fields, "settings in clg cc");
        var colorList = [
            { label: "None", value: "none" },
            { label: "Lightgery", value: "lightgrey" },
            { label: "Green", value: "green" },
            { label: "Yellow", value: "yellow" },
            { label: "Light Blue", value: "lightblue" }]

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
        var TitlePage = <div>
            <div className="d-flex"> <Checkbox title="" styleName="default"
                onChange={() => this.changeMainSettings(!isMainTitle, "isMainTitle", !isMainTitle, "isTitle", !isMainTitle, "isSubTitle")}
                isChecked={isMainTitle} />Chart Title</div>
            <div style={{ pointerEvents: !isMainTitle ? "none" : null }}><div className="m-t-10">
                <div className="d-flex">
                    <div style={{ width: '45%' }}>Title </div>
                    <div style={{ width: '5%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isTitle, "isTitle")} isChecked={isTitle} /></div>
                    <input
                        value={title}
                        onChange={(e) => this.changeSettings(e.target.value, "title")}>
                    </input>
                </div>
            </div>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: '50%' }}>Title Font Size</div>
                        <input
                            type='number'
                            value={fontTitle}
                            onChange={(e) => this.changeSettings(e.target.value, "fontTitle")}>
                        </input>
                    </div>
                </div>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: '45%' }}>Sub Title</div>
                        <div style={{ width: '5%' }}><Checkbox title="" styleName="default" onChange={() => this.changeSettings(!isSubTitle, "isSubTitle")} isChecked={isSubTitle} /></div>
                        <input
                            value={subtitle}
                            onChange={(e) => this.changeSettings(e.target.value, "subtitle")}>
                        </input>
                    </div>
                </div>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: '50%' }}>Sub Title Font Size</div>
                        <input
                            type='number'
                            value={fontSubtitle}
                            onChange={(e) => this.changeSettings(e.target.value, "fontSubtitle")}>
                        </input>
                    </div>
                </div>

                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: '50%' }}>Position</div>
                        <div style={{ width: '50%', zIndex: 15 }}><SelectDD data={POS_LIST} onChange={(o) => this.changeSettings(o, "position")} selected={position} /></div>
                    </div>
                </div>
            </div>
        </div>



        var axisPage = <div>
            <div className="m-t-10">
                <div className="d-flex">
                    <div style={{ width: '50%' }}>Chart Type</div>
                    <div style={{ width: '50%', zIndex: 12 }}><SelectDD data={CHART_LIST} onChange={(o) => this.changeSettings(o, "type")} selected={type} isClearable={false} /></div>
                </div>
            </div>

            {type.value !== "pie" ? <div>
                <div className="m-t-10">
                    <div className="d-flex">
                        <div style={{ width: '40%' }}>Series Name</div>
                        <div style={{ width: '20%' }}>2nd Axis</div>
                        {type.value === 'custom' ? <div style={{ width: '40%' }}>Chart Type</div> : null}
                    </div>
                </div>
                <div>
                    {AGG_LIST.map((o, i) => {
                        return (
                            <div className="d-flex">
                                <div style={{ width: '40%' }}>{o.label}</div>
                                <div style={{ width: '20%', zIndex: 10 - i }}><Checkbox title="" styleName="default" onChange={() => this.axisSettings(!o.yAxis, o)} isChecked={o.yAxis} /></div>
                                {type.value === 'custom' ? <div style={{ width: '40%', zIndex: 10 - i }}><SelectDD data={CHART_CUSTOM_LIST} onChange={(selected) => this.customSettings(selected, o)} selected={o.selected} isClearable={false} /></div> : null}
                            </div>
                        )
                    })}
                </div>
            </div> : null}
        </div>

        var themePage = <div className="m-t-10">
            <div className="d-flex">
                <div style={{ width: '50%' }}>Theme</div>
                <div style={{ width: '50%', zIndex: 14 }}><SelectDD data={colorList} onChange={(o) => this.changeSettings(o, "backGroundColor")} selected={backGroundColor} /></div>
            </div>
        </div>
        var page = route === "title" ? TitlePage : route === "axis" ? axisPage : themePage
        var classNameTitle = route === "title" ? "tab_button" + " tab_button_active" : "tab_button"
        var classNameAxis = route === "axis" ? "tab_button" + " tab_button_active" : "tab_button"
        var classNameTheme = route === "theme" ? "tab_button" + " tab_button_active" : "tab_button"
        console.log(this.state, "state in chart settings");

        return (
            <ModalBody> {/* Popup div here */}
                <div style={{height:"30vh"}}>
                    <div className="main-tab d-flex">
                        <div className={classNameTitle} onClick={this.setPage.bind(this, "title")}>Chart Title</div>
                        <div className={classNameAxis} onClick={this.setPage.bind(this, "axis")}>Axis Properties</div>
                        <div className={classNameTheme} onClick={this.setPage.bind(this, "theme")}>Themes</div>
                    </div>
                    <div style={{height:"1vh"}}></div>
                    <div style={{height:"20vh"}}>{page}</div>
                    <div className="m-t-10">
                    </div>
                    <div className="btn btn-sm btn-primary" onClick={this.apply}>Apply</div>
                    <span style={{ width: "10px" }}> </span>
                    <div className="btn btn-sm btn-primary m-l-10" onClick={toggle}>Cancel</div>
                </div>
            </ModalBody>
        )
    }
}