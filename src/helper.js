export function saveErr(wholeErrs, newErrs) {
  if (newErrs[0] !== undefined) {
    wholeErrs.splice(wholeErrs.length - 1, 0, ...newErrs);
  }
};