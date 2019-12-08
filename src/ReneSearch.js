import React, { Component } from 'react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
//import { Link } from 'react-router-dom'; 
import { withStyles } from '@material-ui/core';
import isEmpty from 'lodash/isEmpty';
import ReactHtmlParser from 'react-html-parser';
import cloneDeep from "lodash/cloneDeep";

const styles = theme => {
    console.log(theme)
    return {
        containerPopup: {
            marginTop: '60px',
            position: 'relative',
            zIndex: '999999',
            backgroundColor: '#fff',
            opacity: '0.9',
            width: '100%',
            height: `85vh`
        },
        searchTextBox: {
            border: '2px solid #eee',
            width: '60%',
            fontSize: '10px',
            margin: 'auto',
            padding: '10px',
            borderRadius: '5px',
            position: 'relative',
            paddingTop: '30px',
            backgroundColor: '#fff',
            [theme.breakpoints.up('sm')]: {
                width: '70%',
                fontSize: '12px'
            }
            //opacity: 0 
        },
        closeReneIconBox: {
            display: 'flex',
            justifyContent: 'flex-end',
            cursor: 'pointer',
            position: 'absolute',
            top: '2px',
            right: '2px'
        },
        dropDown: {
            width: '150px',
            height: '450px',
            border: '2px solid #FFEB9D',
            //margin: 'auto', 
            position: 'fixed',
            "overFlowY": 'auto',
            //left:'150px', 
            [theme.breakpoints.up('sm')]: {
                width: '300px'
            }
            //position: 'absolute' 
        },
        searchText: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        dropDownArrow: {
            width: '10px',
            height: '10px',
            transform: `rotate(45deg)`,
            borderTop: '2px solid #FFEB9D',
            borderLeft: '2px solid #FFEB9D',
            margin: 'auto',
            position: 'relative',
            top: '-8px',
            ///backgroundColor: '#fff' 
        }
    };
};

class ReneSmartSearch extends Component {
    state = {
        selectedAmbiguityNode: null,
        ambiguityNodesArray: [],
        counter: 0,
        loading: true,
        reneResString: 'Show me performances of hdfc in arbitrage',
        arrayOfDropDownBlocks: [],
        previousAmbiguityNode: null,
        resFromApi: {
            ambiguous_query:
                "Show me performances of <span class='highlight_ambiguity'>hdfc equity</span> in <span class='highlight_ambiguity'>arbitrage</span> and <span class='highlight_ambiguity'>debt</span>",
            suggestions: {
                hdfc: [
                    {
                        type: 'NAME',
                        value: 'HDFC Arbitrage',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Balanced Advantage Fund',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Banking & PSU Debt Fund',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Capital Builder Value Fund',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Corporate Bond',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Credit Risk Debt',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Dynamic Debt Fund',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Dynamic PE Ratio FOFs A',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Equity',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Equity Savings Fund',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Floating Rate Debt Fund',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Focused 30 Fund',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Gilt Fund',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Gold',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Growth Opportunities Fund',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Hybrid Debt Fund',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Hybrid Equity Fund',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Income',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Infrastructure',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'HDFC Liquid',
                        score: 0
                    }
                ],
                arbitrage: [
                    {
                        type: 'NAME',
                        value: 'Aditya BSL Arbitrage Fund',
                        score: 0
                    },
                    {
                        type: 'CATEGORY',
                        value: 'Arbitrage',
                        score: 0
                    },
                    {
                        type: 'NAME',
                        value: 'Axis Arbitrage Fund',
                        score: 0
                    }
                ]
            }
        }
    };

    componentDidMount() {
        console.log('reneSearch Component mount');
        this.reneSearchRequest();
    }
    componentWillUnmount() { }
    reneSearchRequest = () => {
        // make request to reneApi 
        // then setTheState 
        // after that run this function 

        this.updateString();
    };
    findAmbiguousWordsInString = () => {

        let ambiguityNodesArray = [];

        let nodes = document.querySelectorAll(`.highlight_ambiguity`);
        nodes = Array.from(nodes);
        if (nodes.length > 0) {
            //ambiguityNodesArray.push(node) 
            nodes.forEach(item => {
                if(item.hasAttribute("data")){
                item.style.backgroundColor = '#FFF';
                item.style.borderRadius = '5px';
                item.style.padding = '2px';
                item.style.marginTop = '3px';
                }else{
                item.style.backgroundColor = '#FFD93C';
                item.style.borderRadius = '5px';
                item.style.padding = '2px';
                item.style.marginTop = '3px';
                }
                
            });
        }
        nodes.forEach((node, index) => {
            let cords = node.getBoundingClientRect();
            ambiguityNodesArray.push({ element: node, cords });
        });

        console.log('ambiguityNodesArray', ambiguityNodesArray);
        this.setState({ ambiguityNodesArray: ambiguityNodesArray }, () =>
            this.focusNextAmguityString()
        );


        //setSelectedAmbiquity(ambiguousWordsArray[0]); 
    };
    updateString = () => {
        if (this.state.counter < 1) {
            this.findAmbiguousWordsInString()
        } else {
            let arrayOfAmbiguiousWords = ["hdfc equity", "arbitrage", "debt"];
            let lastNode = document.querySelectorAll('.highlight_ambiguity')[this.state.counter-1];
            lastNode.setAttribute("data", "done")
            let newString = this.state.resFromApi.ambiguous_query.replace(arrayOfAmbiguiousWords[this.state.counter - 1], "akakkdakkdlaskdkakan")
            let clonedResponseFromApi = cloneDeep(this.state.resFromApi);
            clonedResponseFromApi.ambiguous_query = newString;
            this.setState({ resFromApi: clonedResponseFromApi, }, () =>
                this.findAmbiguousWordsInString()
            );
        }
    }
    focusNextAmguityString = () => {
        console.log('focusNextAmguityString');
        let counter = this.state.counter;
        let selectedNode = this.state.ambiguityNodesArray[counter];
        console.log('focusNextAmguityString', counter, selectedNode);
        if (
            this.state.counter < this.state.ambiguityNodesArray.length + 1 &&
            selectedNode
        ) {
            if (this.state.counter < 1) {
                this.setState(
                    { selectedAmbiguityNode: selectedNode, counter: counter + 1 },
                    () => {
                        this.moveDropDown();
                        //counter++; 
                        //this.moveDropDown(); 
                    }
                );
            } else {
                let arrayOfAmbiguiousWords = ["hdfc equity", "arbitrage", "debt"];

                let newString = this.state.resFromApi.ambiguous_query.replace(arrayOfAmbiguiousWords[this.state.counter - 1], "akakkdakkdlaskdkakan")
                let clonedResponseFromApi = cloneDeep(this.state.resFromApi);
                clonedResponseFromApi.ambiguous_query = newString;
                this.setState(
                    { selectedAmbiguityNode: selectedNode, counter: counter + 1 },
                    () => {

                        this.moveDropDown();
                        //counter++; 
                        //this.moveDropDown(); 
                    }
                );
            }

        }
    };
    moveDropDown = () => {
        let dropDown = document.getElementById('reneDropDown');
        //console.log("moveDropDown", dropDown, this.state.selectedAmbiguityNode.cords.left); 
        let deviceWidth = window.innerWidth;
        let isMobile = deviceWidth < 600;

        if (dropDown && !isMobile) {
            dropDown.style.cssText = `left: ${+this.state.selectedAmbiguityNode.cords
                .left -
                +dropDown.offsetWidth / 2 + this.state.selectedAmbiguityNode.cords
                    .width / 2}px;  
      top: ${this.state.selectedAmbiguityNode.cords.top + 30}px`;
            //dropDown.style.cssText  = `top: ${+ambiguousWordsArray[2].cords.top}px` 
            //dropDown.style.top = ambiguousWordsArray[0].cords.top; 
        } else if (dropDown) {
            dropDown.style.cssText = `left: ${+this.state.selectedAmbiguityNode.cords
                .left -
                +dropDown.offsetWidth / 2}px;  
          top: ${this.state.selectedAmbiguityNode.cords.top + 30}px`;
        }
    };
    render() {
        let { classes } = this.props;
        console.log('reneSearch State', this.state);
        console.log(
            'reneSearch sear map',
            Object.entries(this.state.resFromApi.suggestions)
        );
        return (
            <div className={classes.containerPopup}>
                <div style={{ padding: '20px' }}>
                    <div className={classes.searchTextBox}>
                        <div
                            onClick={this.props.closeReneSearch}
                            className={classes.closeReneIconBox}
                        >
                            <HighlightOffIcon style={{ color: 'red' }} />
                        </div>
                        <div className={classes.searchText}>
                            <div>{ReactHtmlParser(this.state.resFromApi.ambiguous_query)}</div>
                        </div>
                    </div>
                    <div className={classes.dropDown} id={'reneDropDown'}>
                        <div className={classes.dropDownArrow}></div>
                        {/*{Object.entries(this.state.resFromApi.suggestions)[ 
              this.state.counter 
            ][1].map(item => { 
              console.log('arrrrrrrr=====================', item); 
              return ( 
                <div>{`type:${item.type}, value:${item.value}, score${item.score}`}</div> 
 
              ); 
            })}*/}
                    </div>
                </div>
                {/* <Link to={'/dashboard'}> 
          <div>go to dashboard</div> 
        </Link>  */}
                <div
                    style={{ width: '200px', height: '30px', backgroundColor: 'grey' }}
                    onClick={this.updateString}
                >
                    next
        </div>
            </div>
        );
    }
}

export default withStyles(styles)(ReneSmartSearch);


