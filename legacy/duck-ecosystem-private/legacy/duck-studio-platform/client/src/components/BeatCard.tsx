import { ShoppingBag, Waves } from "lucide-react";
import {
  formatCatalogPrice,
  getCatalogCategoryLabel,
  type PublicCatalogProduct,
} from "@/lib/catalogPresentation";

const tones = ["emerald", "lime", "teal", "jade"] as const;

export function CatalogProductCard({
  product,
}: {
  product: PublicCatalogProduct;
}) {
  const tone = tones[product.id % tones.length];
  const productNumber = String(product.id).padStart(2, "0");

  return (
    <article className="beat-card">
      <div className={`beat-visual tone-${tone}`}>
        <span className="beat-orbit orbit-one" />
        <span className="beat-orbit orbit-two" />
        <div className="relative z-10 flex h-full flex-col justify-between p-5">
          <span className="mono-label">{productNumber} · PUBLICADO</span>
          <Waves size={28} className="text-emerald-100/80" aria-hidden="true" />
          <div className="flex h-7 items-end gap-1" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => (
              <span
                key={index}
                className="wave-bar"
                style={{ height: `${20 + ((index * 17) % 70)}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl tracking-tight text-white">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-emerald-100/55">
              {getCatalogCategoryLabel(product.category)}
            </p>
          </div>
          <Waves
            size={18}
            className="mt-1 shrink-0 text-emerald-300"
            aria-hidden="true"
          />
        </div>
        <p className="min-h-10 text-sm leading-5 text-emerald-100/62">
          {product.description ||
            "Detalhes serão apresentados pelo Duck antes da contratação."}
        </p>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="text-xs font-medium text-emerald-100/70">
            {formatCatalogPrice(product.priceCents)}
          </span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-100/45">
            <ShoppingBag size={15} /> Checkout pendente
          </span>
        </div>
      </div>
    </article>
  );
}
