import { h, render, Component, createRef } from "preact";
// import problems from "../data/problems.json";
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

    const ctx = cnv.getContext("2d");
    this.circle(ctx, "G3", "#0f0");
    this.circle(ctx, "F4", "#0f0");
    this.circle(ctx, "E6", "#00f");
    this.circle(ctx, "F18", "#f00");
  }

  circle(ctx, pos, color="#00f") {
    const i = pos.charCodeAt(0) - 65; // 65 = "A"
    const j = 18 - pos.slice(1);

    ctx.lineWidth = 6;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(
      80 + i*43 ,
      75 + j*43,
      20, 0, 2 * Math.PI, false);
    ctx.stroke();
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
      problems: []
    });

//    fetch(problems)
//      .then(res => res.json())
//      .then(problems => this.setState({problems}));
  }

  render() {
    const {problems} = this.state;
    return problems && (
      <div class="columns">
        <div class="column is-three-fifths is-offset-one-fifth">
          Climb harder!
          <Board/>
        </div>
      </div>);
  }
}


render(<App />, document.body);
