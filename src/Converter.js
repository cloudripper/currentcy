import React from 'react';
import './Converter.css';


const Converter = () => {
    return <h2>Currency Converterer</h2>;
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
                    <form onSubmit={this.handleSubmit} className="form-inline">
                            <button className="btn btn-sm btn-primary primCurr currCirc" type="submit" value="submit">{primaryCurrency}</button>
                            <input className="form-control border rounded bg-light primCurr" onChange={this.handleChange} type="number" value="1" placeholder="1" />
                        </form>
                    </div>
                    <div className="flex-col col-lg-6">

                    </div>
                    <div className="col-lg-6 exRates">
                        
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default Converter; 