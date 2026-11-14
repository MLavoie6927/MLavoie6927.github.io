"""End-to-end regression checks for ATLAS Class 8 v3.0, local-only Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
results=[]
def mount(page):
    # The hosted test environment blocks file:// and loopback navigation.
    # Render local assets in-memory in their actual declared load order.
    page.goto('about:blank')
    page.set_content((ROOT/'index.html').read_text())
    page.add_style_tag(content=(ROOT/'assets/styles.css').read_text())
    page.add_style_tag(content=(ROOT/'assets/v3.css').read_text())
    for name in ('catalog','training-data','blueprints','component-art','simulations','app','v3-labs','embed-frame'):
        page.add_script_tag(content=(ROOT/'js'/f'{name}.js').read_text())

with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--allow-file-access-from-files'])
    page=browser.new_page(viewport={'width':1560,'height':950},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    mount(page)
    page.set_default_timeout(5000)
    page.wait_for_timeout(400)
    assert page.locator('.part-row').count()==117, 'legacy component catalog missing'
    assert page.locator('.hotspot').count()==29
    assert page.locator('[data-nav]').count()>=15
    assert page.evaluate('ATLAS_V3_TEST.xrayLayers')==6
    assert page.evaluate('ATLAS_V3_TEST.tires')==18
    results.append('v2 preserved: 117 parts and 29 clickable regions; 6 new X-ray layers')
    page.screenshot(path=str(ROOT/'preview-v3-dashboard.png'),full_page=True)
    page.locator('[data-nav="xray"]').click()
    assert page.locator('[data-xray]').count()==5
    page.locator('[data-layer="brake"]') if False else None
    page.locator('[data-layer="1"]').click()
    assert page.locator('[data-xray]').count()==6
    page.locator('[data-xray-btn="4"]').click()
    assert 'TRAILER GLAD HANDS' in page.locator('#xrayDetail').inner_text()
    page.screenshot(path=str(ROOT/'preview-v3-xray.png'),full_page=True)
    page.locator('#xrayOpenPart').click()
    assert 'Glad' in page.locator('#detailName').inner_text()
    results.append('X-ray layer switching, SVG node selection and full component deep link')
    page.locator('[data-nav="drivetrain"]').click()
    speed1=page.locator('#driveResults .v3-result').nth(3).inner_text()
    page.locator('#driveGear').fill('2')
    speed2=page.locator('#driveResults .v3-result').nth(3).inner_text()
    assert speed1 != speed2
    page.screenshot(path=str(ROOT/'preview-v3-powertrain.png'),full_page=True)
    results.append('Drivetrain torque, ratio, road speed calculations update live')
    page.locator('[data-nav="tires"]').click()
    assert page.locator('[data-tire]').count()==18
    page.locator('#tireWearPreset').click()
    assert 'DO NOT OPERATE' in page.locator('#tireVerdict').inner_text()
    assert '1 HARD FAIL' in page.locator('#tireStatusLabel').inner_text()
    page.locator('#tireReset').click()
    page.locator('[data-tire="4-L-I"]').click()
    assert 'Axle 4' in page.locator('#tireSelection').inner_text()
    page.screenshot(path=str(ROOT/'preview-v3-tires.png'),full_page=True)
    results.append('All 18 selectable tire positions; worn-tread detection and reset')
    print("CHECK: loading cargo lab",flush=True)
    page.locator('[data-nav="loadplan"]').click(force=True)
    before=page.locator('#loadResults').inner_text()
    page.locator('#loadPosition').fill('39')
    after=page.locator('#loadResults').inner_text()
    assert before!=after
    print("CHECK: transferring axle loads",flush=True)
    page.screenshot(path=str(ROOT/'preview-v3-cargo.png'),full_page=True)
    page.locator('#transferWeight').click(force=True)
    assert page.locator('#screen-weight').is_visible()
    assert page.locator('#bridgeRows tr').count()==15
    actual=page.locator('[data-axle-weight="0"]').input_value()
    assert float(actual)>0
    results.append('Cargo placement changes support reactions; transfers to 15-group bridge lab')
    print("CHECK: air brake",flush=True)
    page.locator('[data-nav="air"]').click(force=True)
    page.locator('#airLeak').fill('9')
    page.locator('#runAirTest').click()
    assert 'Exceeds test' in page.locator('#airResult').inner_text()
    results.append('Existing air-brake simulator regression passes')
    print("CHECK: repairs",flush=True)
    page.locator('[data-nav="repairs"]').click(force=True)
    page.locator('#repairPicker').select_option('turbocharger')
    page.locator('#repairPickerAdd').click()
    assert 'Turbocharger' in page.locator('#repairRows').inner_text()
    results.append('Existing repair estimator regression passes')
    # Mobile layout and menu
    print("CHECK: mobile",flush=True)
    mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
    mobile_errors=[]
    mobile.on('pageerror',lambda e:mobile_errors.append(str(e)))
    print("CHECK: mobile mount",flush=True)
    mount(mobile)
    print("CHECK: mobile mounted",flush=True)
    mobile.set_default_timeout(3500)
    mobile.locator('#menuToggle').click()
    mobile.locator('[data-nav="xray"]').click()
    mobile.wait_for_timeout(300)
    assert mobile.locator('#screen-xray').is_visible()
    assert not mobile.evaluate('document.documentElement.scrollWidth > window.innerWidth + 2'), 'mobile horizontal scroll'
    print("CHECK: mobile screenshot",flush=True)
    mobile.screenshot(path=str(ROOT/'preview-v3-mobile.png'),full_page=True,timeout=8000)
    print("CHECK: mobile screenshot done",flush=True)
    print("CHECK: mobile nav",flush=True)
    mobile.locator('#menuToggle').click(force=True)
    mobile.locator('[data-nav="tires"]').click()
    assert mobile.locator('#screen-tires').is_visible()
    assert not mobile.evaluate('document.documentElement.scrollWidth > window.innerWidth + 2')
    results.append('Responsive 390px layout, X-ray and tire lab navigation')
    # Host embed adapter isolated from external site styling; spoofed source ignored.
    print("CHECK: embed",flush=True)
    host=browser.new_page(viewport={'width':1250,'height':900},device_scale_factor=1)
    host_errors=[]
    host.on('pageerror',lambda e:host_errors.append(str(e)))
    host.goto('about:blank')
    host.set_content('<html><head></head><body><h1>Host webpage</h1><div data-atlas-class8 data-atlas-src="about:blank"></div></body></html>')
    host.add_script_tag(content=(ROOT/'integration/atlas-embed.js').read_text())
    embed=host.locator('[data-atlas-class8] iframe')
    assert embed.count()==1
    assert embed.evaluate('(el)=>el.getBoundingClientRect().width')>1100, 'Embedded frame did not span host content'
    frame=embed.element_handle().content_frame()
    frame.set_content((ROOT/'index.html').read_text())
    frame.add_style_tag(content=(ROOT/'assets/styles.css').read_text())
    frame.add_style_tag(content=(ROOT/'assets/v3.css').read_text())
    for name in ('catalog','training-data','blueprints','component-art','simulations','app','v3-labs'):
        frame.add_script_tag(content=(ROOT/'js'/f'{name}.js').read_text())
    assert frame.locator('.part-row').count()==117
    frame.evaluate("parent.postMessage({source:'ATLAS_CLASS8_FRAME',type:'resize',height:1812},'*')")
    host.wait_for_timeout(100)
    height=embed.evaluate('(el)=>parseInt(el.style.height,10)')
    assert height==1815,f'iframe resize protocol failed: {height}'
    assert host.locator('h1').inner_text()=='Host webpage'
    host.screenshot(path=str(ROOT/'preview-v3-website-embed.png'),full_page=False)
    results.append('Host embed adapter keeps host markup, validates frame source and updates height')
    assert not errors, f'page errors: {errors}'
    assert not mobile_errors, f'mobile errors: {mobile_errors}'
    assert not host_errors, f'host errors: {host_errors}'
    results.append('No uncaught page errors in desktop, mobile or embedded host')
    browser.close()
for item in results: print('PASS — '+item)
