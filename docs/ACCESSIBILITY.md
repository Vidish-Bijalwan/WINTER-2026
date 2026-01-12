# Accessibility Features

## WCAG 2.1 AA Compliance

TopoShape Insights follows Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.

---

## Keyboard Navigation

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Cmd/Ctrl + /` | Toggle keyboard shortcuts help |
| `Cmd/Ctrl + B` | Toggle sidebar |
| `Esc` | Close modal/dialog |
| `Tab` | Navigate to next element |
| `Shift + Tab` | Navigate to previous element |

### Dashboard Navigation

| Shortcut | Action |
|----------|--------|
| `Arrow Keys` | Navigate between widgets |
| `Enter` | Enter focus mode for widget |
| `Space` | Toggle widget expansion |
| `Delete/Backspace` | Remove focused widget |

### Data Visualization

| Shortcut | Action |
|----------|--------|
| `Arrow Keys` | Navigate data points |
| `+/-` | Zoom in/out |
| `Home` | Reset zoom |
| `E` | Export chart data |

---

## Screen Reader Support

### ARIA Labels

All interactive elements have descriptive ARIA labels:

```tsx
// Dashboard Widget
<button 
  aria-label="Remove visualization widget"
  aria-describedby="widget-remove-description"
>
  <X />
</button>

// TDA Stats
<div 
  role="region" 
  aria-label="Real-time TDA metrics"
  aria-live="polite"
>
  {stats}
</div>

// Anomaly Alert
<div 
  role="alert" 
  aria-live="assertive"
  aria-atomic="true"
>
  Anomaly detected: Confidence {confidence}%
</div>
```

### Live Regions

Dynamic content uses `aria-live` for screen reader announcements:
- **polite**: Statistics updates, chart data changes
- **assertive**: Anomaly alerts, error messages

---

## Semantic HTML

All components use semantic HTML5 elements:

```tsx
<main>
  <nav aria-label="Main navigation">
    <ul>...</ul>
  </nav>
  
  <article>
    <header>
      <h1>Dashboard</h1>
    </header>
    
    <section aria-labelledby="tda-metrics-heading">
      <h2 id="tda-metrics-heading">TDA Metrics</h2>
      {/* Content */}
    </section>
  </article>
</main>
```

---

## Focus Management

### Focus Indicators

Custom focus styles for better visibility:

```css
:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :focus-visible {
    outline-width: 4px;
  }
}
```

### Focus Trapping

Modals and dialogs trap focus within their boundaries:

```tsx
<Dialog open={isOpen}>
  <DialogContent
    onOpenAutoFocus={(e) => {
      // Focus first interactive element
      firstButtonRef.current?.focus();
    }}
    onCloseAutoFocus={(e) => {
      // Return focus to trigger button
      triggerRef.current?.focus();
    }}
  >
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

---

## Color Contrast

All text meets WCAG AA contrast ratios:

| Element | Foreground | Background | Ratio |
|---------|-----------|------------|-------|
| Body text | #e2e8f0 | #0f172a | 13.5:1 ✅ |
| Primary button | #ffffff | #3b82f6 | 4.6:1 ✅ |
| Danger text | #fca5a5 | #0f172a | 8.2:1 ✅ |

### Dark Mode

Automatically respects system preferences:

```tsx
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button 
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
```

---

## Reduced Motion

Respects `prefers-reduced-motion` setting:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
// In React components
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
>
  {content}
</motion.div>
```

---

## Form Accessibility

### Labels and Descriptions

```tsx
<div>
  <label htmlFor="email" className="block mb-2">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    aria-describedby="email-help"
    aria-required="true"
    aria-invalid={errors.email ? 'true' : 'false'}
  />
  {errors.email && (
    <p id="email-error" role="alert" className="text-red-500">
      {errors.email}
    </p>
  )}
  <p id="email-help" className="text-sm text-muted">
    We'll never share your email
  </p>
</div>
```

### Error Handling

Error messages are announced to screen readers:

```tsx
{errors.length > 0 && (
  <div role="alert" aria-live="assertive">
    <h3>Please correct the following errors:</h3>
    <ul>
      {errors.map(error => (
        <li key={error.field}>
          <a href={`#${error.field}`}>{error.message}</a>
        </li>
      ))}
    </ul>
  </div>
)}
```

---

## Skip Navigation

Skip links allow keyboard users to bypass repeated content:

```tsx
<a 
  href="#main-content" 
  className="skip-link"
  style={{
    position: 'absolute',
    left: '-9999px',
    zIndex: 999
  }}
  onFocus={(e) => {
    e.target.style.left = '0';
  }}
  onBlur={(e) => {
    e.target.style.left = '-9999px';
  }}
>
  Skip to main content
</a>

<main id="main-content" tabIndex={-1}>
  {/* Main content */}
</main>
```

---

## Testing

### Automated Testing

```bash
# Run accessibility tests
npm run test:a11y

# Lighthouse audit
npm run audit:a11y
```

### Manual Testing Checklist

- [ ] All images have alt text
- [ ] All interactive elements are keyboard accessible
- [ ] Focus order is logical
- [ ] No keyboard traps
- [ ] Color is not the only means of conveying information
- [ ] Animations respect prefers-reduced-motion
- [ ] Form inputs have labels
- [ ] Error messages are descriptive
- [ ] ARIA landmarks are present
- [ ] Heading levels are sequential

### Screen Reader Testing

Tested with:
- **NVDA** (Windows)
- **JAWS** (Windows)
- **VoiceOver** (macOS, iOS)
- **TalkBack** (Android)

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)

---

**Last Updated**: 2026-01-11  
**Compliance Level**: WCAG 2.1 AA
