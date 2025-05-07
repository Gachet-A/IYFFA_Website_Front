import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Terms = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1EAEDB] mb-4">Terms & Data Protection</h1>
        <p className="text-[#FEF7CD] text-lg max-w-2xl mx-auto">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-[#FEF7CD] text-lg max-w-2xl mx-auto mt-4">
          This privacy policy is designed to help you understand what information we collect, why we collect it, and how you can update, manage, export, and delete your information.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto bg-[#1A1F2C] border-[#1EAEDB]/20">
        <CardHeader>
          <CardTitle className="text-[#1EAEDB] text-2xl">Data Protection Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="general">
              <AccordionTrigger className="text-[#1EAEDB] hover:text-[#1EAEDB]/80">
                General Information
              </AccordionTrigger>
              <AccordionContent className="text-white space-y-4">
                <p>
                  IYFFA places great importance on protecting your data. We only collect personal data that is absolutely necessary for the fulfillment of our tasks (data economy). The recorded data is managed with diligence and protected against any form of abuse.
                </p>
                <p>
                  Article 13 of the Federal Constitution, as well as data protection law, guarantees everyone respect for privacy and protection against the misuse of personal data. Our website complies with these provisions.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="scope">
              <AccordionTrigger className="text-[#1EAEDB] hover:text-[#1EAEDB]/80">
                Scope of Application
              </AccordionTrigger>
              <AccordionContent className="text-white space-y-4">
                <p>
                  This privacy policy applies to the IYFFA website and the personal data collected through this site. It may be modified at any time without notice. Third-party sites linked from our website are subject to their own privacy policies.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="donation-data">
              <AccordionTrigger className="text-[#1EAEDB] hover:text-[#1EAEDB]/80">
                Donation Data Collection
              </AccordionTrigger>
              <AccordionContent className="text-white space-y-4">
                <p>
                  When you make a donation to IYFFA, we collect and process certain information to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process your donation and provide you with a receipt</li>
                  <li>Comply with legal requirements for charitable donations</li>
                  <li>Send you acknowledgment and thank you messages</li>
                  <li>Keep you informed about how your donation is being used</li>
                </ul>
                <p>
                  For monthly donations, we also collect information to manage your recurring payments and subscription.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="stripe-data">
              <AccordionTrigger className="text-[#1EAEDB] hover:text-[#1EAEDB]/80">
                Stripe Payment Processing
              </AccordionTrigger>
              <AccordionContent className="text-white space-y-4">
                <p>
                  We use Stripe, a secure payment processor, to handle all donations. When you make a payment:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Stripe collects and processes your payment information securely</li>
                  <li>Your payment details are encrypted and never stored on our servers</li>
                  <li>Stripe complies with PCI DSS standards for payment security</li>
                  <li>We only receive confirmation of successful payments and basic transaction details</li>
                </ul>
                <p>
                  For more information about how Stripe handles your data, please visit their privacy policy at{' '}
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#1EAEDB] hover:underline">
                    stripe.com/privacy
                  </a>
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="legal-info">
              <AccordionTrigger className="text-[#1EAEDB] hover:text-[#1EAEDB]/80">
                Legal Information Collection
              </AccordionTrigger>
              <AccordionContent className="text-white space-y-4">
                <p>
                  We collect the following information for legal purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Name:</strong> Required for generating donation receipts and tax documentation
                  </li>
                  <li>
                    <strong>Address:</strong> Required for legal documentation and tax purposes
                  </li>
                  <li>
                    <strong>Email:</strong> Used to send donation receipts and important communications
                  </li>
                </ul>
                <p>
                  This information is collected in accordance with Swiss law and is used solely for the purposes stated above.
                  We do not share this information with third parties except as required by law or with your explicit consent.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cookies">
              <AccordionTrigger className="text-[#1EAEDB] hover:text-[#1EAEDB]/80">
                Cookies and Analytics
              </AccordionTrigger>
              <AccordionContent className="text-white space-y-4">
                <p>
                  Our website uses cookies to enhance your browsing experience and provide certain functions. We use:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Session cookies for basic website functionality</li>
                  <li>Analytics cookies to understand how visitors use our site</li>
                  <li>Security cookies to prevent unauthorized access</li>
                </ul>
                <p>
                  You can control cookie settings through your browser preferences. However, disabling cookies may limit some website functionality.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-rights">
              <AccordionTrigger className="text-[#1EAEDB] hover:text-[#1EAEDB]/80">
                Your Data Rights
              </AccordionTrigger>
              <AccordionContent className="text-white space-y-4">
                <p>
                  Under Swiss Data Protection Law (LPD), you have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data (subject to legal requirements)</li>
                  <li>Object to data processing</li>
                  <li>Request data portability</li>
                </ul>
                <p>
                  To exercise these rights or for any questions about our data practices, please contact us at{' '}
                  <a href="mailto:privacy@iyffa.org" className="text-[#1EAEDB] hover:underline">
                    privacy@iyffa.org
                  </a>
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security">
              <AccordionTrigger className="text-[#1EAEDB] hover:text-[#1EAEDB]/80">
                Data Security
              </AccordionTrigger>
              <AccordionContent className="text-white space-y-4">
                <p>
                  We implement appropriate technical and organizational security measures to protect your data against:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unauthorized access</li>
                  <li>Accidental or intentional manipulation</li>
                  <li>Loss or destruction</li>
                </ul>
                <p>
                  Our website uses SSL encryption for secure data transmission. You can verify this by the padlock symbol in your browser's address bar.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms; 