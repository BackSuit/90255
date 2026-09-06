import type { Metadata } from "next";
import { CITY, STATE, ZIP_CODE, COUNTY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About 90255.com",
  description: `Learn about 90255.com, a local guide to ${CITY}, ${STATE} — ZIP code ${ZIP_CODE}.`,
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">About 90255.com</h1>

      <div className="prose prose-gray max-w-none space-y-4">
        <p>
          <strong>90255.com</strong> is a local directory and community portal
          for ZIP code {ZIP_CODE}, covering {CITY}, {STATE}. Our mission is to
          connect residents, visitors, and business owners with the best local
          businesses and services.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">About {CITY}</h2>
        <p>
          {CITY} is a vibrant city located in {COUNTY}, {STATE}, within the Los
          Angeles metropolitan area. With a population of approximately 60,000
          residents, it is known for its diverse community, thriving small
          business scene, and rich cultural heritage.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Our Purpose</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Help residents discover local businesses and services</li>
          <li>Support business owners with free online visibility</li>
          <li>Provide useful real estate information for the 90255 area</li>
          <li>Build a comprehensive local resource for the community</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">Disclaimer</h2>
        <p className="text-sm text-muted-foreground">
          90255.com is an independent website and is not affiliated with the
          City of {CITY}, the United States Postal Service (USPS), GoDaddy,
          Google, or any other government or corporate entity. Business
          information is provided by business owners and users. We make no
          guarantees about the accuracy or completeness of the information
          listed.
        </p>
      </div>
    </div>
  );
}
