import { describe, expect, it } from "vitest";
import {
  filterPublicCatalog,
  formatCatalogPrice,
  getCatalogCategoryLabel,
  type PublicCatalogProduct,
} from "./catalogPresentation";

const products: PublicCatalogProduct[] = [
  {
    id: 1,
    name: "Beat autorizado",
    description: "Produto publicado",
    category: "beat",
    priceCents: 14900,
  },
  {
    id: 2,
    name: "Mix sob consulta",
    description: null,
    category: "service",
    priceCents: null,
  },
];

describe("catalogPresentation", () => {
  it("formata preço somente quando ele foi realmente cadastrado", () => {
    expect(formatCatalogPrice(14900)).toBe("R$ 149,00");
    expect(formatCatalogPrice(null)).toBe("Preço sob consulta");
  });

  it("filtra apenas produtos fornecidos pela consulta pública", () => {
    expect(filterPublicCatalog(products, "autorizado", "Todos")).toEqual([
      products[0],
    ]);
    expect(filterPublicCatalog(products, "", "service")).toEqual([products[1]]);
  });

  it("traduz categorias conhecidas sem inventar metadados musicais", () => {
    expect(getCatalogCategoryLabel("beat")).toBe("Beat");
    expect(getCatalogCategoryLabel("desconhecida")).toBe("Produto");
  });
});
