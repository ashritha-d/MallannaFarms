import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { ROUTES } from "@/routes";
import { FARM_IMAGES } from "@/data/seed";

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist." path="/404" />
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <img src={FARM_IMAGES.f2} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest-950/80" />
        <div className="container-page relative z-10 text-center text-cream-50">
          <p className="font-display text-6xl font-semibold text-gold-300 sm:text-8xl">404</p>
          <h1 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">This page has wandered off the farm</h1>
          <p className="mx-auto mt-3 max-w-md text-cream-100/85">
            The page you're looking for doesn't exist or may have moved.
          </p>
          <Link to={ROUTES.home} className="btn-gold mt-8 inline-flex">
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
