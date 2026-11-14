"""Offline Playwright suite for Motherboard & Chips Full Stack Silicon Lab v4.0.0.
Author: Marc Lavoie | 2026-11-13. No network connection is required.
"""
from pathlib import Path
import re
import os
from playwright.sync_api import sync_playwright
p=Path(__file__).resolve().parent

def verify(page,width,capture=False):
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    html=(p/'preview.html').read_text(encoding='utf-8')
    html=re.sub(r'<link[^>]+href="\./motherboard-(?:atlas|binary|advanced)\.css"[^>]*>', '', html)
    html=re.sub(r'<script[^>]+src="\./motherboard-(?:atlas|binary|advanced)\.js"[^>]*></script>', '', html)
    page.set_content(html,wait_until='domcontentloaded')
    for asset in ('motherboard-atlas.css','motherboard-binary.css','motherboard-advanced.css'):
        page.add_style_tag(content=(p/asset).read_text(encoding='utf-8'))
    for asset in ('motherboard-atlas.js','motherboard-binary.js','motherboard-advanced.js'):
        page.add_script_tag(content=(p/asset).read_text(encoding='utf-8'))
    page.wait_for_function('document.querySelector("#hardware-atlas")?.dataset.hwatAdvancedReady === "true"')
    assert page.evaluate('HardwareAdvancedAtlas.version')=='4.0.0'
    assert page.evaluate('HardwareAdvancedAtlas.scenarioCount')==6
    assert page.evaluate('HardwareAdvancedAtlas.quizCount')==15
    assert page.evaluate('HardwareAdvancedAtlas.glossaryCount')>=30
    assert page.locator('[data-bin-pane]').count()==11
    assert page.locator('[data-hwat-part]').count()>=25
    # route page: verify cross-click to physical hardware explorer
    page.locator('[data-hwat-binary-tab]').click()
    page.locator('[data-bin-pane="scenarios"]').click()
    assert page.locator('[data-bin-content="scenarios"]').is_visible()
    assert page.locator('[data-v4-trace-step]').count()==7
    assert 'UTF-8' in page.locator('[data-v4-trace-detail]').inner_text()
    page.locator('[data-v4-scenario-next]').click()
    assert 'Host transport' in page.locator('[data-v4-trace-detail]').inner_text()
    page.locator('[data-v4-scenario-select]').select_option('boot')
    assert page.locator('[data-v4-trace-step]').count()==7
    page.locator('[data-v4-scenario-select]').select_option('keyboard')
    assert page.locator('[data-v4-trace-step]').count()==6
    page.locator('[data-v4-trace-step="2"]').click()
    assert 'USB' in page.locator('[data-v4-trace-detail]').inner_text()
    page.locator('[data-v4-goto-chip]').click()
    assert page.locator('[data-hwat-workspace]').is_visible(), 'route did not navigate to board inspector'
    page.locator('[data-hwat-binary-tab]').click()
    # CPU simulator has real execution, state and memory
    page.locator('[data-bin-pane="cpu"]').click()
    assert page.locator('[data-v4-memory-address]').count()==256
    assert '10 05' in page.locator('[data-v4-cpu-disassembly]').inner_text()
    page.locator('[data-v4-cpu-step]').click()
    assert '0x05' in page.locator('[data-v4-cpu-registers]').inner_text()
    page.locator('[data-v4-cpu-run]').click()
    assert '12 (0x0C)' in page.locator('[data-v4-cpu-output]').inner_text()
    assert 'HALTED' in page.locator('[data-v4-cpu-registers]').inner_text()
    page.locator('[data-v4-cpu-sample]').select_option('memory')
    page.locator('[data-v4-cpu-run]').click()
    assert '42 (0x2A)' in page.locator('[data-v4-cpu-output]').inner_text()
    assert page.locator('[data-v4-memory-address="128"]').get_attribute('aria-label')=='RAM address 0x80 contains 0x2A'
    page.locator('[data-v4-cpu-sample]').select_option('countdown')
    page.locator('[data-v4-cpu-run]').click()
    assert '3 (0x03) · 2 (0x02) · 1 (0x01)' in page.locator('[data-v4-cpu-output]').inner_text()
    page.locator('[data-v4-cpu-source]').fill('LDI 255\nADD 1\nOUT\nHLT')
    page.locator('[data-v4-cpu-compile]').click()
    page.locator('[data-v4-cpu-run]').click()
    assert '0 (0x00)' in page.locator('[data-v4-cpu-output]').inner_text()
    assert page.locator('[data-v4-cpu-registers]').inner_text().count('Carry / borrow')==1
    page.locator('[data-v4-cpu-source]').fill('LDI 999\nHLT')
    page.locator('[data-v4-cpu-compile]').click()
    assert page.locator('[data-v4-cpu-error]').get_attribute('data-error')=='true'
    page.locator('[data-v4-cpu-source]').fill('LDI 42\nOUT\nHLT')
    page.locator('[data-v4-cpu-compile]').click()
    assert page.locator('[data-v4-cpu-error]').get_attribute('data-error')=='false'
    # SPI/UART scope: validate bit order and immutable semantics
    page.locator('[data-bin-pane="scope"]').click()
    assert 'b7' in page.locator('[data-v4-scope-readout]').inner_text()
    page.locator('[data-v4-scope-mode]').select_option('uart')
    assert 'LSB first' in page.locator('[data-v4-scope-heading]').inner_text()
    assert '0x41' in page.locator('[data-v4-scope-readout]').inner_text()
    page.locator('[data-v4-scope-position]').fill('6')
    assert 'b6' in page.locator('[data-v4-scope-readout]').inner_text()
    page.locator('[data-v4-scope-mode]').select_option('spi')
    page.locator('[data-v4-scope-preset="03"]').click()
    assert '0x03' in page.locator('[data-v4-scope-readout]').inner_text()
    assert page.locator('[data-v4-scope-chart] svg').count()==1
    # Real ISA field encodings
    page.locator('[data-bin-pane="isa"]').click()
    assert 'B8' in page.locator('[data-v4-isa-bytes]').inner_text()
    assert '2A' in page.locator('[data-v4-isa-bytes]').inner_text()
    page.locator('[data-v4-isa-mode="riscv"]').click()
    assert '93' in page.locator('[data-v4-isa-bytes]').inner_text()
    assert '02 A0 02' in ' '.join(page.locator('[data-v4-isa-bytes] strong').all_inner_texts())
    assert '0010011' in page.locator('[data-v4-isa-fields]').inner_text()
    page.locator('[data-v4-isa-value]').fill('-1')
    page.locator('[data-v4-isa-value]').blur()
    assert 'ADDI x5, x0, -1' in page.locator('[data-v4-isa-title]').inner_text()
    page.locator('[data-v4-isa-mode="x86"]').click()
    assert '2A' in page.locator('[data-v4-isa-bytes]').inner_text()
    # glossary and quiz
    page.locator('[data-bin-pane="academy"]').click()
    assert page.locator('[data-v4-glossary] details').count()>=30
    page.locator('[data-v4-glossary-search]').fill('mosfet')
    assert page.locator('[data-v4-glossary] details').count()>=1
    page.locator('[data-v4-glossary-search]').fill('')
    page.locator('[data-v4-answer="1"]').click()
    assert 'Correct' in page.locator('[data-v4-quiz-explanation]').inner_text()
    page.locator('[data-v4-quiz-next]').click()
    assert 'QUESTION 2' in page.locator('[data-v4-quiz-progress]').inner_text()
    page.locator('[data-v4-quiz-reset]').click()
    assert '0 correct' in page.locator('[data-v4-quiz-progress]').inner_text()
    # cross-module version and mobile no overflow
    assert not errors,errors
    measured=page.evaluate('({document:document.documentElement.scrollWidth, viewport:window.innerWidth})')
    assert measured['document']<=measured['viewport']+1,measured
    if capture:
        for pane in ('scenarios','cpu','scope','isa','academy'):
            page.locator(f'[data-bin-pane="{pane}"]').click()
            page.locator('[data-hwat-binary-page]').screenshot(path=str(p/'previews'/f'v4-{pane}-{width}.png'),animations='disabled',timeout=120000)
    print(f'PASS {width}px: 6 hardware traces, executable EDU-8, SPI/UART, ISA comparison, 15-question quiz, no overflow/errors')

with sync_playwright() as driver:
    browser=driver.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
    for width,height in [(1600,1000),(1280,900),(760,1000),(390,844)]:
        page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
        verify(page,width,capture=width in (1280,390) and not bool(os.environ.get("V4_SKIP_CAPTURE")))
        page.close()
    browser.close()
print('ALL ADVANCED V4 BROWSER TESTS PASSED')
