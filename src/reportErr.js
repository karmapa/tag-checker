export default function reportErr(errMessages) {
  let errStr = errMessages.join('\n')
  if ('' !== errStr) {
    console.log('Repeat Page:\n' + errStr);
    throw new Error();
  }
}