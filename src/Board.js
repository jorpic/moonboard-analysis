import { h, render, Component, createRef } from "preact";
import board_2017 from "../images/2017.png";


export default class Board extends Component {
  constructor() {
    super();
    this.cnvRef = createRef();
  }

  componentDidMount() {
    const cnv = this.cnvRef.current;
    this.ctx = cnv.getContext("2d");
    this.img = new Image(0, 0);
    const board = this;
    this.img.onload = function() {
      cnv.width = this.naturalWidth;
      cnv.height = this.naturalHeight;
      board.componentDidUpdate();
    }
    this.img.src = board_2017;
  }

  componentDidUpdate() {
    this.ctx.drawImage(this.img, 0, 0);

    if (!this.props.problem) return;
    const m = this.props.problem.Moves;
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
      95 + i*50 ,
      85 + j*50,
      20, 0, 2 * Math.PI, false);
    this.ctx.stroke();
  }


  render() {
    return (
      <canvas ref={this.cnvRef}/>);
  }
}
