
const KEY="ghadghod_store_v1";
const defaultData={
 settings:{pink:"#ef9fc0",cyan:"#5bd4dc",ink:"#3f4a4d",store:"𝙶𝙷𝙰𝙳𝙶𝙷𝙾𝙳 𝙱𝚁𝙰𝙽𝙳",whatsapp:"201016581380"},
 products:[
  {id:1,nameAr:"بوكيه ورد أنيق",nameEn:"Elegant Flower Bouquet",price:650,cat:"بوكيهات الورد",img:""},
  {id:2,nameAr:"هدية أنثوية",nameEn:"Lovely Gift Box",price:450,cat:"هدايا",img:""},
  {id:3,nameAr:"طقم حريمي",nameEn:"Women Set",price:850,cat:"ملابس",img:""},
  {id:4,nameAr:"إكسسوار أنيق",nameEn:"Elegant Accessory",price:300,cat:"مستلزمات",img:""}
 ],
 orders:[]
};
let data=JSON.parse(localStorage.getItem(KEY)||"null")||defaultData;
function save(){localStorage.setItem(KEY,JSON.stringify(data));}
function applyTheme(){document.documentElement.style.setProperty("--pink",data.settings.pink);document.documentElement.style.setProperty("--cyan",data.settings.cyan);document.documentElement.style.setProperty("--ink",data.settings.ink)}
applyTheme();
function money(n){return new Intl.NumberFormat("ar-EG",{style:"currency",currency:"EGP",maximumFractionDigits:0}).format(n)}
function getCart(){return JSON.parse(localStorage.getItem("ghadghod_cart")||"[]")}
function setCart(c){localStorage.setItem("ghadghod_cart",JSON.stringify(c))}
function productName(p){return document.documentElement.lang==="en"?p.nameEn:p.nameAr}
function renderProducts(targetId="products"){const el=document.getElementById(targetId);if(!el)return;el.innerHTML=data.products.map(p=>`<article class="card"><div class="card-img">${p.img?`<img src="${p.img}" alt="">`:`<div class="placeholder">🛍️</div>`}</div><div class="card-body"><div class="muted">${p.cat}</div><h3>${productName(p)}</h3><div class="price">${money(p.price)}</div><button class="btn" onclick="addToCart(${p.id})">${document.documentElement.lang==="en"?"Add to cart":"أضف للسلة"}</button></div></article>`).join("")}
function addToCart(id){let c=getCart();let x=c.find(i=>i.id===id);if(x)x.qty++;else c.push({id,qty:1});setCart(c);renderCart();openModal("cartModal")}
function renderCart(){const el=document.getElementById("cartItems");if(!el)return;let c=getCart();if(!c.length){el.innerHTML="<p class='muted'>السلة فارغة</p>";document.getElementById("cartTotal").textContent=money(0);return}let total=0;el.innerHTML=c.map(i=>{let p=data.products.find(x=>x.id===i.id);if(!p)return "";total+=p.price*i.qty;return `<div class="cart-row"><div style="font-size:28px">🛍️</div><div><b>${productName(p)}</b><div class="muted">${money(p.price)}</div></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${i.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div>`}).join("");document.getElementById("cartTotal").textContent=money(total)}
function changeQty(id,d){let c=getCart(),x=c.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)c=c.filter(i=>i.id!==id);setCart(c);renderCart()}
function openModal(id){document.getElementById(id).classList.add("open");if(id==="cartModal")renderCart()}
function closeModal(id){document.getElementById(id).classList.remove("open")}
function goCheckout(){if(!getCart().length)return alert("السلة فارغة");closeModal("cartModal");openModal("checkoutModal");calcDeposit()}
function calcDeposit(){let c=getCart(),t=0;c.forEach(i=>{let p=data.products.find(x=>x.id===i.id);if(p)t+=p.price*i.qty});let online=document.getElementById("payOnline"),d=document.getElementById("deposit");if(d)d.textContent=money(t*.3);let total=document.getElementById("checkoutTotal");if(total)total.textContent=money(t);if(online)online.checked=true}
function submitOrder(e){e.preventDefault();let f=new FormData(e.target),c=getCart(),items=[],total=0;c.forEach(i=>{let p=data.products.find(x=>x.id===i.id);if(p){items.push({name:p.nameAr,qty:i.qty,price:p.price});total+=p.price*i.qty}});let pay=f.get("payment"),order={id:Date.now(),date:new Date().toLocaleString("ar-EG"),name:f.get("name"),phone:f.get("phone"),address:f.get("address"),payment:pay,total,deposit:pay==="cod"?total*.3:total,items,status:"جديد"};data.orders.unshift(order);save();setCart([]);let msg=`طلب جديد من ${data.settings.store}%0A%0Aالاسم: ${order.name}%0Aالهاتف: ${order.phone}%0Aالعنوان: ${order.address}%0Aالدفع: ${pay==="cod"?"عند الاستلام - عربون 30%":"دفع أونلاين"}%0A%0A${items.map(x=>`• ${x.name} × ${x.qty} = ${x.price*x.qty} جنيه`).join("%0A")}%0A%0Aالإجمالي: ${total} جنيه%0Aالمطلوب مقدمًا: ${order.deposit} جنيه`;window.open(`https://wa.me/${data.settings.whatsapp}?text=${msg}`,"_blank");closeModal("checkoutModal");alert("تم تسجيل الطلب وتجهيز رسالة WhatsApp.");}
function setLang(lang){document.documentElement.lang=lang;document.querySelectorAll("[data-ar]").forEach(el=>el.textContent=lang==="en"?el.dataset.en:el.dataset.ar);renderProducts();renderCart();document.body.dir=lang==="en"?"ltr":"rtl";localStorage.setItem("ghadghod_lang",lang)}
window.addEventListener("DOMContentLoaded",()=>{setLang(localStorage.getItem("ghadghod_lang")||"ar");document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));});
