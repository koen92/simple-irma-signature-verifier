import React, { Component } from 'react';
import Files from 'react-files'
import logo from './logo.svg';
import Blob from 'blob';
import './App.css';
import jwt from 'jsonwebtoken';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      error: null,
    };
  }

  onFilesChange = (x) => {
    const signature = new Blob(new Array(x[x.length - 1]));
    const endpoint = 'http://localhost:3000/irma_api_server/api/v2/signature/checksignature';
    fetch(endpoint, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: signature,
    })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Invalid signature!');
      }

      return response;
    })
    .then(response => response.text())
    .then(token => {
      this.setState({
        token,
        error: null,
      })
    })
    .catch(error => (
      this.setState({
        token: null,
        error,
      })
    ));
  }

  renderToken = () => {
    const result = jwt.decode(this.state.token); // TODO: use jwt.verify with key!
    const { signature, status } = result;
    
    if (status !== 'VALID' || signature === undefined) {
      return 'Dit is geen geldige signature!';
    }

    const { messageType, message } = signature;
    return (
      <div>
        Bericht: <br />
        {messageType === 'jpg' ? <img src={`data:image/jpeg;base64,${message}`} alt={message} /> : message}<br /><br />
        Attributes: <br />
        {JSON.stringify(result.attributes)}
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
        </p>
        <Files
          onChange={this.onFilesChange}
          clickable
        >
          Sleep een bestand hier naartoe of click om te uploaden!
        </Files>
        {this.state.token !== null ? this.renderToken() : ''}<br />
        {this.state.error !== null ? 'Dit is geen geldige signature!' : ''}
      </div>
    );
  }
}

export default App;
