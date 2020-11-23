import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faBars, faCircle, faEnvelope, faChessQueen } from '@fortawesome/free-solid-svg-icons'; 
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Exchange from "./Exchange";
import Converter from "./Converter";

library.add( fab, faBars, faCircle, faEnvelope, faChessQueen );



const NotFound = () => {
  return <h2>404: Nadda herea</h2>
}

const App = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-md bg-dark nav-font">
        <Link className="navbar-brand nav-font" to="/"><FontAwesomeIcon icon="chess-queen" /> Currentsy</Link>
        <button className="navbar-toggler" type="button" data-toggler="collapse" data-target="#navbarMenu"><FontAwesomeIcon id="menuIcon" icon="bars" /></button>
        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active"> 
              <Link className="nav-link nav-font" to="/">Exchange Rates</Link>
            </li>
            <li className="nav-item active"> 
              <Link className="nav-link nav-font" to="/calc">Currency Converter</Link>
            </li>
          </ul>
        </div>
      </nav>
      <Switch>
        <Route path="/" exact component={Exchange} />
        <Route path="/calc" component={Converter} />
        <Route component={NotFound} />
      </Switch>
      <footer className="footer pt-3 pb-2 d-flex flew-row">
        <div className="d-flex justify-content-center contactLinks pb-2">
            <a href="https://github.com/cloudripper"><FontAwesomeIcon icon={['fab', 'github']} /></a>
            <p className="dotFormat my-auto mx-2 mx-sm-2 mx-md-3 mx-lg-4 mx-xl-5"><FontAwesomeIcon icon="circle" /></p>
            <a href="#"><FontAwesomeIcon icon={['fab', 'linkedin']} /></a>
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