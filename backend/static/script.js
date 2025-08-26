const els = document.querySelectorAll(
".content__wrapper > *"
)
const maxHeight = Math.max(...Array.from(els).map(e => e.clientHeight))
els.forEach(e => e.style.height = maxHeight + "px")

function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "flex";
  evt.currentTarget.className += " active";
  moveTabIndicator(evt.currentTarget.parentElement)
}

function moveTabIndicator(container) {
    const active = container.querySelector('button.active');
    const indicator = container.querySelector('.tab__indicator');
    if (!active || !indicator) return;

    const a = active.getBoundingClientRect();
    const c = container.getBoundingClientRect();
    const left = a.left - c.left;
    const width = a.width;

    indicator.style.setProperty('--indicator-left', left + 'px');
    indicator.style.setProperty('--indicator-width', width + 'px');
}

// Position the indicator on load and on resize
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementsByClassName('active');
  moveTabIndicator(container);
});

window.addEventListener('resize', () => {
  const container = document.getElementsByClassName('active');
  moveTabIndicator(container);
});

function positionIndicator() {
  const activeBtn = document.querySelector('.tab .tablinks.active'); // or '#gameTabs .tablinks.active'
  if (!activeBtn) return;
  moveTabIndicator(activeBtn.closest('.tab'));
}

document.addEventListener('DOMContentLoaded', () => {
  positionIndicator();
  // If fonts/layout shift widths, run once more on next frame:
  requestAnimationFrame(positionIndicator);
});

window.addEventListener('load', positionIndicator);   // optional, after assets/fonts
window.addEventListener('resize', positionIndicator); // keep it aligned on resize

