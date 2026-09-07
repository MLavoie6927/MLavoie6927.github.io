"use strict";
(function(){
  const m=window.BROWSER_OS_TEST_MANIFEST||{assertions:0,passed:0,failed:1,generated:"missing"};
  document.getElementById("status").textContent=m.failed===0?"PASS":"FAIL";
  document.getElementById("count").textContent=`${m.passed}/${m.assertions} assertions`;
  document.getElementById("generated").textContent=`Generated: ${m.generated}`;
})();
