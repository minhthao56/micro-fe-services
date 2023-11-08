
export function intervalUpdate( cb:() => void, interval: number,) {
  let intervalId: NodeJS.Timeout | null = null;
  const startInterval = () => {
    intervalId = setInterval(cb, interval);
  };
  const unsubscribe = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  startInterval();
  return unsubscribe
}
