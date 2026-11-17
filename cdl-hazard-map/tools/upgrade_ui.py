from pathlib import Path
p=Path(__file__).resolve().parents[1]/'index.html'
s=p.read_text()
s=s.replace('<title>ATLAS | US Class A CDL Road Hazard Atlas</title>', '<title>ATLAS | U.S. Class A CDL GPS Trap & Road Hazard Atlas v1.1</title>')
s=s.replace('road problem awareness map with government-source restriction examples and illustrative logistics planning regions.', 'road problem awareness map with 30 GPS-trap road examples, documented restrictions and illustrative logistics planning regions.')
s=s.replace('  <script src="assets/js/atlas.js" defer></script>', '  <script src="assets/js/road-traps.js" defer></script>\n  <script src="assets/js/atlas.js" defer></script>\n  <script src="assets/js/trap-engine.js" defer></script>')
s=s.replace('REFERENCE ATLAS <b>01</b>', 'GPS TRAP EDITION <b>01.1</b>')
s=s.replace('KNOW THE ROAD.<br><em>BEFORE THE ROAD KNOWS YOU.</em>', 'BEYOND THE GPS.<br><em>KNOW WHERE YOUR SEMI CANNOT GO.</em>')
s=s.replace('A visual intelligence map of U.S. tractor-trailer routing restrictions, clearance risks, mountain-road limitations, wind corridors, and high-complexity delivery zones.', 'A visual Class A CDL intelligence atlas identifying truck-restricted roads, low bridges, cramped mountain passes and deceptive GPS shortcuts. Distinguish published rules from route-planning concerns — before approaching a road with no safe turnaround.')
s=s.replace('        <div class="stat"><span class="stat-icon blue">▦</span><strong id="stat-planning">50</strong><small>PLANNING ZONES</small></div>', '        <div class="stat"><span class="stat-icon blue">▦</span><strong id="stat-planning">50</strong><small>PLANNING ZONES</small></div>\n        <div class="stat"><span class="stat-icon gps-orange">⚠</span><strong id="stat-gps">30</strong><small>GPS TRAP ROADS</small></div>')
s=s.replace('          <div class="map-topbar-status"><span class="pulse-mini"></span><span>OFFLINE REFERENCE · NOT LIVE</span></div>', '          <div class="map-topbar-status"><span class="pulse-mini"></span><span>REFERENCE · NOT LIVE</span></div>')
s=s.replace('        <div class="filters" aria-label="Map category filters">', '''        <div class="gps-alert-strip"><span class="gps-alert-icon">⚠</span><span><strong>GPS TRAP ROADS LAYER</strong><small>30 authority-sourced road profiles, including narrow mountain passes and prohibited truck parkways. Diagram traces are approximate — never a driving route.</small></span><a href="#gps-trap-studio">EXPLORE ROADS ↘</a></div>
        <div class="filters" aria-label="Map category filters">''')
s=s.replace('              <g id="map-markers"></g>', '              <g id="map-trap-lines" aria-label="Schematic trap-road highlights"></g>\n              <g id="map-markers"></g>\n              <g id="map-trap-markers" aria-label="GPS problem road markers"></g>')
s=s.replace('SCHEMATIC  ·  NOT FOR NAVIGATION', 'ROAD TRACES SCHEMATIC · DO NOT NAVIGATE')
s=s.replace('<span class="layer-label">MAP LAYERS</span>', '<span class="layer-label">MAP LAYERS</span><label class="toggle-chip gps-toggle"><input type="checkbox" id="layer-gps-traps" checked><span class="toggle-indicator"></span><b>GPS TRAP ROADS</b></label>')
s=s.replace('marker locations are approximate. The heat layer', 'marker locations and road highlights are approximate. Road traces are not centerlines. The heat layer')
s=s.replace('        <div class="list-head"><div><b>LOCATIONS IN VIEW</b>', '        <div id="gps-mini-panel" class="gps-mini-panel"><span class="gps-mini-title">⚠ GPS TRAP FOCUS</span><strong id="gps-mini-name">Choose an orange road marker</strong><small id="gps-mini-status">Official-source road profiles · not GPS error incident reports</small><a href="#gps-trap-studio">Explore all 30 road profiles ↗</a></div>\n        <div class="list-head"><div><b>LOCATIONS IN VIEW</b>')
s=s.replace('    <section class="bottom-band"', '''    <section id="gps-trap-studio" class="gps-studio" aria-label="Roads that can mislead ordinary GPS navigation">
      <div class="gps-heading"><div><div class="eyebrow"><span class="tiny-line"></span> ROUTING CONFLICT INTELLIGENCE / SOURCE-REFERENCED</div><h2>THE ROADS AN ORDINARY GPS<br><em>DOESN’T KNOW YOUR TRUCK CAN’T TAKE.</em></h2><p>Click a highlighted route to investigate the underlying restriction, the driver-facing failure mode, and what needs to be verified. These are <strong>potential passenger-GPS mismatch traps</strong>, not evidence that any named GPS provider currently generates a wrong route.</p></div><div class="gps-heading-count"><span>30</span><small>ROAD PROFILES<br>15 STATES</small></div></div>
      <div class="gps-pillars" aria-label="Three road risk illustrations">
        <div class="gps-pillar"><span class="gps-pillar-icon">↕</span><div><strong>LOW BRIDGE / FALSE CLEARANCE</strong><small>Boston’s river roads can have bridge clearances far below a typical semi’s height.</small></div><span class="gps-pillar-n">01</span></div>
        <div class="gps-pillar"><span class="gps-pillar-icon">⌁</span><div><strong>NARROW CURVES / NO TURNAROUND</strong><small>A short mountain route may have combination length restrictions and tight hairpins.</small></div><span class="gps-pillar-n">02</span></div>
        <div class="gps-pillar"><span class="gps-pillar-icon">⊘</span><div><strong>RESTRICTED TRUCK CORRIDOR</strong><small>Highway-looking parkways, tunnels and bridges may ban specific trucks or cargo.</small></div><span class="gps-pillar-n">03</span></div>
      </div>
      <div class="gps-toolgrid">
        <section class="gps-catalog" aria-label="GPS trap road library">
          <div class="gps-tool-head"><div><small>30 NAMED ROAD SEGMENTS</small><h3>Road conflict explorer</h3></div><span class="gps-led"></span></div>
          <div class="gps-filterbar"><input type="search" id="trap-search" placeholder="Search road, state, city or issue…" aria-label="Search road trap profiles"><select id="trap-category" aria-label="Filter problem type"><option value="all">All problem types</option><option value="access">Restricted road</option><option value="clearance">Low bridge</option><option value="geometry">Narrow / length / turning</option><option value="weight">Weight restrictions</option><option value="hazmat">Hazmat routing</option><option value="weather">Conditional weather</option></select></div>
          <div class="gps-catalog-summary"><span id="trap-results">30 roads listed</span><button type="button" id="trap-clear">RESET FILTERS</button></div>
          <div id="trap-list" class="trap-list" aria-live="polite"></div>
        </section>
        <section class="gps-inspector" id="gps-inspector" aria-label="Road restriction detail">
          <div class="gps-tool-head"><div><small>SAFETY INTELLIGENCE PANEL</small><h3>Road restriction briefing</h3></div><span class="inspector-hex">⬡</span></div>
          <div id="gps-detail" class="gps-detail" aria-live="polite"></div>
          <div class="vehicle-profile"><div class="vehicle-head"><strong>CLASS A VEHICLE PROFILE COMPARISON</strong><small>Planning comparison only · not permission to travel</small></div><div class="vehicle-form">
            <label>Overall length (ft)<input id="truck-length" type="number" min="10" max="150" step="0.5" value="73"></label>
            <label>Vehicle height (ft)<input id="truck-height" type="number" min="6" max="22" step="0.1" value="13.5"></label>
            <label>Gross weight (lb)<input id="truck-weight" type="number" min="1000" max="200000" step="1000" value="80000"></label>
            <label>KPRA (ft)<input id="truck-kpra" type="number" min="5" max="65" step="0.5" value="41"></label>
          </div><div class="vehicle-result" id="vehicle-result" aria-live="polite"></div></div>
        </section>
      </div>
      <div class="gps-accuracy"><strong>IMPORTANT MAP LIMITATION</strong><p>All orange highlighted road traces and markers are schematic regional references, not legal route geometry or verified GPS guidance. These entries summarize government-published restrictions and operating conditions, but do not prove that a particular GPS product will send a truck there. Temporary conditions change. Vehicle configuration, route segments, signed exceptions, hazmat classifications and jurisdictional rules require authoritative checks before driving. Neither the map nor its profile comparison can certify a road as safe or legal.</p></div>
    </section>
    <section class="bottom-band"''')
s=s.replace('<span><i class="legend-ring"></i> Grouped markers (zoom to expand)</span>', '<span><i class="legend-ring"></i> Grouped markers (zoom to expand)</span><span><i class="legend-dot gps"></i> GPS conflict road profile</span>')
s=s.replace('Static map edition v1.0 · No quizzes · No live traffic · No route authorization','GPS trap edition v1.1 · No quizzes · No live traffic · No route authorization')
p.write_text(s)
q=Path(__file__).resolve().parents[1]/'assets/js/atlas.js'
s=q.read_text()
s=s.replace("const zoomComp=1/zoom; // marker sizes remain fairly consistent when zooming", "const zoomComp=1/zoom; // marker sizes remain fairly consistent when zooming")
s=s.replace("   drawMarkers();renderList();\n }\n function zoomAt", "   drawMarkers();renderList();window.dispatchEvent(new CustomEvent('atlas:camera',{detail:{x:camera.x,y:camera.y,w:camera.w,h:camera.h,zoom}}));\n }\n function zoomAt")
s=s.replace("window.ATLAS_TEST_API={getFiltered:", "window.ATLAS_TEST_API={focusPoint:(x,y,zoomTarget=3)=>focusPoint(x,y,zoomTarget),getCamera:()=>({...camera,zoom}),getFiltered:")
s=s.replace("e.target.closest('.map-marker,.cluster')", "e.target.closest('.map-marker,.cluster,.trap-marker,.trap-cluster')")
p=q.write_text(s)
