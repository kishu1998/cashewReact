export const comma = k => {
  let a = k.toString(10).split(".");
  let b = a[0].split("").map((i, ind, ar) => {
    if (ind > ar.length - 3) return i;
    if (ar.length % 2 === 0) {
      if (ind % 2 === 0) return `${i},`;
      else return i;
    }
    if (ind % 2 !== 0) return `${i},`;
    return i;
  });
  return b.join("") + "." + a[1];
};
