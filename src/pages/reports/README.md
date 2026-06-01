# Reports

Each report is a standalone Astro page in this folder.

## Naming convention

```
{brand}-{product-slug}-{YYYY-MM-DD}.astro
```

Examples:
- `myprotein-impact-whey-2026-06-01.astro`
- `myprotein-creatine-monohydrate-2026-07-15.astro`

## Adding a new report

1. **Create the page file** using the naming convention above.

2. **Import the layout and card component:**
   ```astro
   ---
   import ReportLayout from '@/components/ReportLayout.astro';
   import FindingCard from '@/components/FindingCard.astro';
   ---
   ```

3. **Set the layout title:**
   ```astro
   <ReportLayout title="Product Name — Brand PDP">
   ```

4. **Add `FindingCard` components** for each finding. Each card takes:
   - `title` — short description of the issue
   - `viewport` — `'Desktop'`, `'Mobile'`, or `'Both'`
   - `priority` — `'high'`, `'medium'`, or `'low'`
   - Three named slots: `what`, `why`, `fix`

   ```astro
   <FindingCard title="Issue title" viewport="Mobile" priority="high">
     <p slot="what">Describe what the problem is.</p>
     <p slot="why">Explain why it matters.</p>
     <p slot="fix">Describe how to fix it.</p>
   </FindingCard>
   ```

5. **Register the report** in `index.astro` by adding an entry to the `reports` array:
   ```ts
   {
     slug: 'myprotein-impact-whey-2026-06-01',
     name: 'Impact Whey Protein Milkshake — Myprotein PDP',
     date: '1 June 2026',
     url: 'https://...',
     health: 'AMBER',       // 'GREEN' | 'AMBER' | 'RED'
     healthLabel: 'Conversion Risk',
   }
   ```

## Folder structure

```
src/
├── components/
│   ├── FindingCard.astro   — priority-coloured audit card
│   └── ReportLayout.astro  — sticky header page shell
├── pages/
│   └── reports/
│       ├── index.astro     — report listing page
│       ├── README.md       — this file
│       └── {brand}-{slug}-{date}.astro
└── styles/
    └── design-system.css   — brand tokens (colours, fonts, radii)
```
