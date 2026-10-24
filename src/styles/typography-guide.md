# Design Tokens Quick Reference

Source of truth: `tailwind.config.js` (names) and `src/index.css` (values, light and dark).
Colour tokens switch with the theme on their own, so no `dark:` pair is needed.

## Type

- `font-sans` - Schibsted Grotesk (everything)
- `font-code` - JetBrains Mono, only inside real code or interface fragments

| Class          | Size           | Use                           |
| -------------- | -------------- | ----------------------------- |
| `text-display` | 48–136px fluid | the one h1                    |
| `text-title`   | 36–64px fluid  | section h2                    |
| `text-lead`    | 22–28px fluid  | a statement or intro sentence |
| `text-base`    | 18px           | body                          |
| `text-sm`      | 15px           | meta, captions                |

`text-hero-sm`, `text-section-sm`, `text-section-md` are legacy and go as each section is rebuilt.

## Colour

| Token                  | Use                                                   |
| ---------------------- | ----------------------------------------------------- |
| `ground`               | page background                                       |
| `surface`              | a tone step for panels, instead of borders or shadows |
| `ink`                  | all running text                                      |
| `muted`                | secondary notes only                                  |
| `accent`               | actions, and little else                              |
| `on-accent`            | text set on `accent`                                  |
| `field`                | one full-bleed contrasting section                    |
| `diff-add`, `diff-del` | inside the diff fragment only                         |

All text pairs pass WCAG AA in both themes; `accent` on `surface` is the tightest at 4.9:1.

## Space and shape

- `px-gutter` - outer page margins (16–32px)
- `py-section` - gap between sections (120–200px)
- `rounded` is square; `rounded-ui` (6px) only inside interface fragments; `rounded-full` for round controls
