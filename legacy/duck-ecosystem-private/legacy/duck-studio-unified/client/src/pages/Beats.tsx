import { CatalogProductCard } from "@/components/BeatCard";
import { StudioFooter, StudioNav } from "@/components/StudioNav";
import { trpc } from "@/lib/trpc";
import {
  filterPublicCatalog,
  getCatalogCategoryLabel,
} from "@/lib/catalogPresentation";
import { Filter, Search, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";

export default function Beats() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const catalog = trpc.catalog.list.useQuery();
  const products = catalog.data ?? [];
  const categories = [
    "Todos",
    ...Array.from(new Set(products.map(product => product.category))),
  ];
  const filtered = useMemo(
    () => filterPublicCatalog(products, search, category),
    [products, search, category]
  );

  return (
    <div className="studio-page">
      <StudioNav />
      <main className="container pb-20 pt-14">
        <div className="max-w-3xl">
          <p className="eyebrow">CATÁLOGO · PUBLICAÇÕES ATIVAS</p>
          <h1 className="mt-4 font-display text-5xl tracking-[-.05em] text-white md:text-6xl">
            Encontre o que está
            <br />
            <em className="text-emerald-300">pronto para apresentar.</em>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-emerald-100/62">
            A vitrine exibe apenas produtos ativos cadastrados pelo Duck.
            Valores, arquivos e checkout só aparecem quando forem efetivamente
            configurados.
          </p>
        </div>
        <div className="mt-12 grid gap-4 xl:grid-cols-[1fr_auto]">
          <div className="glass-panel flex items-center gap-3 px-4">
            <Search className="text-emerald-300" size={18} />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Buscar produto ou categoria"
              className="h-14 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-emerald-100/35"
            />
          </div>
          <div className="glass-panel flex items-center gap-3 px-5 text-xs text-emerald-100/65">
            <ShoppingBag size={17} className="text-emerald-300" />
            <span>Checkout seguro com Shopify</span>
            <span className="rounded-full bg-amber-300/15 px-2 py-1 text-[.6rem] font-bold text-amber-200">
              PENDENTE
            </span>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <div className="filter-group">
            <Filter size={14} />
            <span>Categoria</span>
            {categories.map(item => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={
                  category === item ? "filter-pill active" : "filter-pill"
                }
              >
                {item === "Todos" ? item : getCatalogCategoryLabel(item)}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-9 flex items-center justify-between">
          <p className="text-sm text-emerald-100/55">
            <span className="font-bold text-white">{filtered.length}</span>{" "}
            {filtered.length === 1
              ? "produto publicado"
              : "produtos publicados"}
          </p>
          <span className="mono-label">AUDIÇÃO · CATÁLOGO</span>
        </div>
        {catalog.isLoading ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                className="beat-card h-96 animate-pulse bg-white/[.04]"
                key={index}
              />
            ))}
          </div>
        ) : catalog.isError ? (
          <div className="glass-panel mt-5 p-10 text-center">
            <p className="text-lg font-bold text-white">
              O catálogo não está disponível agora.
            </p>
            <p className="mt-2 text-sm text-emerald-100/55">
              Tente novamente em alguns instantes ou envie seu briefing
              diretamente ao Duck.
            </p>
          </div>
        ) : filtered.length ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map(product => (
              <CatalogProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <div className="glass-panel mt-5 p-10 text-center">
            <p className="text-lg font-bold text-white">
              Ainda não há produtos publicados.
            </p>
            <p className="mt-2 text-sm text-emerald-100/55">
              O catálogo será atualizado quando o Duck autorizar conteúdo,
              termos e disponibilidade reais.
            </p>
          </div>
        )}
      </main>
      <StudioFooter />
    </div>
  );
}
