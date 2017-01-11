export function saveErr(wholeErrs, newErrs) {
  if (newErrs.length > 0) {
    wholeErrs.splice(wholeErrs.length - 1, 0, ...newErrs);
  }
};