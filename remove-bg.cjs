// Flood-fill background removal — starts from image edges, removes only
// connected background pixels. Far more accurate than a global colour threshold.
const Jimp = require('jimp');
const path = require('path');

const INPUT  = path.join(__dirname, 'public', 'profile.jpg');
const OUTPUT = path.join(__dirname, 'public', 'profile.png');

function dist(r1,g1,b1, r2,g2,b2) {
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}

(async () => {
  console.log('Reading image…');
  const img = await Jimp.read(INPUT);
  const { width, height } = img.bitmap;
  const data = img.bitmap.data;
  console.log(`${width}×${height}`);

  // ── Sample seed colour from multiple edge points ──
  const edgeSamples = [
    [0, 0], [width-1, 0], [0, height-1], [width-1, height-1],
    [Math.floor(width/2), 0],      // top centre
    [0, Math.floor(height/2)],     // left centre
    [width-1, Math.floor(height/2)],// right centre
  ];
  let sR=0, sG=0, sB=0;
  for (const [x,y] of edgeSamples) {
    const i = (y*width+x)*4;
    sR += data[i]; sG += data[i+1]; sB += data[i+2];
  }
  sR = Math.round(sR/edgeSamples.length);
  sG = Math.round(sG/edgeSamples.length);
  sB = Math.round(sB/edgeSamples.length);
  console.log(`Seed colour (avg edge): rgb(${sR},${sG},${sB})`);

  const TOLERANCE      = 52;   // Euclidean RGB distance
  const SOFT_TOLERANCE = 75;   // pixels within this become semi-transparent (feather)
  const visited = new Uint8Array(width * height);

  // ── BFS flood fill from all four edges ──
  // Seed queue with every pixel on the image border
  const queue = [];
  for (let x=0; x<width; x++)  { queue.push(x, 0); queue.push(x, height-1); }
  for (let y=1; y<height-1; y++){ queue.push(0, y); queue.push(width-1, y); }

  let removed = 0, softened = 0;

  // Process in pairs (x,y)
  let qi = 0;
  while (qi < queue.length) {
    const x = queue[qi++];
    const y = queue[qi++];
    const pidx = y*width+x;
    if (visited[pidx]) continue;
    visited[pidx] = 1;

    const i = pidx*4;
    const d = dist(data[i],data[i+1],data[i+2], sR,sG,sB);

    if (d <= TOLERANCE) {
      data[i+3] = 0;   // fully transparent
      removed++;
      // push 4-connected neighbours
      if (x>0)        { queue.push(x-1, y); }
      if (x<width-1)  { queue.push(x+1, y); }
      if (y>0)        { queue.push(x, y-1); }
      if (y<height-1) { queue.push(x, y+1); }
    } else if (d <= SOFT_TOLERANCE) {
      // feather zone: partially transparent
      const alpha = Math.round(((d - TOLERANCE) / (SOFT_TOLERANCE - TOLERANCE)) * 255);
      data[i+3] = Math.max(0, Math.min(255, alpha));
      softened++;
    }
  }

  console.log(`Transparent: ${removed} | Feathered: ${softened}`);
  console.log('Writing PNG…');
  await img.writeAsync(OUTPUT);
  console.log('Done ✓  →', OUTPUT);
})();
