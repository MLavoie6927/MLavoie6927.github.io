from pathlib import Path
from playwright.sync_api import sync_playwright
p=Path(__file__).parent
with sync_playwright() as w:
 b=w.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu'])
 for width,height in [(1600,980),(1280,800),(760,950),(390,844)]:
  pg=b.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
  errs=[];pg.on('pageerror',lambda error: errs.append(str(error)))
  pg.set_content('<html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#081522">'+(p/'motherboard-atlas-tab.html').read_text()+'</body></html>')
  pg.add_style_tag(content=(p/'motherboard-atlas.css').read_text())
  pg.add_script_tag(content=(p/'motherboard-atlas.js').read_text())
  pg.wait_for_selector('#hardware-atlas[data-hwat-initialized="true"]',timeout=20000)
  print('Browser:',width,'parts',pg.locator('.hwat-diagram [data-hwat-part]').count(),'errors',errs, 'pageW',pg.evaluate('document.documentElement.scrollWidth'))
  assert not errs,errs
  assert pg.locator('.hwat-diagram [data-hwat-part]').count()==25
  pg.screenshot(path=str(p/f'preview-board-{width}.png'),full_page=(width<=760),animations='disabled')
  pg.locator('[data-hwat-part="vrm"]').click(force=True)
  assert pg.locator('#hwat-info-title').inner_text()=='Voltage regulator module'
  assert pg.locator('.hwat-detail-visual svg').count()==1
  pg.locator('[data-hwat-trace="power"]').click()
  assert pg.locator('#hardware-atlas').get_attribute('data-hwat-trace')=='power'
  pg.locator('[data-hwat-zoom="in"]').click()
  assert pg.locator('[data-hwat-zoom-level]').inner_text()=='140%'
  pg.locator('[data-hwat-zoom="fit"]').click()
  assert pg.locator('[data-hwat-zoom-level]').inner_text()=='100%'
  pg.locator('[data-hwat-view="chip"]').click()
  assert pg.locator('.hwat-diagram [data-hwat-part]').count()==14
  pg.screenshot(path=str(p/f'preview-chip-{width}.png'),full_page=False,animations='disabled')
  pg.locator('[data-hwat-part="transistor"]').focus();pg.keyboard.press('Enter')
  assert pg.locator('#hwat-info-title').inner_text()=='CMOS transistor devices'
  pg.locator('[data-hwat-view="materials"]').click()
  assert pg.locator('[data-hwat-item]').count()==12
  pg.screenshot(path=str(p/f'preview-materials-{width}.png'),full_page=False,animations='disabled')
  pg.locator('[data-hwat-item="cu"]').click()
  assert pg.locator('#hwat-info-title').inner_text()=='Copper'
  pg.locator('[data-hwat-view="history"]').click()
  assert pg.locator('[data-hwat-item]').count()==10
  pg.locator('[data-hwat-item="1971"]').click()
  assert 'Intel 4004' in pg.locator('#hwat-info-title').inner_text()
  pg.locator('[data-hwat-search]').fill('1995')
  assert pg.locator('[data-hwat-item]').count()==1
  pg.locator('[data-hwat-reset]').click()
  assert pg.locator('[data-hwat-item]').count()==10
  pg.locator('[data-hwat-tour]').click()
  assert pg.locator('#hwat-info-title').inner_text()=='CPU socket'
  pg.locator('[data-hwat-next-step]').click()
  assert pg.locator('#hwat-info-title').inner_text()=='Voltage regulator module'
  assert not errs,errs
  assert pg.evaluate('document.documentElement.scrollWidth')<=width+1, 'overflow at '+str(width)
  pg.close()
 b.close()
print('ALL BROWSER TESTS PASSED')
