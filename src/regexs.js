// S for Simple, X for compleX, I for getting Info, D for Detect, W for Whole tag

export const volHeadPbSWRegex = /<(vol|head).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<head))/g;

export const sutraCIRegex = /<sutra id="([\da-zA-Z]*?[a-zA-Z])((\d+?)([a-zA-Z])?)"/;
export const bampoCIRegex = /<bampo n="((\d+?)([a-zA-Z])?)\.((\d+?)(\.(\d+?))?)"/;

export const headSIRegex = /<head n="(\d+?)"/;
export const pbSIRegex = /<pb id="(.+?)"/;

export const volDRegex = /<vol/;
export const sutraDRegex = /sutra/;
export const bampoDRegex = /bampo/;
export const headDRegex = /<head/;
export const pbDRegex = /<pb/;