import ContactForm from "@/components/admin/contact-form"
import { getPortfolioData } from "@/lib/data"

export default async function ContactPage() {
  const data = await getPortfolioData()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Contact Information</h1>
      <ContactForm contact={data.contact} />
    </div>
  )
}
