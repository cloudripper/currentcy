import React from 'react';

class PrimaryCurrencySelector  extends React.Component {
    constructor(props) {
        super(props);
    }


}


class Exchange extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            primaryCurrency: 'USD',
            exchangeRate: '',
            amount: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
    }
    handleSubmit(event) {
        event.preventDefault();
    }

    render () {
        const { primaryCurrency } = this.state;
                
        return (
            <div className="container">
                <div className="row text-center">
                    <div className="col-lg-6">
                        Exchange Rates
                    </div>
                    
                </div>
            </div>
        )
    }
}


export default Exchange; 