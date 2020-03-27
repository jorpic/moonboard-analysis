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
      font-size="14"
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
      <text
        dy="-4"
        x={i * (barWidth + barGap) + barWidth/2}
        y={height - scale*val}
        width={barWidth}
        text-anchor="middle"
      >
        {val}
      </text>
      <text
        dy="16"
        x={i * (barWidth + barGap) + barWidth/2}
        y={height}
        width={barWidth}
        text-anchor="middle"
      >
        {label}
      </text>
    </g>
  );
  const svgProps = {
    class: "histogram",
    viewBox: `0 -25 ${width} ${height+25+16}`,
    width, height
  };
  return (<svg {...svgProps}>{bars}</svg>);
}
