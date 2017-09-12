/*
 *
 * ChatRoom
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import Pusher from 'pusher-js';

import './style.css';
import './styleM.css';

export default class ChatRoom extends React.PureComponent {

  constructor(){
    super();
    this.state = {
      username: JSON.parse(sessionStorage.getItem('user')),
      messages: [],
      value: ''
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // componentWillMount() is invoked immediately before mounting occurs and we are setting the username state to the value gotten from the localStorage.
    componentWillMount() {
        this.setState({ username: sessionStorage.user.username });
        // Establish a connection to Pusher.
        this.pusher = new Pusher('224475fc3b60138f89d1', {
            cluster: 'us2',
            encrypted: true
        });
        // Subscribe to the 'private-reactchat' channel
        this.chatRoom = this.pusher.subscribe('private-reactchat');
    }
    // componentDidMount() is invoked immediately after a component is mounted. Listen for changes to the 'messages' state via Pusher and updates it.
    componentDidMount() {
        this.chatRoom.bind('messages', newmessage => {
            this.setState({messages: this.state.messages.concat(newmessage)})
        }, this);

    }
    // Used to update the value of the input form in which we type in our chat message
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    // This sends the message inside the input form and sends it to backend database.
    sendMessage(event) {
        event.preventDefault();

        let _this = this;
        let data = new FormData();
        data.append('message', this.state.value);

        if (this.state.value !== '') {
          fetch('http://localhost:8000/api/sendMessage', {
            method:'POST',
            body: data
          })
          .then(function(response){
            return response.json();
          })
          .then(function(json){
            if(json.error)
            {
              alert(json.error);
            }
          }
          _this.setState({
            value: ''
          })
        }
    }

  render() {
    // Renders the chat messages
    const messages = this.state.messages;
    const message = messages.map(item => {

      return (
        <div className="container">
          <Helmet title="FaveChat | General Chat" meta={[ { name: 'description', content: 'Description of ChatRoom' }]}/>

          <div className="title">
            <h1 className="faveChat">FaveChat<span className="blue">!</span></h1>
            <span className="signOut"><h2 className="green">{this.state.username} <a href="/" className="blue">Sign Out</a></h2></span>
          </div>

          <div className="chatWindow">
            <div key={item.id} className="chatBox">
                <h3>{message}</h3>
                <h3><span className="green">{item.username}<span className="orange">:</span></span>
                <span className="message">{item.message}</span></h3>
            </div>
            <div className="users">
              <br/>
              <h2>Users</h2>
              <br/>
              <div><h3 className="green">user1</h3></div>
            </div>
            <form className="input" onSubmit={this.sendMessage}>
              <input type="text" className="text" name="message" value={this.state.value} placeholder="Enter message here" onChange={this.handleChange}/>
              <input type="submit" className="send" name="send" value="Send"/>
            </form>
          </div>

        </div>
      );
    })
  }
}

ChatRoom.contextTypes = {
  router: React.PropTypes.object
};
