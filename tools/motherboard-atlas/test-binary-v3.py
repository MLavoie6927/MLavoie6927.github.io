"""Motherboard & Chips v3 binary subsystem end-to-end validation.
Author: Marc Lavoie. 2026-11-13.
Requires playwright and Chromium. Runs offline, does not alter an existing site.
"""
from pathlib import Path
import re
from playwright.sync_api import sync_playwright

here = Path(__file__).resolve().parent

def verify(page,width):
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    html = (here/'preview.html').read_text()
    html = re.sub(r'<link[^>]*href="\./motherboard-(?:atlas|binary)\.css"[^>]*>', '', html)
    html = re.sub(r'<script[^>]*src="\./motherboard-(?:atlas|binary)\.js"[^>]*></script>', '', html)
    page.set_content(html,wait_until='domcontentloaded')
    page.add_style_tag(content=(here/'motherboard-atlas.css').read_text())
    page.add_style_tag(content=(here/'motherboard-binary.css').read_text())
    page.add_script_tag(content=(here/'motherboard-atlas.js').read_text())
    page.add_script_tag(content=(here/'motherboard-binary.js').read_text())
    page.wait_for_function('window.HardwareAtlas && window.HardwareBinaryAtlas && document.querySelector("#hardware-atlas").dataset.hwatBinaryReady === "true"')
    assert page.locator('[data-hwat-view]').count()==4
    assert page.locator('[data-hwat-binary-tab]').count()==1
    assert page.locator('.hwat-diagram [data-hwat-part]').count()==25
    assert page.evaluate('window.HardwareBinaryAtlas.profileCount')==39
    assert page.evaluate('window.HardwareBinaryAtlas.protocolCount')==10
    page.locator('[data-hwat-part="vrm"]').click(force=True)
    assert page.locator('#hwat-info-title').inner_text()=='Voltage regulator module'
    page.locator('[data-hwat-open-binary="vrm"]').click()
    assert page.locator('[data-hwat-binary-page]').is_visible()
    assert not page.locator('[data-hwat-workspace]').is_visible()
    assert 'Voltage regulator' in page.locator('[data-bin-dossier]').inner_text()
    page.locator('[data-bin-search]').fill('CMOS inverter')
    assert page.locator('[data-bin-index] button').count()==1
    page.locator('[data-bin-search]').fill('')
    page.locator('[data-bin-layer]').select_option('board')
    assert page.locator('[data-bin-index] button').count()==25
    page.locator('[data-bin-layer]').select_option('chip')
    assert page.locator('[data-bin-index] button').count()==14
    page.locator('[data-bin-layer]').select_option('all')
    assert page.locator('[data-bin-index] button').count()==39
    page.locator('[data-bin-profile="transistor"]').click()
    assert 'CMOS inverter' in page.locator('[data-bin-dossier]').inner_text()
    page.locator('[data-bin-jump="transistor"]').last.click()
    assert page.locator('[data-hwat-workspace]').is_visible()
    assert page.locator('#hwat-info-title').inner_text()=='CMOS transistor devices'
    assert page.locator('.hwat-diagram [data-hwat-part]').count()==14
    page.locator('[data-hwat-binary-tab]').click()
    page.locator('[data-bin-pane="html"]').click()
    assert '11 UTF-8 bytes' in page.locator('[data-bin-html-stats]').inner_text()
    assert page.locator('[data-bin-html-sequence] .hwat-bin-html-byte').count()==11
    page.locator('[data-bin-html-source]').fill('<p>é</p>')
    assert '9 UTF-8 bytes' in page.locator('[data-bin-html-stats]').inner_text()
    assert '11000011' in page.locator('[data-bin-html-sequence]').inner_text()  # U+00E9 is C3 A9
    page.locator('[data-bin-html-trace]').click()
    assert page.locator('[data-bin-path-step]').count()==8
    page.locator('[data-bin-path-step="3"]').click()
    assert 'B8 2A' in page.locator('[data-bin-path-detail]').inner_text()
    page.locator('[data-bin-pane="bits"]').click()
    assert page.locator('[data-bin-bits] button').count()==8
    assert '01000001' in page.locator('[data-bin-numeric]').inner_text()
    page.locator('[data-bin-byte-value]').fill('255')
    assert '11111111' in page.locator('[data-bin-numeric]').inner_text()
    page.locator('[data-bin-bit="7"]').click()
    assert '01111111' in page.locator('[data-bin-numeric]').inner_text()
    page.locator('[data-bin-alu-a]').fill('255')
    page.locator('[data-bin-alu-a]').blur()
    page.locator('[data-bin-alu-b]').fill('1')
    page.locator('[data-bin-alu-b]').blur()
    assert 'Carry-out: 1' in page.locator('[data-bin-alu-result]').inner_text()
    page.locator('[data-bin-pane="instructions"]').click()
    assert 'B8' in page.locator('[data-bin-instruction-detail]').inner_text()
    page.locator('[data-bin-instruction="add"]').click()
    assert '83' in page.locator('[data-bin-instruction-detail]').inner_text()
    page.locator('[data-bin-pane="protocols"]').click()
    assert page.locator('[data-bin-protocol] option').count()==10
    page.locator('[data-bin-protocol]').select_option('nvme')
    assert '0x02' in page.locator('[data-bin-protocol-detail]').inner_text()
    page.locator('[data-bin-protocol]').select_option('hid')
    assert page.locator('[data-bin-protocol-hex]>div').count()==8
    page.locator('[data-hwat-view="materials"]').click()
    assert not page.locator('[data-hwat-binary-page]').is_visible()
    assert page.locator('[data-hwat-workspace]').is_visible()
    assert page.locator('[data-hwat-item]').count()==12
    page.locator('[data-hwat-view="history"]').click()
    assert page.locator('[data-hwat-item]').count()==10
    assert not errors,errors
    overflow=page.evaluate('document.documentElement.scrollWidth')
    assert overflow <= width+1,(width,overflow)
    print(f'PASS {width}px: 39 chip profiles; 8-stage path; byte/logic/ALU; real ISA examples; 10 protocol demos; cross-view sync; no JS errors or horizontal overflow')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu'])
    for width,height in [(1600,1000),(1280,850),(760,950),(390,844)]:
        page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
        verify(page,width)
        page.close()
    browser.close()
print('ALL v3 BINARY ATLAS TESTS PASSED')
