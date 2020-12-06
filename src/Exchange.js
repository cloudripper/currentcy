import React from 'react';
import './Exchange.css';
import ExchangeRateUpdate from './GetRates';
import { fetchCurrencyList, fetchFunction, dateIterate } from './utils';
import { Line } from 'react-chartjs-2';
import { useState, useEffect, useRef } from 'react';


let listeners = [];
let state = { altBase: 'HKD' };

const setState = (newState) => {
    state = { ...state, ...newState };
    listeners.forEach((listeners) => {
        listeners(state)
    })
}

export const useCustom = () => {
    const newListener = useState()[1];
    useEffect(() => { 
        listeners.push(newListener);
        return () => {
            listeners = listeners.filter(listener => listener !== newListener)
        };
     }, []);
     return [state, setState];
}


export const RateChart = (props) => {
    const { rangeData, base, altBase, start, end } = props;
    const [ dates, setDates ] = useState([])
    const [chartData, setChartData] = useState({})

    const rangeArray = dateIterate(start, end)

    const chart = (data) => {
        setChartData({
            labels: rangeArray,
            datasets: [
                {
                    label: `${base}-${altBase} Exchange Range`,
                    data: data,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)'
                    ],
                    borderwidth: 4,
                    spanGaps: true,
                }
            ]
        })
    }

    const processData = () => {
        const dataArray = []
        console.log("Array: ", rangeArray)
        rangeArray.forEach(date => {
            if (!rangeData[date]) {
                dataArray.push(null)
            }
            if (rangeData[date]) {
                let rate = rangeData[date][altBase]
                let datapoint = { x: date, y: rate } 
                dataArray.push(datapoint)
            } 
        })
        return dataArray
    }

    useEffect(() => {
        let dataArray = processData()
        chart(dataArray)
    }, [])

    return(
        <div>
            <Line data={chartData} options={{
                height: "250px",
                title: {text: `5-Year Rate Trend`, display: true},
                scales: {
                    yAxes: [{
                            ticks: {
                                autoSkip: true,
                                //maxTicksLimit: 10,
                               // beginAtZero: true,
                            }, 
                            gridLines: {
                                display: false
                            }
                        }],
                    xAxes: [
                        {
                            ticks: {
                                maxRotation: 25,
                              //  stepSize: 1
                            },
                            gridLines: {
                                display: false
                            }
                        }
                    ]
                }
            }} />
        </div>
    )
}



class Exchange extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            primaryCurrency: 'USD',
            altBase: 'HKD',
            exchangeRate: '',
            amount: '',
            currencies: [],
            currencyData: {},
            rateKey: 0,
            currencyType: "US Dollar",
            currencyCountry: "USA",
            currencyKey: "us",
            currencyRegion: "AMERICAS",
            todayResults: '',
            loading: true,
            today: '',
            startDate: '',
            rangeResults: ''
        }
        this.handleCurrencyList = this.handleCurrencyList.bind(this);
        this.fetchRates = this.fetchRates.bind(this);
        this.onParentChange = this.onParentChange.bind(this);
      //  this.onLiftAltBase = this.onLiftAltBase.bind(this);
    }

    componentDidMount () {
        this.fetchRates();
        this.handleCurrencyList();
    }

    onParentChange(e) {  
        let timerChild = e;
        if (timerChild === 0) {
           this.fetchRates();
        }
    }


    async fetchRates() {
        const { primaryCurrency } = this.state;
        const fetchResults = await fetchFunction(primaryCurrency);            
        
        await this.setState({ 
            todayResults: fetchResults[0][fetchResults[1]],
            loading: false,
            today: fetchResults[1],
            startDate: fetchResults[2],
            rangeResults: fetchResults[0]
        });
    }

    async handleCurrencyList() {
        const { primaryCurrency, rateKey } = this.state;
        const currJSON = await fetchCurrencyList();
        const primaryKey = rateKey + 1;

        const jsonData = currJSON.data[0][primaryCurrency];
        
        await this.setState({
            currencies: currJSON.list,
            currencyData: currJSON.data[0],
            currencyKey: jsonData["key"],
            currencyType: jsonData["currency"],
            currencyCountry: jsonData["country"],
            currencyRegion: jsonData["region"],
            rateKey: primaryKey, 
        })
    }

    handleClick(currency) {   
        const { rateKey, currencyData } = this.state;
        const primaryKey = rateKey + 1
        const currencyUpdate = currencyData[currency];

        this.setState({ 
            primaryCurrency: currency,
            rateKey: primaryKey, 
            currencyKey: currencyUpdate["key"],
            currencyType: currencyUpdate["currency"],
            currencyCountry: currencyUpdate["country"],
            currencyRegion: currencyUpdate["region"],
        });
    }

    render () {
        const { primaryCurrency, currencies, currencyType, currencyKey, currencyCountry, currencyData, rateKey, todayResults, loading, today, startDate, rangeResults } = this.state;
        console.log("Today Results: ", todayResults)
        return (
            <div className="container">
                <div className="row text-center">
                    <div className="col-lg-6">
                        <p className="mt-5 mb-0">{currencyCountry}</p>
                        <div className="dropdown btn-group my-2">
                            <div className="dropdown-toggle customBtn primaryBtn border" type="button" id="dropdownMenuButton" data-toggle="dropdown" style={{ position: "relative", }}>
                                <div className="btnBg" style={{backgroundImage: `url(https://flagcdn.com/64x48/${currencyKey}.png)`}}></div>
                                <span className="btnTxt">1<br/>{primaryCurrency}<br/></span>
                            </div>
                            <div className="dropdown-menu customMenu rounded" onChange={this.handleChange}>                            
                                    {currencies.map((currency, index) => {
                                        if (currency !== primaryCurrency) {
                                            return <div className="dropdown-item customDropdownItem col-3"><p key={index} currency={currency} type="button" className="btn customBtn" onClick={() => this.handleClick(currency)}>{currency}</p></div>
                                        }
                                        return;
                                    })}                                  
                            </div>
                        </div>
                        <p>{currencyType}</p>
                        {(() => {
                            if (!loading) {
                               return <RateChart rangeData={rangeResults} base={primaryCurrency} start={startDate} end={today} altBase="HKD" />
                            }
                         })()}
                        
                    </div>
                    <div className="col-lg-6 exRates">
                    {(() => {
                        if (loading) {
                            return <div className="d-flex flex-row flex-lg-column justify-content-center border rounded bg-light mt-5 rateContainer"><p>Loading data...</p></div>;
                        }
                        if (!loading) {
                            return <ExchangeRateUpdate key={rateKey} currData={currencyData} currList={currencies} baseInput={primaryCurrency} parentResults={todayResults} />                          
                        }
                    })()}
                    </div>                    
                </div>
            </div>
        )
    }
}

export default Exchange
