/*
 *
 * Home
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import './style.css';
import './styleM.css';

export default class Home extends React.PureComponent {

  constructor(){
    super();
    this.state = {
      //variables here
    }
  };

  showInput = (event) => {
    if(this.refs.username.style.display == 'none')
    {
      this.refs.username.style.display = 'block';
      this.refs.password.style.display = 'block';
      this.refs.go.style.display = 'block';

    }
    else
    {
      this.refs.username.style.display = 'none';
      this.refs.password.style.display = 'none';
      this.refs.go.style.display = 'none';
    }
  }

  render() {
    return (
      <div className="container">
        <Helmet title="Home" meta={[ { name: 'description', content: 'Description of Home' }]}/>
        <div className="smallContainer">
          <div className="welcomeBox">
            <div className="title"><h2>Welcome to</h2></div>
            <div className="title"><h1>FaveChat<span className="exclamation">!</span></h1></div>
            <div className="title"><h3>Find Your Favorite Chat Room</h3></div><br/>
          </div>
          <div className="loginBox">

            <input className="button" type="submit" value="Login" onClick={this.showInput} />
            <input className="button" type="submit" value="Sign Up"  onClick={this.showInput} />


            <input type="text" ref="username" className="signupInput username input" name="username" style={{display:'none'}} placeholder="Username" />
            <input type="password" ref="password" className="signupInput password input" name="password" style={{display:'none'}} placeholder="Password"/>
            <br/><br/>
            <input type="submit" ref="go" className="goButton" style={{display:'none'}} name="go" value="GO!"/>
          </div>
        </div>
      </div>
    );
  }
}

Home.contextTypes = {
  router: React.PropTypes.object
};
