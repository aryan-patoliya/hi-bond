(function () {
  "use strict";

  const listEl = document.getElementById("product-list");
  const countEl = document.getElementById("product-count");
  const raw = window.PRODUCTS || [];
  /** Higher priority first (top of list). Missing priority treated as 0. */
  const products = raw
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

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function cardMarkup(p, index) {
    const imgs = Array.isArray(p.imageUrls) ? p.imageUrls : [];
    const first = imgs[0] || "";
    const stockClass = p.inStock
      ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/25"
      : "bg-rose-500/10 text-rose-200 border border-rose-400/20";
    const stockLabel = p.inStock ? "In stock" : "Out of stock";

    const specs = [
      ["Material", p.material],
      ["Handle material", p.handleMaterial],
      ["Usage / application", p.usageApplication],
      ["Type of power tool", p.typeOfPowerTool],
      ["Color", p.color],
    ];

    const specRows = specs
      .map(
        ([label, val]) => `
        <div class="flex justify-between gap-4 py-1.5 border-b border-white/10 last:border-0">
          <dt class="text-slate-400 shrink-0">${escapeHtml(label)}</dt>
          <dd class="text-slate-100 text-right">${escapeHtml(String(val ?? "—"))}</dd>
        </div>`
      )
      .join("");

    return `
      <article class="group flex flex-col h-full rounded-2xl bg-black/20 border border-white/[0.08] ring-1 ring-white/[0.04] overflow-hidden shadow-card hover:border-brand-accent/30 hover:ring-brand-accent/20 transition-all duration-300" data-index="${index}">
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
          <h3 class="font-display text-lg md:text-xl font-bold text-white tracking-tight mb-2 leading-snug">${escapeHtml(p.title)}</h3>
          <p class="text-slate-400 text-sm leading-relaxed mb-5 flex-1">${escapeHtml(p.description)}</p>
          <dl class="rounded-xl bg-black/35 px-3.5 py-3 mb-5 text-xs sm:text-sm border border-white/[0.06]">${specRows}</dl>
          <div class="flex flex-wrap items-end justify-between gap-3 mt-auto pt-4 border-t border-white/[0.08]">
            <div>
              <p class="text-xl md:text-2xl font-extrabold text-brand-accent tracking-tight">${escapeHtml(String(p.price))}</p>
              <p class="text-slate-500 text-xs mt-1.5 font-medium">Min. order <span class="text-slate-300">${escapeHtml(String(p.minimumOrderQuantity))}</span> units</p>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  if (countEl) countEl.textContent = String(products.length);
  if (listEl) {
    listEl.innerHTML = products.map(cardMarkup).join("");
  }
})();
