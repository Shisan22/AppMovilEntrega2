import React from 'react';

export const KoruLogo = ({ className = "w-12 h-12" }: { className?: string }) => {
  // Generación procedural del Koru para replicar exactamente la imagen adjunta
  const getPoint = (t: number) => {
    // Espiral de Arquímedes modificada para el tallo
    const theta = Math.PI / 2 + Math.pow(t, 0.85) * 2.1 * Math.PI;
    const r = 1 + Math.pow(t, 1.2) * 34;
    return {
      x: 50 + r * Math.cos(theta),
      y: 50 + r * Math.sin(theta)
    };
  };

  const stemPointsLeft = [];
  const stemPointsRight = [];
  
  // Generar el tallo grueso y cónico
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const p = getPoint(t);
    const pNext = getPoint(t + 0.001);
    
    const dx = pNext.x - p.x;
    const dy = pNext.y - p.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    const ox = dy / len;
    const oy = -dx / len;
    
    const width = 1.2 + Math.pow(t, 0.8) * 5.5; 
    
    stemPointsLeft.push(`${p.x + ox * width / 2},${p.y + oy * width / 2}`);
    stemPointsRight.unshift(`${p.x - ox * width / 2},${p.y - oy * width / 2}`);
  }
  
  const stemPath = `M ${stemPointsLeft.join(' L ')} L ${stemPointsRight.join(' L ')} Z`;

  // Generar las hojas a lo largo de la espiral
  const leaves = [];
  const numLeaves = 32;
  
  for (let i = 0; i < numLeaves; i++) {
    const t = 0.06 + (i / (numLeaves - 1)) * 0.94; 
    const p = getPoint(t);
    const pNext = getPoint(t + 0.001);
    
    const dx = pNext.x - p.x;
    const dy = pNext.y - p.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    const tx = dx / len;
    const ty = dy / len;
    
    const ox = dy / len;
    const oy = -dx / len;
    
    // Dirección de la hoja: hacia afuera y curvada hacia atrás
    const backFactor = 0.3 + t * 0.8;
    const outFactor = 1 - t * 0.2;
    
    let ldx = ox * outFactor - tx * backFactor;
    let ldy = oy * outFactor - ty * backFactor;
    const llen = Math.sqrt(ldx * ldx + ldy * ldy);
    ldx /= llen;
    ldy /= llen;
    
    const leafSize = 2 + Math.pow(t, 1.2) * 16; 
    const leafWidth = 0.8 + Math.pow(t, 1.0) * 2.8;
    
    const width = 1.2 + Math.pow(t, 0.8) * 5.5;
    const baseX = p.x + ox * (width / 2 - 0.5); 
    const baseY = p.y + oy * (width / 2 - 0.5);
    
    const tipX = baseX + ldx * leafSize;
    const tipY = baseY + ldy * leafSize;
    
    const lnx = -ldy;
    const lny = ldx;
    
    // Puntos de control para darle forma curva a cada hoja
    const cp1x = baseX + ldx * leafSize * 0.4 + lnx * leafWidth;
    const cp1y = baseY + ldy * leafSize * 0.4 + lny * leafWidth;
    
    const cp2x = baseX + ldx * leafSize * 0.4 - lnx * leafWidth;
    const cp2y = baseY + ldy * leafSize * 0.4 - lny * leafWidth;
    
    leaves.push(
      <path 
        key={`leaf-${i}`}
        d={`M ${baseX} ${baseY} Q ${cp1x} ${cp1y} ${tipX} ${tipY} Q ${cp2x} ${cp2y} ${baseX} ${baseY} Z`}
        fill="currentColor"
      />
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-10 50 50)">
        <circle cx={getPoint(0).x} cy={getPoint(0).y} r={1.2} fill="currentColor" />
        <path d={stemPath} fill="currentColor" />
        {leaves}
      </g>
    </svg>
  );
};
