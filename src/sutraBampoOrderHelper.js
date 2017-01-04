function checkFirstBampoN(bampoN, errInfo = '') {
  if (bampoN !== '1' && bampoN !== '1.1') {
    console.log('Warning! Bampo n is not 1 or 1.1', errInfo);
  }
}

export {checkFirstBampoN};