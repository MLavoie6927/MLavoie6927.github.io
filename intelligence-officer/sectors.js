function openTargetSector() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (target?.matches("details.sector-brief")) target.open = true;
}

window.addEventListener("DOMContentLoaded", openTargetSector);
window.addEventListener("hashchange", openTargetSector);
