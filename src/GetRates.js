import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBlackTie } from '@fortawesome/free-brands-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef } from 'react';
import { usePopper, createPopper } from 'react-popper';
import './GetRates.css';
import { fetchFunction, rateRounder } from './utils';
import { XChartComponent } from './GetRates';

library.add( faPlusCircle );


const ExchangeRate = (props) => {
    const { currencyData, currency, rate } = props;
    const [isShown, setIsShown] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);
    const customBoundary = document.querySelector('#rateContainer')
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
      placement: 'right',
      modifiers: [
          { name: 'hide' }, 
          { name: 'applyStyles', options: { color: "green" }}, 
          { name: 'arrow', options: { element: arrowElement, padding: 8,  }}, 
          { name: 'offset', options: { offset: [0, 10]}}, 
          { name: 'preventOverflow', options: { mainAxis: true, altAxis: false, padding: 0, boundary: customBoundary}}, 
//          { name: 'flip', options: { fallbackPlacements: ['top', 'left', 'bottom']}}
        ],
    });

    const changeToggler = () => {
        setIsShown(!isShown)                
    }

    return (
        <>
            <button className="rateBtn mx-1 my-1" type="button" ref={setReferenceElement} onFocus={changeToggler} onBlur={changeToggler} >
                <span className="rateStyle">{rateRounder(rate)}</span><br/><span className="rateCurr">{currency}</span>
            </button>
            <div id="popper" className={ (isShown) ? "popperStyle" : "popperStyle-hidden" } ref={setPopperElement} style={styles.popper} {...attributes.popper} onClick={changeToggler} >
                <span style={{ fontWeight: "700" }}>{currencyData[currency]["currency"]}</span><br />{currencyData[currency]["country"]}<br /><span style={{ fontSize: ".8rem" }}>- {currencyData[currency]["region"]} -</span><br /><img src={`https://www.countryflags.io/${currencyData[currency]["key"]}/flat/64.png`} />
                <div id="popper" className={ (isShown) ? "arrowStyle" : "arrowStyle-hidden" } ref={setArrowElement} style={styles.arrow} />
            </div> 
        </>
    );
}


class Timer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            stateTimer: 0
        }
        this.rateTimer = null;
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.onTimerChange = this.onTimerChange.bind(this);
        
        const { timer } = this.props;
        console.log(timer);
        
    }

    componentDidMount () {
        this.startTimer();
    }

    componentWillUnmount () {
        this.stopTimer();
    }

    onTimerChange(e) {
        this.props.onChange(e);
    }

    startTimer () {
        const { timer } = this.props;
        console.log("Start timer: " + timer);

        if (timer === 60) {
            if (!this.rateTimer) {
                let lapseTime = 60;
                this.rateTimer = setInterval(() => {
                    if (lapseTime === 1) {
                        window.clearInterval(this.rateTimer);
                        console.log('break')
                        this.onTimerChange(0);
                    }
                    lapseTime -= 1;
                    this.onTimerChange(lapseTime);
                    this.setState({stateTimer: lapseTime});
                }, 1000);
            }
        }
    }

    stopTimer () {
        window.clearInterval(this.rateTimer);
        this.rateTimer = null;
    }

    render() {
        const { stateTimer } = this.state;

        return (
            <p className="my-2 mb-5">Rate Refresh in {stateTimer}secs</p>
        )
    }
}

class ExchangeRateUpdate extends React.Component {
    constructor(props){
        super(props);
        const { baseInput, currList, currData } = this.props;
        console.log("1 " + baseInput);
        this.state = { 
            base: baseInput,
            currencies: currList,
            currencyData: currData,
            results: [],
            error: '',
            timer: 60,
            timerKey: 1,
            loading: 'true',
            parentResults: [],
            today: '',
            chartResults: {}
        };
        console.log("2 " + this.state.base);
        
        this.fetchRates = this.fetchRates.bind(this);
        this.onParentChange = this.onParentChange.bind(this);
        this.resultChange = this.resultChange.bind(this);
    }

    componentDidMount () {       
        this.fetchRates();
    }
    
    onParentChange(e) {  
        let timerChild = e;
        if (timerChild === 0) {
            this.fetchRates();
        }
    }


    resultChange(e) {
        console.log(e);
    }

    async fetchRates() {
        const { base } = this.state;
        const fetchResults = await fetchFunction(base);

        this.setState({ 
            results: fetchResults[0][fetchResults[1]],
            loading: 'false',
            today: fetchResults[1],
            chartResults: fetchResults[0]
        });
    }
        
    render() {
        const {
            base,
            results, 
            currencies,
            error,
            timer,
            timerKey,
            loading,
            currencyData,
            today
        } = this.state;

        if (loading === 'true') {
            return <div className="d-flex flex-row flex-lg-column justify-content-center border rounded bg-light mt-5 rateContainer"><p>Loading data...</p></div>;
        }

        if (loading === 'false') {
            const ratesObj = results;
            console.log('Render ', ratesObj)
            const currencyArr = [];
            const columnCount = 8;
            
            return (
                <div>
                    <div className="justify-content-center border rounded bg-light mt-5" id="rateContainer"> 
                        {(() => {
                            if (error) {
                                return <div>{error}</div>
                            }
                            return currencies.map((currency) => {
                        
                                for (var key in ratesObj) {                               
                                    currencyArr.push(key)
                                    if (currency === key && currency !== base) {     
                                        return <ExchangeRate key={key} currencyData={currencyData} currency={currency} rate={ratesObj[key]}  />
                                    }
                                }
                                return;
                            })
                        })()}

                    </div>
                    
                    <Timer key={timerKey} timer={timer} onChange={this.onParentChange} />
                </div>
            )
        }
    }
}

export default ExchangeRateUpdate; 


//<div className="flex-item dropdown">
//<button className="btn btn-secondary currCirc addCurr mx-1 my-1 dropdown-toggle" data-toggle="dropdown" onClick={this.handleAddClick}><FontAwesomeIcon icon="plus-circle" /><br/></button>
//    <div className="dropdown-menu">                            
//            {currencies.map((currency) => {
//                if (currency !== base) {
//                    return <p currency={currency} type="button" className="dropdown-item col-3">{currency}</p>
//                }
//            })}                                  
//    </div>
//</div>