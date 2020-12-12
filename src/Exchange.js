import React from 'react';
import './Exchange.css';
import ExchangeRates from './ExchangeRates';
import { dateIterate } from './utils';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';



export const RateChart = (props) => {
    const { rangeData, base, start, end, passAltBase } = props;
    const [chartData, setChartData] = useState({})
    const altBase = passAltBase
    const rangeArray = dateIterate(start, end)

    const chart = (data) => {
        setChartData({
            labels: rangeArray,
            datasets: [
                {
                    label: `${base}-${altBase} Exchange Range`,
                    borderColor: "darkgrey",
                    pointBackgroundColor: "white",
                    pointBorderWidth: 0,
                    pointRadius: 2,
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
        <div id="chartStyle">
            <Line data={chartData} 
            options={{
                height: "250px",
                title: {text: `Rate Trend`, display: true, fontColor: "white"},
                legend: {
                    labels: {
                        fontColor: 'lightgray',
                    }
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                autoSkip: true,
                                autoSkipPadding: 15,
                                fontColor: 'lightgray',
                                padding: 0,
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
        const { base, altCurr } = props
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
        this.onParentChange = this.onParentChange.bind(this)
        this.onLiftAltBase = this.onLiftAltBase.bind(this)
        this.fetchProcess = this.fetchProcess.bind(this)
        this.currencyListProcess = this.currencyListProcess.bind(this)
        
    }

    componentDidMount () {
        this.fetchProcess()
        this.currencyListProcess()
    }

    fetchProcess() {
        const { fetchData } = this.props
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
        const { chartKey, rateKey } = this.state;
        const chKey = chartKey + 1
        const rKey = rateKey + 1
        
        this.props.onChangeAltBase(altCurrency)

        this.setState({
            altBase: altCurrency,
            chartKey: chKey,
            rateKey: rKey
        })
    }

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
                            <div className="dropdown-menu" onChange={this.handleChange}>                            
                                    {currencies.map((currency, index) => {
                                        if (currency !== primaryCurrency) {
                                            return <div key={index} className="customDropdownItem"><p key={index} currency={currency} type="button" onClick={() => this.props.onChangeBase(currency)}>{currency}</p></div>
                                        }
                                        return null;
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
                            return (
                                <div className="d-flex border my-5" id="rateContainer">            
                                    {(() => {
                                        return currencies.map((currency) => {
                                            for (var key in todayResults) {                               
                                                if (currency === key && currency !== primaryCurrency) {     
                                                    let rate = todayResults[key] 
                                                    return <ExchangeRates key={key} currData={currencyData} passCurrency={currency} passAltBase={altBase} passRate={rate} handleAltChange={this.onLiftAltBase} />                                        
                                                }
                                            }
                                            return null;
                                        })
                                    })()}
                                </div>
                            )
                        }
                    })()}
                    </div>                    
                </div>
            </div>
        )
    }
}

export default Exchange
