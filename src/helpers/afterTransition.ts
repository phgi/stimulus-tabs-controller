export default function afterTransition(element: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    const duration = Number(
      getComputedStyle(element)
        .transitionDuration
        .replace('s', '')
    ) * 1000;

    setTimeout(() => {
      resolve();
    }, duration);
  });
}
