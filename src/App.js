import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faBars, faCircle, faEnvelope, faChessQueen, faPlusCircle, faCommentsDollar } from '@fortawesome/free-solid-svg-icons'; 
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Exchange from "./Exchange";
import Converter from "./Converter";
import { useState, useEffect } from 'react';
import { fetchCurrencyList, fetchFunction } from './utils';



library.add( fab, faBars, faCircle, faEnvelope, faChessQueen, faPlusCircle, faCommentsDollar );


const NotFound = () => {
  return ( 
    <div> 
      <h2>404: Nadda herea</h2>
      <ul>
        <li> 
          <Link to="/">Exchange Rates</Link>
        </li>
        <li> 
          <Link to="/calc">Currency Converter</Link>
        </li>
      </ul>
    </div>    
  )
}
const Loading = () => {
  return ( 
    <div> 
      <h2>Standby: Loading Data...</h2>
    </div>    
  )
}

const App = () => {
  const [ base, setBase ] = useState('USD')
  const [ altBase, setAltBase ] = useState('HKD')
  const [ key, setKey ] = useState(0)
  const [ fetchResults, setFetchResults ] = useState(null)
  const [ fetchList, setFetchList ] = useState(null)
  const [ loading, setLoading ] = useState(true)


  useEffect(() => {    
    fetchJSON()
  }, [])

  const changeAltBase = (currency) => {
    if (base !== currency) {
      setAltBase(currency)
      setKey(key + 1)
    } else {
      console.log('Base and AltBase are the same. Select another currency.')
    }
  }
  
  const changeBase = async (currency) => {
    if (currency === altBase) {
      if (altBase !== 'AUD') {
        setAltBase('AUD')
      } else {
        setAltBase('HKD')
      }
    }

    setBase(currency)
    const results = await fetchFunction(currency);
    await setFetchResults(results)
    await setKey(key + 1)
  }

  const fetchJSON = async () => {
    const rates = await fetchFunction(base);
    const list = await fetchCurrencyList();
    await setFetchList(list)
    await setFetchResults(rates)
    await setLoading(false)
    await setKey(key + 1)
  }

  const switchBase = async (prim, alt) => {
    setBase(alt)
    const results = await fetchFunction(alt);
    await setFetchResults(results)
    await setAltBase(prim)
    await setKey(key + 1)
    
  }

  return (
    <Router>
      <nav className="navbar navbar-expand bg-dark nav-font">
        <Link className="navbar-brand nav-font" to="/"><FontAwesomeIcon id="brandIcon" icon="comments-dollar" /> Currentsy</Link>
        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active"> 
              <Link className="nav-link nav-font" to="/">Exchange Rates</Link>
            </li>
            <li className="nav-item"> 
              <Link className="nav-link nav-font" to="/calc">Currency Converter</Link>
            </li>
          </ul>
        </div>
      </nav>
      <Switch>
        <Route path="/" exact render={() => <Exchange key={key} base={base} altCurr={altBase} currencyList={fetchList} fetchData={fetchResults} onChangeAltBase={ changeAltBase } onChangeBase={ changeBase } />} />
        { (loading) ? <Route component={Loading} /> : <Route path="/calc" render={() => <Converter key={key} primBase={base} altCurr={altBase} currencyList={fetchList} fetchData={fetchResults} onChangeAltBase={ changeAltBase } onChangeBase={ changeBase } switchBase={ switchBase } />} /> }
        <Route component={NotFound} />
      </Switch>
      <footer className="footer pt-3 pb-2 d-flex flew-row">
        <div className="d-flex justify-content-center contactLinks pb-2">
            <a href="https://github.com/cloudripper"><FontAwesomeIcon icon={['fab', 'github']} /></a>
            <p className="dotFormat my-auto mx-2 mx-sm-2 mx-md-3 mx-lg-4 mx-xl-5"><FontAwesomeIcon icon="circle" /></p>
            <a href="https://github.com/cloudripper"><FontAwesomeIcon icon={['fab', 'linkedin']} /></a>
            <p className="dotFormat my-auto mx-2 mx-sm-2 mx-md-3 mx-lg-4 mx-xl-5"><FontAwesomeIcon icon="circle" /></p>
            <a href="mailto: info@verticalwild.com"><FontAwesomeIcon icon="envelope" /></a>      
        </div>
        <div className="flex-item brand pb-2">
            <div className="fontMod pr-4 my-auto">VertWild Labs 2020</div>
        </div>
      </footer>



    </Router>
  );
}

export default App;