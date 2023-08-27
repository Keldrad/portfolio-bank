export default function getMinMaxValue(array) {
  let min = Infinity;
  let max = -Infinity;
  array.forEach((element) => {
    if (element < min) {
      min = element;
    }
    if (element > max) {
      max = element;
    }
  });
  return { min, max };
}
