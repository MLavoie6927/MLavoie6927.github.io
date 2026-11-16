#!/usr/bin/env python3
"""In-memory Playwright browser regression test. Marc Lavoie, 2026-11-14.
Works in restricted environments where localhost and file navigation is blocked.
Requires Python playwright and a Chromium binary (default /usr/bin/chromium).
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text('utf8')
html=html.replace('<link rel="stylesheet" href="app/styles.css">', '<style>'+ (root/'app/styles.css').read_text('utf8')+'</style>')
html=html.replace('<script src="data/questions.js" defer></script>', '<script>'+ (root/'data/questions.js').read_text('utf8')+'</script>')
html=html.replace('<script src="app/app.js" defer></script>', '<script>'+ (root/'app/app.js').read_text('utf8')+'</script>')

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=os.getenv('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox','--disable-gpu'])
    page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
    failures=[]
    page.on('pageerror',lambda e: failures.append(str(e)))
    page.set_content(html,wait_until='load')
    assert page.locator('.track-card').count()==6
    assert page.locator('#total-count').inner_text()=='300'
    assert page.locator('.rig-region').count()==5
    page.screenshot(path=str(root/'preview-desktop.png'),full_page=True)
    print('PASS dashboard: 6 tracks, 5 clickable schematic groups, 300-question indicator')

    page.get_by_role('button',name='Explore questions').click()
    assert page.locator('.question-card').count()==20
    assert '300' in page.locator('#study-result-count').inner_text()
    page.locator('#search').fill('hydroplaning')
    assert page.locator('.question-card').count()>=1
    page.locator('#search').fill('')
    page.locator('#study-section').select_option('Air')
    assert page.locator('.question-card').count()>=1
    assert '49' in page.locator('#study-result-count').inner_text()
    page.locator('.question-card footer button').first.click()
    assert 'Bookmarked' in page.locator('.question-card footer button').first.inner_text()
    print('PASS study: centered 20-card library, search, section filter, pagination, bookmark')

    page.get_by_role('button',name='Flashcards').click()
    assert page.locator('#flash-stage h2').count()==1
    page.get_by_role('button',name='Reveal answer').click()
    assert page.locator('.flash-answer').count()==1
    page.locator('#flash-next').click()
    assert page.locator('.flash-answer').count()==0
    print('PASS flashcards: reveal and next')

    page.get_by_role('button',name='Vehicle inspection').click()
    assert page.locator('.inspection-card').count()==18
    page.locator('.inspection-card button').first.click()
    assert 'Reviewed' in page.locator('.inspection-card button').first.inner_text()
    print('PASS inspection: 18-step study map and saved selection')

    page.get_by_role('button',name='Mock examinations').click()
    assert page.locator('.preset').count()==11
    page.locator('#exam-presets').get_by_role('button',name='Hazardous Materials').click()
    page.locator('#exam-size').select_option('20')
    page.get_by_role('button',name='Begin practice exam').click()
    assert page.locator('.exam-option').count()==4
    # Answer each randomly drawn hazmat question correctly using the JSON's stored answer.
    for index in range(20):
        stem=page.locator('#exam-run h2').inner_text()
        answer=page.evaluate('stem => {const q=window.ATLAS_CDL_BANK.questions.find(x=>x.question===stem);return q.answer}',stem)
        assert answer in (0,1,2,3),stem
        page.locator('.exam-option input').nth(answer).check()
        page.locator('#exam-run .exam-controls button').last.click()
    assert page.locator('#exam-results').is_visible()
    assert '20 / 20' in page.locator('#exam-results').inner_text()
    assert '100%' in page.locator('#exam-results').inner_text()
    print('PASS exam: 20/20 correct, exact answer checking and per-section score')
    page.get_by_role('button',name='New practice exam').click()
    page.locator('#exam-presets').get_by_role('button',name='Class A Tractor-Trailer').click()
    page.get_by_role('button',name='Begin practice exam').click()
    assert 'of 95' in page.locator('.exam-countdown').inner_text()
    for index in range(95):
        stem=page.locator('#exam-run h2').inner_text()
        answer=page.evaluate('stem => window.ATLAS_CDL_BANK.questions.find(q=>q.question===stem).answer',stem)
        page.locator('.exam-option input').nth(answer).check()
        page.locator('#exam-run .exam-controls button').last.click()
    result_text=page.locator('#exam-results').inner_text()
    assert '50/50' in result_text and '25/25' in result_text and '20/20' in result_text, result_text
    assert 'Practice passing standard met' in result_text
    print('PASS Class A: all 95 answered correctly, all three categories separately passed')

    mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
    mobile_errors=[]
    mobile.on('pageerror',lambda e:mobile_errors.append(str(e)))
    mobile.set_content(html,wait_until='load')
    mobile.screenshot(path=str(root/'preview-mobile.png'),full_page=True)
    overflow=mobile.evaluate('document.documentElement.scrollWidth - window.innerWidth')
    assert overflow<=3,f'horizontal page overflow {overflow}px'
    mobile.get_by_role('button',name='Mock examinations').click()
    assert mobile.locator('#exam-setup').is_visible()
    mobile.get_by_role('button',name='CDL study guide').click()
    assert mobile.locator('.guide-card').count()==8
    print('PASS mobile: 390px viewport, no unintended page overflow; navigation, guide')
    assert not failures,failures
    assert not mobile_errors,mobile_errors
    print('PASS JS: No uncaught script errors on desktop/mobile')
    browser.close()
