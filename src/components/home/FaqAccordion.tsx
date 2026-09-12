'use client';

import { useState } from 'react';
import Reveal from '@/components/ui/Reveal';

type Faq = { id: string; question: string; answer: string };

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {faqs.map((f, i) => {
        const isOpen = openId === f.id;
        return (
          <Reveal key={f.id} delay={i * 40}>
            <div className="card-flat faq-item">
              <button
                type="button"
                className="faq-trigger"
                onClick={() => setOpenId(isOpen ? null : f.id)}
                aria-expanded={isOpen}
              >
                <span>{f.question}</span>
                <span className="faq-icon">{isOpen ? '−' : '+'}</span>
              </button>
              <div className={`faq-panel ${isOpen ? 'open' : ''}`}>
                <div className="faq-panel-inner">
                  <p>{f.answer}</p>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
