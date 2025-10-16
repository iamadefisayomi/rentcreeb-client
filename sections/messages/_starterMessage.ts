// starterMessages.ts
export const _starterMessages: string[] = [
  // Professional / Formal
  "Hello, I’m interested in your property listing. Could you please confirm the availability, rent, and possible inspection dates? Thank you.",
  "Good day, I came across your property and would love to know more about the price, location details, and inspection arrangements.",

  // Friendly / Neutral
  "Hi, I like this property you listed. Is it still available? Can I get more info and book an inspection?",
  "Hello, I’m interested in this apartment. Please let me know the rent, extra charges, and if I can schedule a viewing.",

  // Casual / WhatsApp-style
  "Hi, is this property still available? 😊",
  "Hey, I’m interested in this place—when can I check it out?",
  "Hello, can I book an inspection for this property?"
];

// Function to get one at random
export function getRandomSingleStarterMessage(): string {
  const randomIndex = Math.floor(Math.random() * _starterMessages.length);
  return _starterMessages[randomIndex];
}
