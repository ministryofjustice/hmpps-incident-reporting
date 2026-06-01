# Auto-skip the prisoner-role radio when only one role can be chosen

## Summary

When staff add (or edit) a prisoner on an incident report, they normally choose the
prisoner's **role** from a list of radio buttons, then optionally fill in an outcome
(NOMIS reports only) and free-text involvement details.

For some incident types the role list only ever offers **one** option. The clearest
example is `UNLAWFUL_DETENTION_1`, whose configuration declares a single active prisoner
role:

```ts
prisonerRoles: [
  {
    prisonerRole: 'UNLAWFULLY_DETAINED',
    onlyOneAllowed: true,
    active: true,
  },
],
```

Forcing the user to click the sole radio button is a pointless extra step. This change
removes it: when only one role is selectable, the role is submitted automatically as a
**hidden field** and the page asks only for the optional *"Details of &lt;name&gt;'s
involvement"* free-text box (and, for NOMIS-origin reports, the outcome — unchanged).

This reuses the exact mechanism introduced in **IR-1651** (commit `de195c5`), which
already does this auto-skip for single-answer *questions* in the dynamic questions flow.

## Behaviour decisions

- **Trigger:** the optimisation activates whenever the **runtime** list of selectable
  roles is reduced to exactly one. This covers single-role incident types like
  `UNLAWFUL_DETENTION_1`, and also multi-role types where every other `onlyOneAllowed`
  role has already been used up and only one remains. This is consistent with IR-1651's
  "only one active answer" philosophy.
- **Page content when hidden:** only the optional details textbox is shown (plus the
  outcome field for NOMIS reports). The assigned role name is **not** printed on the
  page — the page heading already names the prisoner, and the role is implicit for a
  single-role type.

## Files changed

### 1. `server/routes/reports/prisoners/involvement/controller.ts`

`PrisonerInvolvementController.customisePrisonerRoles()` already builds the list of
selectable role radio items (`newItems`) and redirects with a flash error when that list
is empty. A new branch was added immediately after that: when exactly one item remains,
the `prisonerRole` field is switched from a `govukRadios` component to a `hidden`
component with its `default` set to the sole role code.

```ts
customisedFields.prisonerRole.items = newItems

if (newItems.length === 0) {
  req.flash('error', {
    title: 'No more prisoner roles can be added',
    content: 'You may need to remove an existing person.',
  })
  res.redirect(this.getBackLink(req, res))
  return
}

if (newItems.length === 1) {
  // Only one selectable role: there is nothing to choose, so skip the radio
  // and submit the role automatically as a hidden field. The page then only
  // asks for the optional involvement details.
  customisedFields.prisonerRole = {
    ...customisedFields.prisonerRole,
    component: 'hidden',
    default: newItems[0].value,
  }
}
```

(The pre-existing `if (customisedFields.prisonerRole.items.length === 0)` check was
rewritten as `if (newItems.length === 0)` purely for readability — same condition.)

This single change covers **both** the add and the edit journeys, because both concrete
controllers (`add.ts`, `edit.ts`) extend this base class and run this middleware.

- **Add:** `values.prisonerRole` is empty on first render, so the hidden input takes its
  value from `field.default`. The `validate: ['required']` rule on the field is satisfied
  by the value submitted from the hidden input.
- **Edit:** `EditPrisonerInvolvementController.getValues()` already pre-fills
  `prisonerRole` from the existing involvement, which takes precedence over `default`, so
  the existing role is carried through unchanged.

The `"What was <name>'s role?"` label still gets set in `customiseFields()`, but it is
simply never rendered for a hidden input, so no extra cleanup was needed.

### 2. `server/views/macros/renderField.njk`

The generic `hidden` component branch previously rendered:

```njk
<input type="hidden" name="{{ fieldName }}" value="{{ values[fieldName] | default("") }}" />
```

It did not fall back to `field.default`, so a freshly-rendered add form would emit an
empty value. It now mirrors the proven pattern from `questions.njk`:

```njk
<input type="hidden" name="{{ fieldName }}" value="{{ values[fieldName] | default(field.default) | default("") }}" />
```

This is fully backwards-compatible: the other hidden fields that use this branch (report
re-open, prisoner search, staff search) set no `default`, so the trailing `| default("")`
preserves today's empty-string behaviour.

### 3. Tests

**`server/routes/reports/prisoners/involvement/add.test.ts`** — new
`describe('when the incident type allows only one prisoner role')` block (type
`UNLAWFUL_DETENTION_1`):

- GET renders the role as a hidden field (`name="prisonerRole"`, `value="UNLAWFULLY_DETAINED"`,
  `type="hidden"`), does **not** render the *"What was Andrew's role?"* radio legend nor
  the *"Unlawfully detained"* radio label, and still shows the *"Details of Andrew's
  involvement"* box.
- POST with the hidden role + a comment calls `addToReport` with
  `prisonerRole: 'UNLAWFULLY_DETAINED'`, `outcome: null` and the comment, then redirects
  to the prisoner summary.

**`server/routes/reports/prisoners/involvement/edit.test.ts`** — new
`describe('when the incident type allows only one prisoner role')` block editing the
single involvement of an `UNLAWFUL_DETENTION_1` report:

- GET keeps the role hidden (no radio), and pre-fills the details textarea with the
  existing comment (`Original details`).
- POST with an updated comment calls `updateForReport(report.id, 1, { prisonerRole:
  'UNLAWFULLY_DETAINED', outcome: null, comment: 'Updated details' })` — role unchanged,
  details updated — then redirects to the summary.

The existing multi-role tests (`FIND_6`, `ESCAPE_FROM_PRISON_1`, …) were left untouched
and still verify that the radio list is shown whenever more than one role is selectable.

## What was deliberately *not* changed

- **`formWizard.ts` / `generateSteps`** — prisoner involvement is its own standalone form
  wizard, separate from the dynamic questions flow, so no change was required there.
- **API-error edge case:** `handleApiError` attaches API errors to the `prisonerRole`
  key. With the field hidden, the error-summary link won't focus a visible element, but
  the error message still displays. This is pre-existing behaviour for the controller's
  key field and is unaffected by this change.

## Verification

```shell
cd hmpps-incident-reporting
npm test          # 76 suites, 2622 tests — all pass
npm run typecheck # clean
npm run lint      # clean
```

Suggested manual checks:

1. Create an `UNLAWFUL_DETENTION_1` report and add a prisoner — confirm there is no role
   radio, only the optional details box; save and confirm the prisoner appears on the
   summary with role *"Unlawfully detained"*.
2. Edit that prisoner — confirm the role stays hidden and the details pre-fill; change the
   details and save.
3. For contrast, add a prisoner on a multi-role type (e.g. a FIND report) and confirm the
   role radio list still appears as before.
