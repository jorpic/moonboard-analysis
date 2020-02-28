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
      histograms: null,
      filters: {},
    });

    const problemsUrl = require("../data/problems.json");
    fetch(problemsUrl)
      .then(res => res.json())
      .then(problems => this.setState({
        problems,
        histograms: {
          Grade: mkHistogram(problems, "Grade")
        }
      }));

    // FIXME: configure parcel to accept class properties.
    this.onGradeFilter = this.onGradeFilter.bind(this);
  }

  onFilter(name, label) {
    const {filters} = this.state;
    const filter = filters[name] || {};
    this.setState({
      filters:
        {...filters, [name]: {...filter, [label]: !filter[label]}}
    });
  }

  onGradeFilter(label) { this.onFilter("Grade", label) }

  render() {
    const {problems, histograms, filters} = this.state;
    if (!problems) return "Loading...";

    const i = 12;
    return (
      <div class="columns">
        <div class="column is-three-fifths is-offset-one-fifth">
          <Histogram
            width={600}
            height={300}
            data={histograms.Grade}
            selected={filters.Grade}
            onSelect={this.onGradeFilter}
          />
          {problems[i].Name}
          <Board moves={problems[i].Moves}/>
        </div>
      </div>);
  }
}


function mkHistogram(list, key) {
  return list.reduce(
    (ix, p) => {
      const count = ix[p[key]] || 0;
      ix[p[key]] = count + 1;
      return ix;
    },
    {});
}

render(<App />, document.body);
