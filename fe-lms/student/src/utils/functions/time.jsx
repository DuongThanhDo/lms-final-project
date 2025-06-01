export function formatDuration(seconds, type = "") {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num) => (num < 10 ? "0" + num : num);

  switch (type) {
    case "text":
      if (hrs > 0) {
        return `${pad(hrs)} giờ ${pad(mins)} phút`;
      } else {
        return `${pad(mins)} phút ${pad(secs)} giây`;
      }

    default:
      if (hrs > 0) {
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
      } else {
        return `${pad(mins)}:${pad(secs)}`;
      }
  }
}
