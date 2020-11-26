import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Exchange from './Exchange';
import './GetRates.css';
import { json, checkStatus } from './utils';

library.add( faPlusCircle );

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
        
        const { timer, onChange} = this.props;
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
        const { stateTimer } = this.state;
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
            <p className="my-2">Rate Refresh in {stateTimer}secs</p>
        )
    }
}


class ExchangeRate extends React.Component {
    render() {
        const { currency, rate } = this.props ;    
        const rateRounder = Math.round((rate * 1000)) / 1000;
        console.log("Exchange Rate Refresh:" + currency + " at " + rateRounder)
        
        return <button className="btn btn-secondary currCirc mx-1 my-1"><span className="rateStyle">{rateRounder}</span><br/><span className="rateCurr">{currency}</span></button>;
    }
}

class ExchangeRateUpdate extends React.Component {
    constructor(props){
        super(props);
        const { baseInput } = this.props;
        console.log("1 " + baseInput);
        this.state = { 
            base: baseInput,
            currencies: ['HKD', 'EUR', 'MYR', 'SGD'],
            results: [],
            error: '',
            timer: 60,
            timerKey: 1,
        };
        console.log("2 " + this.state.base);
        
        this.fetchRates = this.fetchRates.bind(this);
        this.onParentChange = this.onParentChange.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
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

    handleAddClick() {
        
    }

    fetchRates() {
        const { base, results, error, timerKey } = this.state; 
        

        if ({base} === '') {
            return console.log("No Base Set - Placeholder for full-list fetch");
        }
            fetch(`https://alt-exchange-rate.herokuapp.com/latest?base=${base}`)
            .then(checkStatus)
            .then(json)
            .then((data) => {
                const keyVar = timerKey + 1;
                this.state.results.push(data.rates);
                this.setState({ 
                    timer: 60,
                    timerKey: keyVar,
                    results: results.slice(-1)
                }); 
            }).catch((error) =>  {
                this.setState({ error: error.message });
                console.log(error);
            })    
    }

    render() {

        const {
            results, 
            currencies,
            error,
            timer,
            timerKey
        } = this.state;

        const ratesObj = results[0];
        
        return (
            <div>
                <div className="d-flex flex-row flex-lg-column justify-content-center border rounded bg-light mt-5"> 
                    {(() => {
                        if (error) {
                            return <div>{error}</div>
                        }
                        return currencies.map((currency) => {
                            for (var key in ratesObj) {
                                if (currency === key) {
                                    return <ExchangeRate key={key} currency={currency} rate={ratesObj[key]}  />
                                }
                            }
                        })
                    })()}
                    <div className="flex-item dropdown">
                    <button className="btn btn-secondary currCirc addCurr mx-1 my-1 dropdown-toggle" data-toggle="dropdown" onClick={this.handleAddClick}><FontAwesomeIcon icon="plus-circle" /><br/></button>
                        <ul className="dropdown-menu">                            
                                {currencies.map((currency) => {
                                           return <li currency={currency} type="button" className="dropdown-item">{currency}</li>
                                        }
                                    )
                                }                                  
                        </ul>
                    </div>
                </div>
                <Timer key={timerKey} timer={timer} onChange={this.onParentChange} />
            </div>
        )
    }
}

export default ExchangeRateUpdate; 
