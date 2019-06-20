import React, { Component } from 'react'
import DrillFilterButton from './DrillFilterButton';

export default class ButtonGroup extends Component {
  render() {

    var { buttonList , selectedFilter, tabChange} = this.props
    return (
        <div className="v-center m-b-5" style={{flexWrap: 'wrap'}}>
            {buttonList ? buttonList.map((filter, index) => {
                var {label, value, data, drillData, isGroup, showDrill} = filter
                var selected = selectedFilter.value === value
                
                return <DrillFilterButton
                    label={label} 
                    onClick={()=>{tabChange(filter)}} 
                    selected={selected}
                />
            }): null}
        </div>
    )
  }
}
