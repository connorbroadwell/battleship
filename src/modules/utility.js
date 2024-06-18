function logArrays(...arr) {
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = 0; j < arr[i].length; j += 1) {
      console.log(arr[i][j]);
    }
  }
}

// use my utility function! :D

function difference(num1, num2) {
  return Math.abs(num1 - num2);
}

export { logArrays, difference };
