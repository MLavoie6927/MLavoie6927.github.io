(() => {
  "use strict";
  const base = window.GlassMeridianBase;
  if (!base) return;
  const root = document.getElementById("glass-meridian-lab");
  if (!root) return;
  const qs = (s,c=root)=>c.querySelector(s);
  const qsa = (s,c=root)=>[...c.querySelectorAll(s)];
  const esc = (v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const nowId = p => `${p}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  const state = () => base.getState();
  const save = () => { const el=qs("#gm-v4-save-status"); if(el){el.textContent="Saving…";el.classList.add("is-saving");} base.saveState(); if(el){clearTimeout(save.t);save.t=setTimeout(()=>{el.textContent="Saved locally";el.classList.remove("is-saving")},250);} };
  const toast = m => base.toast(m);

  const biasDefs = [
    ["confirmation","Confirmation bias","Overweighting evidence that supports the preferred hypothesis."],
    ["anchoring","Anchoring","Remaining too close to the initial estimate after new reporting arrives."],
    ["mirror","Mirror imaging","Assuming Norland evaluates risk and signaling as Estavia would."],
    ["availability","Availability bias","Overweighting vivid cyberattacks, viral video, or dramatic documents."],
    ["recency","Recency bias","Treating newly discovered reporting as more important simply because it is new to the analyst."],
    ["groupthink","Groupthink","Suppressing disagreement to preserve team consensus."],
    ["closure","Premature closure","Stopping hypothesis testing once one explanation appears sufficient."],
    ["politicization","Politicization","Allowing policymaker preferences to shape the estimate."],
    ["overconfidence","Overconfidence","Expressing greater certainty than source access and evidence justify."]
  ];
  const rubric = [
    ["decision","Intelligence Question & Decision Relevance",10], ["evidence","Evidence & Source Evaluation",15],
    ["sat","Structured Analytic Techniques",20], ["alternatives","Alternative Hypotheses",15],
    ["warning","Indicators & Warning",10], ["collection","Intelligence Gaps & Collection",10],
    ["integrity","Cognitive Bias & Analytic Integrity",10], ["writing","Intelligence Writing",10]
  ];
  const injects = [
    ["07:32","GEOINT / Logistics","Ammunition train moves west","Commercial imagery and rail reporting identify a westbound ammunition train. Follow-on tracking indicates roughly 40% of the cars are routed toward the established exercise range while the remainder continue toward western depots.","Concern rises, but destination ambiguity prevents immediate classification as combat-load distribution."],
    ["07:36","Diplomatic","Voluntary departure guidance","Norland's embassy quietly advises dependents that voluntary departure is available. The embassy remains open and no mandatory evacuation order is issued.","More concerning than normal posture, but weaker than mandatory evacuation."],
    ["07:41","CYBINT","Destructive tooling staged","Estavian defenders identify a wiper module staged inside one compromised energy-sector network. No execution command or detonation mechanism is observed.","Narrows the gap between persistent access and potential destructive action."],
    ["07:45","Military / Personnel","Reserve availability checks","Several reserve officers report requests to confirm contact information and 72-hour availability. No formal mobilization orders are confirmed.","Potential preparatory step, but materially weaker than reserve activation."],
    ["07:50","GEOINT","Engineering convoy splits","Bridging and engineering vehicles disperse toward two routes associated with Rovan River crossing sites.","Geographic specificity increases the value of previously dual-use bridging evidence."],
    ["07:54","Diplomatic / HUMINT","Backchannel ultimatum","A trusted diplomatic source reports that Norland privately demanded autonomy negotiations by 18:00 or face measures that cannot be reversed. The source lacks direct visibility into military orders.","Strengthens coercive intent while preserving both negotiated and limited-force pathways."]
  ];
  const paperSections = [
    ["executive","1. Executive Intelligence Assessment",500,"Principal judgment, confidence, 2–4 supporting judgments, strongest alternative, and indicators that would change the assessment."],
    ["context","2. Intelligence Question and Decision Context",700,"Decision requirement, relevance, time horizon, and limits of intelligence."],
    ["environment","3. Intelligence Environment",700,"Only political, military, cyber, economic, geographic, diplomatic, and information context relevant to the PIQ."],
    ["collection","4. Collection and Source Evaluation",900,"INT disciplines, reliability, credibility, access, corroboration, lineage, deception risk, timeliness, and gaps."],
    ["ach","5. Analysis of Competing Hypotheses",900,"ACH findings, diagnostic evidence, inconsistencies, missing indicators, and deceptive reporting."],
    ["warning","6. Indicators and Warning Framework",650,"Early warning, operational warning, confirmation, escalation, and de-escalation indicators."],
    ["bias","7. Cognitive Bias and Analytic Risk",550,"At least four analytic failure modes and how structured analysis mitigates them."],
    ["gaps","8. Intelligence Gaps and Collection Strategy",700,"Decision-relevant gaps, appropriate INTs, realistic collection opportunities, indicators, and impact."],
    ["final","9. Final Assessment",700,"Most likely outcome, alternative, confidence, warning, implications, and reconsideration conditions."]
  ];

  function ensure(){
    const s=state();
    s.v4Evidence ??= {};
    s.v4AchWeights ??= {};
    s.v4Assumptions ??= [{id:"a-1",text:"Norland's western posture reflects genuine operational preparation rather than purely theatrical signaling.",importance:"High",support:"Multiple independent physical and logistical indicators.",contradiction:"Exercise explanations remain plausible for several individual indicators.",consequence:"If false, H1 or H4 would strengthen substantially.",test:"Look for costly, operationally necessary enabling activity beyond historical exercise norms."}];
    s.v4Biases ??= {};
    s.v4RedTeam ??= {falseInvasion:"",hiddenOperation:"",costly:"",hardToHide:"",challenge:""};
    s.v4Futures ??= {
      f1:{title:"Negotiated coercive settlement",probability:30,signposts:"",implications:""},
      f2:{title:"Limited cross-border operation",probability:45,signposts:"",implications:""},
      f3:{title:"Large-scale conventional invasion",probability:15,signposts:"",implications:""},
      f4:{title:"De-escalation / exercise termination",probability:10,signposts:"",implications:""}
    };
    s.v4InjectsReleased ??= 0; s.v4InjectNotes ??= {};
    s.v4DecisionLog ??= []; s.v4Rubric ??= {}; s.v4Paper ??= {}; s.v4Research ??= [];
  }
  ensure(); save();

  const reportMeta = id => (state().v4Evidence[id] ??= {pinned:false,relevance:"Moderate",disposition:"Unresolved",rationale:""});
  const reviewedCount=()=>Object.values(state().reviewed||{}).filter(Boolean).length;
  const classifiedCount=()=>Object.keys(state().evidenceClass||{}).length;
  const substantialQuestions=()=>Object.values(state().questionResponses||{}).filter(v=>String(v||"").trim().length>=25).length;
  const wordCount=t=>String(t||"").trim().split(/\s+/).filter(Boolean).length;

  function renderEvidence(){
    const body=qs("#gm-v4-evidence-body"); if(!body)return;
    body.innerHTML=base.reports.map(r=>{const m=reportMeta(r.id);return `<tr>
      <td><input class="gm-v4-pin" type="checkbox" data-v4-pin="${r.id}" ${m.pinned?"checked":""}></td>
      <td><button class="gm-btn" type="button" data-v4-open="${r.id}">File ${String(r.id).padStart(2,"0")}</button></td>
      <td>${esc(r.family)}</td><td><strong>${esc(r.title)}</strong><br><small>${esc(r.summary)}</small></td>
      <td><select data-v4-meta="${r.id}:relevance">${["Low","Moderate","High","Critical"].map(v=>`<option ${v===m.relevance?"selected":""}>${v}</option>`).join("")}</select></td>
      <td><select data-v4-meta="${r.id}:disposition">${["Unresolved","Supports principal judgment","Supports alternative","Contradicts principal judgment","Deception concern","Background / low value"].map(v=>`<option ${v===m.disposition?"selected":""}>${v}</option>`).join("")}</select></td>
      <td><textarea rows="3" data-v4-rationale="${r.id}" placeholder="Why does this evidence matter?">${esc(m.rationale)}</textarea></td></tr>`}).join("");
  }

  function renderAchWeights(){
    const table=qs(".gm-ach-table"); if(!table)return;
    const head=table.querySelector("thead tr");
    if(head && !head.querySelector("[data-v4-weight-head]")){
      const th=document.createElement("th"); th.textContent="Weight"; th.dataset.v4WeightHead="1"; head.insertBefore(th,head.children[1]);
    }
    [...table.querySelectorAll("tbody tr")].forEach((tr,i)=>{
      if(tr.querySelector("[data-v4-weight-cell]"))return;
      const td=document.createElement("td"); td.dataset.v4WeightCell="1";
      td.innerHTML=`<select class="gm-v4-ach-weight" data-v4-ach-weight="${i}">${[1,2,3,4,5].map(w=>`<option value="${w}" ${Number(state().v4AchWeights[i]||3)===w?"selected":""}>${w}</option>`).join("")}</select>`;
      tr.insertBefore(td,tr.children[1]);
    });
  }

  function renderAssumptions(){
    const w=qs("#gm-v4-assumptions"); if(!w)return;
    w.innerHTML=state().v4Assumptions.map((a,i)=>`<article class="gm-v4-assumption" data-v4-assumption-card="${esc(a.id)}"><div class="gm-gap-head"><span class="gm-label">Assumption ${i+1}</span><button class="gm-btn" type="button" data-v4-del-assumption="${esc(a.id)}">Remove</button></div><div class="gm-v4-fields">
      <label class="gm-v4-span2"><span>Assumption</span><textarea rows="3" data-v4-assumption="text">${esc(a.text)}</textarea></label>
      <label><span>Importance</span><select data-v4-assumption="importance">${["Critical","High","Moderate","Low"].map(v=>`<option ${v===a.importance?"selected":""}>${v}</option>`).join("")}</select></label>
      <label><span>Collection / test</span><textarea rows="3" data-v4-assumption="test">${esc(a.test)}</textarea></label>
      <label class="gm-v4-span2"><span>Supporting evidence</span><textarea rows="3" data-v4-assumption="support">${esc(a.support)}</textarea></label>
      <label class="gm-v4-span2"><span>Contradicting evidence</span><textarea rows="3" data-v4-assumption="contradiction">${esc(a.contradiction)}</textarea></label>
      <label class="gm-v4-span2"><span>If false, what changes?</span><textarea rows="3" data-v4-assumption="consequence">${esc(a.consequence)}</textarea></label>
    </div></article>`).join("");
    const b=qs("#gm-v4-biases"); if(b)b.innerHTML=biasDefs.map(([id,t,d])=>`<article class="gm-v4-bias"><span class="gm-label">${esc(t)}</span><p class="gm-muted-text">${esc(d)}</p><label><span>Case-specific risk and mitigation</span><textarea rows="4" data-v4-bias="${id}">${esc(state().v4Biases[id]||"")}</textarea></label></article>`).join("");
  }

  function renderRedTeam(){qsa("[data-v4-redteam]").forEach(e=>e.value=state().v4RedTeam[e.dataset.v4Redteam]||"");}

  function renderFutures(){
    const w=qs("#gm-v4-futures");if(!w)return;
    w.innerHTML=Object.entries(state().v4Futures).map(([id,f])=>`<article class="gm-v4-future" data-v4-future-card="${esc(id)}"><span class="gm-label">Alternative Future</span><h4>${esc(f.title)}</h4><label><span>Probability</span><div class="gm-v4-prob-row"><input type="range" min="0" max="100" value="${Number(f.probability)||0}" data-v4-future-prob="${esc(id)}"><strong data-v4-future-label="${esc(id)}">${Number(f.probability)||0}%</strong></div></label><label><span>Observable signposts</span><textarea rows="5" data-v4-future-field="signposts">${esc(f.signposts)}</textarea></label><label><span>Decision implications</span><textarea rows="5" data-v4-future-field="implications">${esc(f.implications)}</textarea></label></article>`).join("");
  }

  function renderInjects(){
    const n=Number(state().v4InjectsReleased||0); const p=qs("#gm-v4-inject-progress"); if(p)p.textContent=`${n} / ${injects.length} released`;
    const w=qs("#gm-v4-injects");if(!w)return;
    w.innerHTML=injects.map((x,i)=>{const open=i<n;return `<article class="gm-v4-inject ${open?"":"is-locked"}"><span class="gm-label">${open?esc(x[0]+" · "+x[1]):"CLASSIFIED INJECT · NOT RELEASED"}</span><h4>${open?esc(x[2]):`Inject ${i+1} locked`}</h4><p>${open?esc(x[3]):"Release sequentially to preserve the exercise."}</p>${open?`<div class="gm-analyst-note"><strong>Diagnostic note:</strong><br>${esc(x[4])}</div><textarea rows="4" data-v4-inject-note="${i}" placeholder="How does this change—or fail to change—your assessment?">${esc(state().v4InjectNotes[i]||"")}</textarea>`:""}</article>`}).join("");
  }

  function renderPaper(){
    const w=qs("#gm-v4-paper-sections");if(!w)return;
    w.innerHTML=paperSections.map(([id,title,target,prompt])=>{const text=state().v4Paper[id]||"";const wc=wordCount(text);return `<article class="gm-v4-paper-section"><div class="gm-section-meta"><span>${esc(title)}</span><span class="${id==="executive"&&wc>500?"is-over":""}" data-v4-section-count="${id}">${wc}${id==="executive"?" / 500 max":" words"}</span></div><p class="gm-muted-text">${esc(prompt)}</p><textarea rows="12" data-v4-paper="${id}">${esc(text)}</textarea></article>`}).join("");
    const total=Object.values(state().v4Paper).reduce((n,t)=>n+wordCount(t),0); const totalEl=qs("#gm-v4-paper-total"); if(totalEl)totalEl.textContent=`${total} words`;
    const bar=qs("#gm-v4-paper-bar"); if(bar)bar.style.width=`${Math.min(100,Math.round(total/6000*100))}%`;
  }

  function renderResearch(){
    const list=qs("#gm-v4-research-list");if(!list)return;
    const sources=state().v4Research; const count=qs("#gm-v4-research-count");if(count)count.textContent=`${sources.length} / 12 sources`; const bar=qs("#gm-v4-research-bar");if(bar)bar.style.width=`${Math.min(100,Math.round(sources.length/12*100))}%`;
    list.innerHTML=sources.map((s,i)=>`<article class="gm-v4-research-source" data-v4-source-card="${esc(s.id)}"><div class="gm-gap-head"><div><span class="gm-label">Academic / Professional Source ${i+1}</span><h4>${esc(s.title||"Untitled source")}</h4></div><button class="gm-btn" type="button" data-v4-del-source="${esc(s.id)}">Remove</button></div><div class="gm-v4-research-grid">
      <label><span>Author / organization</span><input data-v4-source-field="author" value="${esc(s.author||"")}"></label><label><span>Year</span><input data-v4-source-field="year" value="${esc(s.year||"")}"></label><label><span>Source type</span><input data-v4-source-field="type" value="${esc(s.type||"")}" placeholder="Book, journal, doctrine, government report"></label>
      <label class="wide"><span>Title</span><input data-v4-source-field="title" value="${esc(s.title||"")}"></label><label class="wide"><span>URL / DOI / publication</span><input data-v4-source-field="locator" value="${esc(s.locator||"")}"></label><label class="wide"><span>APA 7 citation</span><textarea rows="3" data-v4-source-field="apa">${esc(s.apa||"")}</textarea></label><label class="wide"><span>How this source supports the paper</span><textarea rows="3" data-v4-source-field="relevance">${esc(s.relevance||"")}</textarea></label>
    </div></article>`).join("") || `<div class="gm-panel"><p>No academic sources entered yet. The assignment requires at least twelve.</p></div>`;
  }

  function renderDecision(){const w=qs("#gm-v4-decision-list");if(!w)return;const a=[...state().v4DecisionLog].reverse();w.innerHTML=a.map(e=>`<article class="gm-v4-log"><div class="gm-v4-log-meta"><span>${esc(new Date(e.time).toLocaleString())}</span><span>${esc(e.h)}</span><span>${esc(e.dir)}</span><span>${esc(e.files||"No file refs")}</span></div><p>${esc(e.reason)}</p><button class="gm-btn" type="button" data-v4-del-log="${esc(e.id)}">Remove</button></article>`).join("")||`<div class="gm-panel"><p>No decision-log entries yet.</p></div>`;}

  function qualityChecks(){
    const s=state(), ach=Object.values(s.ach||{}).filter(v=>v&&v!=="—"); const paperTotal=Object.values(s.v4Paper||{}).reduce((n,t)=>n+wordCount(t),0);
    return [
      [reviewedCount()>=24,"At least 24 of 30 intelligence files reviewed."],
      [classifiedCount()>=20,"At least 20 evidence items explicitly classified as Known/Assessed/Assumed/Uncertain/Unknowable."],
      [ach.length>=30,"ACH contains enough populated judgments to expose competing explanations."],
      [ach.some(v=>String(v).toLowerCase().includes("inconsistent")),"ACH contains explicit inconsistent evidence instead of support-only counting."],
      [state().v4Assumptions.length>=3,"At least three key assumptions are explicit."],
      [Object.values(s.v4Biases).filter(v=>String(v).trim().length>=25).length>=4,"At least four cognitive biases have case-specific mitigation notes."],
      [String(s.v4RedTeam.challenge||"").trim().length>=100,"A substantive red-team challenge attacks the preferred judgment."],
      [(s.gaps||[]).filter(g=>["Critical","High"].includes(g.priority)).length>=2,"At least two critical/high collection gaps are prioritized by decision value."],
      [Object.values(s.indicators||{}).filter(Boolean).length>=3,"Multiple warning indicators have been evaluated as observed."],
      [s.assessmentHistory?.length>=1,"At least one probability assessment checkpoint is locked."],
      [String(s.finalAssessment?.falsification||"").trim().length>=60,"Falsification conditions are explicit."],
      [s.v4Research.length>=12,"At least twelve scholarly/professional sources are tracked."],
      [paperTotal>=4000&&paperTotal<=6000,"Graduate paper is within the 4,000–6,000 word target."],
      [wordCount(s.v4Paper.executive||"")<=500&&wordCount(s.v4Paper.executive||"")>100,"Executive Intelligence Assessment is substantive and no longer than 500 words."]
    ];
  }
  function publicationScore(){const c=qualityChecks();return Math.round(c.filter(x=>x[0]).length/c.length*100)}
  function renderQuality(){
    const c=qualityChecks();const f=qs("#gm-v4-quality-flags");if(f)f.innerHTML=c.map(([p,t])=>`<div class="gm-v4-quality-flag ${p?"pass":"warn"}"><span>${p?"✓":"!"}</span><span>${esc(t)}</span></div>`).join("");
    const score=publicationScore(),pub=qs("#gm-v4-publication");if(pub)pub.innerHTML=`<div class="gm-v4-publication-score">${score}%</div><p class="gm-muted-text">${score>=85?"Ready for senior review":score>=65?"Substantive draft; tradecraft gaps remain":"Not yet ready to brief"}</p>`;
    const r=qs("#gm-v4-rubric");if(r)r.innerHTML=rubric.map(([id,t,max])=>`<div class="gm-v4-rubric-row"><span>${esc(t)}</span><input type="number" min="0" max="${max}" value="${Number(state().v4Rubric[id]||0)}" data-v4-rubric="${id}"><span>/ ${max}</span></div>`).join("");
    const total=rubric.reduce((n,[id,t,max])=>n+Math.min(max,Math.max(0,Number(state().v4Rubric[id]||0))),0),te=qs("#gm-v4-rubric-total");if(te)te.textContent=total;
    const mini=qs("#gm-v4-dashboard-quality");if(mini){const fails=c.filter(x=>!x[0]).slice(0,4);mini.innerHTML=fails.length?fails.map(x=>`<div class="gm-v4-mini-item">! ${esc(x[1])}</div>`).join(""):`<div class="gm-v4-mini-item">✓ No major automated tradecraft flags.</div>`;}
  }

  function renderDashboard(){
    const pinned=base.reports.filter(r=>reportMeta(r.id).pinned),pw=qs("#gm-v4-dashboard-pinned");if(pw)pw.innerHTML=pinned.length?pinned.slice(0,7).map(r=>`<div class="gm-v4-mini-item"><strong>File ${String(r.id).padStart(2,"0")}</strong> · ${esc(r.title)} · ${esc(reportMeta(r.id).relevance)}</div>`).join(""):`<div class="gm-v4-mini-item">No evidence pinned yet.</div>`;
    const s=state(); const complete={collect:reviewedCount()>=24,evaluate:classifiedCount()>=20&&Object.keys(s.sourceMatrix||{}).length>=20,analyze:Object.values(s.ach||{}).filter(v=>v&&v!=="—").length>=30&&s.v4Assumptions.length>=3,challenge:String(s.v4RedTeam.challenge||"").trim().length>=100,task:(s.gaps||[]).filter(g=>["Critical","High"].includes(g.priority)).length>=2,warn:Object.values(s.indicators||{}).filter(Boolean).length>=3,judge:s.assessmentHistory?.length>=1,brief:Object.values(s.finalAssessment||{}).filter(v=>String(v).trim().length>=40).length>=5};
    qsa("[data-v4-workflow]").forEach(e=>e.classList.toggle("is-complete",!!complete[e.dataset.v4Workflow]));
  }

  function refresh(){ensure();renderEvidence();renderAchWeights();renderAssumptions();renderRedTeam();renderFutures();renderInjects();renderPaper();renderResearch();renderDecision();renderQuality();renderDashboard();}
  window.GlassMeridianV4={refresh};

  root.addEventListener("click",e=>{
    const open=e.target.closest("[data-v4-open]");if(open)base.openReport(open.dataset.v4Open);
    const delA=e.target.closest("[data-v4-del-assumption]");if(delA){state().v4Assumptions=state().v4Assumptions.filter(a=>a.id!==delA.dataset.v4DelAssumption);save();refresh();}
    const delS=e.target.closest("[data-v4-del-source]");if(delS){state().v4Research=state().v4Research.filter(s=>s.id!==delS.dataset.v4DelSource);save();refresh();}
    const delL=e.target.closest("[data-v4-del-log]");if(delL){state().v4DecisionLog=state().v4DecisionLog.filter(x=>x.id!==delL.dataset.v4DelLog);save();refresh();}
  });
  root.addEventListener("input",e=>{
    if(e.target.matches("[data-v4-rationale]")){reportMeta(e.target.dataset.v4Rationale).rationale=e.target.value;save();}
    if(e.target.matches("[data-v4-bias]")){state().v4Biases[e.target.dataset.v4Bias]=e.target.value;save();}
    if(e.target.matches("[data-v4-redteam]")){state().v4RedTeam[e.target.dataset.v4Redteam]=e.target.value;save();}
    if(e.target.matches("[data-v4-inject-note]")){state().v4InjectNotes[e.target.dataset.v4InjectNote]=e.target.value;save();}
    if(e.target.matches("[data-v4-paper]")){state().v4Paper[e.target.dataset.v4Paper]=e.target.value;save();renderPaper();renderQuality();}
    if(e.target.matches("[data-v4-rubric]")){state().v4Rubric[e.target.dataset.v4Rubric]=Number(e.target.value);save();renderQuality();}
    if(e.target.matches("[data-v4-future-prob]")){const id=e.target.dataset.v4FutureProb;state().v4Futures[id].probability=Number(e.target.value);const l=qs(`[data-v4-future-label="${id}"]`);if(l)l.textContent=e.target.value+"%";save();}
    if(e.target.matches("[data-v4-future-field]")){const c=e.target.closest("[data-v4-future-card]");state().v4Futures[c.dataset.v4FutureCard][e.target.dataset.v4FutureField]=e.target.value;save();}
    if(e.target.matches("[data-v4-assumption]")){const c=e.target.closest("[data-v4-assumption-card]"),a=state().v4Assumptions.find(x=>x.id===c.dataset.v4AssumptionCard);if(a){a[e.target.dataset.v4Assumption]=e.target.value;save();}}
    if(e.target.matches("[data-v4-source-field]")){const c=e.target.closest("[data-v4-source-card]"),s=state().v4Research.find(x=>x.id===c.dataset.v4SourceCard);if(s){s[e.target.dataset.v4SourceField]=e.target.value;save();}}
  });
  root.addEventListener("change",e=>{
    if(e.target.matches("[data-v4-pin]")){reportMeta(e.target.dataset.v4Pin).pinned=e.target.checked;save();renderDashboard();}
    if(e.target.matches("[data-v4-meta]")){const [id,k]=e.target.dataset.v4Meta.split(":");reportMeta(id)[k]=e.target.value;save();renderDashboard();}
    if(e.target.matches("[data-v4-ach-weight]")){state().v4AchWeights[e.target.dataset.v4AchWeight]=Number(e.target.value);save();}
    if(e.target.matches("[data-v4-assumption]")){const c=e.target.closest("[data-v4-assumption-card]"),a=state().v4Assumptions.find(x=>x.id===c.dataset.v4AssumptionCard);if(a){a[e.target.dataset.v4Assumption]=e.target.value;save();}}
  });

  qs("#gm-v4-add-assumption")?.addEventListener("click",()=>{state().v4Assumptions.push({id:nowId("a"),text:"",importance:"High",support:"",contradiction:"",consequence:"",test:""});save();refresh();});
  qs("#gm-v4-add-source")?.addEventListener("click",()=>{state().v4Research.push({id:nowId("src"),author:"",year:"",type:"",title:"",locator:"",apa:"",relevance:""});save();refresh();});
  qs("#gm-v4-release-inject")?.addEventListener("click",()=>{if(state().v4InjectsReleased<injects.length){state().v4InjectsReleased++;save();refresh();toast(`Inject ${state().v4InjectsReleased} released.`)}else toast("All instructor injects have been released.");});
  qs("#gm-v4-reset-injects")?.addEventListener("click",()=>{state().v4InjectsReleased=0;state().v4InjectNotes={};save();refresh();toast("Instructor injects reset.");});
  qs("#gm-v4-add-log")?.addEventListener("click",()=>{const reason=qs("#gm-v4-log-reason").value.trim();if(!reason){toast("Add reasoning before saving the log entry.");return;}state().v4DecisionLog.push({id:nowId("log"),time:new Date().toISOString(),h:qs("#gm-v4-log-h").value,dir:qs("#gm-v4-log-dir").value,files:qs("#gm-v4-log-files").value.trim(),reason});qs("#gm-v4-log-files").value="";qs("#gm-v4-log-reason").value="";save();refresh();});

  function download(name,text,type){const blob=new Blob([text],{type});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);}
  qs("#gm-v4-export-json")?.addEventListener("click",()=>download(`operation-glass-meridian-workspace-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify({project:"Operation Glass Meridian",version:4,exportedAt:new Date().toISOString(),state:state()},null,2),"application/json"));
  qs("#gm-v4-export-md")?.addEventListener("click",()=>{const s=state(),lines=["# Operation Glass Meridian — Intelligence Product","",`Exported: ${new Date().toLocaleString()}`,"","## Hypothesis Assessment",...base.hypotheses.map(h=>`- ${h.id}: ${s.probabilities[h.id]}% — ${h.title}`),"","## Graduate Paper",...paperSections.flatMap(([id,title])=>["",`### ${title}`,s.v4Paper[id]||""]),"","## Academic References",...s.v4Research.map(x=>`- ${x.apa||[x.author,x.year,x.title].filter(Boolean).join(". ")}`),"","## Decision Log",...s.v4DecisionLog.map(x=>`- ${new Date(x.time).toLocaleString()} — ${x.h} ${x.dir}; ${x.files}: ${x.reason}`)];download(`operation-glass-meridian-intelligence-product-${new Date().toISOString().slice(0,10)}.md`,lines.join("\n"),"text/markdown")});
  const importInput=qs("#gm-v4-import-file");qs("#gm-v4-import")?.addEventListener("click",()=>importInput?.click());importInput?.addEventListener("change",async()=>{const f=importInput.files?.[0];if(!f)return;try{if(f.size>2_000_000)throw new Error();const p=JSON.parse(await f.text());if(p.project!=="Operation Glass Meridian"||Number(p.version)!==4||!p.state||typeof p.state!=="object"||Array.isArray(p.state))throw new Error();localStorage.setItem("glassMeridianLab.v1",JSON.stringify(p.state));location.reload()}catch{toast("Import failed: choose a valid Glass Meridian v4 workspace export under 2 MB.")}finally{importInput.value=""}});
  qs("#gm-v4-print")?.addEventListener("click",()=>{base.showView("paper");setTimeout(()=>window.print(),120)});

  refresh();
})();
