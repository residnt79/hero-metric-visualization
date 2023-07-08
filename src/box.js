import React from 'react'
import numeral from 'numeral'
import './styles/hero_style.css';

//'https://unpkg.com/react-dom@17/umd/react-dom.development.js'

function numberFormatter(type, data) {
    const data_raw = data
    const num = numeral(data_raw)
    var num_data = num
    /*if (data < 1000) {
        num_data = (num.format('0'))
    }*/
    if (data < 10) {
        num_data = (data_raw.toPrecision(2)).toString()
    } else if (data < 1000) {
        num_data = (data_raw.toPrecision(3)).toString()
    } else if (data >= 1000 && data <= 9999) {
        num_data = (num.format('0,0'))
    } else if (data >= 10000 && data <= 999999) {
    //     num_data = (num.format('0,0')).toUpperCase()
    // } else if (data >= 100000 && data <= 999999) {
        num_data = (num.format('0a')).toUpperCase()
    } else if (data >= 1000000 && data <= 99999999) {
        num_data = (num.format('0.0a')).toUpperCase()
    } else if (data >= 100000000 && data <= 999999999) {
        num_data = (num.format('0.0a')).toUpperCase()
    } else {
       num_data = (num.format('0.0a')).toUpperCase()
    }
    if (type === 'cur') {
        return '$'.concat(num_data.toString());
    } else if (type === 'num') {
        return num_data;
    } else if (type === 'pct') {
        return ((parseFloat(data_raw)*100).toPrecision(3)).toString().concat('%');
    }
 }

function yoyPercentage(type, current_year, prior_year) {
    var perc = 0
    if (type === 'pct') {
        perc = (current_year - prior_year)
    } else {
        perc = ((current_year / prior_year) - 1)
    }
    const num = perc
    if (num >= 0.01 ) {
      return (
        <div className="positiveYOY"> ▲{numeral(num).format('0%')} </div>
      );
    } else if (num <= -0.01 ){
      return (
        <div className="negativeYOY"> ▼{numeral(Math.abs(num)).format('0%')} </div>
      );  
    } else {
      return (
        <div> {numeral(Math.abs(num)).format('0%')} </div>
      );
    }
  }

function CategoryHeader(props) {
    if (props.header.isFiltered) {
        let dateRange = {}
        Object.entries(props.header.data).map(([k,v])=>{
            if(k === props.header.startDate || k === props.header.endDate) {
                dateRange[k] = v.value;
            }
        })
        
            if (props.header.end_dt_only) {
                return ( 
                    <div className="boxHeader">
                        <br/>
                        {props.header.boxName} {dateRange[props.header.endDate]}
                    </div>    
                    )
            } else {
                return (
                    <div className="boxHeader">
                        {props.header.boxName}
                        <br/>
                        ({dateRange[props.header.startDate]} - {dateRange[props.header.endDate]})
                    </div>
                )
            }
    } else {
        return (
            <div className="boxHeader">
                <br/>
                {props.header.boxName}
            </div>
        )
    }

}

function CategoryValue(props) {
    if (props.value.metricNA != true || props.value.boxKey != null ) {
        let boxValue = 0;
        Object.entries(props.value.data).map(([k,v])=>{
            if(k === props.value.boxKey) {
                boxValue = v.value;
            }
        })
        return (
            <div className="boxValue">
                {numberFormatter(props.value.numType, boxValue)}
            </div>
        )
    } else {
        return (
            <div className="boxValue">
                N/A
            </div>
        )
    }
}

function CategoryFooter(props) {
    if (props.footer.metricNA != true || (props.footer.boxKey != null && props.footer.boxKey != null)) {
        let boxValues = {}
        Object.entries(props.footer.data).map(([k,v])=>{
            if(k === props.footer.boxKey || k === props.footer.boxPyKey) {
                boxValues[k] = v.value;
            }
        })
        return (
            <div className="boxFooter">
                <div>
                    {yoyPercentage(props.footer.numType, boxValues[props.footer.boxKey], boxValues[props.footer.boxPyKey])}
                </div>
                &nbsp;{props.footer.yoyType}
            </div>
        )
    } else {
        return (
            <div className="boxFooter">
            </div>
        )
    }
}

class Box extends React.Component {
    render() {
        return (
            <div className = 'heroBox'
                style={{backgroundColor: this.props.boxColor,
                        width: numeral(this.props.width).format('0%'),
                        justifyContent: this.props.textAlign}}
                >
                <CategoryHeader header = {this.props} />
                <CategoryValue value = {this.props} />
                <CategoryFooter footer = {this.props} />
            </div>
        );
    }
}

export default class HeroBox extends React.Component {
    constructor (props) {
      // So we have access to 'this'
      super(props)
    }
  
    // render our data
    render() {
        // console.log(this.props)
  
      return (
        <Box 
            boxName = {this.props.boxName}
//            boxValue = {this.props.boxValue}
            boxKey = {this.props.boxKey} // Passing key instead of value
            boxColor = {this.props.boxColor}
            textAlign = {this.props.textAlign}
//            boxPyValue = {this.props.boxPyValue}
            boxPyKey = {this.props.boxPyKey} // Passing key instead of value
            numType = {this.props.numType}
            yoyType = {this.props.yoyType}
            width = {this.props.width}
            metricNA = {this.props.metricNA}
            isFiltered = {this.props.isFiltered}
            end_dt_only = {this.props.end_dt_only}
            startDate = {this.props.startDate}
            endDate = {this.props.endDate}
            data = {this.props.data}
        />
      );
    }
  }



