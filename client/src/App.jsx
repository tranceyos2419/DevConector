import React, {
  Component
} from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Layout/Navbar.jsx'
import Footer from './components/Layout/Footer.jsx';
import Landing from './components/Layout/Landing.jsx';
import Login from './components/autho/Login';
import Register from './components/autho/Register';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App" >
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
