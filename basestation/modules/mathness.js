

export function radToDegree(rad) { return rad * 180 / Math.PI };
export function degreeToRad(angle) { return angle * Math.PI / 180 };

export function randomInRange(start, end) {
  var range = end - start;
  var result = Math.random() * range;
  result += start;
  // return Math.round(result);
  return result;
}

export function randomFromArr(arr) {

  return arr[Math.floor(Math.random() * arr.length)];
}

export function random3InRange(start, end) {

  return [
    randomInRange(start, end),
    randomInRange(start, end),
    randomInRange(start, end)
  ]
}
