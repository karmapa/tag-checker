export const jpb4XWRegex = /<(pb|jp) id="\d+?-\d+?-\d+?[abcd]"\/>/;

export const volHeadPbSWRegex = /<(vol|head).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<head))/g;
export const pbSWgRegex = /<pb id=.+?>/g;

export const sutraXIRegex = /<sutra id="([\da-zA-Z]*?[a-zA-Z])((\d+?)([a-zA-Z])?)"/;
export const bampoXIRegex = /<bampo n="((\d+?)([a-zA-Z])?)\.((\d+?)(\.(\d+?))?)"/;

export const headSIRegex = /<head n="(\d+?)"/;
export const pbSIRegex = /<pb id="(.+?)"/;

export const volDRegex = /vol/;
export const sutraDRegex = /sutra/;
export const headDRegex = /head/;
export const pbDRegex = /pb/;