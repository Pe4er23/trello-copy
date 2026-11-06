const COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F033FF",
  "#33FFF0",
  "#FF33A8",
  "#A833FF",
];

const getContrastTextColor = (hexColor) => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};

const getColorByName = (name) => {
  if (!name) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.codePointAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
};

export const Avatar = ({ user, size = 40, customColor = null }) => {
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "?";
  const bgColor = customColor || user.avatarColor || getColorByName(user.name);
  const textColor = getContrastTextColor(bgColor);

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        color: textColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        fontWeight: "bold",
        fontSize: size * 0.4,
      }}
      title={user.name}
    >
      {initial}
    </div>
  );
};
