/*
 *
 * ChatRoom
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import Pusher from 'pusher-js';

import FaHandPeaceO from 'react-icons/lib/fa/hand-peace-o';

import './style.css';
import './styleM.css';

export default class ChatRoom extends React.PureComponent {

  constructor(){
    super();
    this.state = {
      token: sessionStorage.getItem('token'),
      username: JSON.parse(sessionStorage.getItem('user')),
      messages: [],
      value: '',
      title: "Chat Room",
      users: [],
      interval: "",
      showAlertSignedOut: false
    }

    this.pusher = new Pusher('224475fc3b60138f89d1', {
          cluster: 'us2',
          authEndpoint: 'http://localhost:8000/api/presenceAuth',
          auth: {
            headers: {
              'Authorization': 'Bearer ' + this.state.token
            }
          },
          encrypted: false
        });
  }

    componentWillMount() {
      this.channel=this.pusher.subscribe('presenceRoom_' + this.props.params.id);
      this.channel.bind('send-message', this.updateChat);
      this.getMessage();
      this.setTitle();


    }

    componentDidMount() {
      let _this = this;
      let interval = setInterval(function(){_this.getOnline();}, 30000);
      this.setState({
        interval: interval
      })
    }

    componentWillUnmount() {
      clearInterval(this.state.interval);
      //this.leaveRoom();
    }

    updateChat = (event) => {
      let messages = this.state.messages;
      messages.push(event.message);
      this.setState({
        messages: messages
      })
      this.forceUpdate();
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }

    handleEnter = (event) => {
      if(event.keyCode === 13)
      {
          this.sendMessage();
      }
    };

    setTitle = () => {
      switch(this.props.params.id) {
    case '1':
        this.setState({
          title: "General Chat"
        })
        break;
    case '2':
        this.setState({
          title: "Philosophy Chat"
        })
        break;
    case '3':
        this.setState({
          title: "Science Chat"
        })
        break;
    case '4':
        this.setState({
          title: "Games Chat"
        })
        break;
    case '5':
        this.setState({
          title: "Computers Chat"
        })
        break;
    case '6':
        this.setState({
          title: "Literature Chat"
        })
        break;
    case '7':
        this.setState({
          title: "Health Chat"
        })
        break;
    case '8':
        this.setState({
          title: "Students Chat"
        })
        break;
}
    }

    sendMessage = () => {
      let _this = this;
      let data = new FormData();
      data.append('message', this.state.value);
      data.append('roomID', this.props.params.id);

      fetch('http://localhost:8000/api/sendMessage', {
        method:'POST',
        body: data,
        headers: {'Authorization': 'Bearer ' + this.state.token}
      })
      .then(function(response){
        return response.json();
      })
      .then(function(json){
        if(json.error)
        {
          alert(json.error);
        }
      })
      this.setState({
        value: ''
      })
      this.forceUpdate();
    }

    getMessage = () => {
      let _this = this;
    fetch('http://localhost:8000/api/getMessages/'+this.props.params.id, {
      method:'GET',
      headers: {'Authorization': 'Bearer ' + this.state.token}
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      this.setState({
        messages: json.messages
      })
      _this.getOnline();
    }.bind(this))
  };

  getOnline = () => {
    fetch('http://localhost:8000/api/getOnline/'+this.props.params.id, {
      method: 'GET'
    })
    .then(function(response){
      return response.json();
    })
    .then(function(json) {
      this.setState({
        users: json.users
      })
    }.bind(this))
  }

  signOut = () => {
    let _this = this;
    fetch('http://localhost:8000/api/signOut', {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + this.state.token}
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      _this.setState({
        showAlertSignedOut: true
      })
    })
  }

  leaveRoom = () => {
    fetch('http://localhost:8000/api/leaveRoom', {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + this.state.token}
    })
  }

  renderAlertSignedOut = () => {
    if(this.state.showAlertSignedOut === true){
      return(
        <div className="alertBox">
          <br/>
          <span>Goodbye!</span>
          <br/>
          <FaHandPeaceO className="iconHand"/>
          <input className="okButton" type="button" value="OK" onClick={this.hideAlert}/>
        </div>
      )
    }
  }

  hideAlert = () => {
    this.setState({
      showAlertSignedOut: false
    })
    this.context.router.push('/');
  }

  render() {
      return (
        <div className="container">
          <Helmet title="FaveChat | Chat Room" meta={[ { name: 'description', content: 'Description of ChatRoom' }]}/>

          {this.renderAlertSignedOut()}

          <div className="title">
            <h1 className="faveChat">FaveChat<span className="blue">!</span></h1>
            <span className="signOut">
              <h2 className="green">
                {this.state.username.username}&nbsp;
                <span onClick={this.signOut} className="blue signOutLink">Sign Out</span>
              </h2>
            </span>
          </div>

          <div className="chatWindow">
            <h2>{this.state.title}</h2>
            <div  className="chatBox">

              {this.state.messages.map((message, index)=>(
                <h3><span className="green">{message.username} </span><span><span className="orange">:</span></span> {message.content}</h3>
              ))}

            </div>
            <div className="users">
              <h2>Users</h2>
              <br/>
              <div>
                {this.state.users.map((user, index) => (
                  <h3 className="green">{user.username}</h3>
                ))}
              </div>
            </div>
            <div className="input"  >
              <input type="text" className="text" name="message" value={this.state.value} placeholder="Enter message here" onChange={this.handleChange} onKeyDown={this.handleEnter}/>
              <input type="submit" className="send" name="send" value="Send" onClick={this.sendMessage}/>
            </div>
          </div>

        </div>
      );
  }
}

ChatRoom.contextTypes = {
  router: React.PropTypes.object
};
