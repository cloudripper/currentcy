import React from 'react';
import './Exchange.css';
import ExchangeRateUpdate from './GetRates';
import { fetchCurrencyList } from './utils';
import { Line } from 'react-chartjs-2';
import { useState, useEffect, useRef } from 'react';


export const XChartComponent = () => {
    const [chartData, setChartData] = useState({})

    const chart = () => {
        setChartData({
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [
                {
                    label: "7-day Rate Trend",
                    data: [12, 23, 23, 21, 14, 74, 85],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)'
                    ],
                    borderwidth: 4
                }
            ]

        })
    }

    useEffect(() => {
        chart()
    }, [])

    return(
        <div>
            <Line data={chartData} options={{
                height: "250px",
                title: {text: "Rate Trend", display: true},
                scales: {
                    yAxis: [
                        {
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10,
                                beginAtZero: true
                            }, 
                            gridLines: {
                                display: "false"
                            }
                        }
                    ],
                    xAxis: [
                        {
                            gridLines: {
                                display: "false"
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
            exchangeRate: '',
            amount: '',
            currencies: [],
            currencyData: {},
            rateKey: 0,
            currencyType: "US Dollar",
            currencyCountry: "USA",
            currencyKey: "us",
            currencyRegion: "AMERICAS"
        }
        this.handleCurrencyList = this.handleCurrencyList.bind(this);
    }

    componentDidMount () {
        this.handleCurrencyList();
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
        const { primaryCurrency, currencies, currencyType, currencyKey, currencyCountry, currencyData, rateKey } = this.state;
        
        console.log("Key: " + currencyKey)
        return (
            <div className="container">
                <div className="row text-center">
                    <div className="col-lg-6">
                        <p className="mt-5 mb-0">{currencyCountry}</p>
                        <div className="dropdown btn-group my-2">
                            <div className="dropdown-toggle customBtn primaryBtn border" type="button" id="dropdownMenuButton" data-toggle="dropdown" style={{ position: "relative", }}>
                                <div className="btnBg" style={{backgroundImage: `url(https://www.countryflags.io/${currencyKey}/flat/64.png)`}}></div>
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
                        <XChartComponent />
                    </div>
                    <div className="col-lg-6 exRates">
                    {() => {


                    }}
                    <ExchangeRateUpdate key={rateKey} currData={currencyData} currList={currencies} baseInput={primaryCurrency} />                          
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default Exchange
