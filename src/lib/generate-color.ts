export function generateColor(): string {
 const colors = ["#ff6467", "#ffb900", "#9ae600", "#05df72", "#00d5be", "#00d3f3", "#00bcff", "#51a2ff", "#7c86ff", "#a684ff", "#ed6bff", "#fb64b6", "#ff637e", "#90a1b9"]
 return colors[Math.floor(Math.random() * colors.length)]
}