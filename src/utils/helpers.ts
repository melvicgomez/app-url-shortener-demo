export const isValidUrl = (urlString: string): boolean => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

export const shuffleArray = <T>(arr: T[]): T[] => {
  // Create a copy of the original array
  const newArray = [...arr];
  for (let i = newArray.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at i and j
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
};

export const isBcryptHash = (input: string): boolean => {
  // Define a regular expression pattern for bcrypt hashes
  const bcryptPattern = /^\$2[aby]?\$[0-9]{2}\$[A-Za-z0-9./]{53}$/;
  // Test if the input string matches the bcrypt pattern
  return bcryptPattern.test(input);
};

export const fakeDelay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
