const scorePassword = (pass: string): number => {
  var score = 0;
  if (!pass) return score;

  // award every unique letter until 5 repetitions
  const letters: {[char: string]: number} = {}
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1;
    score += 5.0 / letters[pass[i]];
  }

  // bonus points for mixing it up
  const variations: {[check: string]: boolean} = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass),
  }

  let variationCount = 0;
  for (let check in variations) {
    variationCount += variations[check] ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  return score;
}

export default scorePassword