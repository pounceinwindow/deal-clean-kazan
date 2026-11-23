const form = document.querySelector('#renovation-brief');
const panels = [...form.querySelectorAll('[data-step]')];
const progress = [...form.querySelectorAll('.brief-progress li')];
const summary = document.querySelector('#brief-summary');
const status = document.querySelector('.brief-status');
const area = form.elements.namedItem('area');
let current = 0;

function prepareBrief() {
  const fields = new FormData(form);
  const lines = ['Здравствуйте! Хочу уточнить стоимость уборки после ремонта.', '', 'Помещение: ' + fields.get('object')];
  const areaValue = fields.get('area');
  const work = fields.getAll('work');
  const details = fields.get('details').trim();
  if (areaValue) lines.push('Площадь: ' + areaValue + ' м²');
  if (work.length) lines.push('Что нужно учесть: ' + work.join(', '));
  if (details) lines.push('Детали: ' + details);
  lines.push('', 'Подскажите, какие работы можно выполнить и когда?');
  summary.value = lines.join('\n');
  status.textContent = '';
}

function showStep(index) {
  current = index;
  for (const [position, panel] of panels.entries()) {
    const active = position === index;
    panel.hidden = !active;
    if (active) progress[position].setAttribute('aria-current', 'step');
    else progress[position].removeAttribute('aria-current');
  }
  if (index === 2) prepareBrief();
  panels[index].querySelector('h3').focus({ preventScroll: true });
  if (panels[index].getBoundingClientRect().top < 20) {
    form.scrollIntoView({ block: 'start' });
  }
}

function next() {
  if (current === 0 && !area.reportValidity()) return;
  if (current < panels.length - 1) showStep(current + 1);
}

form.querySelectorAll('[data-next]').forEach((button) => button.addEventListener('click', next));
form.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => showStep(current - 1)));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  next();
});

document.querySelector('#copy-brief').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(summary.value);
    status.textContent = 'Сводка скопирована.';
  } catch {
    summary.focus();
    summary.select();
    status.textContent = 'Выделили текст. Скопируйте его из поля.';
  }
});
