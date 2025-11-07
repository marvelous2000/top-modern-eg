"use client"

import { notFound } from "next/navigation"
import { MarbleBackground } from "@/components/marble-background"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactTracking } from "@/components/contact-tracking"
import type { Product } from "@/lib/actions/products"

type ProductPageProps = {
  params: { slug: string }
  product: Product | null
}

export function ProductPageClient({ params, product }: ProductPageProps) {
  if (!product) {
    notFound()
  }

  const formattedCategory = product.category
    ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
    : "Marble"

  const featureList = product.applications ?? []
  const showcaseString = product.specifications?.["Featured Projects"]
  const showcaseItems = showcaseString
    ? showcaseString.split(",").map((item) => item.trim()).filter(Boolean)
    : featureList.slice(0, 3)

  const specificationEntries = Object.entries(product.specifications ?? {})

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <MarbleBackground />
      <ContactTracking />
      <Navigation />

      <main className="relative z-10 pt-32">
        <section className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-primary font-semibold uppercase tracking-wide">{formattedCategory}</span>
                <span className="text-muted-foreground">{"\u2022"}</span>
                <span className="text-muted-foreground">{product.origin}</span>
              </div>

              <h1 className="text-h1 mb-8 text-balance break-words">{product.name}</h1>

              <p className="text-body text-muted-foreground mb-8 break-words">{product.description}</p>

              {featureList.length > 0 && (
                <div className="space-y-3 mb-8">
                  <h2 className="text-h2 text-primary">Applications & Features</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    {featureList.map((feature, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="mt-2 size-1.5 rounded-full bg-primary/80" aria-hidden="true" />
                        <span className="break-words">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/80 hover:text-primary-foreground transition-colors duration-300 text-center"
                >
                  Request Quote
                </a>
                <a
                  href="tel:+201234567890"
                  className="border border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-300 text-center"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("contactClick", {
                        detail: { type: "phone", identifier: "+201234567890", page: `/products/${params.slug}` },
                      }),
                    )
                  }
                >
                  Call Expert
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-primary/30 aspect-video lg:aspect-[4/3]">
                <img
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-x-0 -bottom-12 hidden lg:flex justify-center gap-4">
                {(product.images ?? []).slice(1, 4).map((image, index) => (
                  <div key={`${image}-${index}`} className="w-24 h-24 rounded-2xl overflow-hidden border border-primary/30">
                    <img src={image || "/placeholder.svg"} alt={`${product.name} detail ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-10">
              <div className="rounded-2xl border border-primary/20 bg-card/80 p-10">
                <h2 className="text-h2 text-primary break-words mb-6">Material Overview</h2>
                <p className="text-muted-foreground leading-relaxed break-words">
                  {product.name} is sourced from {product.origin} and finished with a {product.finish.toLowerCase()} surface,
                  offering exceptional durability for premium interior and exterior applications. Available in {product.thickness},
                  it balances structural integrity with refined aesthetics.
                </p>
              </div>

              {featureList.length > 0 && (
                <div className="rounded-2xl border border-primary/20 bg-card/80 p-10">
                  <h2 className="text-h2 text-primary break-words mb-6">Recommended Uses</h2>
                  <div className="flex flex-wrap gap-3">
                    {featureList.map((application) => (
                      <span
                        key={application}
                        className="bg-primary/20 text-primary px-4 py-2 rounded-full font-semibold break-words"
                      >
                        {application}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-h1 mb-8 break-words">
                Technical <span className="text-primary">Specifications</span>
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-6 border border-primary/20 rounded-lg">
                  <div>
                    <p className="text-primary font-semibold mb-2">Origin</p>
                    <p className="text-foreground/90 break-words">{product.origin}</p>
                  </div>
                  <div>
                    <p className="text-primary font-semibold mb-2">Finish</p>
                    <p className="text-foreground/90 break-words">{product.finish}</p>
                  </div>
                  <div>
                    <p className="text-primary font-semibold mb-2">Thickness</p>
                    <p className="text-foreground/90 break-words">{product.thickness}</p>
                  </div>
                  <div>
                    <p className="text-primary font-semibold mb-2">Category</p>
                    <p className="text-foreground/90 break-words">{formattedCategory}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {specificationEntries.map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-3 border-b border-primary/20">
                      <span className="text-muted-foreground break-words">{key}</span>
                      <span className="text-primary font-semibold text-right max-w-[60%] break-words">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {showcaseItems.length > 0 && (
          <section className="container mx-auto px-6 py-20">
            <h2 className="text-h1 mb-12 text-center break-words">
              Featured <span className="text-primary">Installations</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {showcaseItems.map((item, index) => (
                <div key={`${item}-${index}`} className="text-center p-8 border border-primary/20 rounded-lg">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-primary-foreground text-2xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-h2 mb-4 break-words">{item}</h3>
                  <p className="text-muted-foreground break-words">
                    Premium installation showcasing the beauty and durability of {product.name}.
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-h1 mb-8 break-words">
              Ready to Use <span className="text-primary">{product.name}</span>?
            </h2>
            <p className="text-body text-muted-foreground mb-12 leading-relaxed break-words">
              Contact our experts to discuss your project requirements and get a detailed quote for {product.name}.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/contact"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/80 hover:text-primary-foreground transition-colors duration-300 text-center"
              >
                Get Quote
              </a>
              <a
                href="mailto:info@topmodern.com"
                className="border border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-300 text-center"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("contactClick", {
                      detail: { type: "email", identifier: "info@topmodern.com", page: `/products/${params.slug}` },
                    }),
                  )
                }
              >
                Email Expert
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ProductPageClient







