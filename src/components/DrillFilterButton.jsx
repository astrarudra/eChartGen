import React from "react";

/*  Author - Rudra Roy */

const DrillFilterButton = (props) => {
    var { label, value,
        selected = false,
        onClick,
        className = "btn btn-primary",
        selectedClassName = "btn btn-dark",
    } = props;

    var labelClass = className
    var labelSelectedClass = selectedClassName

    return (
        <div className="button-wrap">
            <div onClick={onClick} className={selected ? labelSelectedClass : labelClass}>
                {label}
            </div>
        </div>
    )
}

export default DrillFilterButton
