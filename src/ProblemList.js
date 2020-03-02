import { h, render, Component, createRef } from "preact";
import cls from "classnames";


export default class ProblemList extends Component {
  // TODO: sorting
  // TODO: keyboard control

  render() {
    const {data, onSelect, selected} = this.props;
    const li = p =>
      <div
        class={cls("li", {selected: p.Id == selected})}
        onClick={() => onSelect && onSelect(p.Id)}
      >
        <span class="grade">{p.Grade}</span>
        <span class="name">{p.Name}</span>
        <span class="repeats">{p.Repeats}</span>
      </div>;

    // FIXME: slicing creates useless object
    return (
      <div class="problem-list">
        <div class="header">{data.length}</div>
        {data.slice(0, 20).map(li)}
      </div>);
  }
}
