// S for Simple, X for compleX, I for getting Info, D for Detect, W for Whole tag

const volHeadPbSWRegex = /<(vol|head).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<head))/g;

const headIRegex = /<head n="(\d+?)"/;

const volDRegex = /<vol/;
const headDRegex = /<head/;

export {volHeadPbSWRegex, headIRegex, volDRegex, headDRegex};