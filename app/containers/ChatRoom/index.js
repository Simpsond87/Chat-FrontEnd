/*
 *
 * ChatRoom
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import Pusher from 'pusher-js';

var pusher = new Pusher('224475fc3b60138f89d1', {
      cluster: 'us2',
      encrypted: false
    });

import './style.css';
import './styleM.css';

export default class ChatRoom extends React.PureComponent {

  constructor(){
    super();
    this.state = {
      token: sessionStorage.getItem('token'),
      username: JSON.parse(sessionStorage.getItem('user')),
      messages: [],
      value: ''
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

    componentWillMount() {
      this.channel=pusher.subscribe('room_'+this.props.params.id);
      this.channel.bind('send-message', this.updateChat);
      this.getMessage();
    }

    updateChat = (event) => {
      let messages = this.state.messages;
      messages.push(event.message);
      this.setState({
        messages: messages
      })
      this.forceUpdate();
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    sendMessage() {
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
      this.forceUpdate();
    }

    getMessage = () => {
    fetch('http://localhost:8000/api/getMessages/'+this.props.params.id, {
      method:'GET'
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      this.setState({
        messages: json.messages
      })
    }.bind(this))

  };

  render() {
      return (
        <div className="container">
          <Helmet title="FaveChat | Chat Room" meta={[ { name: 'description', content: 'Description of ChatRoom' }]}/>

          <div className="title">
            <h1 className="faveChat">FaveChat<span className="blue">!</span></h1>
            <span className="signOut"><h2 className="green">{this.state.username.username} <a href="/" className="blue">Sign Out</a></h2></span>
          </div>

          <div className="chatWindow">
            <div  className="chatBox">

              {this.state.messages.map((message, index)=>(
                <h3><span className="green">{message.username} </span><span><span className="orange">:</span></span> {message.content}</h3>
              ))}

            </div>
            <div className="users">
              <h2>Users</h2>
              <br/>
              <div><h3 className="green">user1</h3></div>
            </div>
            <div className="input"  >
              <input type="text" className="text" name="message" value={this.state.value} placeholder="Enter message here" onChange={this.handleChange}/>
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
