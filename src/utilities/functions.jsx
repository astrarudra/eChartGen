import _ from 'lodash'
import { DATA , FIELDS } from './data'

export const initilize = () => {
    var lists = getLists(FIELDS)
    var tableConfig = genTableConfig(lists)
    var initList = listToLV(lists.columnList)
    return {
        fields: FIELDS,
        position:"-webkit-center",
        popup: false,
        route:"title",
        route1:"chartType",
        settings: {type: CHART_CUSTOM_LIST[0]},
        tableData: DATA,
        lists: lists,
        tableConfig: tableConfig,
        buttons: initList && initList.length > 0 ? [{list: initList, selected: initList[0]}] : [],
        eyeFilter: genEyeFilter(lists),
        filterState: {}, negFilterState: {},
    }
}

export const COLUMN = 'column'
export const METRIC = 'metric'
export const SUM = 'sum'
export const AVERAGE = 'average'
export const MAX = 'max'
export const MIN = 'min'
export const COUNT = 'count'
export const PCT_TOTAL = 'pTotal'

export const LINE = 'line'
export const BAR = 'bar'
export const AREA = 'area'
export const SCATTER = 'scatter'
export const PIE = 'pie'
export const CUSTOM = 'custom'

export const CHART_LIST = [
    { value: BAR, label: 'Bar Chart' }, // 0
    { value: LINE, label: 'Line Chart' }, // 1
    { value: AREA, label: 'Area Chart' }, // 2
    { value: SCATTER, label: 'Scatter Chart' }, // 3
    { value: PIE, label: 'Pie Chart' }, // 3
    { value: CUSTOM, label: 'Custom Chart' }, // 4
]
export const CHART_CUSTOM_LIST = [
    { value: BAR, label: 'Bar' }, // 0
    { value: LINE, label: 'Line' }, // 1
    { value: AREA, label: 'Area' }, // 2
    { value: SCATTER, label: 'Scatter' }, // 3
]
export const POS_LIST = [
                        {label:"Left", value:"-webkit-left" },
                        {label:"Center", value:"-webkit-center" },
                        {label:"Right", value:"-webkit-right" } // 2
]
export const THEMES = [{label:"None", backGroundColor:"#FFFFFF", color:"#000000", chartBackGround:"#FFFFFF", value:"#000000"},
                       {label:"Theme1", backGroundColor:"rgb(198, 246, 198)", color:"#696969", chartBackGround:"rgb(198, 246, 198)", value:"#696969"},
                       {label:"Theme2", backGroundColor:"#696969", color:"#ffffff", chartBackGround:"#808080", value:"j#ffffff"},
                       {label:"Theme3", backGroundColor:"#228B22", color:"#D3D3D3", chartBackGround:"#808080", value:"#D3D3D3"},
                       {label:"Theme4", backGroundColor:"#FFFF33", color:"#a9baad", chartBackGround:"#808080", value:"#a9baad"}
                      ]

const getLists = (fields) => {
    var attributeList = _.filter(fields, 'isSelected')
    if (attributeList.length > 0) {
        var columnList = _.filter(attributeList, o => o.ddField === COLUMN)
        var metricList = _.filter(attributeList, o => o.ddField === METRIC)
    }
    return { columnList, metricList }
}

const genTableConfig = (lists = {}) => {
    var { columnList = [], metricList = [] } = lists
    var list = [...columnList, ...metricList]
    var tableConfig = list ? listToLV(flattenChildren(list)) : []
    return tableConfig
}

// Advance Recursive Functions
const listToLV = (list = []) => {
    return list.map(i => {
        return {
            value: i.fieldName,
            label: i.label, 
            type: i.fieldType, //Dimension Metric
            list: i.list,
            aggregator: i.aggregator,
            isGroup: i.isGroup,
            fieldProp: i.fieldProp,
            children: i.children ? listToLV(i.children): undefined,
        }
    })
}

export const genEyeFilter = (lists) => {
    var { columnList = [] } = lists
    var obj = {}
    flattenChildren(columnList).forEach(filter => obj[filter.value] = true)
    return obj
}

const flattenChildren = (treeData) => {
    var list = []
    console.log(treeData, "tree data in flattenCHildren");
    treeData.forEach(o => {
        if(o.isGroup){
         list = [...list, ...flattenChildren(o.children)]
        console.log(list,"List in list flattenChildren");
        }
        else list.push(o)
     })
     return list
}

// End of recursion 
const negFilter = (tableData, negFilterState) => {
    return _.filter(tableData, data => {
        var include = true
        _.keys(negFilterState).forEach(key => {
            if(_.includes(negFilterState[key], data[key])) include = false
        })
        return include
    })
}

export const genUniqueList = (tableData, filterValue, drill = false, filterState, negFilterState, drillAlready) => {
    if(drill){
        return _.uniqBy(_.filter(tableData, drillAlready ? {} : filterState), filterValue).map(o => {
            var obj = {
                value: o[filterValue],
                label: o[filterValue],
            }
            if(filterState[filterValue] && filterState[filterValue] === obj.value){
                obj.isSelected = true;
            }
            return obj
        })
    }
    else {
        var _tableData = _.filter(tableData, filterState)
        _tableData = _.filter(_tableData, data => {
            var include = true
            _.keys(negFilterState).forEach(key => {
                if(key !== filterValue && _.includes(negFilterState[key], data[key])) include = false
            })
            return include
        })

        return _.uniqBy(_tableData, filterValue).map(o => {
            var obj = {
                value: o[filterValue],
                label: o[filterValue],
            }
            if(negFilterState[filterValue] && _.includes(negFilterState[filterValue], obj.value)){
                obj.isNotSelected = true;
            }
            return obj
        })
    }
}

export const genData = (tableData , tableConfig , buttons , filterState , negFilterState, eyeFilter, lists) => { // This entire thing needs to be re-coded in serverside.
    var _tableData = _.cloneDeep(tableData)
    var _tableConfig = _.cloneDeep(tableConfig)
    if(buttons.length > 0 && _tableData.length > 0 ) {
        _tableConfig = _tableConfig.filter(filter => !eyeFilter[filter.value])
        _tableConfig = _tableConfig.filter(filter => filter.value !== buttons[buttons.length - 1].selected.value)
        _tableConfig.unshift(buttons[buttons.length - 1].selected)
        _tableConfig = _tableConfig.filter(filter => !_.includes(_.keys(filterState), filter.value))
    }

    var dimensions = _tableConfig.filter(config => config.type === "Dimension")
    var metrics = _tableConfig.filter(config => config.type === "Metric")

    // Filter dilldown
    _tableData = _.filter(_tableData, filterState)
    _tableData = _.filter(_tableData, data => {
        var include = true
        _.keys(negFilterState).forEach(key => {
            if(_.includes(negFilterState[key], data[key])) include = false
        })
        return include
    })
    
    // Keep only the dimensions selected
    _tableData = _tableData.map(data => {
        var obj = {}
        dimensions.forEach(config => {
            obj[config.value] = data[config.value]
        })
        return obj
    })
    // Filter out duplicates.
    _tableData = _.uniqWith(_tableData, _.isEqual)

    // Now let's add metrics. 
    _tableData.forEach(data => {
        var filterForMetrics = _.merge(data, filterState)
        var filteredData = _.filter(tableData, filterForMetrics)
        filteredData = negFilter(filteredData, negFilterState)
        metrics.forEach(config => {
            var o = {}
            config.aggregator.forEach(aggregate => {//_.countBy(['one', undefined, 'three'], o => o === undefined)[false]
                if(aggregate === SUM) o[SUM] = _.sumBy(filteredData, config.value)
                else if(aggregate === AVERAGE) o[AVERAGE] = _.meanBy(filteredData, config.value)
                else if(aggregate === MAX) o[MAX] = _.maxBy(filteredData, config.value)[config.value]
                else if(aggregate === MIN) o[MIN] = _.minBy(filteredData, config.value)[config.value]
                else if(aggregate === COUNT) o[COUNT] = _.countBy(filteredData, o => o[config.value] === undefined)[false]
                else if(aggregate === PCT_TOTAL) o[PCT_TOTAL] = _.sumBy(filteredData, config.value)
            })
            data[config.value] = o // Add more types of aggregations.
        })
    })
    // Let's total it up now
    var totalConfig = listToLV(lists.metricList)
    var totalData = {} 
    metrics.forEach(config => {
        var o = {}
        config.aggregator.forEach(aggregate => {
            if(aggregate === SUM) o[SUM] = _.sumBy(_tableData, o => o[config.value][SUM])
            else if(aggregate === AVERAGE) o[AVERAGE] = _.meanBy(_tableData, o => o[config.value][AVERAGE])
            else if(aggregate === MAX) o[MAX] = _.maxBy(_tableData, o => o[config.value][MAX])[config.value][MAX]
            else if(aggregate === MIN) o[MIN] = _.minBy(_tableData, o => o[config.value][MIN])[config.value][MIN]
            else if(aggregate === COUNT) o[COUNT] = _.countBy(_tableData, o => o[config.value][COUNT] === undefined)[false]
            else if(aggregate === PCT_TOTAL) {
                var total = _.sumBy(_tableData,  o => o[config.value][SUM])
                _tableData.forEach(i => {
                    i[config.value][PCT_TOTAL] = (i[config.value][PCT_TOTAL]/total) * 100
                })
                o[PCT_TOTAL] = undefined
            }
        })
        totalData[config.value] = o
    })
    return { dispTableData : _tableData , dispTableConfig : _tableConfig, totalConfig, totalData}
}
