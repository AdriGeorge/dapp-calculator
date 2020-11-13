import React, { Component } from 'react';
import CalculatorContract from './contracts/Calculator.json';
import ResultComponent from './components/ResultComponent';
import KeyPadComponent from './components/KeyPadComponent';
import getWeb3 from './getWeb3';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      result: '',
      web3: null,
      accounts: null,
      contract: null,
    };
  }
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CalculatorContract.networks[networkId];
      const instance = new web3.eth.Contract(
        CalculatorContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Add 1+1
    const r = await contract.methods
      .calculate(1, 1, '+')
      .call({ from: accounts[0] });

    console.log('App -> r', r);
  };

  smartCalcolate = async (x, y, operation) => {
    const { accounts, contract } = this.state;
    var r;
    try {
      r = await contract.methods
        .calculate(x, y, operation)
        .call({ from: accounts[0] });
    } catch (e) {
      this.setState({
        result: '',
      });
      return;
    }
    console.log('App -> r', r);
    try {
      this.setState({
        // eslint-disable-next-line
        result: r,
      });
    } catch (e) {
      this.setState({
        result: 'error',
      });
    }
  };

  onClick = (button) => {
    if (button === '=') {
      this.calculate();
    } else if (button === 'C') {
      this.reset();
    } else if (button === 'CE') {
      this.backspace();
    } else {
      this.setState({
        result: this.state.result + button,
      });
    }
  };

  calculate = () => {
    console.log(this.state.result);
    var checkResult = '';

    if (this.state.result.includes('--')) {
      checkResult = this.state.result.replace('--', '+');
    } else if (this.state.result.length === 1) {
      return;
    } else {
      checkResult = this.state.result;
    }

    let elements = this.getElements(checkResult);
    console.log('App -> elements', elements);
    var number1 = elements[0][0];
    var number2 = elements[0][1];
    var operation = elements[1];

    console.log(number1 + ' ' + number2 + ' ' + operation);

    this.smartCalcolate(number1, number2, operation);
  };

  getElements = (checkResult) => {
    var numbers = [];
    var operation = '';
    var minus = false;

    if (checkResult[0] === '-') {
      checkResult = checkResult.slice(1, checkResult.length);
      minus = true;
    }

    if (checkResult.includes('+')) {
      numbers = checkResult.split('+');
      operation = '+';
    }
    if (checkResult.includes('-')) {
      numbers = checkResult.split('-');
      operation = '-';
    }
    if (checkResult.includes('/')) {
      numbers = checkResult.split('/');
      operation = '/';
    }
    if (checkResult.includes('*')) {
      numbers = checkResult.split('*');
      operation = '*';
    }

    if (minus) {
      numbers[0] = -numbers[0];
    }
    return [numbers, operation];
  };

  reset = () => {
    this.setState({
      result: '',
    });
  };

  backspace = () => {
    this.setState({
      result: this.state.result.slice(0, -1),
    });
  };

  render() {
    return (
      <div>
        <div className="section-center">
          <div className="calculator-body">
            <h2 className="title">Calculator</h2>
            <ResultComponent result={this.state.result} />
            <KeyPadComponent
              result={this.state.result}
              onClick={this.onClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
