const sutraBampoPbRegex = /<(sutra|bampo).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<sutra|<bampo))/g;
const sutraRegex = /<sutra id="([\da-zA-Z]*?[a-zA-Z])((\d+?)([a-zA-Z])?)"/;
const bampoRegex = /<bampo n="([\da-zA-Z]+?)\.(\d+?)(\.(\d+?))?"/;
const pbRegex = /<pb id=".+?"/;

export default function checkSutraBampoOrder(textObjs) {
  
}