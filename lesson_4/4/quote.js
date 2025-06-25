let functionRead = 0;
const motivationalQuotes = [
  "Believe you can and you're halfway there.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Stay positive. Work hard. Make it happen.",
  "Don’t stop when you’re tired. Stop when you’re done.",
  "Success doesn’t just find you. You have to go out and get it."
];

export const handler = async (event) => {
  // TODO implement
  functionRead++
  const random = Math.floor(Math.random() * 10);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(`the fuction has been read ${functionRead} times, ${motivationalQuotes[random]}`),
  };
};
