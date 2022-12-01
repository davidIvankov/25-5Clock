
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import ReactDOM from 'react-dom'
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { library } from '@fortawesome/fontawesome-svg-core';
 import { faCheckSquare, faArrowUp, faPlay, faPause, faArrowDown, faRefresh} from '@fortawesome/free-solid-svg-icons'

  library.add( faCheckSquare, faArrowUp)

const buildState =() =>({
   break: 5,
      session: 25,
      currstate: "Session",
      left: 1500,
  paused: true,
  font: faPlay,
  color: "red"
})
//React Components:
//Timer Component:
class Timer extends React.Component {
  render(){
    return(
      <div className = "text-center">
        <div className ="screen" style= {{color: this.props.colval}}>
        <h3 id="timer-label">
          {this.props.label}</h3>
        <h2 id="time-left">
   {this.props.left}</h2>
        </div>
        <button id="start_stop" onClick={this.props.startOrStop}>
          <FontAwesomeIcon icon={this.props.class} />
        </button>
        <button id="reset" onClick={this.props.reset}>
          <FontAwesomeIcon icon={faRefresh}/>
        </button>
        </div>
    )
  }
}
// Session Component:
class Session extends React.Component{
  render(){
    return(
    <div className= "text-center">
      
        <Button variant="danger">
          Session Length
         </Button>

        <div className = "screen1">
        <h3 id="session-length">
          {this.props.value}
        </h3>
        </div>
        <button id="session-decrement" onClick={this.props.sessionDec}>
          <FontAwesomeIcon icon={faArrowDown}/>
        </button>
          <button id="session-increment" onClick={this.props.sessionInc}>
         <FontAwesomeIcon icon={faArrowUp}/>
        </button>
        </div>
    )
  }
}
//Break component:
class Break extends React.Component{
  render(){
    return(
      <div className= "text-center">
        <label id="break-label" className = "btn btn-primary">
          Break Length
        </label>
        <div className ="screen3">
        <h3 id="break-length">{this.props.value}
        </h3>
        </div>
        <button id="break-decrement" onClick ={this.props.breakDec}>
          <FontAwesomeIcon icon={faArrowDown}/>
        </button>
        <button onClick={this.props.breakInc} id="break-increment">
          <FontAwesomeIcon icon={faArrowUp}/>
        </button>
        
        </div>
    )
  }
}

//Clock Component:
class Clock extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ...buildState()
    }
    this.mmss = this.mmss.bind(this)
 this.reset = this.reset.bind(this)
    this.breakDec = this.breakDec.bind(this)
     this.breakInc = this.breakInc.bind(this)
     this.sessionDec = this.sessionDec.bind(this)
     this.sessionInc = this.sessionInc.bind(this)
    this.startOrStop = this.startOrStop.bind(this)
    this.clocky = this.clocky.bind(this)
    this.breakTime = this.breakTime.bind(this)
    this.sessionTime = this.sessionTime.bind(this)
  }
  // chage color to red if 00: 10 or less


  //when timer is at 00:00 and break is currstate starts session
  sessionTime() { 
 if(this.state.left === -1 && this.state.currstate === "Break") {
      this.setState({
        currstate: "Session",
        left: this.state.session * 60
      })
  }
  }
  //when timer is at 00:00 and session is currstate starts break
  breakTime() {
    if(this.state.left === -1 && this.state.currstate === "Session") {
      this.setState({
        currstate: "Break",
        left: this.state.break * 60,
        color: "white"
      }) 
    }
    else if(this.state.left === 0) {
    this.audio.play()
    }
  }
// this makes time in timer display like mm : ss
 mmss () {
   
    var minutes = Math.floor(this.state.left / 60);
    var seconds = this.state.left - minutes * 60;
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
} 
  //incriments the value of session
  sessionInc(){
    if (this.state.session < 60) {
    this.setState({
      session: this.state.session + 1,
       left: this.state.left +60
    })
    }
  }
  // start/stop
  
  startOrStop(){
    if(this.state.paused === true) {
    this.intervalId =  setInterval(this.clocky, 1000)
      this.setState({
        font: faPause
      })
    }
    else if (this.state.paused !== true) {
clearInterval(this.intervalId);
      this.setState({
        paused: true,
        font: faPlay
      })
    }  
  }
  // function that executes periodicaly when timer is on
  clocky() {
    this.setState({
      left: this.state.left - 1,
      paused: false
    })
  }
  // lowers value of session
  sessionDec(){
    if (this.state.session > 1) {
    this.setState({
      session: this.state.session - 1,
      left: this.state.left -60
    })
    }
  }
  //incriments the value of break
  breakInc(){
    if(this.state.break < 60) {
    this.setState({
      break: this.state.break + 1
    })
    }
  }
  // lowers value of break
  breakDec(){
    if(this.state.break > 1) {
    this.setState({
      break: this.state.break - 1
    })
    }
  }
  //reset button
  reset(){
    clearInterval(this.intervalId);
    this.setState({
      ...buildState()
    })
     this.audio.load()
    this.audio.pause()

  }
  render(){
    const startOfSession = this.sessionTime();
const startOfBreak =this.breakTime();
    return(
      <div id="clock" className = "align-center">
       <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            this.audio = audio;
          }}
          src="https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg"
        />
        <div id ="flex">
        <Break value={this.state.break} breakDec={this.breakDec} breakInc={this.breakInc} />
        <Session value={this.state.session}  sessionDec={this.sessionDec} sessionInc={this.sessionInc}/>
          </div>
        <Timer label={this.state.currstate} left={this.mmss()} reset={this.reset} startOrStop={this.startOrStop}
          colval ={this.state.color}
          class={this.state.font}/>
        </div>
      
          )
   
          }
}

ReactDOM.render(<Clock/>, document.getElementById("root"))