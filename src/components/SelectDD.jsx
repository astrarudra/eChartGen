import React, { Component } from "react"
import Select from 'react-select'
//import makeAnimated from 'react-select/lib/animated';

const dummyData = [ // Example Datastructure, Value should be unique, label should be set to display text.
    { value: 'example1', label: 'Example1' },
    { value: 'example2', label: 'Example2' },
]

class SelectDD extends Component {
    constructor() {
        super();
        this.state = {
            isFocus: false
        };
    }

    render() {
        var { 
            placeholder, 
            data = dummyData, 
            isMulti = false, 
            onChange = null,
            isClearable = true,
            className='dd-wrap', 
            classNamePrefix="dd",
            selected = [],
            abbreviate = true,
            isDisabled = false,
        } = this.props
        var { isFocus } = this.state;

        var closeMenuOnSelect = isMulti ? false: true; 
        if(placeholder === undefined) placeholder = isMulti ? "-- Multi Select --":  "-- Single Select --"
        var value = selected
        if(isMulti && abbreviate){ // Abbreviate Code
            var selectedCount = selected.length
            var abbreviate = selectedCount > 0 ? [{ value: null, label: selectedCount + ' Selected' }] : []
            value = !isMulti || isFocus ? selected : abbreviate
            isClearable = isMulti && !isFocus ? false : isClearable
        }

        return (
            <div style={{height: '35px'}}>
                <div style={{overflow: 'visible', zIndex: 0, position: 'sticky'}}>
                    <Select options={data.slice()} // ref to datastructure above
                        //defaultValue={selected} // Uncontrolled State
                        value={value} // Controlled State - Selected values [{},{}] for multi or {} for single
                        placeholder={placeholder} // Default is "-- Multi Select --"  or "-- Single Select --" based on isMulti
                        isMulti={isMulti} // Allow multi - default false
                        closeMenuOnSelect={closeMenuOnSelect}
                        className={className}
                        classNamePrefix={classNamePrefix}
                        onChange={onChange}
                        onFocus={() => this.setState({isFocus: true})}
                        onBlur={() => this.setState({isFocus: false})}
                        //defaultMenuIsOpen={true} // Useful for styling 
                        isClearable={isClearable} // X button to clear selection
                        //components={makeAnimated()}
                        isDisabled={isDisabled}
                    />
                </div>
            </div>
        )
    }
}

export default SelectDD