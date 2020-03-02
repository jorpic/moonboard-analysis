import { h, render, Component, createRef } from "preact";

import Board from "./Board";
import Histogram from "./Histogram";
import ProblemList from "./ProblemList";


class App extends Component {
  constructor() {
    super();
    this.setState({
      problems: null,
      histograms: null,
      selected: null,
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
    this.onSelectProblem = this.onSelectProblem.bind(this);
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

  onSelectProblem(problemId) {
    this.setState({selected: problemId});
  }

  render() {
    const {problems, histograms, filters, selected} = this.state;
    if (!problems) return "Loading...";

    return (
      <div class="columns">
        <div class="column is-three-fifths is-offset-one-fifth">
          <Board
            problem={problems.find(p => p.Id === selected)}
          />
          <Histogram
            width={600}
            height={300}
            data={histograms.Grade}
            selected={filters.Grade}
            onSelect={this.onGradeFilter}
          />
          <ProblemList
            data={filter(problems, filters)}
            selected={selected}
            onSelect={this.onSelectProblem}/>
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

function filter(problems, filters) {
  const {Grade} = filters;
  const hasGrade = Grade && Object.values(Grade).some(g => g);
  return hasGrade
    ? problems.filter(p => Grade[p.Grade])
    : problems;
}

render(<App />, document.body);
