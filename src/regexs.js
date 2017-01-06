// S for Simple, X for compleX, I for getting Info, g for global
// D for Detect, LD for Detect in Line W for Whole tag
const repo = process.argv[2];

export const divXWgRegex = new RegExp('<division n="(\\d+?)" t=".+?" i18n="' + repo + '-division-\\1"\\/>', 'g');
export const volXWgRegex = /<vol n="\d+?-\d+?" t="[\u0f00-\u0fff]+?"\/>/g;
export const sutraXWgRegex = /<sutra id="[\da-zA-Z]*?[a-zA-Z]\d+?[a-zA-Z]?"( [a-zA-Z]\w*?="[^<>\n]+?")*?\/>/g;
export const bampoXWgRegex = /<bampo n="\d+?[a-zA-Z]?\.\d+?(\.\d+?)?"( [a-zA-Z]\w*?="[^<>\n]+?")*?\/>/g;
export const headXWgRegex = /<head n="\d+?" t="[\u0f00-\u0fff ]+?"( [a-zA-Z]\w*?="[^<>\n]+?")*?\/>/g;
export const jpb4XWgRegex = /<(pb|jp) id="\d+?-\d+?-\d+?[abcd]"\/>/g;
export const jpbXWgRegex = /<(pb|jp) id="\d+?-\d+?-\d+?"\/>/g;

export const jpb4XWRegex = /<(pb|jp) id="\d+?-\d+?-\d+?[abcd]"\/>/;

export const volHeadPbSWRegex = /<(vol|head).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<head))/g;

export const sutraXIRegex = /<sutra id="([\da-zA-Z]*?[a-zA-Z])((\d+?)([a-zA-Z])?)"/;
export const bampoXIRegex = /<bampo n="((\d+?)([a-zA-Z])?)\.((\d+?)(\.(\d+?))?)"/;

export const headSIRegex = /<head n="(\d+?)"/;
export const pbSIRegex = /<pb id="(.+?)"/;

export const divLDRegex = /^.*?div.*?$/mg;
export const volLDRegex = /^.*?vol.*?$/mg;
export const sutraLDRegex = /^.*?sutra.*?$/mg;
export const bampoLDRegex = /^.*?bampo.*?$/mg;
export const headLDRegex = /^.*?head.*?$/mg;
export const jpbLDRegex = /^.*?(pb|jp).*?$/mg;

export const divDgRegex = /div/g;
export const volDgRegex = /vol/g;
export const sutraDgRegex = /sutra/g;
export const bampoDgRegex = /bampo/g;
export const headDgRegex = /head/g;
export const jpbDgRegex = /pb|jp/g;

//export const divDRegex = /div/;
//export const volDRegex = /vol/;
export const sutraDRegex = /sutra/;
//export const bampoDRegex = /bampo/;
export const headDRegex = /head/;
export const pbDRegex = /pb/;

export const emptyTag = /<[\s\/]*>/g;
export const noEndArrow = /<[^>]*?(<|\n|$)/g;
export const noStartArrow = /(^|\n|>)[^<\n]*>/g;