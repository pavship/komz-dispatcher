// groupBy = (xs, key) => xs.reduce((rv, x) => {
//     (rv[x[key]] = rv[x[key]] || []).push(x)
//     return rv
//   }, {})
// groupByArray(xs, key) => xs.reduce( (rv, x) => {
//   let v = key instanceof Function ? key(x) : x[key];
//   let el = rv.find((r) => r && r.key === v);
//   if (el) { el.values.push(x); } else { rv.push({ key: v, values: [x] }); }
//   return rv;
// }, [])
// const splitBy = (xs, key) => xs.reduce( (rv, x) => {
//   let el = rv.find(r => r[0][key] === x[key])
//   if (el) { el.push(x); } else { rv.push([x]); }
// }, [])
