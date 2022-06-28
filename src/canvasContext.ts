export const getCanvasContext = () => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#game-canvas');
  const ctx = canvas?.getContext('2d');

  return { canvas, ctx };
};
