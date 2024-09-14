export function generateId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}

export const generateRandomNumber = (limit = 0) => {
  return parseInt(Math.random().toString().split(".")[1].slice(limit));
};

export const generateUserId = (id) => {
  const sampleStr = ["B", "D", "0", "0", "0", "0"];
  const latestNum = +id.split("").slice(2).join("") + 1;
  const latestStr = latestNum.toString().split("");
  if (latestStr.length > 4)
    throw {
      message: "Agent code succeeded 6 chars",
    };
  return sampleStr.slice(0, 6 - latestStr.length).concat(latestStr);
};
