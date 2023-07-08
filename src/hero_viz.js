import HeroBox from './box'
import React, {Fragment} from 'react'
import ReactDOM from 'react-dom'
import './styles/main_style.css';
import { ReactComponent as InfoIcon } from './images/info_icon.svg';


looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  id: "sports_hero_visualization",
  label: "Sports Hero Visualization",
  title: "Summary Visualization",
  options: {
      box_count: {
        type: "number",
        label: "Number of Boxes",
        section: "Setup",
        display: "range",
        min: "1",
        max: "6", /*aop - changed from 14 to 6*/
        step: "1"
    }
  },

  // Set up the initial state of the visualization
  create: function(element, config) {

    // Insert a <style> tag with some styles we'll use later.
    element.innerHTML = `
      <style>
        .hero-box-vis {
          /* Vertical centering */
          height: calc(100% + 20px);
          width: 100%
         
        }
        .hello-world-text-large {
          font-size: 72px;
        }
        .hello-world-text-small {
          font-size: 18px;
        }
      </style>
    `;

    // Create a container element to let us center the text.
    let container = element.appendChild(document.createElement("div"));
    container.className = "hero-box-vis";

    // Create an element to contain the text.
    this._textElement = container.appendChild(document.createElement("div"));
    this._textElement.className = "text-element";
	//Render to the target element

	this.chart = ReactDOM.render(
		<Hero data="loading..." />,
		this._textElement
	);

  },
  // Render in response to the data or settings changing
  updateAsync: function(data, element, config, queryResponse, details, done) {
    
    // Clear any errors from previous updates
    this.clearErrors();
    let firstRow = data[0];
   // let numberOfRecords = data.row.length;

    // list of dimensions.  Will need to add in measures
    function dimension_list(dim) {
        const dimension_list = []
        dim.forEach((field) => {
            dimension_list.push({[field.label_short] : field.name})
        })
        return ({dimension_list})
    }
    
    function measure_list(dim) {
        const measure_list = []
        dim.forEach((field) => {
            measure_list.push({[field.label_short] : field.name})
        })
        return ({measure_list})
    }

    /*added to do a null check*/
    function checkNull(input) {
        var re = 0;
        try {
            if(input) {
                re = input;
            }
        } catch (error) {
            console.log(error);
        }
        return re;
    }
    
    // Need to change this to a function to be passed

    const options = {...this.options}
    const dimensions = dimension_list(queryResponse.fields.dimension_like).dimension_list
    const measures = measure_list(queryResponse.fields.measure_like).measure_list
    const defaultMeasure = checkNull(Object.values(measures[1])); /*added default measure*/
    //console.log(dimensions.push({"test" : "test123"}))
    {
        options["viz_title"] = {
            label: "Viz Title",
            section: "Setup",
            type: "string",
            display: "select",
            values: dimensions,
            order: "1"
        }
        options["alt_title"] = {
            label: "Alternate Title",
            section: "Setup",
            type: "string",
            placeholder: "Enter alternate title",
            order: "2"
        }
        options["description"] = {
            label: "Metric Description",
            section: "Setup",
            type: "string",
            display: "select",
            values: measures, /*aop - changed this from dimensions to measures*/
            order: "3"
        }
        options["alignment"] = {
            label: "Text Align",
            section: "Setup",
            type: "string",
            display: "select",
            values: [
                {"Left" : "flex-start"},
                {"Right" : "flex-end"},
                {"Center" : "center"}
            ],
            default: "center",
            order: "4"
        }
        options["na"] = {
            label: "Error Text",
            section: "Setup",
            type: "string",
            placeholder: "Enter error text",
            order: "5"
        }
    }
    for (let i = 0; i < config.box_count; i++) {
        const section_title = "Box "
        options["not_applicable_" + i] = {
            label: "Metric Value Not Applicable",
            section: section_title + (i + 1),
            type: "boolean",
            default : true, /*aop - changed false to true*/
            order: "0"
        }
        options["header" + i] = {
            label: "Header Label",
            section: section_title + (i + 1),
            type: "string",
            placeholder: "Header Text",
            order: "1"
        }
        options["bg" + i] = {
            label: "Background Color",
            section: section_title + (i + 1),
            display: "color",
            type: "string",
            default: "#e7eff3",
            order: "6"
        }
//        options["alignment" + i] = {
//            label: "Alignment",
//            section: section_title + (i + 1),
//            type: "string",
//            display: "select",
//            values: [
//                {"Left" : "flex-start"},
//                {"Right" : "flex-end"},
//                {"Center" : "center"}
//            ],
//            default: "center",
//            order: "7"
//        }
        if (config[`not_applicable_` + i] === false) {
        options["number_type" + i] = {
            label: "Display Type",
            section: section_title + (i + 1),
            type: "string",
            display: "select",
            values: [
                {"Number" : "num"},
                {"Currency" : "cur"},
                {"Percentage" : "pct"}
            ],
            default: "num",
            order: "2" 
        }
        options["display" + i] = {
            label: "Select Display Measure",
            section: section_title + (i + 1),
            type: "string",
            display: "select",
            values: measures,
            order: "3",
            default: defaultMeasure
        }
        options["prior" + i] = {
            label: "Select Prior Year Measure",
            section: section_title + (i + 1),
            type: "string",
            display: "select",
            values: measures,
            order: "4",
            default: defaultMeasure
        }
        options["cnv_type" + i] = {
            label: "Conversion Type Text",
            section: section_title + (i + 1),
            type: "string",
            placeholder: "YoY",
            order: "5"
        }
        /*aop - change start - moved to last & given order*/
        options["is_filtered" + i] = {
            label: "Is Metric Filtered?",
            section: section_title + (i + 1),
            type: "boolean",
            order: "7" /*aop - added order*/
        }
        if (config[`is_filtered` + i] === true) {
            options["end_dt_only" + i] = {
                label: "Only Display End Date",
                section: section_title + (i + 1),
                type: "boolean",
                order: "8" /*aop - added order*/
            }
            options["start_dt" + i] = {
                label: "Start Date Measure",
                section: section_title + (i + 1),
                type: "string",
                display: "select",
                values: dimensions,
                order: "9" /*aop - added order*/
            }
            options["end_dt" + i] = {
                label: "End Date Measure",
                section: section_title + (i + 1),
                type: "string",
                display: "select",
                values: dimensions,
                order: "10" /*aop - added order*/
            }
        }
      }
        /*aop - change end*/
    }
    
 
    {
        this.trigger('registerOptions', options)
    }

  //  console.log([config])
    function Boxes(props) {
        return (
            [...Array(config.box_count)].map((e, i) =>
                <HeroBox key = {i}
                    boxName = {config[`header` + i]}
                    metricNA = {config['not_applicable_' + i]} /*aop - added to show & hide NA*/
                    isFiltered = {config['is_filtered' + i]} /*aop - added to check if its a filtered measure*/
                    end_dt_only = {config['end_dt_only' + i]}
                    startDate = {config['start_dt' + i]} /*aop - added start_dt*/
                    endDate = {config['end_dt' + i]} /*aop - added end_dt*/
                    numType = {config['number_type' + i]}
//                    boxValue = {firstRow[config[`display` + i]].value}
                    boxKey = {config[`display` + i]} // Passing key instead of value
                    boxColor = {config[`bg` + i]}
                    textAlign = {config[`alignment`]}
//                    boxPyValue = {firstRow[config['prior' + i]].value}
                    boxPyKey = {config['prior' + i]} // Passing key instead of value
                    yoyType = {config[`cnv_type` + i]}
                    width = {1 / config.box_count}
                    data = {firstRow}
                    config = {config}
                />
                )
            )
        }

    class Tooltip extends React.Component {
        constructor(props) {
            super(props)
        
            this.state = {
            displayTooltip: false
            }
            this.hideTooltip = this.hideTooltip.bind(this)
            this.showTooltip = this.showTooltip.bind(this)
        }
        
        hideTooltip () {
            this.setState({displayTooltip: false})
            
        }
        showTooltip () {
            this.setState({displayTooltip: true})
        }
        
        render() {
            let message = this.props.message
            let position = this.props.position
            let message_length = message.split('\n').length
            return (
            <span className='tooltip'
                onMouseLeave={this.hideTooltip}
                >
                {this.state.displayTooltip &&
                <div className={`tooltip-bubble tooltip-bottom`}>
                <div className='tooltip-message'>
                    {message_length > 1 ? (
                    <>
                        <div>{message.split('\n')[0]} </div>
                        <div>{message.split('\n')[1]}</div>
                    </>
                    ) : (
                        <div>{message}</div>
                    )}
 
                </div>
                </div>
                }
                <span 
                className='tooltip-trigger'
                onMouseOver={this.showTooltip}
                >
                {this.props.children}
                </span>
            </span>
            )
        }
    }

    function InfoIcon() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" class="icon">
                <path fill="currentColor" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2a1 1 0 0 1 0 2Z"/>
            </svg>
                        
        )
    }
    class MainTitle extends React.Component {
        render() {
            return (
                <div className="titleBar">
                    <Tooltip message={firstRow[config.description].value}>
                        {firstRow[config.viz_title].value} <InfoIcon />
                    </Tooltip>
                </div>
            )
        }
    }

//config.header[{i}]
//aop - added table, tbody & tr
class FinalBox extends React.Component {
    render() {
        return (
            <Fragment >
                <div className="container">
                    <MainTitle />
                    <div className="boxContainer">
                        <Boxes />
                    </div>
                </div>
            </Fragment>
        )
    }
}

    //To handle if there is no result for the selection.
    try {
        const firstCell = firstRow[1];
        this.chart = ReactDOM.render(
		    <FinalBox />,
		    this._textElement
	    );
    } catch (error) {
       //         console.log(error);
       // console.log(numberOfRecords);
        this.chart = ReactDOM.render(
            <Fragment>
                <div className="container">
                <div className="alttitleBar">{config.alt_title}</div>
                    <div className="boxContainer">
                        <div className="na">{config.na}</div>                        
                     </div>
                </div>
            </Fragment>,
            this._textElement
        );
            }
//    const firstCell = firstRow[1];
//    this.chart = ReactDOM.render(
//		<FinalBox />,
//		this._textElement
//	);

    // We are done rendering! Let Looker know.
    done()
  }

});