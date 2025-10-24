import { useEffect } from 'react';

export default function SettingsInjector() {
  useEffect(() => {
    // Fetch settings on client side
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        const settings = data.data || {};

        // Inject head_after_code using DOMParser
        if (settings.head_after_code) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(settings.head_after_code, 'text/html');

          // Get all elements from head and body (in case scripts are in body of parsed HTML)
          const allElements = [
            ...Array.from(doc.head.children),
            ...Array.from(doc.body.children)
          ];

          allElements.forEach(element => {
            if (element.tagName === 'SCRIPT') {
              const script = document.createElement('script');

              // Copy all attributes
              Array.from(element.attributes).forEach(attr => {
                script.setAttribute(attr.name, attr.value);
              });

              // Copy text content if no src
              if (!element.src) {
                script.textContent = element.textContent;
              }

              document.head.appendChild(script);
            } else {
              // For other elements (meta, link, style, etc.)
              document.head.appendChild(element.cloneNode(true));
            }
          });
        }

        // Inject body_after_code
        if (settings.body_after_code) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(settings.body_after_code, 'text/html');

          const allElements = [
            ...Array.from(doc.head.children),
            ...Array.from(doc.body.children)
          ];

          allElements.forEach(element => {
            document.body.insertBefore(element.cloneNode(true), document.body.firstChild);
          });
        }
      })
      .catch(error => {
        console.error('[Settings Injector Error]', error);
      });
  }, []);

  return null;
}
