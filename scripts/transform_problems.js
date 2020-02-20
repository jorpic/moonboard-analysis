
const problems = require("../problems.json");


const dictionary = {};

function dict(p, field1, field2) {
  if (!dictionary[field1]) {
    dictionary[field1] = {};
  }
  const val = field2 ? p[field1][field2] : p[field1];
  if (!dictionary[field1][val]) {
    if(field2) {
      delete p[field1][field2]
    }
    dictionary[field1][val] = p[field1];
  }
  return {[field1]: val};
}

function raw(p, field) {
  return {[field]: p[field]};
}

function moves(ms) {
  return [
    ms.filter(m => m.IsStart).map(m => m.Description).join(" "),
    ms.filter(m => !m.IsStart && !m.IsEnd).map(m => m.Description).join(" "),
    ms.filter(m => m.IsEnd).map(m => m.Description).join(" "),
  ].join("#");
}


const compact = problems.map(p => Object.assign({}, ...[
  raw(p, "Method"),
  raw(p, "Name"),
  raw(p, "Grade"),
  dict(p, "MoonBoardConfiguration", "Id"),
  dict(p, "Setter", "Id"),
  raw(p, "UserRating"),
  raw(p, "Repeats"),
  dict(p, "Holdsetup", "Id"),
  raw(p, "IsBenchmark"),
  raw(p, "IsMaster"),
  raw(p, "Id"),
  raw(p, "DateInserted"),
  {Moves: moves(p.Moves)}
]));

console.log(JSON.stringify({dictionary, problems: compact}));
