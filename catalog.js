(function () {
  "use strict";

  const raw = window.PRODUCTS || [];

  function sortedProducts() {
    return raw
      .map(function (p, i) {
        return { p: p, i: i };
      })
      .sort(function (a, b) {
        var pa = Number(a.p.priority);
        var pb = Number(b.p.priority);
        if (isNaN(pa)) pa = 0;
        if (isNaN(pb)) pb = 0;
        if (pb !== pa) return pb - pa;
        return a.i - b.i;
      })
      .map(function (x) {
        return x.p;
      });
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function slugFor(p) {
    if (p.slug && String(p.slug).trim()) return String(p.slug).trim();
    return String(p.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "product";
  }

  function productSpecsEntries(p) {
    const specs = [
      ["Material", p.material],
      ["Handle material", p.handleMaterial],
      ["Usage / application", p.usageApplication],
      ["Type of power tool", p.typeOfPowerTool],
      ["Color", p.color],
    ];
    if (Array.isArray(p.sizes) && p.sizes.length) {
      const sizeText = p.sizes
        .map(function (s) {
          return String(s);
        })
        .filter(function (s) {
          return s.trim();
        })
        .join(" · ");
      if (sizeText) specs.push(["Sizes", sizeText]);
    }
    return specs;
  }

  function productDetailHref(slug) {
    return "product.html?id=" + encodeURIComponent(slug);
  }

  function listCardMarkup(p) {
    const slug = slugFor(p);
    const imgs = Array.isArray(p.imageUrls) ? p.imageUrls : [];
    const first = imgs[0] || "";
    const stockClass = p.inStock
      ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/25"
      : "bg-rose-500/10 text-rose-200 border border-rose-400/20";
    const stockLabel = p.inStock ? "In stock" : "Out of stock";

    const specRows = productSpecsEntries(p)
      .map(
        ([label, val]) => `
        <div class="flex justify-between gap-4 py-1.5 border-b border-white/10 last:border-0">
          <dt class="text-slate-400 shrink-0">${escapeHtml(label)}</dt>
          <dd class="text-slate-100 text-right">${escapeHtml(String(val ?? "—"))}</dd>
        </div>`
      )
      .join("");

    const href = productDetailHref(slug);

    return `
      <a href="${href}" class="group flex flex-col h-full rounded-2xl bg-black/20 border border-white/[0.08] ring-1 ring-white/[0.04] overflow-hidden shadow-card hover:border-brand-accent/30 hover:ring-brand-accent/20 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60">
        <div class="relative aspect-[4/3] bg-brand-navy-deep overflow-hidden">
          ${
            first
              ? `<img src="${escapeHtml(first)}" alt="" class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.classList.remove('hidden');">`
              : ""
          }
          <div class="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent opacity-90"></div>
          <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-navy/95 to-brand-navy-deep ${first ? "hidden" : ""}" data-fallback>
            <span class="text-slate-500 text-sm font-medium px-4 text-center">Add image to <code class="text-slate-500">/images</code></span>
          </div>
          <span class="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wide ${stockClass}">${stockLabel}</span>
        </div>
        <div class="flex flex-col flex-1 p-5 md:p-6">
          <h2 class="font-display text-lg md:text-xl font-bold text-white tracking-tight mb-2 leading-snug">${escapeHtml(p.title)}</h2>
          <p class="text-slate-400 text-sm leading-relaxed mb-5 flex-1">${escapeHtml(p.description)}</p>
          <dl class="rounded-xl bg-black/35 px-3.5 py-3 mb-5 text-xs sm:text-sm border border-white/[0.06]">${specRows}</dl>
          <div class="flex flex-wrap items-end justify-between gap-3 mt-auto pt-4 border-t border-white/[0.08]">
            <div>
              <p class="text-xl md:text-2xl font-extrabold text-brand-accent tracking-tight">${escapeHtml(String(p.price))}</p>
              <p class="text-slate-500 text-xs mt-1.5 font-medium">Min. order <span class="text-slate-300">${escapeHtml(String(p.minimumOrderQuantity))}</span> units</p>
            </div>
            <span class="text-brand-accent text-sm font-semibold group-hover:translate-x-0.5 transition-transform">View details →</span>
          </div>
        </div>
      </a>
    `;
  }

  function detailMarkup(p) {
    const imgs = Array.isArray(p.imageUrls) ? p.imageUrls : [];
    const first = imgs[0] || "";
    const stockClass = p.inStock
      ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/25"
      : "bg-rose-500/10 text-rose-200 border border-rose-400/20";
    const stockLabel = p.inStock ? "In stock" : "Out of stock";

    const specRows = productSpecsEntries(p)
      .map(
        ([label, val]) => `
        <div class="flex flex-col sm:flex-row sm:justify-between sm:gap-8 py-3 border-b border-white/[0.08] last:border-0">
          <span class="text-slate-500 text-sm shrink-0 sm:w-52">${escapeHtml(label)}</span>
          <span class="text-white font-medium text-sm sm:text-base">${escapeHtml(String(val ?? "—"))}</span>
        </div>`
      )
      .join("");

    const extraImages = imgs
      .slice(1)
      .map(
        (url) =>
          `<img src="${escapeHtml(url)}" alt="" class="rounded-xl border border-white/[0.08] w-full object-cover max-h-64" loading="lazy" />`
      )
      .join("");

    return `
      <article>
        <nav class="mb-8 text-sm">
          <a href="products.html" class="text-brand-accent hover:text-[#ffc030] transition-colors">← All products</a>
        </nav>
        <div class="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div class="space-y-4">
            <div class="relative aspect-[4/3] rounded-2xl bg-brand-navy-deep overflow-hidden border border-white/[0.08]">
              ${
                first
                  ? `<img src="${escapeHtml(first)}" alt="" class="w-full h-full object-cover" loading="eager" onerror="this.style.display='none';this.nextElementSibling.classList.remove('hidden');">`
                  : ""
              }
              <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-navy/95 to-brand-navy-deep ${first ? "hidden" : ""}">
                <span class="text-slate-500 text-sm px-4 text-center">Add image to <code class="text-slate-500">/images</code></span>
              </div>
              <span class="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wide ${stockClass}">${stockLabel}</span>
            </div>
            ${extraImages ? `<div class="grid grid-cols-2 gap-3">${extraImages}</div>` : ""}
          </div>
          <div>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">${escapeHtml(p.title)}</h1>
            <p class="text-slate-300 text-base md:text-lg leading-relaxed mb-8">${escapeHtml(p.description)}</p>
            <div class="rounded-2xl border border-white/[0.08] bg-black/25 px-5 py-2 mb-8">${specRows}</div>
            <div class="rounded-2xl border border-brand-accent/25 bg-brand-accent/5 p-6 mb-8">
              <p class="text-2xl md:text-3xl font-extrabold text-brand-accent tracking-tight">${escapeHtml(String(p.price))}</p>
              <p class="text-slate-400 text-sm mt-2">Minimum order quantity: <span class="text-slate-200 font-semibold">${escapeHtml(String(p.minimumOrderQuantity))}</span> units</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
              <a href="contact.html" class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-accent text-brand-navy px-6 py-3.5 text-sm font-bold shadow-accent-glow hover:bg-[#ffc030] transition-all text-center">Contact for quote</a>
              <a href="products.html" class="inline-flex items-center justify-center rounded-xl border border-slate-500/90 bg-white/[0.04] text-white px-6 py-3.5 text-sm font-semibold hover:bg-white/[0.08] transition-colors text-center">Back to catalog</a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function notFoundMarkup() {
    return `
      <div class="text-center py-16 md:py-24 max-w-md mx-auto">
        <h1 class="font-display text-2xl md:text-3xl font-extrabold text-white mb-3">Product not found</h1>
        <p class="text-slate-400 mb-8">This product may have been removed or the link is incorrect.</p>
        <a href="products.html" class="inline-flex items-center justify-center rounded-xl bg-brand-accent text-brand-navy px-6 py-3.5 text-sm font-bold hover:bg-[#ffc030] transition-colors">Browse all products</a>
      </div>
    `;
  }

  const listEl = document.getElementById("product-list");
  if (listEl) {
    const products = sortedProducts();
    listEl.innerHTML = products.map(listCardMarkup).join("");
    const countEl = document.getElementById("product-count");
    if (countEl) countEl.textContent = String(products.length);
  }

  const detailEl = document.getElementById("product-detail");
  if (detailEl) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const products = sortedProducts();
    const match = id
      ? products.find(function (p) {
          return slugFor(p) === id;
        })
      : null;

    if (match) {
      detailEl.innerHTML = detailMarkup(match);
      document.title = match.title + " — Hi Bond Tools Industries";
    } else {
      detailEl.innerHTML = notFoundMarkup();
      document.title = "Product not found — Hi Bond Tools Industries";
    }
  }
})();
