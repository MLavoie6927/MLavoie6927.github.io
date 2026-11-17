"""Optional Playwright/Chromium smoke test, no internet or server needed.
The testing sandbox blocks file:// and localhost browser navigation, so this test
injects local HTML/CSS/JS into about:blank. In normal use, open index.html directly.
Run: python tests/browser_smoke.py (requires playwright and Chromium installed).
"""
import re
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=re.sub(r'<script defer src="[^"]+"></script>','',(ROOT/'index.html').read_text())
MOCK_STORAGE=r'''(function(){
const db=window.__atlasPreserved || {};
Object.defineProperty(window,'localStorage',{configurable:true,value:{
getItem:k=>Object.prototype.hasOwnProperty.call(db,k)?db[k]:null,
setItem:(k,v)=>db[k]=String(v),
removeItem:k=>delete db[k]
}});
window.__atlasMockDb=db;
})();'''
def load(page, storage=None):
  page.goto('about:blank')
  page.set_content(HTML)
  if storage: page.evaluate('(d)=>{window.__atlasPreserved=d}', storage)
  page.add_script_tag(content=MOCK_STORAGE)
  page.add_style_tag(content=(ROOT/'assets/styles.css').read_text())
  for script in ['js/catalog.js','js/quiz.js','js/logic.js','js/app.js']:
    page.add_script_tag(content=(ROOT/script).read_text())

with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':1440,'height':900},accept_downloads=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  load(page)
  assert page.locator('#stat-scenarios').inner_text()=='222'
  assert page.locator('#stat-categories').inner_text()=='14'
  page.screenshot(path=str(ROOT/'docs/desktop-preview.png'),full_page=True)
  page.locator('[data-page=library]').click()
  assert page.locator('.scenario-card').count()==16
  page.locator('#scenario-search').fill('bridge')
  assert page.locator('.scenario-card').count()>=1
  page.locator('.scenario-card').first.click()
  assert page.locator('#detail-modal').is_visible()
  page.keyboard.press('Escape')
  assert page.locator('#detail-modal').is_hidden()
  page.locator('[data-page=checker]').click()
  page.locator('[data-preset=bridge]').click()
  assert 'DO NOT ENTER' in page.locator('.fit-summary strong').inner_text()
  page.locator('[data-preset=clear]').click()
  assert 'UNVERIFIED' in page.locator('.fit-summary strong').inner_text()
  page.locator('[data-page=training]').click()
  page.locator('[data-answer="1"]').click()
  assert page.locator('#quiz-score').inner_text()=='1'
  page.locator('[data-page=fieldguide]').click()
  page.locator('[data-check="0"]').check()
  assert page.locator('#checklist-count').inner_text()=='1 of 28'
  page.locator('[data-page=reports]').click()
  page.locator('[name="location"]').fill('Test Road near Exit 4')
  page.locator('textarea[name="description"]').fill('Posted bridge clearance differs from passenger GPS guidance.')
  page.locator('#report-form button[type=submit]').click()
  assert page.locator('#report-total').inner_text()=='1'
  assert 'Saved locally' in page.locator('#report-status').inner_text()
  page.screenshot(path=str(ROOT/'docs/reports-preview.png'),full_page=True)
  with page.expect_download() as dl:
    page.locator('#export-report-json').click()
  assert dl.value.suggested_filename=='atlas-class-a-hazards.json'
  prior=page.evaluate('window.__atlasMockDb')
  load(page,prior)
  page.locator('[data-page=reports]').click()
  assert page.locator('#report-total').inner_text()=='1','saved report should survive new load'
  page.locator('[data-page=training]').click()
  assert page.locator('#quiz-score').inner_text()=='1','quiz progress should survive new load'
  assert not errors,errors
  mobile=browser.new_page(viewport={'width':390,'height':844})
  merr=[];mobile.on('pageerror',lambda e:merr.append(str(e)))
  load(mobile)
  assert mobile.locator('#stat-scenarios').inner_text()=='222'
  assert not mobile.evaluate('document.documentElement.scrollWidth>window.innerWidth'),'mobile overflow'
  mobile.screenshot(path=str(ROOT/'docs/mobile-preview.png'),full_page=True)
  assert not merr,merr
  browser.close()
  print('PASS | browser: navigation, search, detail dialog, input-only STOP/VERIFY, quiz, checklist, report storage, JSON export, mobile layout and no JS errors')
