import { h, render, Component, createRef } from "preact";

import Board from "./Board";
import Histogram from "./Histogram";


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
