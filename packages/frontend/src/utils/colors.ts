
export const getRandomColor = (): string => {
  const color = (~~(Math.random() * 0xffffff)).toString(16);
  const hex = `000000${color}`.slice(-6);

  return `#${hex}`;
};