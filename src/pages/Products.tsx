import Seo from "@/components/seo/Seo";
import { Section } from "@/components/ui/Section";
import ProductShop from "@/components/products/ProductShop";

export default function Products() {
  return (
    <>
      <Seo
        title="Our Eggs — Shop Free Range Eggs"
        description="Shop Mallanna Farms' free-range eggs — Grade A, naturally raised, fresh from our farm to your family."
        path="/products"
      />
      <Section tone="cream" className="pt-8 sm:pt-12">
        <h1 className="sr-only">Our Fresh Free Range Eggs — Shop Mallanna Farms</h1>
        <ProductShop />
      </Section>
    </>
  );
}
