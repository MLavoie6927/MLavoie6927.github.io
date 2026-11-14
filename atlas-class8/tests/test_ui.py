"""Automated Chromium smoke/regression checks for offline Class 8 teaching studio."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
URL='about:blank'
def mount(page):
    page.goto(URL)
    page.set_content((ROOT/'index.html').read_text())
    page.add_style_tag(content=(ROOT/'assets/styles.css').read_text())
    for name in ('catalog','training-data','blueprints','component-art','app'):
        page.add_script_tag(content=(ROOT/f'js/{name}.js').read_text())
results=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1540,'height':1020},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    mount(page)
    page.wait_for_timeout(350)
    assert page.title().startswith('ATLAS')
    assert page.locator('.part-row').count() == 117
    assert page.locator('.hotspot').count() == 29
    page.screenshot(path=str(ROOT/'preview-desktop.png'),full_page=True)
    results.append('117 parts / 29 regions / desktop rendering')
    # Select a trailer region and verify linked component details.
    page.locator('.hotspot[data-zone="trailer-rear"]').click(force=True)
    assert 'Trailer' in page.locator('#detailPath').inner_text()
    results.append('Clickable trailer region selects trailer part')
    # Filtering and searching
    page.locator('[data-vehicle="Tractor"]').click()
    page.locator('#partSearch').fill('turbo')
    assert page.locator('.part-row').count()>0
    assert page.locator('.part-row').filter(has_text='Turbocharger').count() >= 1
    page.locator('#partSearch').fill('')
    # Diagrams
    page.locator('[data-nav="systems"]').click()
    assert page.locator('.bp-node').count()==6
    page.locator('[data-system="brakes"]').click()
    assert 'Dual-circuit' in page.locator('#systemName').inner_text()
    page.locator('.bp-node[data-node="4"]').click()
    assert 'BRAKE CHAMBERS' in page.locator('#systemDetail').inner_text()
    page.locator('#openBlueprintPart').click()
    assert page.locator('#detailName').inner_text() == 'Service and spring brake chambers'
    results.append('Five interactive subsystem diagrams and linked component record')
    # Air pressure simulation (change severity and run)
    page.locator('[data-nav="air"]').click()
    page.locator('#airLeak').fill('8')
    page.locator('#runAirTest').click()
    assert 'Exceeds test' in page.locator('#airResult').inner_text()
    page.locator('#resetAir').click()
    page.locator('#runAirTest').click()
    assert 'within example threshold' in page.locator('#airResult').inner_text()
    results.append('Air brake simulator pass/fail thresholds')
    # Bridge calc
    page.locator('[data-nav="weight"]').click()
    assert page.locator('#bridgeRows tr').count()==15
    page.locator('#loadOverloaded').click()
    assert 'exceed' in page.locator('#weightAlerts').inner_text()
    page.locator('#loadBalanced').click()
    assert 'No modeled baseline violations' in page.locator('#weightAlerts').inner_text()
    results.append('15 contiguous axle-group checks and example scenarios')
    # Diagnostic cases
    page.locator('[data-nav="diagnostics"]').click()
    page.locator('#scenarioOptions .option-btn').nth(2).click()
    assert 'Correct engineering judgment' in page.locator('#scenarioFeedback').inner_text()
    results.append('Troubleshooting scenario feedback and score')
    # Inspection
    page.locator('[data-nav="inspection"]').click()
    assert page.locator('.inspection-item').count()==18
    page.locator('.inspection-buttons button[data-value="defect"]').first.click()
    assert 'HOLD FOR DEFECT' in page.locator('#inspectionOutcome').inner_text()
    results.append('18 pre-trip inspection stations and defect summary')
    # Fluid volume converter
    page.locator('[data-nav="fluids"]').click()
    assert '43' in page.locator('#fluidCapacity').inner_text()
    page.locator('#fluidFill').fill('50')
    assert '21.5 L' in page.locator('#fluidCurrent').inner_text()
    results.append('Fluid capacity conversions and level controls')
    # Maintenance service tracking
    page.locator('[data-nav="maintenance"]').click()
    assert page.locator('#maintenanceRows tr').count()==12
    page.locator('#odoInput').fill('300000')
    assert page.locator('.maintenance-summary .overdue strong').inner_text().isdigit()
    results.append('Editable 12-item maintenance planner')
    # Repair planner
    page.locator('[data-nav="repairs"]').click()
    page.locator('#repairPicker').select_option('turbocharger')
    page.locator('#repairPickerAdd').click()
    assert 'Turbocharger' in page.locator('#repairRows').inner_text()
    page.locator('#laborRate').fill('175')
    assert '$' in page.locator('#repairGrandTotal').inner_text()
    results.append('Parts + labor cost estimate updates')
    # Quiz
    page.locator('[data-nav="knowledge"]').click()
    page.locator('[data-quiz-opt="1"]').click()
    page.locator('#quizNext').click()
    assert 'Correct.' in page.locator('#quizFeedback').inner_text()
    results.append('CDL quiz scoring and explanations')
    page.locator('[data-nav="references"]').click()
    assert page.locator('.source-item').count()>=6
    # Mobile view
    mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
    mobile_errors=[]
    mobile.on('pageerror',lambda error:mobile_errors.append(str(error)))
    mount(mobile)
    mobile.wait_for_timeout(300)
    mobile.screenshot(path=str(ROOT/'preview-mobile.png'),full_page=True)
    mobile.locator('#menuToggle').click()
    assert 'open' in (mobile.locator('#rail').get_attribute('class') or '')
    mobile.locator('[data-nav="systems"]').click()
    assert mobile.locator('#screen-systems').is_visible()
    assert not mobile.evaluate('document.documentElement.scrollWidth > window.innerWidth + 2')
    results.append('390px responsive mobile layout and navigation')
    assert not errors, f'Desktop errors: {errors}'
    assert not mobile_errors, f'Mobile errors: {mobile_errors}'
    results.append('No uncaught JavaScript errors')
    browser.close()
for x in results: print('PASS —',x)
