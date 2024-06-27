const countdownColorClasses = [
  ["bg-red-900", "text-white"],
  ["bg-red-800", "text-white"],
  ["bg-red-700", "text-white"],
  ["bg-red-600", "text-white"],
  ["bg-red-500", "text-white"],
  ["bg-red-400", "text-black"],
  ["bg-red-300", "text-black"],
  ["bg-red-200", "text-black"],
  ["bg-red-100", "text-black"],
  ["bg-red-50", "text-black"],
];

export const getColorFromDelay = (countdown?: number) => {
  if (countdown === undefined) return "bg-transparent";
  if (countdown === 0) return ["bg-vivid-cyan-blue", "text-white"].join(" ");
  return countdownColorClasses[countdown - 1].join(" ");
};
