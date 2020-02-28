import { h, render, Component, createRef } from "preact";
import Histogram from "./Histogram";
import board_2017 from "../images/2017.png";


class Board extends Component {
  constructor() {
    super();
    this.cnvRef = createRef();
  }

  componentDidMount() {
    const cnv = this.cnvRef.current;
    this.ctx = cnv.getContext("2d");
    const img = new Image(0, 0);
    const board = this;
    img.onload = function() {
      cnv.width = this.naturalWidth;
      cnv.height = this.naturalHeight;
      board.ctx.drawImage(this, 0, 0);
      board.componentDidUpdate();
    }
    img.src = board_2017;
  }

  componentDidUpdate() {
    const cnv = this.cnvRef.current;
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


class App extends Component {
  constructor() {
    super();
    this.setState({
      problems: null,
      gradesFilter: {},
    });

    const problemsUrl = require("../data/problems.json");
    fetch(problemsUrl)
      .then(res => res.json())
      .then(problems => this.setState({problems}));

    // FIXME: configure parcel to accept class properties.
    this.onGradeFilter = this.onGradeFilter.bind(this);
  }

  onGradeFilter(label) {
    const {gradesFilter} = this.state;
    console.log(gradesFilter);
    this.setState({gradesFilter:
      Object.assign({}, gradesFilter, {[label]: !gradesFilter[label]})
    });
  };

  render() {
    const {problems, gradesFilter} = this.state;
    if (!problems) return "Loading...";

    const i = 12;
    const grades = problems.reduce((m, p) => {
      m[p.Grade] || (m[p.Grade] = 0);
      m[p.Grade] += 1;
      return m;
    }, {});

    return (
      <div class="columns">
        <div class="column is-three-fifths is-offset-one-fifth">
          <Histogram
            width={600}
            height={300}
            data={grades}
            selected={gradesFilter}
            onSelect={this.onGradeFilter}
          />
          {problems[i].Name}
          <Board moves={problems[i].Moves}/>
        </div>
      </div>);
  }
}


render(<App />, document.body);
