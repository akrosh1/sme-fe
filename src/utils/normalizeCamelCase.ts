export default function normalizeCamelCase(str: string) {
  // Replace all uppercase letters with space and the lowercase version of the letter
  const result = str.replace(/([A-Z])/g, ' $1').toLowerCase();
  // Capitalize the first letter of the string
  return result.charAt(0).toUpperCase() + result.slice(1);
}
