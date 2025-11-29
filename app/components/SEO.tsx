export const createWebsiteStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GamepadTest',
  alternateName: ['Gamepad Tester', 'Controller Tester', 'Gamepad Checker'],
  description: 'The #1 professional gamepad testing tool. Test Xbox, PlayStation & PC controllers with real-time input detection and performance analysis.',
  url: 'https://www.gamepadtest.tech',
  sameAs: [
    'https://twitter.com/gamepadchecker',
    'https://facebook.com/gamepadchecker',
    'https://github.com/gamepadchecker'
  ],
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.gamepadtest.tech/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  },
  mainEntity: {
    '@type': 'WebApplication',
    name: 'GamepadTest',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  }
});

export const createFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

export const createHowToStructuredData = (name: string, steps: string[]) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: name,
  step: steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    text: step
  }))
});

export const createBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((breadcrumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: breadcrumb.name,
    item: breadcrumb.url
  }))
});

export const createToolPageStructuredData = (toolName: string, description: string, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `${toolName} | GamepadTest`,
  description: description,
  url: url,
  isPartOf: {
    '@type': 'WebSite',
    name: 'GamepadTest',
    url: 'https://www.gamepadtest.tech'
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.gamepadtest.tech'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: toolName,
        item: url
      }
    ]
  }
});
