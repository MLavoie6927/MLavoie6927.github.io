/*
 * ATLAS CLASS 8 | Engineering math core | v3.0
 * 2026-11-14 · Marc Lavoie
 * Pure functions: no DOM, no network, no persistent state.
 * These models are illustrative. They cannot determine roadworthiness.
 */
'use strict';
(function(root){
  const finite=(n,name)=>{if(typeof n!=='number'||!Number.isFinite(n))throw new TypeError(name+' must be a finite number');return n;};
  const range=(n,low,high,name)=>{finite(n,name);if(n<low||n>high)throw new RangeError(name+' must be between '+low+' and '+high);return n;};
  function drivetrain(p){
    const torque=range(p.torque,0,5000,'torque'),rpm=range(p.rpm,0,4000,'rpm');
    const gear=range(p.gear,0.1,30,'gear ratio'),axle=range(p.axle,0.5,10,'axle ratio');
    const efficiency=range(p.efficiency,0,1,'efficiency'),diameter=range(p.diameter,10,80,'tire diameter');
    const mass=range(p.weight,1000,200000,'gross vehicle weight');
    const grade=range(p.grade,0,30,'road grade');
    const overall=gear*axle;
    const wheelTorque=torque*overall*efficiency;
    const radiusFeet=diameter/24;
    const tractiveForce=wheelTorque/radiusFeet;
    const mph=(rpm*Math.PI*diameter)/(overall*1056);
    const gradeDemand=mass*grade/100; // Grade angle approximation; rolling resistance not included.
    return {overall,wheelTorque,tractiveForce,mph,gradeDemand,forceMargin:tractiveForce-gradeDemand,validModel:true};
  }
  function cargo(p){
    const weight=range(p.cargo,0,110000,'cargo'),tractor=range(p.tractor,1000,60000,'empty tractor');
    const trailer=range(p.trailer,1000,50000,'empty trailer');
    const steerEmpty=range(p.steerEmpty,0,tractor,'empty steer axle');
    const pinFraction=range(p.emptyPinShare,0,1,'empty pin fraction');
    const steerFraction=range(p.pinSteerShare,0,1,'kingpin-to-steer fraction');
    const pinX=3,tandemX=43, x=range(p.position,pinX,tandemX,'cargo center');
    const rearCargo=weight*(x-pinX)/(tandemX-pinX);
    const frontCargo=weight-rearCargo;
    const kingpin=trailer*pinFraction+frontCargo;
    const trailerTandem=trailer*(1-pinFraction)+rearCargo;
    const steer=steerEmpty+kingpin*steerFraction;
    const drives=tractor-steerEmpty+kingpin*(1-steerFraction);
    const gross=tractor+trailer+weight;
    const axles=[steer,drives/2,drives/2,trailerTandem/2,trailerTandem/2];
    const reconciliation=axles.reduce((a,b)=>a+b,0)-gross;
    const warning=[];
    if(gross>80000)warning.push('Modeled combination exceeds the general 80,000 lb Interstate reference ceiling.');
    if(steer>12000)warning.push('Modeled steer load exceeds the example 12,000 lb steering GAWR. Actual rating may differ.');
    if(drives>34000)warning.push('Modeled drive tandem exceeds the federal 34,000 lb tandem reference.');
    if(trailerTandem>34000)warning.push('Modeled trailer tandem exceeds the federal 34,000 lb tandem reference.');
    return {frontCargo,rearCargo,kingpin,steer,drives,trailerTandem,gross,axles,reconciliation,warning};
  }
  const tireLocations=(()=>{
    const out=[{id:'S-L',axle:1,side:'Left',pair:'Single',position:'Steer left'},{id:'S-R',axle:1,side:'Right',pair:'Single',position:'Steer right'}];
    for(let axle=2;axle<=5;axle++)for(const side of ['Left','Right'])for(const pair of ['Outer','Inner']){
      out.push({id:`${axle}-${side[0]}-${pair[0]}`,axle,side,pair,position:`Axle ${axle} · ${side.toLowerCase()} ${pair.toLowerCase()}`});
    }
    return Object.freeze(out.map(x=>Object.freeze(x)));
  })();
  function tireCondition(tire,record){
    const depth=range(record.tread,0,40,'tread depth'),pressure=range(record.pressure,0,200,'pressure'),target=range(record.target,1,200,'cold inflation reference');
    const damage=record.damage===true;
    const min=tire.axle===1?4:2;
    const issues=[];
    if(depth<min)issues.push(`Below ${min}/32 inch federal major-groove tread minimum`);
    if(damage)issues.push('Reported ply exposure, separation, cut or audible leak: do not operate');
    if(pressure<target)issues.push(`Measured inflation is below the user-entered ${target} psi cold reference; verify tire/load chart and temperature`);
    const hard=depth<min||damage;
    return {minimum:min,status:hard?'fail':pressure<target?'review':'monitor',issues,hasRegulatoryTreadFailure:depth<min};
  }
  root.ATLAS_SIM=Object.freeze({drivetrain,cargo,tireCondition,tireLocations});
})(typeof window!=='undefined'?window:globalThis);
