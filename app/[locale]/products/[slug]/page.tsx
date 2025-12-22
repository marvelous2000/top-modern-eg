import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { getTranslations } from "next-intl/server";

export default async function ProductPage({ params }: { params: { slug: string; locale: string } }) {
  const { slug, locale } = params;
  const t = await getTranslations();

  // Product data mapping
  const getProductData = (slug: string) => {
    const productDetails = t.raw('products.productDetails');

    // Find the product key that matches the slug
    const productKey = Object.keys(productDetails).find(key => {
      const product = productDetails[key];
      if (!product || !product.name) {
        return false;
      }
      const productName = product.name;
      return productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug;
    });

    if (!productKey) {
      return null;
    }

    const product = productDetails[productKey];

    // Mock images based on product type (you can replace with actual images)
    const getProductImages = (category: string, name: string) => {
      const baseName = name.toLowerCase().replace(/\s+/g, '-');
      return [
        `/${baseName}-1.jpg`,
        `/${baseName}-2.jpg`,
        `/${baseName}-3.jpg`,
      ];
    };

    return {
      name: product.name,
      slug: slug,
      description: product.description,
      category: product.category,
      price: 150.00, // You can customize pricing per product
      rating: 4.8,
      reviews: 72,
      images: getProductImages(product.category, product.name),
      features: product.features
    };
  };

  const product = getProductData(slug);

  if (!product) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-12 md:py-20">
          <h1 className="text-4xl font-bold text-center">Product Not Found</h1>
          <p className="text-center mt-4">The product you're looking for doesn't exist.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((src, index) => (
                  <CarouselItem key={index}>
                    <Card>
                      <CardContent className="relative aspect-square">
                        <Image
                          src={src}
                          alt={`${product.name} - view ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm font-medium text-primary mb-2">{product.category.toUpperCase()}</span>
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              {product.description}
            </p>
            <Separator className="my-6" />
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {product.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-4xl font-bold font-serif">${product.price.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">/ sq. ft.</span>
            </div>
            <Button size="lg" className="mt-8 w-full sm:w-auto">
              Request a Quote
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}