import { faTextHeight } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Exchange from './Exchange';
import { json, checkStatus } from './utils';

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
            <h3 className="my-2">Rate Refresh in {stateTimer}secs</h3>
        )
    }
}


class ExchangeRate extends React.Component {
    render() {
        const { currency, rate } = this.props ;    
        console.log("Exchange Rate Refresh:" + currency + " at " + rate)
        
        return (
            <div>
                <h3>Currency: {currency}<br/>Exchange Rate: {rate}</h3>
            </div>
        ) 
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
                <Timer key={timerKey} timer={timer} onChange={this.onParentChange} />
                <button onClick={this.fetchRates}>Output</button>
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
            </div>
        )
    }
}

export default ExchangeRateUpdate; 
