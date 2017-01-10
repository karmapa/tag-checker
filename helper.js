export function saveErr(wholeErrs, newErrs) {
  if (newErrs.length) {
    wholeErrs.splice(wholeErrs.length - 1, 0, ...newErrs);
  }
};