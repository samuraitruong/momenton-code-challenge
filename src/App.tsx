import React from 'react';
import logo from './logo.svg';
import './App.css';
import  Employee from './Employee';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-content">
        <Employee></Employee>
      </div>
    </div>
  );
}

export default App;
