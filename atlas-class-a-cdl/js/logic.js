/* ATLAS Class A CDL Safety Studio — standalone rule-of-thumb demonstration, NOT routing authorization.
 * Copyright (c) 2026 Marc Lavoie. No external dependencies.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ATLAS_CDL_LOGIC = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null), function () {
  'use strict';
  const LEVELS = { low: 1, medium: 2, high: 3, critical: 4 };
  function finiteNumber(value) {
    if (value === '' || value === null || value === undefined) return null;
    const valueN = Number(value);
    return Number.isFinite(valueN) ? valueN : null;
  }
  function ftInToInches(ft, inches) {
    const f = finiteNumber(ft), i = finiteNumber(inches);
    if (f === null || i === null || f < 0 || i < 0 || i >= 12 || (f === 0 && i === 0)) return null;
    return f * 12 + i;
  }
  function fmtInches(total) {
    if (total === null || total === undefined) return 'not provided';
    return `${Math.floor(total / 12)} ft ${Math.round((total % 12) * 10) / 10} in`;
  }
  function checkFit(raw) {
    const profile = raw && raw.profile || {};
    const restriction = raw && raw.restriction || {};
    const results = [];
    const height = ftInToInches(profile.heightFt, profile.heightIn);
    const bridge = ftInToInches(restriction.clearanceFt, restriction.clearanceIn);
    const width = ftInToInches(profile.widthFt, profile.widthIn);
    const maxWidth = ftInToInches(restriction.maxWidthFt, restriction.maxWidthIn);
    const length = finiteNumber(profile.lengthFt);
    const maxLength = finiteNumber(restriction.maxLengthFt);
    const gross = finiteNumber(profile.grossLb);
    const maxGross = finiteNumber(restriction.maxGrossLb);
    function missing(name) { results.push({severity:'verify', label:name, message:'Not established. Do not infer legal or physical clearance from this tool.'}); }
    if (height === null) results.push({severity:'error',label:'Vehicle height',message:'Enter a valid positive height (inches 0–11).'});
    if (width === null) results.push({severity:'error',label:'Vehicle width',message:'Enter a valid positive width (inches 0–11).'});
    if (length === null || length <= 0) results.push({severity:'error',label:'Combination length',message:'Enter a valid positive overall combination length in feet.'});
    if (gross === null || gross <= 0) results.push({severity:'error',label:'Gross weight',message:'Enter valid actual gross vehicle weight in pounds.'});
    if (restriction.noTrucks === true) results.push({severity:'block',label:'Truck prohibition',message:'Reported NO TRUCKS restriction: do not proceed unless an authorized, applicable exception is verified.'});
    if (restriction.hazmatBan === true && profile.hazmat === true) results.push({severity:'block',label:'Hazmat routing',message:'Potential prohibited hazmat corridor. Verify current official route rules.'});
    if (bridge === null) missing('Vertical clearance');
    else if (height !== null && height > bridge) results.push({severity:'block',label:'Vertical clearance',message:`Vehicle ${fmtInches(height)} exceeds posted ${fmtInches(bridge)}.`});
    else if (height !== null && height === bridge) results.push({severity:'block',label:'Vertical clearance',message:'Vehicle equals reported clearance; no safety margin. Do not attempt passage.'});
    else if (height !== null) results.push({severity:'pass',label:'Height comparison',message:`Vehicle ${fmtInches(height)} is below the entered ${fmtInches(bridge)} clearance. This does not prove the structure is safe.`});
    if (maxWidth === null) missing('Width restriction');
    else if (width !== null && width > maxWidth) results.push({severity:'block',label:'Width restriction',message:`Vehicle ${fmtInches(width)} exceeds entered ${fmtInches(maxWidth)}.`});
    else if (width !== null) results.push({severity:'pass',label:'Width comparison',message:'Entered width does not exceed entered maximum. Verify roadside signs and mirrors/loads.'});
    if (maxLength === null || maxLength <= 0) missing('Length restriction');
    else if (length !== null && length > maxLength) results.push({severity:'block',label:'Length restriction',message:`Combination ${length} ft exceeds entered ${maxLength} ft limit.`});
    else if (length !== null) results.push({severity:'pass',label:'Length comparison',message:'Entered total length does not exceed entered maximum. Trailer length and overall length are different measurements.'});
    if (maxGross === null || maxGross <= 0) missing('Weight restriction');
    else if (gross !== null && gross > maxGross) results.push({severity:'block',label:'Gross weight restriction',message:`Actual gross ${gross.toLocaleString('en-US')} lb exceeds entered ${maxGross.toLocaleString('en-US')} lb limit.`});
    else if (gross !== null) results.push({severity:'pass',label:'Gross weight comparison',message:'Gross weight comparison passes input-only check. Axle weights, bridge formula and other limits were NOT evaluated.'});
    const status = results.some(r=>r.severity==='error') ? 'INVALID' : results.some(r=>r.severity==='block') ? 'STOP' : 'VERIFY';
    return { status, results, note:'Training-only input comparison. No official route verification, live road data, truck turning simulation, bridge engineering, permit validation, axle/bridge-formula calculation or safety certification.' };
  }
  function filterScenarios(items, state) {
    const q = String((state && state.q) || '').trim().toLowerCase();
    return items.filter(s => (!state.category || state.category === 'all' || s.category === state.category)
      && (!state.severity || state.severity === 'all' || s.severity === state.severity)
      && (!q || [s.id,s.title,s.situation,s.action,s.stage,s.basis].join(' ').toLowerCase().includes(q)));
  }
  function fmtCSV(rows, cols) {
    const esc = v => '"' + String(v === undefined || v === null ? '' : v).replace(/"/g, '""') + '"';
    return '\ufeff' + [cols.map(esc).join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\r\n');
  }
  function validateReport(value) {
    const errors = [];
    if (String(value.location || '').trim().length < 3) errors.push('Enter a location with at least 3 characters.');
    if (String(value.description || '').trim().length < 12) errors.push('Describe the hazard in at least 12 characters.');
    if (String(value.location || '').length > 250) errors.push('Location is too long.');
    if (String(value.description || '').length > 2500) errors.push('Description is too long.');
    if (!['unverified','sign-observed','official-reviewed'].includes(value.evidence)) errors.push('Select a valid evidence status.');
    return errors;
  }
  return Object.freeze({LEVELS, finiteNumber,ftInToInches,fmtInches,checkFit,filterScenarios,fmtCSV,validateReport});
});
