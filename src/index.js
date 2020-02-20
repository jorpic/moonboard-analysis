import { h, render, Component } from "preact";
import problems from "../data/problems.json";

class App extends Component {
  constructor() {
    super();
    this.setState({
      problems: null
    });

    fetch(problems)
      .then(res => res.json())
      .then(problems => this.setState({problems}));
  }

  render() {
    const {problems} = this.state;
    return problems && (
      <div class="columns">
        <div class="column is-three-fifths is-offset-one-fifth">
          Climb harder!
        </div>
      </div>);
  }
}


render(<App />, document.body);
