import React from 'react';
import './Exchange.css';
import ExchangeRateUpdate from './GetRates';
import ExchangeRates from './ExchangeRates';
import { fetchCurrencyList, fetchFunction, dateIterate } from './utils';
import { Line } from 'react-chartjs-2';
import { useState, useEffect, useRef, useReducer, createContext, useContext } from 'react';
import { withRouter } from 'react-router-dom';


//let listeners = [];
//let state = { altBase: 'HKD' };
//
//const setState = (newState) => {
//    state = { ...state, ...newState };
//    listeners.forEach((listeners) => {
//        listeners(state)
//    })
//}
//
//export const useCustom = (e) => {
//    console.log("useCustom: ", e)
//    const newListener = useState()[1];
//    console.log("useCustom new listener ", newListener)
//    useEffect(() => { 
//        listeners.push(newListener);
//        return () => {
//            listeners = listeners.filter(listener => listener !== newListener)
//        };
//     }, []);
//     return [state, setState];
//}


//export const currencyReducer = (state, action) => {
//    if (state != null) {
//        console.log("what is altbase: ", action.altBase)
//        state = { altBase: action.altBase }
//        console.log('state: ', state)
//        return RateChart("BAS")
//        }
//}
//
//
//
export const useDataReducer = (state, action) => {
    const [data, setData] = useState({})
    if (action !== null) {
        console.log("what is reducer data: ", action)
        state = { action }
        console.log('state: ', state)
        setData(state);
        console.log('data state: ', data)
        }
    
        console.log('should return data: ', data)
        return data; 
}   



export const RateChart = (props) => {
    //global.currency = useCurrency()
    const { rangeData, base, start, end, passAltBase } = props;
    const [ dates, setDates ] = useState([])
    //const [ altBase, setAltBase ] = useState(passAltBase)
    const [chartData, setChartData] = useState({})
    //const [ altBase, setAltBase ] = (global.currency.altBase)
    //const altBase = global.currency.altBase
    //const [ data, setData ] = useData({
    //    range: rangeData,
    //    base: base,
    //    altBase: passAltBase,
    //    start: start,
    //    end: end,
    //})


    const altBase = passAltBase

    const rangeArray = dateIterate(start, end)
 
    console.log('altbase: ', altBase)

    const handleAltChange = (e) => {
        console.log("handleAlk: ", e)
    //    setAltBase(e)
    }


    
    

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

    useEffect(() => {
       // const baseInput = currencyReducer() 
        //console.log('useEffect Test: ', baseInput)
    })

    return(
        <div id="chartStyle">
            <Line data={chartData} options={{
                height: "250px",
                title: {text: `5-Year Rate Trend`, display: true},
                legends: {
                    fontColor: '#93d9d9',
                    labels: {
                        fontColor: '#93d9d9',
                    }
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                autoSkip: true,
                                fontColor: 'lightgray',
                                padding: -5,
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
                                autoSkip: true,
                                autoSkipPadding: 5,
                                maxRotation: 30,
                                fontColor: 'lightgray',
                                padding: -2,
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
        const { base, altCurr, fetchData, currencyList, onChangeBase, onChangeAltBase } = props
        this.state = { 
            primaryCurrency: base,
            altBase: altCurr,
            exchangeRate: '',
            amount: '',
            currencies: [],
            currencyData: {},
            rateKey: 0,
            chartKey: 100,
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
        //this.handleCurrencyList = this.handleCurrencyList.bind(this)
        //this.fetchRates = this.fetchRates.bind(this)
        this.onParentChange = this.onParentChange.bind(this)
        this.onLiftAltBase = this.onLiftAltBase.bind(this)
        this.fetchProcess = this.fetchProcess.bind(this)
        this.currencyListProcess = this.currencyListProcess.bind(this)
        
    }

    componentDidMount () {
        this.fetchProcess()
        this.currencyListProcess()
        //this.fetchRates();
        //this.handleCurrencyList();
    }

    fetchProcess() {
        const { fetchData } = this.props
        console.log('xchange Data Process: ', fetchData)
        if (fetchData) {
            this.setState({
                loading: false,
                todayResults: fetchData[0][fetchData[1]],
                today: fetchData[1],
                startDate: fetchData[2],
                rangeResults: fetchData[0]
            })
        }
    }

    currencyListProcess() {
        const { primaryCurrency, rateKey } = this.state;
        const { currencyList } = this.props
        if (currencyList) {
            const currJSON = currencyList
            const primaryKey = rateKey + 1;

            const jsonData = currJSON.data[0][primaryCurrency];
            
            this.setState({
                loading: false,
                currencies: currJSON.list,
                currencyData: currJSON.data[0],
                currencyKey: jsonData["key"],
                currencyType: jsonData["currency"],
                currencyCountry: jsonData["country"],
                currencyRegion: jsonData["region"],
                rateKey: primaryKey, 
            })
        }
    }


    onParentChange(e) {  
        let timerChild = e;
        if (timerChild === 0) {
           this.fetchRates();
        }
    }


    onLiftAltBase(altCurrency) {
        const { chartKey } = this.state;
        const chKey = chartKey + 1
        console.log("Change altBase: ", altCurrency)
        
        this.props.onChangeAltBase(altCurrency)

        this.setState({
            altBase: altCurrency,
            chartKey: chKey
        })
    }


    //async fetchRates() {
    //    const { primaryCurrency } = this.state;
    //    const fetchResults = await fetchFunction(primaryCurrency);            
    //    
    //    await this.setState({ 
    //        todayResults: fetchResults[0][fetchResults[1]],
    //        loading: false,
    //        today: fetchResults[1],
    //        startDate: fetchResults[2],
    //        rangeResults: fetchResults[0]
    //    });
    //}

    //async handleCurrencyList() {
    //    const { primaryCurrency, rateKey } = this.state;
    //    const currJSON = await fetchCurrencyList();
    //    const primaryKey = rateKey + 1;
//
    //    const jsonData = currJSON.data[0][primaryCurrency];
    //    
    //    await this.setState({
    //        currencies: currJSON.list,
    //        currencyData: currJSON.data[0],
    //        currencyKey: jsonData["key"],
    //        currencyType: jsonData["currency"],
    //        currencyCountry: jsonData["country"],
    //        currencyRegion: jsonData["region"],
    //        rateKey: primaryKey, 
    //    })
    //}

    handleClick(currency) {   
        const { rateKey, chartKey, currencyData } = this.state;
        const exKey = rateKey + 1
        const chKey = chartKey + 1
        const currencyUpdate = currencyData[currency];

        this.setState({ 
            primaryCurrency: currency,
            rateKey: exKey, 
            chartKey: chKey,
            currencyKey: currencyUpdate["key"],
            currencyType: currencyUpdate["currency"],
            currencyCountry: currencyUpdate["country"],
            currencyRegion: currencyUpdate["region"],
        });
    }

    render () {
        const {  altBase, primaryCurrency, currencies, currencyType, currencyKey, currencyCountry, currencyData, rateKey, chartKey, todayResults, loading, today, startDate, rangeResults } = this.state;
    
        console.log("Today Results: ", todayResults)

        console.log("Render altbase: ", altBase)

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
                                            return <div className="dropdown-item customDropdownItem col-3"><p key={index} currency={currency} type="button" className="btn customBtn" onClick={() => this.props.onChangeBase(currency)}>{currency}</p></div>
                                        }
                                        return;
                                    })}                                  
                            </div>
                        </div>
                        <p>{currencyType}</p>
                        {(() => {
                            if (!loading) {
                               return <RateChart key={chartKey} rangeData={rangeResults} base={primaryCurrency} start={startDate} end={today} passAltBase={altBase} />
                            }
                         })()}
                        
                    </div>
                    <div className="col-lg-6 exRates">
                    {(() => {
                        if (loading) {
                            return <div className="d-flex flex-row flex-lg-column justify-content-center border rounded bg-light mt-5 rateContainer"><p>Loading data...</p></div>;
                        }
                        if (!loading) {
                            return <ExchangeRates key={rateKey} currData={currencyData} currList={currencies} baseInput={primaryCurrency} parentResults={todayResults} handleAltChange={this.onLiftAltBase} />                          
                        }
                    })()}
                    </div>                    
                </div>
            </div>
        )
    }
}

export default Exchange
