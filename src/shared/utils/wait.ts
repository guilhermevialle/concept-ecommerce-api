export const wait = (timeInMs: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, timeInMs))
