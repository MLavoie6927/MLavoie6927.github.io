/* ATLAS Class 8 / Original vector engineering diagrams / 2026-11-14 / Marc Lavoie */
'use strict';
window.ATLAS_DRAWINGS = (() => {
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = (type,x,y) => {
    // All icons are original, schematic SVG line art; no manufacturer's drawings.
    const common=`stroke="#9ceee2" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
    const map={
      fuel:`<rect x="-23" y="-16" width="46" height="36" rx="7"/><path d="M-11 -16V-24H9V-16M-20 -3H20M-9 10H8"/>`,
      turbo:`<circle r="25"/><circle r="7"/><path d="M0 -21L6 -9 19 -4 8 3 3 20 -4 8 -20 3 -8 -4Z"/>`,
      engine:`<rect x="-28" y="-18" width="56" height="36" rx="7"/><path d="M-21 -26H18M-20 -8H20M-20 3H20M-15 18V27M16 18V27"/><circle cx="-13" cy="9" r="4"/><circle cx="0" cy="9" r="4"/><circle cx="13" cy="9" r="4"/>`,
      gear:`<circle r="24" stroke-dasharray="7 5"/><circle r="13"/><circle r="5"/><path d="M0 -30V-23M0 23V30M-30 0H-23M23 0H30"/>`,
      shaft:`<path d="M-32 0H32M-26 -7L-16 7M16 -7L26 7"/><circle cx="-32" r="9"/><circle cx="32" r="9"/>`,
      axle:`<path d="M-30 0H30M0 -18V18"/><circle cx="-30" r="14"/><circle cx="30" r="14"/><rect x="-12" y="-13" width="24" height="26" rx="7"/>`,
      compressor:`<rect x="-26" y="-16" width="52" height="34" rx="8"/><circle cx="-10" r="9"/><path d="M10 -5H20M10 3H20M-25 -23H5M-16 18V27"/>`,
      dryer:`<rect x="-18" y="-28" width="36" height="56" rx="10"/><path d="M-12 -16H12M-12 -5H12M-12 6H12M-12 17H12"/>`,
      reservoir:`<rect x="-32" y="-14" width="64" height="28" rx="13"/><path d="M-20 -14V14M20 -14V14"/>`,
      pedal:`<path d="M-25 24H22M-12 23L5 -18M3 -21L22 -16M-12 -3L9 2"/>`,
      chambers:`<circle cx="-13" cy="0" r="20"/><circle cx="19" cy="0" r="15"/><path d="M-32 0H-17M-10 -12V12M32 0H39"/>`,
      trailer:`<rect x="-32" y="-18" width="64" height="27" rx="4"/><circle cx="-17" cy="20" r="10"/><circle cx="20" cy="20" r="10"/>`,
      battery:`<rect x="-28" y="-18" width="56" height="40" rx="5"/><path d="M-17 -23V-18M17 -23V-18M-17 -5V9M-24 2H-10M10 2H24"/>`,
      alternator:`<circle r="22"/><circle r="7"/><path d="M-11 -19L11 19M11 -19L-11 19M-29 0H-22M22 0H29"/>`,
      ecu:`<rect x="-25" y="-20" width="50" height="40" rx="5"/><path d="M-17 -20V-27M0 -20V-27M17 -20V-27M-17 20V27M0 20V27M17 20V27M-25 -10H-32M-25 10H-32M25 -10H32M25 10H32"/><rect x="-12" y="-8" width="24" height="16" rx="2"/>`,
      abs:`<circle r="24"/><circle r="14" stroke-dasharray="4 5"/><path d="M-10 0H10M0 -10V10"/>`,
      sevenway:`<circle r="24"/><circle cx="0" cy="0" r="5"/><circle cx="-12" cy="-9" r="3"/><circle cx="12" cy="-9" r="3"/><circle cx="12" cy="10" r="3"/><circle cx="-12" cy="10" r="3"/>`,
      lamps:`<path d="M-16 -24V24M0 -24V24M16 -24V24"/><path d="M-25 -18H25M-25 18H25"/><circle r="8"/>`,
      fifth:`<path d="M-28 -15H-8V-3H9V-15H29V8Q0 28 -28 8Z"/><path d="M0 -28V-3"/>`,
      lock:`<circle r="20"/><path d="M-16 0H-3V-11H10V11H-3V1"/>`,
      air:`<path d="M-32 -9H-10Q0 -9 0 0T12 9H32"/><circle cx="-32" cy="-9" r="6"/><circle cx="32" cy="9" r="6"/>`,
      cable:`<path d="M-30 -3C-30 -25 8 -25 8 -3S36 20 29 -7"/><circle cx="-30" cy="-3" r="6"/><circle cx="29" cy="-7" r="6"/>`,
      frame:`<path d="M-34 -20H34V20H-34Z"/><path d="M-34 -8H34M-34 10H34M-10 -20V20M12 -20V20"/>`,
      cargo:`<rect x="-26" y="-20" width="52" height="41" rx="3"/><path d="M-26 -6H26M0 -20V21"/>`,
      restraints:`<path d="M-33 -18H33M-33 0H33M-33 18H33M-24 -25V25M0 -25V25M24 -25V25"/>`,
      floor:`<path d="M-33 16H33M-29 8L-20 -14H20L30 8M-12 -14V16M12 -14V16"/>`,
      tandem:`<rect x="-32" y="-25" width="64" height="10" rx="3"/><path d="M-22 -15V16M22 -15V16"/><circle cx="-22" cy="20" r="13"/><circle cx="22" cy="20" r="13"/>`,
      tires:`<circle cx="-19" r="20"/><circle cx="19" r="20"/><circle cx="-19" r="8"/><circle cx="19" r="8"/>`
    };
    return `<g transform="translate(${x} ${y})" ${common}>${map[type]||map.engine}</g>`;
  };
  function systemSVG(spec,active=0){
    const coords=[[182,134],[578,134],[974,134],[182,374],[578,374],[974,374]];
    // Arrows are semantic functional direction only, not routing schematics.
    let links='';for(const [a,b] of spec.connections){const [x1,y1]=coords[a],[x2,y2]=coords[b];
      if(Math.abs(y1-y2)<3){const direction=x2>x1?1:-1;const from=x1+direction*166,to=x2-direction*166;links+=`<path d="M${from} ${y1}H${to}" class="flow-line" marker-end="url(#arrow)"/>`;}else{
        const fromY=y1+67,toY=y2-67;links+=`<path d="M${x1} ${fromY}V${(fromY+toY)/2}H${x2}V${toY}" class="flow-line" marker-end="url(#arrow)"/>`;
      }
    }
    const cells=spec.nodes.map(([id,name,sub],i)=>{const [x,y]=coords[i],selected=active===i;
      return `<g class="bp-node ${selected?'selected':''}" role="button" tabindex="0" aria-label="Inspect ${esc(name)}" data-node="${i}"><rect x="${x-158}" y="${y-72}" width="316" height="144" rx="16" class="bp-node-body"/><rect x="${x-142}" y="${y-57}" width="110" height="110" rx="15" class="bp-node-icon-bg"/>${icon(id,x-87,y-2)}<text x="${x-17}" y="${y-18}" class="bp-index">0${i+1} / ${esc(sub)}</text><text x="${x-17}" y="${y+10}" class="bp-title">${esc(name)}</text><text x="${x-17}" y="${y+35}" class="bp-tap">EXPLORE →</text></g>`;
    }).join('');
    return `<svg class="blueprint" viewBox="0 0 1160 515" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interactive ${esc(spec.name)} block diagram"><defs><pattern id="bgGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#1b3949" stroke-width=".7"/></pattern><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#63dbc6"/></marker></defs><rect width="1160" height="515" rx="14" fill="#091b28"/><rect width="1160" height="515" fill="url(#bgGrid)"/><g class="bp-connectors">${links}</g>${cells}<text x="20" y="501" class="bp-caption">ATLAS HEAVY VEHICLE STUDIO     |     CONCEPTUAL FUNCTIONAL DIAGRAM     |     NOT TO SCALE</text></svg>`;
  }
  function airFlow(){return `<svg viewBox="0 0 550 175" class="airflow-svg" role="img" aria-label="Air compressor, air dryer, reservoirs and wheel brake flow"><defs><marker id="airArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#67dbc9"/></marker></defs><path d="M74 85H480" stroke="#2b6871" stroke-width="6" stroke-linecap="round" marker-end="url(#airArrow)"/><path d="M74 85H480" stroke="#64e4d1" stroke-width="2" stroke-dasharray="8 9" class="animated-flow"/><g class="air-nodes"><rect x="15" y="46" width="100" height="74" rx="9"/><rect x="147" y="46" width="100" height="74" rx="9"/><rect x="280" y="46" width="100" height="74" rx="9"/><rect x="414" y="46" width="120" height="74" rx="9"/></g><g class="airflow-label"><text x="65" y="75">COMPRESSOR</text><text x="65" y="92">AIR SOURCE</text><text x="197" y="75">DRYER</text><text x="197" y="92">MOISTURE</text><text x="330" y="75">TANKS</text><text x="330" y="92">STORAGE</text><text x="474" y="75">CHAMBERS</text><text x="474" y="92">ACTUATION</text></g><text x="14" y="155" class="bp-caption">CONCEPTUAL SYSTEM FLOW — NOT PHYSICAL PIPING</text></svg>`;}
  function axleSVG(axles,limits){const min=Math.min(...axles.map(a=>a.pos)),max=Math.max(...axles.map(a=>a.pos));const x=pos=>50+(pos-min)/Math.max(1,max-min)*690;
    const marks=axles.map((a,i)=>{const px=x(a.pos);return `<g><path d="M${px} 55V109" stroke="#4ec4cd" stroke-width="3"/><circle cx="${px}" cy="117" r="28" fill="#07131e" stroke="${a.weight>20000?'#ff8b80':'#6daeb5'}" stroke-width="5"/><circle cx="${px}" cy="117" r="12" fill="#3f6879" stroke="#abc8cf" stroke-width="2"/><text x="${px}" y="31" fill="#dffafa" font-weight="800" text-anchor="middle" font-size="15">${Math.round(a.weight/1000*10)/10}k</text><text x="${px}" y="168" fill="#86a7b9" text-anchor="middle" font-size="12">A${i+1} / ${a.pos} ft</text></g>`;}).join('');return `<svg viewBox="0 0 800 205" role="img" aria-label="Five axle positions and individual readings" class="weight-svg"><path d="M32 71H766" stroke="#38566c" stroke-width="12" stroke-linecap="round"/><path d="M32 85H766" stroke="#182e3a" stroke-width="6"/><path d="M20 181H780" stroke="#2f4858" stroke-dasharray="9 11"/><path d="M${x(axles[1].pos)} 47H${x(axles[2].pos)}M${x(axles[3].pos)} 47H${x(axles[4].pos)}" stroke="#d8b66e" stroke-width="3" stroke-dasharray="7 6"/>${marks}</svg>`;}
  return {systemSVG,airFlow,axleSVG};
})();
