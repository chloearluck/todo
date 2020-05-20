import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import SignUpForm from './components/sign-up.js'
import LoginForm from './components/login.js'
import {BrowserRouter} from 'react-router-dom'; //I add this to make errors so away

function App() {
  return (
    <div className="App">
      

      <BrowserRouter>
      <Route exact path='/signup' component={SignUpForm}/>
      <Route exact path='/login' component={LoginForm}/>
      </BrowserRouter>

    </div>
  );
}

export default App;
