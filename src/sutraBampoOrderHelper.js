export function isFirstBampoAhead(lastBio, bio) {
  let {sutraNL: lastSutraNL, bampoN} = lastBio, {sutraNL} = bio;
  return lastSutraNL === sutraNL && (bampoN === '1' || bampoN === '1.1');
};