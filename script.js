/* =========================================================================
   MTRREAL — SCRIPT.JS
   Vanilla JS, sem dependências. Lê os produtos de assets/data/products.js
   ========================================================================= */

(function(){
  "use strict";

  /* ---------------------------------------------------------------------
     CONFIGURAÇÃO — troque aqui o número de WhatsApp da loja
     Formato: código do país + DDD + número, só dígitos.
     Exemplo Maringá/PR: 55 44 91234-5678  ->  "5544912345678"
  --------------------------------------------------------------------- */
  const WHATSAPP_NUMBER = "5544988045611"; // só dígitos: 55 (país) + 44 (DDD) + número
  const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     HELPERS
  --------------------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const money = (n) => "R$ " + n.toFixed(2).replace(".", ",");

  function findProduct(id){ return products.find(p => p.id === id); }

  /* ---------------------------------------------------------------------
     NAV — fundo sólido ao rolar
  --------------------------------------------------------------------- */
  const nav = $("#nav");
  function onScroll(){
    nav.classList.toggle("is-solid", window.scrollY > 40);
  }
  document.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  /* smooth scroll to section via data-link buttons */
  function goTo(id){
    const el = document.getElementById(id);
    if(!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block:"start" });
  }
  $$("[data-link]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      closeMobileMenu();
      goTo(btn.dataset.target);
    });
  });

  /* ---------------------------------------------------------------------
     MOBILE MENU
  --------------------------------------------------------------------- */
  const burgerBtn = $("#burgerBtn");
  const mobileMenu = $("#mobileMenu");

  function openMobileMenu(){
    mobileMenu.hidden = false;
    requestAnimationFrame(()=> mobileMenu.classList.add("is-open"));
    burgerBtn.setAttribute("aria-expanded","true");
    document.body.style.overflow = "hidden";
  }
  function closeMobileMenu(){
    mobileMenu.classList.remove("is-open");
    burgerBtn.setAttribute("aria-expanded","false");
    document.body.style.overflow = "";
    setTimeout(()=>{ if(!mobileMenu.classList.contains("is-open")) mobileMenu.hidden = true; }, 260);
  }
  burgerBtn.addEventListener("click", ()=>{
    mobileMenu.classList.contains("is-open") ? closeMobileMenu() : openMobileMenu();
  });

  $("#mobileCartBtn").addEventListener("click", ()=>{ closeMobileMenu(); openCart(); });

  /* ---------------------------------------------------------------------
     LOGO INTERATIVA — mouse (desktop) e toque (mobile)
     Rotação segue o cursor/dedo e desacelera suavemente ao soltar.
  --------------------------------------------------------------------- */
  (function initEmblem(){
    const wrap = $("#emblemWrap");
    const emblem = $("#emblem");
    if(!wrap || !emblem || prefersReducedMotion) return;

    let target = 0;      // ângulo alvo
    let current = 0;     // ângulo atual (interpolado)
    let velocity = 0;
    let dragging = false;
    let raf = null;

    function rectCenter(){
      const r = wrap.getBoundingClientRect();
      return { x: r.left + r.width/2, y: r.top + r.height/2 };
    }

    function angleFromPoint(x,y){
      const c = rectCenter();
      const dx = x - c.x, dy = y - c.y;
      const dist = Math.min(Math.hypot(dx,dy), 220);
      const raw = (dx/220) * 34; // graus máx.
      return raw;
    }

    function loop(){
      if(dragging){
        current += (target - current) * 0.16;
      } else {
        // desacelera até 0 naturalmente
        current += (0 - current) * 0.045;
        if(Math.abs(current) < 0.05) current = 0;
      }
      emblem.style.transform = `rotate(${current}deg)`;
      if(dragging || Math.abs(current) > 0.05){
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }
    function ensureLoop(){ if(!raf) raf = requestAnimationFrame(loop); }

    // Desktop
    wrap.addEventListener("mousemove", (e)=>{
      dragging = true;
      target = angleFromPoint(e.clientX, e.clientY);
      ensureLoop();
    });
    wrap.addEventListener("mouseleave", ()=>{
      dragging = false;
      ensureLoop();
    });

    // Mobile — toque e swipe
    wrap.addEventListener("touchstart", (e)=>{
      dragging = true;
      const t = e.touches[0];
      target = angleFromPoint(t.clientX, t.clientY);
      ensureLoop();
    }, { passive:true });
    wrap.addEventListener("touchmove", (e)=>{
      const t = e.touches[0];
      target = angleFromPoint(t.clientX, t.clientY);
      ensureLoop();
    }, { passive:true });
    wrap.addEventListener("touchend", ()=>{
      dragging = false;
      ensureLoop();
    });
  })();

  /* ---------------------------------------------------------------------
     REVEAL ON SCROLL
  --------------------------------------------------------------------- */
  function observeReveal(){
    const els = $$(".reveal");
    if(prefersReducedMotion || !("IntersectionObserver" in window)){
      els.forEach(el=> el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.14 });
    els.forEach(el=> io.observe(el));
  }

  /* ---------------------------------------------------------------------
     MEDIA
  --------------------------------------------------------------------- */
  function mediaBlock(src, alt){
    const wrap = document.createElement("div");
    wrap.className = "piece__media-inner";
    wrap.style.position = "relative";
    wrap.style.width = "100%";
    wrap.style.height = "100%";

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    img.draggable = false;

    img.addEventListener("error", ()=>{
      img.classList.add("img-missing");
    }, { once:true });

    wrap.appendChild(img);
    return wrap;
  }

  /* ---------------------------------------------------------------------
     NEW DROP — peça em destaque
  --------------------------------------------------------------------- */
  function renderNewDrop(){
    const slot = $("#newDropSlot");
    const piece = products.find(p => p.newDrop) || products[0];
    if(!piece){ slot.innerHTML = ""; return; }

    const el = document.createElement("article");
    el.className = "featured-piece reveal";

    const media = document.createElement("button");
    media.className = "featured-piece__media";
    media.setAttribute("aria-label", "Ver " + piece.name);
    media.appendChild(mediaBlock(piece.images.front, piece.name, "foto em breve"));
    media.addEventListener("click", ()=> openProduct(piece.id, media));

    const body = document.createElement("div");
    body.className = "featured-piece__body";
    body.innerHTML = `
      <p class="featured-piece__cat">${labelCategory(piece.category)}</p>
      <h3 class="featured-piece__name">${piece.name}</h3>
      <p class="featured-piece__price">${money(piece.price)}</p>
    `;
    const cta = document.createElement("button");
    cta.className = "featured-piece__cta";
    cta.innerHTML = `<span>VIEW PIECE</span>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`;
    cta.addEventListener("click", ()=> openProduct(piece.id, media));
    body.appendChild(cta);

    el.appendChild(media);
    el.appendChild(body);
    slot.appendChild(el);
  }

  function labelCategory(cat){
    const map = { camisetas:"CAMISETAS", moletons:"MOLETONS", camisas:"CAMISAS" };
    return map[cat] || cat.toUpperCase();
  }

  /* ---------------------------------------------------------------------
     GRIDS EDITORIAIS POR CATEGORIA
  --------------------------------------------------------------------- */
  const spanPattern = ["piece--wide","piece--narrow","piece--narrow","piece--wide"];

  function renderCategoryGrid(category){
    // peças com `collection` ou `shelf` aparecem só na sub-aba / prateleira indicada
    renderGrid($("#grid-" + category), products.filter(p => p.category === category && !p.collection && !p.shelf));
  }

  function renderGrid(grid, items){
    if(!grid) return;

    items.forEach((piece, i)=>{
      const article = document.createElement("article");
      article.className = "piece reveal " + spanPattern[i % spanPattern.length] + (i % 3 === 1 ? " piece--offset" : "");

      const media = document.createElement("button");
      media.className = "piece__media";
      media.setAttribute("aria-label","Ver " + piece.name);
      media.appendChild(mediaBlock(piece.images.front, piece.name));
      media.addEventListener("click", ()=> openProduct(piece.id, media));

      if(piece.newDrop){
        const tag = document.createElement("span");
        tag.className = "piece__tag";
        tag.textContent = "NEW";
        media.appendChild(tag);
      }

      const meta = document.createElement("div");
      meta.className = "piece__meta";
      meta.innerHTML = `<span class="piece__name">${piece.name}</span><span class="piece__price">${money(piece.price)}</span>`;

      article.appendChild(media);
      article.appendChild(meta);
      grid.appendChild(article);
    });
  }

  ["camisetas","moletons"].forEach(renderCategoryGrid);
  renderNewDrop();
  initColecoes();
  initShelves();
  observeReveal();

  /* ---------------------------------------------------------------------
     PRATELEIRAS — linhas horizontais na página inicial
     Nomes fixos: prateleira-camisas | prateleira-moletons
     Para colocar uma peça, use `shelf: "prateleira-moletons"` no products.js.
     Cada peça real substitui um card de exemplo (sempre no mínimo 4 cards).
  --------------------------------------------------------------------- */
  function initShelves(){
    const SHELF_MIN = 4;

    function shelfButton(text, onClick){
      const btn = document.createElement("button");
      btn.className = "btn btn--outline shelf__cta";
      btn.textContent = text;
      if(onClick) btn.addEventListener("click", onClick);
      else btn.disabled = true;
      return btn;
    }

    function productCard(piece){
      const article = document.createElement("article");
      article.className = "piece shelf__card reveal";

      const media = document.createElement("button");
      media.className = "piece__media";
      media.setAttribute("aria-label","Ver " + piece.name);
      media.appendChild(mediaBlock(piece.images.front, piece.name));
      media.addEventListener("click", ()=> openProduct(piece.id, media));

      if(piece.newDrop){
        const tag = document.createElement("span");
        tag.className = "piece__tag";
        tag.textContent = "NEW";
        media.appendChild(tag);
      }

      const meta = document.createElement("div");
      meta.className = "piece__meta";
      meta.innerHTML = `<span class="piece__name">${piece.name}</span><span class="piece__price">${money(piece.price)}</span>`;

      article.appendChild(media);
      article.appendChild(meta);
      article.appendChild(shelfButton("VER PEÇA", ()=> openProduct(piece.id, media)));
      return article;
    }

    function placeholderCard(){
      const article = document.createElement("article");
      article.className = "piece shelf__card shelf__card--placeholder reveal";
      article.innerHTML = `
        <div class="piece__media" aria-hidden="true"></div>
        <div class="piece__meta"><span class="piece__name">Produto em breve</span><span class="piece__price">${money(0)}</span></div>
      `;
      article.appendChild(shelfButton("VER PEÇA"));
      return article;
    }

    $$(".shelf").forEach(shelf=>{
      const track = $(".shelf__track", shelf);
      const prev = $(".shelf__arrow--prev", shelf);
      const next = $(".shelf__arrow--next", shelf);
      if(!track) return;

      const items = products.filter(p => p.shelf === shelf.id);
      items.forEach(piece => track.appendChild(productCard(piece)));
      for(let i = items.length; i < SHELF_MIN; i++) track.appendChild(placeholderCard());

      function step(dir){
        track.scrollBy({ left: dir * track.clientWidth, behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
      function updateArrows(){
        const max = track.scrollWidth - track.clientWidth - 2;
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= max;
      }
      prev.addEventListener("click", ()=> step(-1));
      next.addEventListener("click", ()=> step(1));
      track.addEventListener("scroll", updateArrows, { passive:true });
      window.addEventListener("resize", updateArrows);
      updateArrows();
    });
  }

  /* ---------------------------------------------------------------------
     COLEÇÕES — abas com sub-abas (Novidades / Mais vendidos / Promoções)
     Cada sub-aba tem id "<aba>-<sub-aba>", ex: "camisas-novidades".
     Para colocar uma peça numa sub-aba, use `collection: "camisas-novidades"`
     no products.js.
  --------------------------------------------------------------------- */
  function initColecoes(){
    const COLLECTIONS = [
      { id:"camisas",   label:"CAMISAS" },
      { id:"moletons",  label:"MOLETONS" },
    ];
    const SUBTABS = [
      { id:"novidades",     label:"NOVIDADES" },
      { id:"mais-vendidos", label:"MAIS VENDIDOS" },
      { id:"promocoes",     label:"PROMOÇÕES" },
    ];

    const section = $("#colecoes");
    const panelsWrap = $("#colecoesPanels");
    const dropdown = $("#colecoesDropdown");
    const toggleBtn = $("#colecoesBtn");
    const desktopMenu = $("#colecoesMenu");
    const mobileToggle = $("#mobileColecoesBtn");
    const mobileMenuList = $("#mobileColecoes");
    if(!section || !panelsWrap) return;

    const panelIds = [];

    /* painéis (um por sub-aba) */
    COLLECTIONS.forEach(col=>{
      SUBTABS.forEach(sub=>{
        const key = col.id + "-" + sub.id;
        panelIds.push(key);

        const panel = document.createElement("div");
        panel.className = "colecoes__panel";
        panel.id = key;
        panel.hidden = true;

        const tabs = SUBTABS.map(s =>
          `<button class="nav__link${s.id === sub.id ? " is-active" : ""}" data-colecao="${col.id}-${s.id}"${s.id === sub.id ? ' aria-current="page"' : ""}>${s.label}</button>`
        ).join("");

        panel.innerHTML = `
          <div class="section-head">
            <h2 id="${key}-title">${col.label} — ${sub.label}</h2>
            <p class="section-head__sub">Coleções / ${col.label}</p>
          </div>
          <nav class="colecoes__tabs" aria-label="Sub-abas de ${col.label}">${tabs}</nav>
          <div class="editorial-grid" id="grid-${key}"></div>
          <p class="colecoes__empty">Em breve novos produtos aqui</p>
        `;
        panel.setAttribute("role","region");
        panel.setAttribute("aria-labelledby", key + "-title");
        panelsWrap.appendChild(panel);

        const items = products.filter(p => p.collection === key);
        renderGrid($("#grid-" + key, panel), items);
        if(items.length) $(".colecoes__empty", panel).hidden = true;
      });
    });

    /* menu (desktop e mobile): aba principal -> mostra as 3 sub-abas */
    function buildMenu(container){
      COLLECTIONS.forEach(col=>{
        const group = document.createElement("div");
        group.className = "colecoes-menu__group";
        const listId = container.id + "-" + col.id;
        group.innerHTML = `
          <button class="colecoes-menu__main" aria-expanded="false" aria-controls="${listId}">${col.label}</button>
          <div class="colecoes-menu__subs" id="${listId}" hidden>
            ${SUBTABS.map(s => `<button class="colecoes-menu__sub" data-colecao="${col.id}-${s.id}">${s.label}</button>`).join("")}
          </div>
        `;
        const mainBtn = $(".colecoes-menu__main", group);
        const subs = $(".colecoes-menu__subs", group);
        mainBtn.addEventListener("click", ()=>{
          const open = mainBtn.getAttribute("aria-expanded") !== "true";
          // fecha as outras abas do mesmo menu
          $$(".colecoes-menu__main", container).forEach(b=>{
            b.setAttribute("aria-expanded","false");
            $("#" + b.getAttribute("aria-controls")).hidden = true;
          });
          mainBtn.setAttribute("aria-expanded", String(open));
          subs.hidden = !open;
        });
        container.appendChild(group);
      });
    }
    if(desktopMenu) buildMenu(desktopMenu);
    if(mobileMenuList) buildMenu(mobileMenuList);

    /* abrir / fechar dropdown do desktop */
    function setDropdown(open){
      if(!toggleBtn) return;
      toggleBtn.setAttribute("aria-expanded", String(open));
      desktopMenu.hidden = !open;
    }
    if(toggleBtn){
      toggleBtn.addEventListener("click", (e)=>{
        e.stopPropagation();
        setDropdown(desktopMenu.hidden);
      });
      document.addEventListener("click", (e)=>{
        if(!dropdown.contains(e.target)) setDropdown(false);
      });
      document.addEventListener("keydown", (e)=>{
        if(e.key === "Escape" && !desktopMenu.hidden){ setDropdown(false); toggleBtn.focus(); }
      });
    }

    /* abrir / fechar lista no menu mobile */
    if(mobileToggle){
      mobileToggle.addEventListener("click", ()=>{
        const open = mobileToggle.getAttribute("aria-expanded") !== "true";
        mobileToggle.setAttribute("aria-expanded", String(open));
        mobileMenuList.hidden = !open;
        mobileMenu.classList.toggle("has-colecoes-open", open);
      });
    }

    /* mostrar uma sub-aba */
    function showColecao(key, scroll){
      if(!panelIds.includes(key)) return;
      section.hidden = false;
      panelIds.forEach(id=>{ document.getElementById(id).hidden = id !== key; });
      $$(".colecoes-menu__sub").forEach(b=> b.classList.toggle("is-active", b.dataset.colecao === key));
      if(history.replaceState) history.replaceState(null, "", "#" + key);
      observeReveal();
      if(scroll) goTo("colecoes");
    }

    document.addEventListener("click", (e)=>{
      const btn = e.target.closest("[data-colecao]");
      if(!btn) return;
      if(btn.tagName === "A") e.preventDefault();
      setDropdown(false);
      if(!mobileMenu.hidden) closeMobileMenu();
      showColecao(btn.dataset.colecao, true);
    });

    /* link direto, ex: site.com/#camisas-novidades */
    const fromHash = decodeURIComponent(location.hash.slice(1));
    if(panelIds.includes(fromHash)) showColecao(fromHash, true);
    window.addEventListener("hashchange", ()=>{
      const key = decodeURIComponent(location.hash.slice(1));
      if(panelIds.includes(key)) showColecao(key, true);
    });
  }

  /* =======================================================================
     PRODUCT VIEW (overlay contínuo)
  ======================================================================= */
  const pv = {
    root: $("#productView"),
    scrim: $("#pvScrim"),
    close: $("#pvClose"),
    img: $("#pvImg"),
    frame: $("#pvFrame"),
    prev: $("#pvPrev"),
    next: $("#pvNext"),
    dots: $("#pvDots"),
    cat: $("#pvCat"),
    name: $("#pvName"),
    price: $("#pvPrice"),
    desc: $("#pvDesc"),
    sizes: $("#pvSizes"),
    fabric: $("#pvFabric"),
    construction: $("#pvConstruction"),
    addCart: $("#pvAddCart"),
    whatsapp: $("#pvWhatsapp"),
  };

  let pvState = { product:null, imgKeys:[], imgIndex:0, size:null };
  let lastFocused = null;

  function galleryKeys(product){
    return ["front","back","detail"].filter(k => product.images[k]);
  }

  function renderPvImage(){
    const key = pvState.imgKeys[pvState.imgIndex];
    pv.img.hidden = false;
    pv.img.src = pvState.product.images[key];
    pv.img.alt = pvState.product.name + " — " + key;
    pv.img.onerror = ()=>{ pv.img.hidden = true; };
    $$("button", pv.dots).forEach((d,i)=> d.classList.toggle("is-active", i === pvState.imgIndex));
  }

  function openProduct(id){
    const product = findProduct(id);
    if(!product) return;
    lastFocused = document.activeElement;

    pvState = { product, imgKeys: galleryKeys(product), imgIndex:0, size:null };

    pv.cat.textContent = labelCategory(product.category);
    pv.name.textContent = product.name;
    pv.price.textContent = money(product.price);
    pv.desc.textContent = product.description;
    pv.fabric.textContent = product.fabric;
    pv.construction.textContent = product.construction;

    pv.dots.innerHTML = "";
    pvState.imgKeys.forEach((k,i)=>{
      const b = document.createElement("button");
      b.setAttribute("aria-label","Foto " + (i+1));
      b.addEventListener("click", ()=>{ pvState.imgIndex = i; renderPvImage(); });
      pv.dots.appendChild(b);
    });
    renderPvImage();

    pv.sizes.innerHTML = "";
    product.sizes.forEach(size=>{
      const soldOut = product.soldOut.includes(size);
      const b = document.createElement("button");
      b.className = "size-btn" + (soldOut ? " is-soldout" : "");
      b.textContent = size;
      b.disabled = soldOut;
      b.setAttribute("aria-pressed","false");
      b.addEventListener("click", ()=>{
        pvState.size = size;
        $$(".size-btn", pv.sizes).forEach(s=> s.classList.remove("is-selected"));
        b.classList.add("is-selected");
      });
      pv.sizes.appendChild(b);
    });

    const doOpen = ()=>{
      pv.root.hidden = false;
      pv.scrim.hidden = false;
      requestAnimationFrame(()=> pv.scrim.classList.add("is-visible"));
      document.body.style.overflow = "hidden";
      pv.close.focus();
    };

    if(document.startViewTransition && !prefersReducedMotion){
      document.startViewTransition(doOpen);
    } else {
      doOpen();
    }
  }

  function closeProduct(){
    const doClose = ()=>{
      pv.root.hidden = true;
      pv.scrim.classList.remove("is-visible");
      pv.scrim.hidden = true;
      document.body.style.overflow = "";
      if(lastFocused) lastFocused.focus();
    };
    if(document.startViewTransition && !prefersReducedMotion){
      document.startViewTransition(doClose);
    } else {
      doClose();
    }
  }

  pv.close.addEventListener("click", closeProduct);
  pv.scrim.addEventListener("click", ()=>{ if(!pv.root.hidden) closeProduct(); });
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && !pv.root.hidden) closeProduct();
  });

  pv.prev.addEventListener("click", ()=>{
    pvState.imgIndex = (pvState.imgIndex - 1 + pvState.imgKeys.length) % pvState.imgKeys.length;
    renderPvImage();
  });
  pv.next.addEventListener("click", ()=>{
    pvState.imgIndex = (pvState.imgIndex + 1) % pvState.imgKeys.length;
    renderPvImage();
  });

  // swipe on mobile gallery
  (function swipeGallery(){
    let startX = 0, deltaX = 0, touching = false;
    pv.frame.addEventListener("touchstart", (e)=>{
      touching = true; startX = e.touches[0].clientX; deltaX = 0;
    }, { passive:true });
    pv.frame.addEventListener("touchmove", (e)=>{
      if(!touching) return;
      deltaX = e.touches[0].clientX - startX;
    }, { passive:true });
    pv.frame.addEventListener("touchend", ()=>{
      if(!touching) return;
      touching = false;
      if(Math.abs(deltaX) > 44){
        if(deltaX < 0) pv.next.click(); else pv.prev.click();
      }
    });
  })();

  pv.whatsapp.addEventListener("click", ()=>{
    if(!pvState.size){
      flashSizeWarning();
      return;
    }
    const msg = `Olá, quero comprar a ${pvState.product.name}, tamanho ${pvState.size}.`;
    window.open(`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(msg)}`, "_blank");
  });

  pv.addCart.addEventListener("click", ()=>{
    if(!pvState.size){
      flashSizeWarning();
      return;
    }
    addToCart(pvState.product, pvState.size);
    showToast(pvState.product.name + " — tamanho " + pvState.size + " adicionado.");
  });

  function flashSizeWarning(){
    pv.sizes.animate(
      [{ transform:"translateX(0)" },{ transform:"translateX(-4px)" },{ transform:"translateX(4px)" },{ transform:"translateX(0)" }],
      { duration:260 }
    );
    showToast("Selecione um tamanho antes de continuar.");
  }

  /* =======================================================================
     CARRINHO
  ======================================================================= */
  const CART_KEY = "mtrreal_cart_v1";
  let cart = [];
  try{
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if(Array.isArray(saved)) cart = saved;
  } catch(e){ cart = []; }

  function saveCart(){
    try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch(e){ /* ignora se indisponível */ }
  }

  function addToCart(product, size){
    const existing = cart.find(i => i.id === product.id && i.size === size);
    if(existing){ existing.qty += 1; }
    else {
      cart.push({ id: product.id, name: product.name, price: product.price, size, qty: 1, image: product.images.front });
    }
    saveCart();
    renderCart();
  }

  function changeQty(id, size, delta){
    const item = cart.find(i => i.id === id && i.size === size);
    if(!item) return;
    item.qty += delta;
    if(item.qty <= 0){ cart = cart.filter(i => !(i.id === id && i.size === size)); }
    saveCart();
    renderCart();
  }

  function removeItem(id, size){
    cart = cart.filter(i => !(i.id === id && i.size === size));
    saveCart();
    renderCart();
  }

  const cartCount = $("#cartCount");
  const mobileCartCount = $("#mobileCartCount");
  const cartItemsEl = $("#cartItems");
  const cartEmptyEl = $("#cartEmpty");
  const cartSubtotalEl = $("#cartSubtotal");
  const cartCheckoutBtn = $("#cartCheckout");

  function renderCart(){
    const totalQty = cart.reduce((s,i)=> s + i.qty, 0);
    cartCount.hidden = totalQty === 0;
    cartCount.textContent = totalQty;
    mobileCartCount.textContent = totalQty ? `(${totalQty})` : "";

    cartItemsEl.innerHTML = "";
    if(cart.length === 0){
      cartItemsEl.appendChild(cartEmptyEl);
      cartEmptyEl.hidden = false;
    } else {
      cartEmptyEl.hidden = true;
      cart.forEach(item=>{
        const row = document.createElement("div");
        row.className = "cart-item";

        const mediaWrap = document.createElement("div");
        mediaWrap.className = "cart-item__media";
        const img = document.createElement("img");
        img.src = item.image; img.alt = item.name;
        img.addEventListener("error", ()=>{ img.style.opacity = "0"; });
        mediaWrap.appendChild(img);

        const info = document.createElement("div");
        info.innerHTML = `
          <p class="cart-item__name">${item.name}</p>
          <p class="cart-item__size">TAM ${item.size}</p>
          <p class="cart-item__price">${money(item.price * item.qty)}</p>
        `;
        const qtyRow = document.createElement("div");
        qtyRow.className = "cart-item__qty";
        const minus = document.createElement("button");
        minus.textContent = "–"; minus.setAttribute("aria-label","Diminuir quantidade");
        minus.addEventListener("click", ()=> changeQty(item.id, item.size, -1));
        const qtyLabel = document.createElement("span");
        qtyLabel.textContent = item.qty; qtyLabel.style.fontFamily = "var(--font-mono)"; qtyLabel.style.fontSize = "12px";
        const plus = document.createElement("button");
        plus.textContent = "+"; plus.setAttribute("aria-label","Aumentar quantidade");
        plus.addEventListener("click", ()=> changeQty(item.id, item.size, 1));
        qtyRow.append(minus, qtyLabel, plus);
        info.appendChild(qtyRow);

        const remove = document.createElement("button");
        remove.className = "cart-item__remove";
        remove.textContent = "remover";
        remove.addEventListener("click", ()=> removeItem(item.id, item.size));

        row.append(mediaWrap, info, remove);
        cartItemsEl.appendChild(row);
      });
    }

    const subtotal = cart.reduce((s,i)=> s + i.price * i.qty, 0);
    cartSubtotalEl.textContent = money(subtotal);
    cartCheckoutBtn.disabled = cart.length === 0;
  }

  const cartDrawer = $("#cartDrawer");
  const cartScrim = $("#cartScrim");
  function openCart(){
    cartDrawer.hidden = false; cartScrim.hidden = false;
    requestAnimationFrame(()=>{ cartDrawer.classList.add("is-open"); cartScrim.classList.add("is-visible"); });
    document.body.style.overflow = "hidden";
  }
  function closeCart(){
    cartDrawer.classList.remove("is-open"); cartScrim.classList.remove("is-visible");
    document.body.style.overflow = "";
    setTimeout(()=>{ cartDrawer.hidden = true; cartScrim.hidden = true; }, 260);
  }
  $("#cartBtn").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  cartScrim.addEventListener("click", ()=>{ if(!pv.root.hidden){ return; } closeCart(); });
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && cartDrawer.classList.contains("is-open")) closeCart();
  });

  cartCheckoutBtn.addEventListener("click", ()=>{
    if(cart.length === 0) return;
    const lines = cart.map(i => `• ${i.name} — Tam ${i.size} — Qtd ${i.qty} — ${money(i.price*i.qty)}`);
    const subtotal = cart.reduce((s,i)=> s + i.price * i.qty, 0);
    const msg = `Olá! Quero fazer o pedido abaixo pela MTRREAL:\n\n${lines.join("\n")}\n\nSubtotal: ${money(subtotal)}`;
    window.open(`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(msg)}`, "_blank");
  });

  renderCart();

  /* =======================================================================
     TOAST
  ======================================================================= */
  let toastTimer = null;
  function showToast(text){
    const t = $("#toast");
    t.textContent = text;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> t.classList.remove("is-visible"), 2600);
  }

  /* footer year */
  $("#year").textContent = new Date().getFullYear();

})();
