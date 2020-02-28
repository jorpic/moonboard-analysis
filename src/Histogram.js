import { h, render, Component } from "preact";
import cls from "classnames";


export default function Histogram(
  { height, width, data, selected,
    onSelect, onHover
  })
{
  const values = Object.entries(data)
    // FIXME: should we provide sorting function as a prop?
    .sort((a,b) => a[0] > b[0]);
  const maxVal = values.reduce((m, [_, x]) => x > m ? x : m, 0);
  const scale = height / maxVal;

  const barGap = 1;
  const barWidth = Math.round(
    (width - barGap * (values.length-1)) / values.length);
  if (barWidth < 10) {
    console.error("Histogram bars are to narrow!");
  }

  const bars = values.map(([label, val], i) =>
    <g class={cls("bar", {selected: selected && selected[label]})}
      onClick={onSelect && (() => onSelect(label))}
      onHover={onHover && (() => onHover(label))}
    >
      <rect class="empty"
        x={i * (barWidth + barGap)}
        y={0}
        width={barWidth}
        height={height} />
      <rect class="value"
        x={i * (barWidth + barGap)}
        y={height - scale*val}
        width={barWidth}
        height={scale * val} />
    </g>
  );
  return (<svg {...{
    class: "histogram",
    width, height}}
  >
    {bars}
  </svg>);
}
