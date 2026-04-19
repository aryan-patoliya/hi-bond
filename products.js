/**
 * Hi Bond Tools Industries — product catalog
 * Add or update entries in the PRODUCTS array below.
 *
 * slug — URL id for product.html?id=… (stable; do not change once published if links are shared).
 * priority — number; higher values appear first (top of the grid). Omit or use 0 for lowest.
 */
window.PRODUCTS = [
  {
    slug: "plastering-trowel",
    priority: 30,
    title: "Plastering Trowel",
    description:
      "Precision-ground stainless steel blade with comfortable wood handle. Even flex for smooth plaster and render application on walls and ceilings.",
    price: "Contact for quote",
    minimumOrderQuantity: 12,
    inStock: true,
    imageUrls: ["images/plastering-trowel.jpg"],
    material: "Steel",
    handleMaterial: "Wood",
    usageApplication: "Construction",
    typeOfPowerTool: "Hand tools",
    color: "Bright Silver",
  },
  {
    slug: "masonry-trowel",
    priority: 20,
    title: "Masonry Trowel",
    description:
      "Durable steel blade for brick and block work—laying mortar with control. Built for daily use on masonry and general construction sites.",
    price: "Contact for quote",
    minimumOrderQuantity: 12,
    inStock: true,
    imageUrls: ["images/masonry-trowel.jpg"],
    material: "Steel",
    handleMaterial: "Wood",
    usageApplication: "Construction",
    typeOfPowerTool: "Hand tools",
    color: "Bright Silver",
  },
  {
    slug: "margin-trowel-square",
    priority: 10,
    title: "Margin Trowel (square)",
    description:
      "Compact square-end trowel for tight corners, patching, and detail work. Same material standards as our full-size masonry and plastering range.",
    price: "Contact for quote",
    minimumOrderQuantity: 24,
    inStock: false,
    imageUrls: ["images/margin-trowel.jpg"],
    material: "Steel",
    handleMaterial: "Wood",
    usageApplication: "Construction",
    typeOfPowerTool: "W/O. Power",
    color: "Bright Silver",
  }
];
