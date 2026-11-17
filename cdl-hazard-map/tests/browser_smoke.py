from pathlib import Path
from playwright.sync_api import sync_playwright
import json
import re
root=Path(__file__).resolve().parents[1]
raw=(root/'index.html').read_text()
html=re.sub(r'<script src="[^"]+" defer></script>','',raw)
html=re.sub(r'<link rel="stylesheet" href="[^"]+">','',html)
def load(page):
  page.goto('about:blank')
  page.set_content(html)
  page.add_style_tag(content=(root/'assets/css/atlas.css').read_text())
  for js in ['assets/js/geography.js','assets/js/hazards.js','assets/js/atlas.js']:
    page.add_script_tag(content=(root/js).read_text())
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height,label in [(1550,1000,'desktop'),(390,844,'mobile')]:
  page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  load(page)
  page.wait_for_timeout(300)
  print(label,'title',page.title(),'counts',page.evaluate('window.ATLAS_TEST_API?.getCounts()'), 'svg paths',page.locator('.state-path').count(),'markers',page.locator('.map-marker').count(),'clusters',page.locator('.cluster').count(),'errors',errors)
  page.screenshot(path=str(root/f'docs/{label}-preview.png'),full_page=True)
  assert not errors,errors
  assert page.locator('.state-path').count()==51
  assert page.evaluate('window.ATLAS_TEST_API.getCounts().total')==80
  assert page.locator('.map-marker,.cluster').count()>25
  assert not page.evaluate('document.documentElement.scrollWidth>window.innerWidth'), 'horizontal viewport overflow'
  if label=='desktop':
    page.locator('[data-category="hazmat"]').click(); print('hazmat',page.evaluate('window.ATLAS_TEST_API.getCounts()'))
    assert page.evaluate('window.ATLAS_TEST_API.getCounts().visible')>0
    page.locator('[data-category="all"]').click()
    page.locator('#search-input').fill('McKenzie'); assert page.locator('.location-item').count()==1
    page.locator('.location-item').first.click();print('selected',page.locator('#selected-panel').inner_text()[:180])
    assert 'Oregon DOT' in page.locator('#selected-panel').inner_text() or 'ODOT' in page.locator('#selected-panel').inner_text()
    page.locator('#zoom-reset').click()
    page.locator('#clear-search').click()
    page.locator('.status-tab[data-status="official"]').click()
    assert page.evaluate('window.ATLAS_TEST_API.getCounts().visible')==30
    page.locator('.status-tab[data-status="illustrative"]').click()
    assert page.evaluate('window.ATLAS_TEST_API.getCounts().visible')==50
    page.locator('.status-tab[data-status="all"]').click()
    page.locator('#zoom-in').click();assert page.evaluate('window.ATLAS_TEST_API.zoom()')>1
    page.locator('#zoom-reset').click();assert abs(page.evaluate('window.ATLAS_TEST_API.zoom()')-1)<0.01
    print('desktop functionality PASS')
  page.close()
 browser.close()
