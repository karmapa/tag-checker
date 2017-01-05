// S for Simple, X for compleX, I for getting Info, D for Detect, W for Whole tag

const volHeadPbSWRegex = /<(vol|head).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<head))/g;

const headSIRegex = /<head n="(\d+?)"/;
const pbSIRegex = /<pb id="(.+?)"/;

const volDRegex = /<vol/;
const headDRegex = /<head/;
const pbDRegex = /<pb/;

export {volHeadPbSWRegex, headSIRegex, pbSIRegex, headDRegex, pbDRegex};