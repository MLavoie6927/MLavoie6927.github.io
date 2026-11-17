"""Headless Chromium smoke tests using inline local assets for network-restricted environments."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re
root=Path(__file__).resolve().parents[1]
raw=(root/'index.html').read_text(encoding='utf-8')
html=re.sub(r'<script src="[^"]+" defer></script>','',raw)
html=re.sub(r'<link rel="stylesheet" href="[^"]+">','',html)
def load(page):
 page.goto('about:blank')
 page.set_content(html)
 page.add_style_tag(content=(root/'assets/css/atlas.css').read_text())
 for js in ['assets/js/geography.js','assets/js/hazards.js','assets/js/road-traps.js','assets/js/atlas.js','assets/js/trap-engine.js']:
  page.add_script_tag(content=(root/js).read_text(encoding='utf8'))
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h,label in [(1600,1050,'desktop'),(390,844,'mobile')]:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  load(page)
  page.wait_for_timeout(400)
  print(label,'errors=',errors, 'counts=',page.evaluate('window.ATLAS_TEST_API?.getCounts()'),'trap count=',page.evaluate('window.ATLAS_TRAP_TEST?.records()'),'trap markers=',page.locator('.trap-marker,.trap-cluster').count())
  assert not errors,errors
  assert page.locator('.state-path').count()==51
  assert page.evaluate('window.ATLAS_TEST_API.getCounts().total')==80
  assert page.evaluate('window.ATLAS_TRAP_TEST.records()')==30
  assert page.locator('.trap-marker,.trap-cluster').count()>5
  assert page.locator('.trap-road-highlight').count()==30
  assert page.locator('.trap-item').count()==30
  assert page.evaluate('window.ATLAS_TRAP_TEST.selected()')=='GPS-VT-01'
  assert 'Smugglers' in page.locator('#gps-detail').inner_text()
  assert not page.evaluate('document.documentElement.scrollWidth>window.innerWidth'), 'horizontal overflow'
  page.screenshot(path=str(root/f'docs/{label}-v1.1.png'),full_page=True)
  if label=='desktop':
    page.locator('#trap-search').fill('Storrow');assert page.locator('.trap-item').count()==1
    assert page.evaluate('window.ATLAS_TRAP_TEST.filtered()')==1
    page.locator('#trap-clear').click(); assert page.locator('.trap-item').count()==30
    page.select_option('#trap-category','geometry');print('geometry count',page.locator('.trap-item').count())
    assert page.locator('.trap-item').count()>3
    page.locator('#trap-clear').click()
    page.evaluate("window.ATLAS_TRAP_TEST.select('GPS-CO-01')")
    assert page.evaluate('window.ATLAS_TRAP_TEST.selected()')=='GPS-CO-01'
    assert 'COMBINATION LENGTH CONFLICT' in page.locator('#vehicle-result').inner_text()
    page.locator('#truck-length').fill('30')
    assert 'LENGTH THRESHOLD NOT EXCEEDED' in page.locator('#vehicle-result').inner_text()
    assert 'does NOT establish' in page.locator('#vehicle-result').inner_text()
    page.locator('#truck-length').fill('73')
    page.evaluate("window.ATLAS_TRAP_TEST.select('GPS-MD-01')")
    assert 'CARGO CLASSIFICATION REQUIRED' in page.locator('#vehicle-result').inner_text()
    page.locator('.gps-toggle').click()
    assert page.locator('.trap-marker,.trap-cluster').count()==0
    page.locator('.gps-toggle').click()
    assert page.locator('.trap-marker,.trap-cluster').count()>5
    page.evaluate('window.ATLAS_TEST_API.reset()')
    print('desktop interactions PASS')
  page.close()
 browser.close()
