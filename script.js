const products = [
  {id:1,name:"جراب جلد كلاسيك",category:"جرابات",price:249,old:299,badge:"أكتر مبيعًا",new:false,desc:"ملمس جلد هادي وحماية محترمة",icon:"▣"},
  {id:2,name:"شاحن حائط 25W",category:"شواحن",price:399,old:449,badge:"سريع",new:true,desc:"PD سريع بحجم صغير",icon:"⚡"},
  {id:3,name:"كابل Type-C متين",category:"كابلات",price:159,old:199,badge:"متين",new:false,desc:"طول 1.5 متر ومغلف بالقماش",icon:"⌁"},
  {id:4,name:"سماعة بلوتوث Retro",category:"سماعات",price:699,old:799,badge:"مميز",new:true,desc:"صوت دافئ وشكل من أيام زمان",icon:"◉"},
  {id:5,name:"اسكرينة حماية كاملة",category:"حماية",price:119,old:149,badge:"خفيفة",new:false,desc:"وضوح عالي وحواف ناعمة",icon:"◇"},
  {id:6,name:"حامل موبايل للمكتب",category:"حوامل",price:289,old:329,badge:"مفيد",new:true,desc:"ثابت ويتظبط على كذا زاوية",icon:"⌂"},
  {id:7,name:"باور بانك 10000mAh",category:"باور بانك",price:649,old:749,badge:"رف العرض",new:false,desc:"بطارية احتياطية عملية وخفيفة",icon:"▰"},
  {id:8,name:"جراب شفاف ضد الصدمات",category:"جرابات",price:199,old:229,badge:"جديد",new:true,desc:"شفاف، مرن، وحواف حماية",icon:"□"},
  {id:9,name:"شاحن سيارة Dual USB",category:"شواحن",price:279,old:319,badge:"رحلات",new:false,desc:"منفذين للشحن داخل العربية",icon:"◈"},
  {id:10,name:"كابل Lightning 1m",category:"كابلات",price:139,old:169,badge:"اقتصادي",new:false,desc:"كابل يومي للاستخدام العادي",icon:"⌁"},
  {id:11,name:"سماعة سلك كلاسيك",category:"سماعات",price:179,old:219,badge:"قديمك نديمك",new:false,desc:"سماعة سلك بسيطة وموثوقة",icon:"♫"},
  {id:12,name:"ستاند سيارة مغناطيسي",category:"حوامل",price:329,old:379,badge:"عملي",new:true,desc:"تركيب سريع ورؤية مريحة",icon:"⊙"}
];

const categories = [
  ["جرابات","▣","من الناعم للصعب"],
  ["شواحن","⚡","سرعة وأمان"],
  ["سماعات","◉","اسمع براحتك"],
  ["كابلات","⌁","وصّلها صح"],
  ["حماية","◇","خليها سليمة"],
  ["حوامل","⌂","ثبّت موبايلك"],
  ["باور بانك","▰","طاقة زيادة"]
];

let state = { category:"الكل", search:"", sort:"featured", cart:JSON.parse(localStorage.getItem("abascoCart")||"[]") };

const $ = s => document.querySelector(s);
const money = n => `${n.toLocaleString("ar-EG")} ج.م`;

function renderCategories(){
  $("#categoryGrid").innerHTML = categories.map(([name,icon,sub]) => `
    <button class="category-card" data-category="${name}">
      <span class="cat-icon">${icon}</span><strong>${name}</strong><small>${sub}</small>
    </button>`).join("");
  $("#filterRow").innerHTML = `<button class="filter active" data-filter="الكل">الكل</button>` +
    categories.map(c=>`<button class="filter" data-filter="${c[0]}">${c[0]}</button>`).join("");
}

function filteredProducts(){
  let list = products.filter(p => state.category==="الكل" || p.category===state.category)
    .filter(p => `${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(state.search.toLowerCase()));
  if(state.sort==="low") list.sort((a,b)=>a.price-b.price);
  if(state.sort==="high") list.sort((a,b)=>b.price-a.price);
  if(state.sort==="new") list.sort((a,b)=>Number(b.new)-Number(a.new));
  return list;
}

function productCard(p, compact=false){
  return `<article class="product-card ${compact?"compact-card":""}">
    <div class="product-visual">
      <span class="product-badge">${p.badge}</span>
      <div class="product-art"><i>${p.icon}</i><small>ABASCO</small></div>
    </div>
    <div class="product-info">
      <small>${p.category}</small><h3>${p.name}</h3><p>${p.desc}</p>
      <div class="price-row"><strong>${money(p.price)}</strong><del>${money(p.old)}</del>
      <button class="add-btn" data-add="${p.id}">+ أضف</button></div>
    </div>
  </article>`;
}

function renderProducts(){
  const list = filteredProducts();
  $("#productsGrid").innerHTML = list.map(p=>productCard(p)).join("");
  $("#emptyState").hidden = list.length>0;
}

function renderNew(){
  $("#newArrivals").innerHTML = products.filter(p=>p.new).slice(0,4).map(p=>productCard(p,true)).join("");
}

function saveCart(){ localStorage.setItem("abascoCart",JSON.stringify(state.cart)); }

function cartDetails(){
  return state.cart.map(item=>({...item, product:products.find(p=>p.id===item.id)})).filter(x=>x.product);
}
function cartTotal(){ return cartDetails().reduce((s,x)=>s+x.product.price*x.qty,0); }

function renderCart(){
  const details=cartDetails();
  $("#cartCount").textContent=details.reduce((s,x)=>s+x.qty,0);
  $("#cartTotal").textContent=money(cartTotal());
  $("#cartItems").innerHTML = details.length ? details.map(x=>`
    <div class="cart-item">
      <div class="mini-art">${x.product.icon}</div>
      <div class="cart-meta"><strong>${x.product.name}</strong><small>${money(x.product.price)}</small>
        <div class="qty"><button data-minus="${x.id}">−</button><b>${x.qty}</b><button data-plus="${x.id}">+</button>
        <button class="remove" data-remove="${x.id}">حذف</button></div>
      </div>
    </div>`).join("") : `<div class="empty-cart"><span>🛍</span><h3>السلة لسه فاضية</h3><p>اختار حاجة من الرفوف وارجع هنا.</p></div>`;
  $("#checkoutSummary").innerHTML = details.length ? `
    <div><span>عدد القطع</span><b>${details.reduce((s,x)=>s+x.qty,0)}</b></div>
    <div><span>إجمالي المنتجات</span><b>${money(cartTotal())}</b></div>` : `<p>أضف منتجات أولًا.</p>`;
}

function addToCart(id){
  const item=state.cart.find(x=>x.id===id);
  item ? item.qty++ : state.cart.push({id,qty:1});
  saveCart(); renderCart(); showToast("اتضاف للسلة — بالهنا والشفا");
}
function openCart(){ $("#cartDrawer").classList.add("open"); $("#overlay").classList.add("show"); }
function closeCart(){ $("#cartDrawer").classList.remove("open"); $("#overlay").classList.remove("show"); }
function showToast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>t.classList.remove("show"),2600); }

document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]"); if(add) addToCart(Number(add.dataset.add));
  const cat=e.target.closest("[data-category]"); if(cat){ state.category=cat.dataset.category; $("#shop").scrollIntoView({behavior:"smooth"}); renderProducts(); updateFilters(); }
  const filter=e.target.closest("[data-filter]"); if(filter){ state.category=filter.dataset.filter; renderProducts(); updateFilters(); }
  const plus=e.target.closest("[data-plus]"); if(plus){ const i=state.cart.find(x=>x.id===Number(plus.dataset.plus)); if(i)i.qty++; saveCart();renderCart(); }
  const minus=e.target.closest("[data-minus]"); if(minus){ const i=state.cart.find(x=>x.id===Number(minus.dataset.minus)); if(i){i.qty--;if(i.qty<=0)state.cart=state.cart.filter(x=>x.id!==i.id)} saveCart();renderCart(); }
  const remove=e.target.closest("[data-remove]"); if(remove){state.cart=state.cart.filter(x=>x.id!==Number(remove.dataset.remove));saveCart();renderCart();}
  if(e.target.matches("[data-close]")) e.target.closest("dialog").close();
});

function updateFilters(){
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===state.category));
}
$("#searchInput").addEventListener("input",e=>{state.search=e.target.value;renderProducts()});
$("#sortSelect").addEventListener("change",e=>{state.sort=e.target.value;renderProducts()});
$("#cartBtn").onclick=openCart; $("#closeCart").onclick=closeCart; $("#overlay").onclick=closeCart;
$("#clearCart").onclick=()=>{state.cart=[];saveCart();renderCart();showToast("السلة اتمسحت")};

$("#checkoutBtn").onclick=()=>{
  if(!state.cart.length) return showToast("السلة فاضية يا زبون");
  closeCart(); $("#checkoutDialog").showModal();
};
$("#checkoutForm").onsubmit=e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(e.target));
  const order={number:"AB-"+Date.now().toString().slice(-6),...data,items:cartDetails(),total:cartTotal(),date:new Date().toISOString()};
  localStorage.setItem("abascoLastOrder",JSON.stringify(order));
  state.cart=[];saveCart();renderCart();e.target.reset();$("#checkoutDialog").close();
  showToast(`تم تسجيل طلبك ${order.number} — شكرًا يا كبير`);
};

$("#accountBtn").onclick=()=>{
  const saved=JSON.parse(localStorage.getItem("abascoCustomer")||"{}");
  $("#accountForm").elements.name.value=saved.name||"";
  $("#accountForm").elements.phone.value=saved.phone||"";
  $("#accountDialog").showModal();
};
$("#accountForm").onsubmit=e=>{
  e.preventDefault();localStorage.setItem("abascoCustomer",JSON.stringify(Object.fromEntries(new FormData(e.target))));
  $("#accountDialog").close();showToast("بياناتك اتحفظت على الجهاز");
};
$("#newsletterForm").onsubmit=e=>{e.preventDefault();e.target.reset();showToast("وصلنا إيميلك — نورت عباسكو")};
$("#shippingLink").onclick=e=>{e.preventDefault();alert("الشحن متاح حسب المنطقة. الاستبدال يتم وفق حالة المنتج خلال المدة المحددة من المتجر.")};
$("#privacyLink").onclick=e=>{e.preventDefault();alert("عباسكو يحفظ بيانات السلة والحساب محليًا على جهازك في النسخة التجريبية الحالية.")};
$("#mobileMenuBtn").onclick=()=>$("#mainNav").classList.toggle("open");
document.querySelectorAll(".main-nav a").forEach(a=>a.onclick=()=>$("#mainNav").classList.remove("open"));

renderCategories();renderProducts();renderNew();renderCart();
