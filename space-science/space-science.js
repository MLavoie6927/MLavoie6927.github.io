(function(){
  "use strict";
  var data=window.SPACE_SCIENCE_CATALOG;
  if(!data||!Array.isArray(data.divisions)||!Array.isArray(data.subjects)){throw new Error("Space Science catalog data is unavailable.");}
  if(data.divisions.length!==26||data.subjects.length!==650){throw new Error("Expected 26 divisions and 650 Space Science subjects.");}

  var PDF_FILE="complete-encyclopedia-space-science-aerospace-engineering-2026.pdf";
  var clusterColors=["#4fe7ff","#9b8cff","#55e8bd","#ffc85a","#ff6d8d","#71a7ff","#69e0de"];
  var treatmentNames=["Field guide","Physics + mathematics","Materials + fabrication","Architecture + trade study","Safety + verification","People + economics","Operations + case study","Worked engineering problem"];
  var divisionGrid=document.getElementById("division-grid");
  var subjectGrid=document.getElementById("subject-grid");
  var search=document.getElementById("subject-search");
  var divisionFilter=document.getElementById("division-filter");
  var count=document.getElementById("subject-count");
  var context=document.getElementById("catalog-context");
  var empty=document.getElementById("subject-empty");
  var selectedSubject=data.subjects[0];

  function escapeText(value){return String(value).replace(/[&<>"']/g,function(character){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character];});}
  function divisionFor(id){return data.divisions[id-1];}
  function clusterFor(division){if(division<=4)return 0;if(division<=9)return 1;if(division<=15)return 2;if(division<=18)return 3;if(division<=21)return 4;if(division<=24)return 5;return 6;}

  function renderDivisions(){
    divisionGrid.innerHTML=data.divisions.map(function(item){
      return '<button class="division-card" type="button" data-division="'+item.id+'" style="--cluster-color:'+clusterColors[clusterFor(item.id)]+'"><span>DIVISION '+item.code+' · PAGE '+item.page.toLocaleString()+'</span><strong>'+escapeText(item.title)+'</strong><small>25 subjects · 200 technical pages →</small></button>';
    }).join("");
    divisionFilter.innerHTML='<option value="all">All 26 divisions</option>'+data.divisions.map(function(item){return '<option value="'+item.id+'">'+item.code+' · '+escapeText(item.title)+'</option>';}).join("");
  }

  function renderSubjects(){
    var query=(search.value||"").trim().toLowerCase();
    var selected=divisionFilter.value;
    var visible=data.subjects.filter(function(item){
      var matchesDivision=selected==="all"||String(item.division)===selected;
      var division=divisionFor(item.division);
      var searchable=(item.id+" "+item.title+" "+division.title).toLowerCase();
      return matchesDivision&&(!query||searchable.indexOf(query)!==-1);
    });
    subjectGrid.innerHTML=visible.map(function(item){
      var division=divisionFor(item.division);
      return '<article class="subject-card" style="--cluster-color:'+clusterColors[clusterFor(item.division)]+'"><div class="subject-meta"><span>'+escapeText(item.id)+'</span><span>PAGES '+item.page.toLocaleString()+'–'+item.endPage.toLocaleString()+'</span></div><h3>'+escapeText(item.title)+'</h3><p>Division '+division.code+' · '+escapeText(division.title)+'</p><button type="button" data-subject-id="'+escapeText(item.id)+'">Open complete eight-page module →</button></article>';
    }).join("");
    count.textContent=visible.length+(visible.length===1?" subject":" subjects");
    if(selected!=="all"){context.textContent="Division "+divisionFor(Number(selected)).code+" · "+divisionFor(Number(selected)).title;}else if(query){context.textContent="Search results across the complete 650-subject catalog.";}else{context.textContent="Complete coverage across 26 divisions.";}
    empty.hidden=visible.length!==0;
  }

  function renderSelectedSubject(){
    document.getElementById("selected-subject").textContent=selectedSubject.id+" · "+selectedSubject.title;
    document.getElementById("selected-range").textContent="Pages "+selectedSubject.page.toLocaleString()+"–"+selectedSubject.endPage.toLocaleString();
    document.getElementById("treatment-buttons").innerHTML=treatmentNames.map(function(name,index){return '<button type="button" data-treatment="'+index+'"'+(index===0?' class="is-active"':'')+'>'+(index+1)+" · "+escapeText(name)+'</button>';}).join("");
  }

  function openReaderPage(page,scroll){
    var bounded=Math.max(1,Math.min(5294,Number(page)||1));
    document.getElementById("reader-page").value=bounded;
    document.getElementById("reader-current").textContent=bounded.toLocaleString();
    document.getElementById("pdf-frame").src=PDF_FILE+"#page="+bounded+"&view=FitH";
    if(scroll){document.getElementById("reader").scrollIntoView({behavior:"smooth",block:"start"});}
  }

  divisionGrid.addEventListener("click",function(event){var button=event.target.closest("[data-division]");if(!button)return;divisionFilter.value=button.getAttribute("data-division");search.value="";renderSubjects();document.getElementById("catalog").scrollIntoView({behavior:"smooth",block:"start"});});
  search.addEventListener("input",renderSubjects);
  divisionFilter.addEventListener("change",renderSubjects);
  document.getElementById("clear-catalog").addEventListener("click",function(){search.value="";divisionFilter.value="all";renderSubjects();search.focus();});
  subjectGrid.addEventListener("click",function(event){var button=event.target.closest("[data-subject-id]");if(!button)return;selectedSubject=data.subjects.find(function(item){return item.id===button.getAttribute("data-subject-id");})||data.subjects[0];renderSelectedSubject();openReaderPage(selectedSubject.page,true);});
  document.getElementById("treatment-buttons").addEventListener("click",function(event){var button=event.target.closest("[data-treatment]");if(!button)return;var offset=Number(button.getAttribute("data-treatment"));document.querySelectorAll("[data-treatment]").forEach(function(candidate){candidate.classList.toggle("is-active",candidate===button);});openReaderPage(selectedSubject.page+offset,false);});
  document.querySelectorAll("[data-reader-page]").forEach(function(button){button.addEventListener("click",function(){openReaderPage(button.getAttribute("data-reader-page"),true);});});
  document.getElementById("reader-form").addEventListener("submit",function(event){event.preventDefault();openReaderPage(document.getElementById("reader-page").value,false);});

  var altitude=document.getElementById("altitude-input");
  function updateOrbit(){var altitudeKm=Number(altitude.value);var radius=6378137+altitudeKm*1000;var mu=3.986004418e14;var speed=Math.sqrt(mu/radius)/1000;var period=2*Math.PI*Math.sqrt(Math.pow(radius,3)/mu)/60;document.getElementById("altitude-output").textContent=altitudeKm.toLocaleString()+" km";document.getElementById("orbit-speed").textContent=speed.toFixed(2)+" km/s";document.getElementById("orbit-period").textContent=period.toFixed(1)+" min";var visualSize=250+Math.min(125,Math.log10(altitudeKm/160+1)*100);document.getElementById("orbit-ring").style.width=visualSize+"px";document.getElementById("orbit-ring").style.height=visualSize+"px";}
  altitude.addEventListener("input",updateOrbit);

  var toggle=document.getElementById("space-menu-toggle");var menu=document.getElementById("space-menu");
  function closeMenu(){toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open Space Science navigation");menu.classList.remove("is-open");}
  toggle.addEventListener("click",function(){var open=toggle.getAttribute("aria-expanded")==="true";toggle.setAttribute("aria-expanded",String(!open));toggle.setAttribute("aria-label",open?"Open Space Science navigation":"Close Space Science navigation");menu.classList.toggle("is-open",!open);});
  menu.addEventListener("click",function(event){if(event.target.closest("a"))closeMenu();});document.addEventListener("keydown",function(event){if(event.key==="Escape")closeMenu();});document.addEventListener("click",function(event){if(!menu.contains(event.target)&&!toggle.contains(event.target))closeMenu();});

  renderDivisions();renderSubjects();renderSelectedSubject();updateOrbit();
}());
