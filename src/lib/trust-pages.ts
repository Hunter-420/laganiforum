export function getTrustPageCopy(locale: string, page: "about" | "contact" | "disclaimer") {
  const isNp = locale === "np";

  const pages = {
    about: {
      title: isNp ? "हाम्रो बारेमा" : "About Laganiforum",
      description: isNp
        ? "लगानीफोरम को हो, हामी के गर्छौं, र हाम्रो शैक्षिक दृष्टिकोण।"
        : "Who we are, what we publish, and our educational approach to finance content.",
    },
    contact: {
      title: isNp ? "सम्पर्क" : "Contact",
      description: isNp
        ? "प्रश्न, सुधार, वा सामग्री सम्बन्धी सम्पर्क।"
        : "Questions, corrections, or editorial inquiries.",
    },
    disclaimer: {
      title: isNp ? "अस्वीकरण" : "Disclaimer",
      description: isNp
        ? "शैक्षिक सामग्री, जोखिम, र लगानी सल्लाह नदिने स्पष्टीकरण।"
        : "Educational purpose, risk disclosure, and no investment advice policy.",
    },
  };

  return { isNp, ...pages[page] };
}
