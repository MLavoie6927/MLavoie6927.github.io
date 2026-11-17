/* Class 8 Engineering & CDL Lab portfolio shell | Marc Lavoie | 2026-11-14 */
'use strict';

(()=>{
  const data=window.ATLAS_CDL_STUDY;
  if(!data)return;

  const byId=id=>document.getElementById(id);
  const navToggle=byId('class8-menu-toggle');
  const nav=byId('class8-menu');
  const search=byId('cdl-search');
  const results=byId('cdl-results');
  const resultCount=byId('cdl-result-count');
  const reviewedCount=byId('cdl-reviewed-count');
  const flashCategory=byId('flash-category');
  const flashQuestion=byId('flash-question');
  const flashAnswer=byId('flash-answer');
  const flashReveal=byId('flash-reveal');
  const flashNext=byId('flash-next');
  const storageKey='atlas-class8-cdl-reviewed-v1';
  let activeCategory='all';
  let flashItem=null;
  let reviewed=new Set();

  try{
    const stored=JSON.parse(localStorage.getItem(storageKey)||'[]');
    if(Array.isArray(stored))reviewed=new Set(stored.filter(Number.isInteger));
  }catch(_error){
    reviewed=new Set();
  }

  function saveReviewed(){
    try{localStorage.setItem(storageKey,JSON.stringify([...reviewed].sort((a,b)=>a-b)));}catch(_error){/* local persistence is optional */}
    reviewedCount.textContent=`${reviewed.size} / ${data.questions.length} reviewed`;
  }

  function normalized(value){return String(value||'').trim().toLowerCase();}

  function filteredQuestions(){
    const query=normalized(search.value);
    return data.questions.filter(item=>{
      const categoryMatch=activeCategory==='all'||item.category===activeCategory;
      const textMatch=!query||normalized(`${item.question} ${item.answer} ${data.categories[item.category]}`).includes(query);
      return categoryMatch&&textMatch;
    });
  }

  function createQuestionCard(item){
    const details=document.createElement('details');
    details.className='cdl-question-card';
    details.dataset.questionId=String(item.id);

    const summary=document.createElement('summary');
    const number=document.createElement('span');
    number.className='question-number';
    number.textContent=String(item.id).padStart(2,'0');
    const copy=document.createElement('span');
    copy.className='question-copy';
    const category=document.createElement('small');
    category.textContent=data.categories[item.category];
    const question=document.createElement('strong');
    question.textContent=item.question;
    copy.append(category,question);
    const cue=document.createElement('span');
    cue.className='reveal-cue';
    cue.textContent='Reveal answer';
    summary.append(number,copy,cue);

    const answer=document.createElement('div');
    answer.className='question-answer';
    const label=document.createElement('span');
    label.textContent='Answer';
    const text=document.createElement('p');
    text.textContent=item.answer;
    const reviewedButton=document.createElement('button');
    reviewedButton.type='button';
    reviewedButton.className='review-button';

    function syncReviewButton(){
      const isReviewed=reviewed.has(item.id);
      reviewedButton.classList.toggle('is-reviewed',isReviewed);
      reviewedButton.setAttribute('aria-pressed',String(isReviewed));
      reviewedButton.textContent=isReviewed?'Reviewed ✓':'Mark reviewed';
    }

    reviewedButton.addEventListener('click',()=>{
      if(reviewed.has(item.id))reviewed.delete(item.id);else reviewed.add(item.id);
      syncReviewButton();
      saveReviewed();
    });
    syncReviewButton();
    answer.append(label,text,reviewedButton);
    details.append(summary,answer);
    details.addEventListener('toggle',()=>{cue.textContent=details.open?'Hide answer':'Reveal answer';});
    return details;
  }

  function renderQuestions(){
    const items=filteredQuestions();
    const fragment=document.createDocumentFragment();
    items.forEach(item=>fragment.append(createQuestionCard(item)));
    results.replaceChildren(fragment);
    resultCount.textContent=`Showing ${items.length} of ${data.questions.length} practice questions`;
    if(!items.length){
      const empty=document.createElement('p');
      empty.className='cdl-empty';
      empty.textContent='No questions match this search. Try a broader term or choose All topics.';
      results.append(empty);
    }
  }

  document.querySelectorAll('[data-cdl-filter]').forEach(button=>{
    button.addEventListener('click',()=>{
      activeCategory=button.dataset.cdlFilter;
      document.querySelectorAll('[data-cdl-filter]').forEach(candidate=>{
        const active=candidate===button;
        candidate.classList.toggle('is-active',active);
        candidate.setAttribute('aria-pressed',String(active));
      });
      renderQuestions();
    });
  });

  search.addEventListener('input',renderQuestions);
  byId('cdl-clear').addEventListener('click',()=>{search.value='';search.focus();renderQuestions();});
  byId('cdl-expand').addEventListener('click',()=>{
    const cards=[...results.querySelectorAll('details')];
    const shouldOpen=cards.some(card=>!card.open);
    cards.forEach(card=>{card.open=shouldOpen;});
    byId('cdl-expand').textContent=shouldOpen?'Collapse visible answers':'Expand visible answers';
  });

  function chooseFlash(){
    const pool=activeCategory==='all'?data.questions:data.questions.filter(item=>item.category===activeCategory);
    let next=pool[Math.floor(Math.random()*pool.length)];
    if(pool.length>1&&flashItem&&next.id===flashItem.id)next=pool[(pool.indexOf(next)+1)%pool.length];
    flashItem=next;
    flashCategory.textContent=`${data.categories[next.category]} · Question ${next.id}`;
    flashQuestion.textContent=next.question;
    flashAnswer.textContent=next.answer;
    flashAnswer.hidden=true;
    flashReveal.textContent='Reveal answer';
    flashReveal.setAttribute('aria-expanded','false');
  }

  flashReveal.addEventListener('click',()=>{
    const willShow=flashAnswer.hidden;
    flashAnswer.hidden=!willShow;
    flashReveal.textContent=willShow?'Hide answer':'Reveal answer';
    flashReveal.setAttribute('aria-expanded',String(willShow));
  });
  flashNext.addEventListener('click',chooseFlash);

  function renderMiniExam(){
    const host=byId('mini-exam-questions');
    const fragment=document.createDocumentFragment();
    data.miniExam.forEach((item,index)=>{
      const fieldset=document.createElement('fieldset');
      fieldset.className='mini-question';
      const legend=document.createElement('legend');
      legend.textContent=`${index+1}. ${item.question}`;
      fieldset.append(legend);
      item.options.forEach((option,optionIndex)=>{
        const label=document.createElement('label');
        const input=document.createElement('input');
        input.type='radio';
        input.name=`mini-question-${index}`;
        input.value=String(optionIndex);
        const marker=document.createElement('span');
        marker.textContent=String.fromCharCode(65+optionIndex);
        const text=document.createElement('span');
        text.textContent=option;
        label.append(input,marker,text);
        fieldset.append(label);
      });
      fragment.append(fieldset);
    });
    host.replaceChildren(fragment);
  }

  byId('grade-mini-exam').addEventListener('click',()=>{
    let score=0;
    let answered=0;
    const review=[];
    data.miniExam.forEach((item,index)=>{
      const selected=document.querySelector(`input[name="mini-question-${index}"]:checked`);
      if(selected){
        answered++;
        if(Number(selected.value)===item.answer)score++;
        else review.push(`Question ${index+1}: ${item.explanation}`);
      }
    });
    const percent=Math.round(score/data.miniExam.length*100);
    const result=byId('mini-exam-result');
    result.className=`mini-exam-result ${percent>=80&&answered===data.miniExam.length?'is-pass':'is-review'}`;
    if(answered<data.miniExam.length){
      result.innerHTML=`<strong>${answered} of ${data.miniExam.length} answered.</strong><span>Complete every question before treating the result as a scored attempt.</span>`;
      return;
    }
    const status=percent>=80?'Practice benchmark met':'Review recommended';
    result.replaceChildren();
    const heading=document.createElement('strong');
    heading.textContent=`${status}: ${score}/${data.miniExam.length} (${percent}%)`;
    const note=document.createElement('span');
    note.textContent=percent>=80?'Use your current state CDL manual before the official test.':review.join(' ')||'Review the study bank and try again.';
    result.append(heading,note);
  });

  byId('reset-mini-exam').addEventListener('click',()=>{
    document.querySelectorAll('#mini-exam-questions input').forEach(input=>{input.checked=false;});
    const result=byId('mini-exam-result');
    result.className='mini-exam-result';
    result.textContent='Choose an answer for all five questions, then grade the attempt.';
  });

  navToggle.addEventListener('click',()=>{
    const open=nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open',open);
    navToggle.setAttribute('aria-expanded',String(open));
    navToggle.setAttribute('aria-label',open?'Close CDL navigation':'Open CDL navigation');
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded','false');
    navToggle.setAttribute('aria-label','Open CDL navigation');
  }));

  saveReviewed();
  renderQuestions();
  chooseFlash();
  renderMiniExam();
})();
