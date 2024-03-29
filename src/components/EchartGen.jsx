import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

class EchartGen extends PureComponent {
  render() {
    var { option, height, width } = this.props
    console.log(this.props,"Props in echart");
    return (
      <div className='examples'>
        <div className='parent'>
          <ReactEcharts
            option={option}
            style={{height: height, width: "100%"}}
            className='react_for_echarts'
            lazyUpdate={false}
            notMerge={true}
            />
        </div>
      </div>
    );
  }
}

export default EchartGen
