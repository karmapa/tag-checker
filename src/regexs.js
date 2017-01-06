// S for Simple, X for compleX, I for getting Info, D for Detect, W for Whole tag
const repo = process.argv[2];

export const divXWRegex = new RegExp('<division n="(\\d+?)" t=".+?" i18n="' + repo + '-division-\\1"\\/>');
export const volXWRegex = /<vol n="\d+?-\d+?" t="[\u0f00-\u0fff]+?"\/>/;
export const sutraXWRegex = /<sutra id="[\da-zA-Z]*?[a-zA-Z]\d+?[a-zA-Z]?"( [a-zA-Z]\w*?="[^<>\n]+?")*?\/>/;
export const bampoXWRegex = /<bampo n="\d+?[a-zA-Z]?\.\d+?(\.\d+?)?"( [a-zA-Z]\w*?="[^<>\n]+?")*?\/>/;
export const headXWRegex = /<head n="\d+?" t="[\u0f00-\u0fff ]+?"( [a-zA-Z]\w*?="[^<>\n]+?")*?\/>/;

export const volHeadPbSWRegex = /<(vol|head).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<head))/g;

export const sutraXIRegex = /<sutra id="([\da-zA-Z]*?[a-zA-Z])((\d+?)([a-zA-Z])?)"/;
export const bampoXIRegex = /<bampo n="((\d+?)([a-zA-Z])?)\.((\d+?)(\.(\d+?))?)"/;

export const headSIRegex = /<head n="(\d+?)"/;
export const pbSIRegex = /<pb id="(.+?)"/;

export const volDRegex = /vol/;
export const sutraDRegex = /sutra/;
export const bampoDRegex = /bampo/;
export const headDRegex = /head/;
export const pbDRegex = /pb/;

export const emptyTag = /<[\s\/]*>/g;
export const noEndArrow = /<[^>]*?(<|\n|$)/g;
export const noStartArrow = /(^|\n|>)[^<\n]*>/g;