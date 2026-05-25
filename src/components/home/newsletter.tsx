import React from "react";
import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/blog/newsletter-form";

export function Newsletter({ locale = "en" }: { locale?: string }) {
  const isNp = locale === "np";
  
  return (
    <section className="bg-emerald-50 border border-emerald-100 text-foreground dark:bg-zinc-950 dark:border-zinc-800 dark:text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-16 relative overflow-hidden my-8 sm:my-12 md:my-16">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-white/10 mb-6">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {isNp ? "बजारको अगाडि रहनुहोस्" : "Stay Ahead of the Market"}
        </h2>
        <p className="text-muted-foreground dark:text-zinc-400 text-lg mb-8">
          {isNp 
            ? "हाम्रो साप्ताहिक नेप्से (NEPSE) विश्लेषण, विश्वव्यापी फरेक्स (Forex) प्रवृत्तिहरू, र प्राविधिक सेटअपहरू प्राप्त गर्ने हजारौं व्यापारीहरूसँग सामेल हुनुहोस्। कुनै स्पाम छैन, केवल उत्कृष्ट जानकारी (Alpha)।" 
            : "Join thousands of traders receiving our weekly breakdown of the NEPSE, global forex trends, and technical setups. No spam, just alpha."}
        </p>
        
        <NewsletterForm locale={locale} />
        <p className="text-xs text-muted-foreground dark:text-zinc-500 mt-4">
          {isNp ? "सदस्यता लिएर, तपाईं हाम्रो सेवाका सर्तहरू र गोपनीयता नीतिमा सहमत हुनुहुन्छ।" : "By subscribing, you agree to our Terms of Service and Privacy Policy."}
        </p>
      </div>
    </section>
  );
}
