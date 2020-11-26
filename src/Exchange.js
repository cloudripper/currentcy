import React from 'react';
import './Exchange.css';
import ExchangeRateUpdate from './GetRates';



class Exchange extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            primaryCurrency: 'USD',
            exchangeRate: '',
            amount: '',
            currencies: ['AUD', 'GBP', 'USD', 'BGN'],
            xKey: 0
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    

    handleClick(currency) {   
        const { primaryCurrency, xKey } = this.state;
        const primaryKey = xKey + 1

        this.setState({ 
            primaryCurrency: currency,
            xKey: primaryKey 
        });
        
        return <ExchangeRateUpdate key={xKey} baseInput={primaryCurrency} />
    }

    handleChange(event) {
    }

    handleSubmit(event) {

    }

    render () {
        const { primaryCurrency, currencies, xKey } = this.state;
                
        return (
            <div className="container">
                <div className="row text-center">
                    <div className="col-lg-6">
                    <div className="dropdown btn-group mt-5">
                        <button className="btn btn-primary dropdown-toggle primCurr currCirc" type="button" id="dropdownMenuButton" data-toggle="dropdown" >1 {primaryCurrency}</button>
                        <ul className="dropdown-menu" onChange={this.handleChange}>                            
                                {currencies.map((currency, index) => {
                                           return <li key={index} currency={currency} type="button" className="dropdown-item" onClick={() => this.handleClick(currency)}>{currency}</li>
                                        }
                                    )
                                }                                  
                        </ul>
                    </div>
                
                    </div>
                    <div className="col-lg-6 exRates">
                        <ExchangeRateUpdate key={xKey} baseInput={primaryCurrency} />
                    </div>
                    
                </div>
            </div>
        )
    }
}


export default Exchange; 