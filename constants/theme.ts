import { Platform } from "react-native";

// BookMesh — YGG-style dark tracker palette
export const Colors = {
  light: {
    text: "#E1E1E6",
    background: "#0A0A0B",
    tint: "#C5A572", // Gold Premium
    icon: "#88888D",
    tabIconDefault: "#444446",
    tabIconSelected: "#C5A572",
    card: "#141416",
    border: "#1C1C1E",
    muted: "#8E8E93",
    success: "#30D158",
    error: "#FF453A",
    warning: "#FF9F0A",
  },
  dark: {
    text: "#E1E1E6",
    background: "#0A0A0B",
    tint: "#C5A572",
    icon: "#88888D",
    tabIconDefault: "#444446",
    tabIconSelected: "#C5A572",
    card: "#141416",
    border: "#1C1C1E",
    muted: "#8E8E93",
    success: "#30D158",
    error: "#FF453A",
    warning: "#FF9F0A",
  },
};

// Category accent colors — Plus élégants et sobres
export const CategoryColors: Record<string, string> = {
  Roman: "#D1D1D6",
  "Science-Fiction": "#64D2FF",
  Policier: "#FF375F",
  Fantasy: "#BF5AF2",
  Manga: "#FF9F0A",
  BD: "#FFD60A",
  Biographie: "#30D158",
  Histoire: "#C5A572",
  Informatique: "#5E5CE6",
  Sciences: "#4ADE80",
  Art: "#FF9F0A",
  Autre: "#8E8E93",
};

export const CATEGORIES = Object.keys(CategoryColors);
 
export const FormatColors: Record<string, string> = {
  pdf: "#FF453A", // Red
  epub: "#BF5AF2", // Purple
  docx: "#2b579a", // Word Blue
  doc: "#2b579a",
  pptx: "#d24726", // PowerPoint Orange/Red
  ppt: "#d24726",
  xlsx: "#217346", // Excel Green
  xls: "#217346",
  txt: "#8e8e93", // Gray
  unknown: "#444446", // Dark Gray
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
