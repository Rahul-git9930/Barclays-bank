const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const themeToggle = $('#themeToggle');
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeToggle.textContent = isDark ? '☼' : '☾';
  themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  themeToggle.title = `Switch to ${isDark ? 'light' : 'dark'} mode`;
  try { localStorage.setItem('barclays-demo-theme', theme); } catch (_) {}
}
let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('barclays-demo-theme') || 'dark'; } catch (_) {}
setTheme(savedTheme === 'light' ? 'light' : 'dark');
themeToggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

// Set dates from the viewer's local calendar rather than a stale sample date.
const now = new Date();
const dateText = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now);
$('#welcomeDate').textContent = dateText.toUpperCase();
$('#today').textContent = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(now);
$$('.chart-labels span').forEach((label, index, labels) => {
  const day = Math.max(1, Math.round(1 + index * (new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - 1) / (labels.length - 1)));
  label.textContent = new Intl.DateTimeFormat('en-IN', { month: 'short', day: '2-digit' }).format(new Date(now.getFullYear(), now.getMonth(), day)).toUpperCase();
});

const balance = $('#balanceAmount');
const toggleBalance = $('#toggleBalance');
const balanceMarkup = balance.innerHTML;
let balanceVisible = true;
toggleBalance.addEventListener('click', () => {
  balanceVisible = !balanceVisible;
  balance.innerHTML = balanceVisible ? balanceMarkup : '••••••<span>••</span>';
  toggleBalance.innerHTML = balanceVisible ? '◉ <span>Hide</span>' : '◉ <span>Show</span>';
  toggleBalance.setAttribute('aria-label', balanceVisible ? 'Hide balance' : 'Show balance');
});

const modal = $('#transferModal');
const form = $('#transferForm');
const success = $('#formSuccess');
const modalTitle = $('#modalTitle');
const modalDescription = modal.querySelector('.modal > p');
const defaultTitle = modalTitle.textContent;
const defaultDescription = modalDescription.textContent;
const successTitle = success.querySelector('b');
const successDescription = success.querySelector('p');
function showModal({ title, description, resultTitle = 'Done', resultText = 'This is a demo feature.' }) {
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  form.hidden = true;
  success.hidden = false;
  successTitle.textContent = resultTitle;
  successDescription.textContent = resultText;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}
function openTransfer() {
  modalTitle.textContent = defaultTitle;
  modalDescription.textContent = defaultDescription;
  form.reset();
  form.hidden = false;
  success.hidden = true;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  $('[name="recipient"]').focus();
}
function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
}
$('#openTransfer').addEventListener('click', openTransfer);
$('#closeTransfer').addEventListener('click', closeModal);
$('#doneTransfer').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(data.get('amount')));
  form.hidden = true;
  success.hidden = false;
  successTitle.textContent = 'Payment ready to review';
  successDescription.textContent = `${amount} to ${data.get('recipient')} via ${data.get('method')}. Demo only: nothing has been sent.`;
});

// Search and the status filter can be used together.
const search = $('#transactionSearch');
const rows = $$('#transactionRows tr');
const emptyState = $('#emptyState');
let pendingOnly = false;
function filterRows() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  rows.forEach((row) => {
    const matchesText = `${row.dataset.search} ${row.textContent}`.toLowerCase().includes(query);
    const matchesStatus = !pendingOnly || row.querySelector('.pending');
    row.hidden = !(matchesText && matchesStatus);
    if (!row.hidden) visible++;
  });
  emptyState.hidden = visible > 0;
}
search.addEventListener('input', filterRows);
$('#filterButton').addEventListener('click', (event) => {
  pendingOnly = !pendingOnly;
  event.currentTarget.classList.toggle('filter-active', pendingOnly);
  event.currentTarget.querySelector('span').textContent = pendingOnly ? 'Pending' : 'Filter';
  filterRows();
});
$('#seeAllTransactions').addEventListener('click', () => {
  pendingOnly = false;
  search.value = '';
  $('#filterButton').classList.remove('filter-active');
  $('#filterButton span').textContent = 'Filter';
  filterRows();
});

// Indian sample account balances and recent activity are illustrative only.
$('#allAccountsButton').addEventListener('click', () => showModal({
  title: 'Your bank accounts', description: 'Accounts linked to your Barclays Bank demo.',
  resultTitle: '3 accounts linked', resultText: 'Salary account · SBI ••4829  |  Smart savings · HDFC ••1037  |  Holiday fund · ICICI ••7152'
}));
$('.add-account').addEventListener('click', () => showModal({
  title: 'Link a bank account', description: 'Connect an account with a secure bank consent flow.',
  resultTitle: 'Bank linking is a demo', resultText: 'A real app would connect through a regulated account aggregator or your bank. No bank details were collected.'
}));
$$('.account-row').forEach((account) => account.addEventListener('click', () => showModal({
  title: account.querySelector('.account-copy b').textContent,
  description: 'Account details (sample data)', resultTitle: 'Account information', resultText: `${account.dataset.account || 'Indian savings account'} · Balance ${account.querySelector('.account-balance').textContent}`
})));
$$('.stat-more').forEach((button) => button.addEventListener('click', () => showModal({
  title: button.getAttribute('aria-label') === 'Income options' ? 'Income this month' : 'Spending this month',
  description: 'Monthly summary based on sample account activity.',
  resultTitle: button.getAttribute('aria-label') === 'Income options' ? '₹1,24,500 credited' : '₹42,350 spent',
  resultText: 'This breakdown is illustrative demo data.'
})));
rows.forEach((row) => row.addEventListener('click', (event) => {
  if (event.target.closest('button, a')) return;
  const cells = row.querySelectorAll('td');
  showModal({
    title: cells[0].querySelector('.merchant-name b').textContent,
    description: cells[0].querySelector('.merchant-name small').textContent,
    resultTitle: `${cells[4].textContent} · ${cells[3].textContent}`,
    resultText: `${cells[1].textContent} · ${cells[2].textContent} · Sample transaction`
  });
}));

$('#spendPeriod').addEventListener('change', (event) => {
  const values = {
    'This month': ['₹42,350', ['₹18,250', '₹10,700', '₹7,100', '₹6,300']],
    'Last month': ['₹38,920', ['₹17,000', '₹9,850', '₹6,420', '₹5,650']],
    'This week': ['₹9,840', ['₹4,250', '₹2,500', '₹1,650', '₹1,440']]
  }[event.target.value];
  $('#spendTotal').textContent = values[0];
  $$('.legend b').forEach((item, index) => { item.textContent = values[1][index]; });
});

const sidebar = $('#sidebar');
$('#menuToggle').addEventListener('click', () => sidebar.classList.toggle('open'));
document.addEventListener('click', (event) => {
  if (window.innerWidth <= 700 && sidebar.classList.contains('open') && !sidebar.contains(event.target) && !event.target.closest('#menuToggle')) sidebar.classList.remove('open');
});
$$('.nav-item').forEach((item) => item.addEventListener('click', (event) => {
  sidebar.classList.remove('open');
  $$('.nav-item').forEach((nav) => nav.classList.remove('active'));
  item.classList.add('active');
  const destination = item.getAttribute('href');
  if (destination === '#cards') {
    event.preventDefault();
    showModal({ title: 'Your Barclays Bank card', description: 'A sample debit card for your linked salary account.', resultTitle: 'Card controls', resultText: 'Card ending 4829 · Active · Online and contactless payments enabled in this demo.' });
  } else if (destination === '#payments') {
    event.preventDefault();
    openTransfer();
  } else if (destination === '#settings') {
    event.preventDefault();
    showModal({ title: 'Settings', description: 'Manage your demo profile preferences.', resultTitle: 'Account preferences', resultText: 'Currency: INR · Region: India · Language: English (India)' });
  }
}));
$('#notificationsButton').addEventListener('click', () => showModal({
  title: 'Notifications', description: 'Recent activity for your account.', resultTitle: 'You’re all caught up', resultText: 'Your salary credit and UPI payment activity will appear here.'
}));
$('#profileButton').addEventListener('click', () => showModal({
  title: 'Rahul Waditake', description: 'Personal profile · India', resultTitle: 'Profile details', resultText: 'Demo customer · Notifications enabled · INR account'
}));
$('.profile').addEventListener('click', () => $('#profileButton').click());
$('#securityLink').addEventListener('click', (event) => {
  event.preventDefault();
  showModal({ title: 'Your money and data', description: 'This site is a front-end banking demo.', resultTitle: 'No real bank connection', resultText: 'It does not collect credentials, connect to a bank, or send payments. Add a compliant banking provider before handling real money.' });
});

// Keep browser links for the dashboard sections local and useful.
$$('a[href="#overview"], a[href="#transactions"], a[href="#insights"]').forEach((link) => link.addEventListener('click', () => {
  const target = link.getAttribute('href');
  $$('.nav-item').forEach((nav) => nav.classList.toggle('active', nav.getAttribute('href') === target));
}));
