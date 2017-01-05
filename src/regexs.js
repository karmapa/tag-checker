// S for Simple, X for compleX, I for getting Info, D for Detect, W for Whole tag

export const volHeadPbSWRegex = /<(vol|head).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<head))/g;

export const headSIRegex = /<head n="(\d+?)"/;
export const pbSIRegex = /<pb id="(.+?)"/;

export const volDRegex = /<vol/;
export const headDRegex = /<head/;
export const pbDRegex = /<pb/;