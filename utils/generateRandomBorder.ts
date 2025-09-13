export const generateRandomRadius = () => {
  const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 80) + 10) // 10% - 90%
  return `${values[0]}% ${values[1]}% ${values[2]}% ${values[3]}% / ${values[4]}% ${values[5]}% ${values[6]}% ${values[7]}%`
}