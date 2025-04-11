'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faq = [
  {
    question: 'What is Rentease?',
    answer:
      'Rentease is a platform connecting renters and property owners for hassle-free renting.',
  },
  {
    question: 'How do I rent a property on Rentease?',
    answer:
      'Search, select dates, book, pay securely, and wait for host confirmation.',
  },
  {
    question: ' How do I ensure the property is legitimate?',
    answer:
      'Check for verified hosts, read reviews, and always book through Rentease.',
  },
  {
    question: 'What happens if my booking is canceled?',
    answer:
      'If the host cancels, you get a full refund; if you cancel, the policy determines your refund.',
  },
  {
    question: 'Can I get a refund if I’m not satisfied with my stay?',
    answer:
      'Refunds depend on the property’s cancellation policy and the issue reported.',
  },
  {
    question: 'Is it safe to use Rentease?',
    answer:
      'Yes, we verify hosts, secure payments, and offer customer support for disputes.',
  },
  {
    question: 'What if I have an issue with the host or guest?',
    answer:
      'Try resolving it through messaging, or report the issue to Rentease Support.',
  },
  {
    question: 'What are the check-in and check-out policies?',
    answer:
      'Times vary by property, with some offering self-check-in; late check-outs may have fees.',
  },
];

export default function FAQ() {
  return (
    <article className="min-w-full  py-16">
      <div className="min-h-screen rounded-lg bg-white">
        <div className="w-full mb-28 text-center bg-sky-500  z-10 py-28 items-center justify-center relative">
          <h1 className="text-5xl font-bold text-white">
            Frequently Ask and Questions
          </h1>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md -mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium py-4 px-2">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-2 pb-4 pt-1 text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </article>
  );
}
