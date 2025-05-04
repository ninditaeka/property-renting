'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from 'lucide-react';

const helpCenter = [
  {
    question: 'How do I create an account on Rentease?',
    answer:
      'To create an account, click on the Sign Up button on the homepage. Fill in your details, verify your email, and you’re all set to start browsing properties or listing your own rental.',
  },

  {
    question: 'How do I list my property on Rentease?',
    answer:
      'Create account and log in as tenant, create property," fill in details, upload photos, and submit.',
  },
  {
    question: 'How do I contact a host or guest?',
    answer: 'Use the in-app messaging system for secure communication.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept credit/debit cards, digital wallets, and bank transfers in select locations.',
  },
  {
    question: ' What should I do if I have a problem with a booking?',
    answer:
      'Try resolving it with the host/guest first, then contact Rentease Support if needed.',
  },
  {
    question: ' What should I do if I have a problem with a booking?',
    answer:
      'Use the "Report an Issue" section, provide details, and our team will investigate.',
  },
];

export default function HelpCenter() {
  return (
    <article className="min-w-full  py-16">
      <div className="min-h-screen rounded-lg bg-white">
        <div className="w-full mb-28 text-center bg-sky-500 z-10 py-28 items-center justify-center relative">
          <h1 className="text-5xl font-bold text-white">Help Center</h1>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md -mt-10">
          <Accordion type="single" collapsible className="w-full">
            {helpCenter.map((item, index) => (
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
