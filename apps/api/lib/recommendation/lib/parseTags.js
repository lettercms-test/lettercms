export default function parseTags(arr) {
  const tags = {};

  arr.forEach(e => tags[e] = 1);

  return tags;
};
