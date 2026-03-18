export interface BeadColor {
  id: string;
  name: string;
  rgb: [number, number, number];
  hex: string;
  symbol: string;
}

export const PERLER_COLORS: BeadColor[] = [
  { id: '01', name: '白色 (White)', rgb: [255, 255, 255], hex: '#FFFFFF', symbol: '1' },
  { id: '02', name: '奶油色 (Cream)', rgb: [235, 235, 204], hex: '#EBEBCC', symbol: '2' },
  { id: '03', name: '黄色 (Yellow)', rgb: [240, 185, 1], hex: '#F0B901', symbol: '3' },
  { id: '04', name: '橙色 (Orange)', rgb: [240, 90, 35], hex: '#F05A23', symbol: '4' },
  { id: '05', name: '红色 (Red)', rgb: [200, 25, 40], hex: '#C81928', symbol: '5' },
  { id: '06', name: '泡泡糖粉 (Bubblegum)', rgb: [225, 80, 140], hex: '#E1508C', symbol: '6' },
  { id: '07', name: '紫色 (Purple)', rgb: [100, 45, 115], hex: '#642D73', symbol: '7' },
  { id: '08', name: '深蓝色 (Dark Blue)', rgb: [30, 50, 130], hex: '#1E3282', symbol: '8' },
  { id: '09', name: '浅蓝色 (Light Blue)', rgb: [45, 130, 200], hex: '#2D82C8', symbol: '9' },
  { id: '10', name: '深绿色 (Dark Green)', rgb: [20, 100, 50], hex: '#146432', symbol: 'A' },
  { id: '11', name: '浅绿色 (Light Green)', rgb: [65, 175, 90], hex: '#41AF5A', symbol: 'B' },
  { id: '12', name: '棕色 (Brown)', rgb: [80, 45, 25], hex: '#502D19', symbol: 'C' },
  { id: '17', name: '灰色 (Grey)', rgb: [140, 145, 150], hex: '#8C9196', symbol: 'D' },
  { id: '18', name: '黑色 (Black)', rgb: [35, 35, 35], hex: '#232323', symbol: 'E' },
  { id: '19', name: '透明 (Clear)', rgb: [220, 230, 235], hex: '#DCE6EB', symbol: 'F' },
  { id: '20', name: '铁锈红 (Rust)', rgb: [155, 55, 35], hex: '#9B3723', symbol: 'G' },
  { id: '21', name: '浅棕色 (Light Brown)', rgb: [160, 105, 60], hex: '#A0693C', symbol: 'H' },
  { id: '22', name: '桃红色 (Peach)', rgb: [245, 180, 150], hex: '#F5B496', symbol: 'I' },
  { id: '33', name: '浅粉色 (Light Pink)', rgb: [245, 170, 200], hex: '#F5AAC8', symbol: 'J' },
  { id: '35', name: '梅紫色 (Plum)', rgb: [150, 40, 100], hex: '#962864', symbol: 'K' },
  { id: '38', name: '洋红色 (Magenta)', rgb: [215, 30, 110], hex: '#D71E6E', symbol: 'L' },
  { id: '43', name: '柔和黄 (Pastel Yellow)', rgb: [245, 230, 110], hex: '#F5E66E', symbol: 'M' },
  { id: '47', name: '柔和绿 (Pastel Green)', rgb: [130, 205, 130], hex: '#82CD82', symbol: 'N' },
  { id: '48', name: '柔和蓝 (Pastel Blue)', rgb: [105, 170, 215], hex: '#69AAD7', symbol: 'O' },
  { id: '52', name: '薰衣草紫 (Pastel Lavender)', rgb: [160, 135, 190], hex: '#A087BE', symbol: 'P' },
  { id: '53', name: '柔和桃红 (Pastel Peach)', rgb: [245, 200, 160], hex: '#F5C8A0', symbol: 'Q' },
  { id: '56', name: '珍珠白 (Pearl)', rgb: [230, 235, 240], hex: '#E6EBF0', symbol: 'R' },
  { id: '57', name: '金属金 (Gold Metallic)', rgb: [175, 130, 50], hex: '#AF8232', symbol: 'S' },
  { id: '58', name: '金属银 (Silver Metallic)', rgb: [150, 155, 165], hex: '#969BA5', symbol: 'T' },
  { id: '59', name: '金属铜 (Copper Metallic)', rgb: [165, 85, 45], hex: '#A5552D', symbol: 'U' },
  { id: '61', name: '奇异果绿 (Kiwi Lime)', rgb: [115, 190, 45], hex: '#73BE2D', symbol: 'V' },
  { id: '62', name: '绿松石色 (Turquoise)', rgb: [45, 160, 185], hex: '#2DA0B9', symbol: 'W' },
  { id: '63', name: '腮红粉 (Blush)', rgb: [245, 145, 145], hex: '#F59191', symbol: 'X' },
  { id: '83', name: '粉色 (Pink)', rgb: [235, 95, 155], hex: '#EB5F9B', symbol: 'Y' },
  { id: '88', name: '覆盆子红 (Raspberry)', rgb: [175, 45, 85], hex: '#AF2D55', symbol: 'Z' },
  { id: '90', name: '奶油糖果色 (Butterscotch)', rgb: [215, 145, 55], hex: '#D79137', symbol: '!' },
  { id: '91', name: '鹦鹉绿 (Parrot Green)', rgb: [0, 140, 140], hex: '#008C8C', symbol: '@' },
  { id: '92', name: '深灰色 (Dark Grey)', rgb: [85, 90, 95], hex: '#555A5F', symbol: '#' },
  { id: '93', name: '蓝莓奶油色 (Blueberry Cream)', rgb: [100, 145, 210], hex: '#6491D2', symbol: '$' },
  { id: '96', name: '蔓越莓红 (Cranberry)', rgb: [180, 55, 85], hex: '#B43755', symbol: '%' },
  { id: '97', name: '荧光粉 (Neon Pink)', rgb: [245, 55, 150], hex: '#F53796', symbol: '^' },
  { id: '98', name: '荧光橙 (Neon Orange)', rgb: [255, 115, 45], hex: '#FF732D', symbol: '&' },
  { id: '99', name: '荧光黄 (Neon Yellow)', rgb: [235, 235, 45], hex: '#EBEB2D', symbol: '*' },
  { id: '100', name: '荧光绿 (Neon Green)', rgb: [125, 215, 55], hex: '#7DD737', symbol: '+' },
];

export function getClosestColor(r: number, g: number, b: number): BeadColor {
  let minDistance = Infinity;
  let closestColor = PERLER_COLORS[0];

  for (const color of PERLER_COLORS) {
    // Simple Euclidean distance in RGB space
    // For better results, CIEDE2000 could be used, but RGB is usually fine for this use case
    const dr = r - color.rgb[0];
    const dg = g - color.rgb[1];
    const db = b - color.rgb[2];
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  }

  return closestColor;
}
