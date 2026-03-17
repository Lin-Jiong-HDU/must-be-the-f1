// scripts/parse-track-svg.ts
// 从SVG文件中提取赛道坐标点

import fs from 'fs';
import path from 'path';

interface Point {
  x: number;
  y: number;
}

// 解析SVG路径命令
function parsePathCommands(d: string): string[] {
  const commands: string[] = [];
  const regex = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
  let match;
  while ((match = regex.exec(d)) !== null) {
    commands.push(match[0]);
  }
  return commands;
}

// 解析数值
function parseNumbers(str: string): number[] {
  const nums = str.match(/-?\d+\.?\d*/g);
  return nums ? nums.map(Number) : [];
}

// 将路径命令转换为点数组
function pathToPoints(d: string, sampleRate: number = 0.05): Point[] {
  const commands = parsePathCommands(d);
  const points: Point[] = [];
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  for (const cmd of commands) {
    const type = cmd[0];
    const args = parseNumbers(cmd.slice(1));

    switch (type) {
      case 'M': // 绝对移动
        currentX = args[0];
        currentY = args[1];
        startX = currentX;
        startY = currentY;
        points.push({ x: currentX, y: currentY });
        break;

      case 'm': // 相对移动
        currentX += args[0];
        currentY += args[1];
        startX = currentX;
        startY = currentY;
        points.push({ x: currentX, y: currentY });
        break;

      case 'L': // 绝对直线
        for (let i = 0; i < args.length; i += 2) {
          currentX = args[i];
          currentY = args[i + 1];
          points.push({ x: currentX, y: currentY });
        }
        break;

      case 'l': // 相对直线
        for (let i = 0; i < args.length; i += 2) {
          currentX += args[i];
          currentY += args[i + 1];
          points.push({ x: currentX, y: currentY });
        }
        break;

      case 'H': // 水平线
        currentX = args[0];
        points.push({ x: currentX, y: currentY });
        break;

      case 'h': // 相对水平线
        currentX += args[0];
        points.push({ x: currentX, y: currentY });
        break;

      case 'V': // 垂直线
        currentY = args[0];
        points.push({ x: currentX, y: currentY });
        break;

      case 'v': // 相对垂直线
        currentY += args[0];
        points.push({ x: currentX, y: currentY });
        break;

      case 'C': // 绝对三次贝塞尔
        for (let i = 0; i < args.length; i += 6) {
          const x0 = currentX;
          const y0 = currentY;
          const x1 = args[i];
          const y1 = args[i + 1];
          const x2 = args[i + 2];
          const y2 = args[i + 3];
          const x3 = args[i + 4];
          const y3 = args[i + 5];

          // 采样贝塞尔曲线
          for (let t = sampleRate; t <= 1; t += sampleRate) {
            const t2 = t * t;
            const t3 = t2 * t;
            const mt = 1 - t;
            const mt2 = mt * mt;
            const mt3 = mt2 * mt;

            const x = mt3 * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3;
            const y = mt3 * y0 + 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3 * y3;

            points.push({ x, y });
          }

          currentX = x3;
          currentY = y3;
        }
        break;

      case 'c': // 相对三次贝塞尔
        for (let i = 0; i < args.length; i += 6) {
          const x0 = currentX;
          const y0 = currentY;
          const x1 = currentX + args[i];
          const y1 = currentY + args[i + 1];
          const x2 = currentX + args[i + 2];
          const y2 = currentY + args[i + 3];
          const x3 = currentX + args[i + 4];
          const y3 = currentY + args[i + 5];

          for (let t = sampleRate; t <= 1; t += sampleRate) {
            const t2 = t * t;
            const t3 = t2 * t;
            const mt = 1 - t;
            const mt2 = mt * mt;
            const mt3 = mt2 * mt;

            const x = mt3 * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3;
            const y = mt3 * y0 + 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3 * y3;

            points.push({ x, y });
          }

          currentX = x3;
          currentY = y3;
        }
        break;

      case 'S': // 平滑三次贝塞尔
        // 简化处理
        break;

      case 'Z':
      case 'z': // 闭合路径
        points.push({ x: startX, y: startY });
        currentX = startX;
        currentY = startY;
        break;
    }
  }

  return points;
}

// 归一化坐标到 -1 到 1 范围
function normalizePoints(points: Point[]): { x: number; y: number; z: number }[] {
  if (points.length === 0) return [];

  // 找到边界
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const scale = Math.max(width, height);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // 归一化并添加 z=0
  return points.map(p => ({
    x: (p.x - centerX) / scale,
    y: -(p.y - centerY) / scale, // Y轴翻转
    z: 0
  }));
}

// 简化点数（每隔n个点取一个）
function simplifyPoints(points: { x: number; y: number; z: number }[], keepEvery: number = 3) {
  return points.filter((_, i) => i % keepEvery === 0);
}

// 查找最长的path元素（通常是主赛道）
function findMainPath(svgContent: string): string {
  const pathRegex = /<path[^>]*\sd="[^"]*"[^>]*\/>/g;
  let match;
  let longestPath = '';
  let longestLength = 0;

  while ((match = pathRegex.exec(svgContent)) !== null) {
    const pathElement = match[0];
    const dMatch = pathElement.match(/\sd="([^"]+)"/);
    if (dMatch && dMatch[1].length > longestLength) {
      longestLength = dMatch[1].length;
      longestPath = pathElement;
    }
  }

  return longestPath;
}

// 主函数
function main() {
  const svgPath = process.argv[2] || 'public/tracks/Monte_Carlo.svg';
  const outputPath = process.argv[3] || 'content/data/tracks/monaco.json';
  const trackName = process.argv[4] || 'Monaco';
  const trackId = process.argv[5] || 'monaco';
  const pathId = process.argv[6]; // 可选：指定path ID

  console.log(`Reading SVG from: ${svgPath}`);

  const svgContent = fs.readFileSync(svgPath, 'utf-8');

  let pathElement = '';

  if (pathId) {
    // 如果指定了path ID，按ID查找
    const idIndex = svgContent.indexOf(`id="${pathId}"`);
    if (idIndex === -1) {
      console.error(`Could not find path with id="${pathId}"`);
      process.exit(1);
    }
    const pathStart = svgContent.lastIndexOf('<path', idIndex);
    const pathEnd = svgContent.indexOf('/>', idIndex);
    if (pathStart === -1 || pathEnd === -1) {
      console.error('Could not locate path element boundaries');
      process.exit(1);
    }
    pathElement = svgContent.substring(pathStart, pathEnd + 2);
  } else {
    // 自动查找最长的path（通常是主赛道）
    pathElement = findMainPath(svgContent);
    if (!pathElement) {
      console.error('Could not find any path element');
      process.exit(1);
    }
  }

  console.log(`Found path element, length: ${pathElement.length} characters`);

  // 提取 d 属性
  const dMatch = pathElement.match(/\sd="([^"]+)"/);

  if (!dMatch) {
    console.error('Could not extract d attribute');
    process.exit(1);
  }

  const pathData = dMatch[1];
  console.log(`Found path data, length: ${pathData.length} characters`);

  // 转换为点
  const points = pathToPoints(pathData);
  console.log(`Generated ${points.length} raw points`);

  // 归一化
  const normalized = normalizePoints(points);
  console.log('Normalized to -1 to 1 range');

  // 简化
  const simplified = simplifyPoints(normalized, 3);
  console.log(`Simplified to ${simplified.length} points`);

  // 确保输出目录存在
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 保存为JSON
  const output = {
    name: trackName,
    id: trackId,
    points: simplified,
    pointCount: simplified.length
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Saved to: ${outputPath}`);
}

main();
