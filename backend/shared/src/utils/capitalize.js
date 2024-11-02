import { map, toUpper, join } from "ramda";

export function capitalize(text = "", splitOn = " ", joinWith = " ") {

  const copy = text.slice(0);
  const split = copy.split(splitOn);

  const arrCapWords = map((word) => {
    const capFirst = toUpper(word.charAt(0));
    const capWord = capFirst + word.slice(1);
    return capWord;
  },
    split);

  let capText = join(joinWith)(arrCapWords);

  return capText;
}
