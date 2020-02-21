import { h, render, Component, createRef } from "preact";
import board_2017 from "../images/2017.png";


class Board extends Component {
  constructor() {
    super();
    this.imgRef = createRef();
    this.cnvRef = createRef();
  }

  componentDidMount() {
    const img = this.imgRef.current;
    const cnv = this.cnvRef.current;
    cnv.style.position = "absolute";
    cnv.style.left = img.offsetLeft + "px";
    cnv.style.top = img.offsetTop + "px";
    this.ctx = cnv.getContext("2d");
    this.componenetDidUpdate();
  }

  componenetDidUpdate() {
    const cnv = this.cnvRef.current;
    this.ctx.clearRect(0, 0, cnv.width, cnv.height);
    const m = this.props.moves;

    let color = "#0f0";
    let i = 0, j = 0;
    while(j < m.length) {
      while(j < m.length && m[j] != " " && m[j] != "#") j++;
      this.circle(m.substring(i, j), color);
      if(m[j] == '#') { // select next color
        color = color == "#0f0" ? "#00f" : "#f00";
      }
      i = ++j;
    }
  }

  circle(pos, color) {
    const i = pos.charCodeAt(0) - 65; // 65 = "A"
    const j = 18 - pos.slice(1);

    this.ctx.lineWidth = 6;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(
      80 + i*43 ,
      75 + j*43,
      20, 0, 2 * Math.PI, false);
    this.ctx.stroke();
  }


  render() {
    return (
      <div class="board">
        <img ref={this.imgRef} src={board_2017} width="650" height="1000"/>
        <canvas ref={this.cnvRef} width="650" height="1000"/>
      </div>);
  }
}


class App extends Component {
  constructor() {
    super();
    this.setState({
      problems: null
    });

    const problemsUrl = require("../data/problems.json");
    fetch(problemsUrl)
      .then(res => res.json())
      .then(problems => this.setState({problems}));
  }

  render() {
    const i = 12;
    const {problems} = this.state;
    return problems && (
      <div class="columns">
        <div class="column is-three-fifths is-offset-one-fifth">
          {problems[i].Name}
          <Board moves={problems[i].Moves}/>
        </div>
      </div>);
  }
}


render(<App />, document.body);
