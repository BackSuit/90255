import { getSession } from "@/lib/auth";
import { SubmitBusinessForm } from "./submit-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Business | 90255.com",
  description: "Submit a local business to the 90255.com directory.",
};

export default async function SubmitBusinessPage() {
  const session = await getSession();

  return <SubmitBusinessForm isAuthenticated={!!session} />;
}
