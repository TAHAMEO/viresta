# Viresta website

Static website for Viresta, an AI automation agency. Plain HTML, CSS and JavaScript, with no build step and no dependencies.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `services.html` | All services with per-item prices |
| `pricing.html` | Monthly packages, comparison, add-ons and the custom package builder |
| `about.html` | Brand, mission, values, process and founder |
| `contact.html` | Strategy call form and FAQ |
| `privacy.html`, `terms.html` | Placeholder summaries. Replace them with reviewed documents before launch. |

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Editing

- **Colours and fonts:** the tokens at the top of `assets/css/style.css` (`:root`).
- **Logo:** the original Viresta logo. `assets/img/logo.webp` is the full round logo; `logo-mark.webp` (the V) and `logo-word.webp` (the wordmark) are cut out of it with a transparent background for the header and footer. `favicon.png`, `apple-touch-icon.png` and the share image `og-image.png` use the same logo.
- **Founder photo:** on the About page, add `<img src="assets/img/founder.jpg" alt="Abdul Ahad">` inside `.monogram` and it fills the frame.
- **Prices:** the builder and add-ons read from the data at the top of `assets/js/main.js`. The same prices also appear as text in `services.html` and `pricing.html`, so update them in all three places.
- **Contact form:** there is no server. Submitting the form opens the visitor's email app with a message to `hello@viresta.com`. To collect submissions without email, point the form at a form service and remove the `mailto` step in `main.js`.
- **Reviews and results:** the site doesn't include testimonials, client logos or result figures. Add them only after a client has supplied and approved them.

## Speed

Fonts load without blocking the page, sections below the fold are only drawn when they scroll into view, and animations pause when they are off screen.

## Animation

All illustrations are inline SVG animated with CSS. Animations pause when they are off screen and stop for visitors who have turned on reduced motion.
