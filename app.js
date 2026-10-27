const $ = (id) => document.getElementById(id);
$('year').textContent = new Date().getFullYear();
$('menuBtn').addEventListener('click', () => $('nav').classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => $('nav').classList.remove('open')));

const hooks = {
  comments: ['شنو رأيكم؟ شاركونا بالتعليقات 👇', 'نحب نسمع تجربتكم! اكتبولنا رأيكم بالتعليقات 💬'],
  views: ['تابعوا للنهاية حتى تشوفون النتيجة ✨', 'خليكم ويانا للنهاية، التفاصيل تستاهل 👀'],
  sales: ['راسلونا حتى تعرفون التفاصيل أكثر 📩', 'إذا تحتاجون هالخدمة، تواصلوا ويانا ونسعد نساعدكم 🤝'],
  followers: ['تابعوا الحساب حتى توصلكم أفكار جديدة باستمرار ✨', 'إذا يعجبكم هالنوع من المحتوى، تابعونا للمزيد 🙌']
};
const tones = {
  friendly: ['خلّونا نحچي عن {niche} بطريقة بسيطة وقريبة منكم.', 'كل يوم فرصة نتعلم شي جديد عن {niche}، وهاي فكرتنا لليوم:'],
  professional: ['نشارككم اليوم نظرة مختصرة ومفيدة حول {niche}.', 'هدفنا تقديم محتوى واضح وعملي عن {niche} يساعدكم على اتخاذ قرار أفضل.'],
  fun: ['منو مثلي يحب سوالف {niche}؟ 😄', 'خلّونا نضيف شوية حماس لعالم {niche}! جاهزين؟ 🔥']
};
$('captionForm').addEventListener('submit', e => {
  e.preventDefault();
  const niche = $('niche').value.trim();
  if (!niche) return;
  const platform = $('platform').value;
  const goal = $('goal').value;
  const tone = $('tone').value;
  const opening = tones[tone][Math.floor(Math.random() * tones[tone].length)].replaceAll('{niche}', niche);
  const hookList = hooks[goal];
  const hook = hookList[Math.floor(Math.random() * hookList.length)];
  const tags = [...new Set(['#' + niche.replace(/\s+/g,''), '#محتوى', '#نصائح', platform === 'TikTok' ? '#تيك_توك' : platform === 'Instagram' ? '#انستغرام' : '#فيسبوك'])].join(' ');
  const text = `${opening}\n\n${hook}\n\n${tags}\n\nملاحظة: عدّل النص وأضف تجربتك أو تفاصيلك الحقيقية قبل النشر.`;
  $('output').className = 'generated-content';
  $('output').textContent = text;
  $('copyBtn').disabled = false;
  $('copyStatus').textContent = '';
});
$('copyBtn').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('output').textContent);
    $('copyStatus').textContent = 'تم نسخ النص';
  } catch {
    const range = document.createRange(); range.selectNodeContents($('output'));
    const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
    $('copyStatus').textContent = 'حدّد النص ثم انسخه';
  }
});

const KEY = 'socialboost.orders.v1';
function getOrders(){ try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []} }
function saveOrders(items){ localStorage.setItem(KEY, JSON.stringify(items)); renderOrders(); }
function escapeHtml(s){return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderOrders(){
  const items = getOrders();
  $('orderCount').textContent = items.length;
  $('clearOrders').hidden = !items.length;
  if(!items.length){$('ordersList').innerHTML='<div class="empty-state"><span>▤</span><b>ما عندك طلبات بعد</b><p>الطلبات الجديدة تظهر هنا على هذا الجهاز.</p></div>';return;}
  $('ordersList').innerHTML = items.slice().reverse().map(o => `<article class="order-item"><strong>${escapeHtml(o.service)}</strong><p>${escapeHtml(o.name)} · ${escapeHtml(o.platform)}</p><div class="order-meta"><span>${escapeHtml(o.date)}</span><span class="status">محفوظ محلياً</span></div></article>`).join('');
}
$('orderForm').addEventListener('submit', e => {
  e.preventDefault();
  const order = {
    id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    name: $('customerName').value.trim(),
    contact: $('customerContact').value.trim(),
    service: $('serviceType').value,
    platform: $('orderPlatform').value,
    details: $('orderDetails').value.trim(),
    date: new Date().toLocaleDateString('ar-IQ')
  };
  if(!order.name || !order.contact) return;
  saveOrders([...getOrders(), order]);
  $('orderForm').reset();
  alert('تم حفظ الطلب على هذا الجهاز. لإرسال الطلبات فعلياً إلى صاحب الموقع، يلزم إعداد قاعدة بيانات وخدمة خلفية.');
  $('ordersList').scrollIntoView({behavior:'smooth',block:'nearest'});
});
$('clearOrders').addEventListener('click', () => {
  if(confirm('هل تريد مسح كل الطلبات المحفوظة على هذا الجهاز؟')){localStorage.removeItem(KEY);renderOrders();}
});
renderOrders();
