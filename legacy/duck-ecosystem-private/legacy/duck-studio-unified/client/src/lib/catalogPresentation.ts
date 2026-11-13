export type PublicCatalogProduct = {
  id: number;
  name: string;
  description: string | null;
  category: string;
  priceCents: number | null;
};

const categoryLabels: Record<string, string> = {
  beat: "Beat",
  license: "Licença",
  production: "Produção",
  service: "Serviço",
  preset: "Preset",
  digital_file: "Arquivo digital",
  package: "Pacote",
};

export function getCatalogCategoryLabel(category: string) {
  return categoryLabels[category] ?? "Produto";
}

export function formatCatalogPrice(priceCents: number | null) {
  if (typeof priceCents !== "number") return "Preço sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}

export function filterPublicCatalog(
  products: PublicCatalogProduct[],
  query: string,
  category: string
) {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  return products.filter(product => {
    const matchesCategory =
      category === "Todos" || product.category === category;
    const haystack =
      `${product.name} ${product.description ?? ""} ${getCatalogCategoryLabel(product.category)}`.toLocaleLowerCase(
        "pt-BR"
      );
    return (
      matchesCategory &&
      (!normalizedQuery || haystack.includes(normalizedQuery))
    );
  });
}
