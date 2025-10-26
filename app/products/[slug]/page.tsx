import type { Metadata } from "next"
import { getProductBySlug } from "@/lib/actions/products"
import { ProductPageClient } from "./page.client.tsx"

type ProductPageProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { data: product } = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Product Not Found - Top Modern",
    }
  }

  return {
    title: `${product.name} - Top Modern | Premium Marble & Granite`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { data: product } = await getProductBySlug(params.slug)

  return <ProductPageClient product={product ?? null} params={params} />
}
