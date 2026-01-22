# Add Task UI Refactor Plan

## Problem Statement
The current Add Task form modal uses a basic form layout that doesn't match the polished, list-based UI pattern seen in the Streaks app reference. We need reusable components that can create consistent, professional list-based interfaces across the app.

## Solution Overview
Create a component library of reusable UI primitives (ListRow, IconButton, SectionHeader, etc.) that can be composed to build various screens. Refactor the Add Task flow to use a two-step process: task selection followed by task configuration, using these new components.

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Component Reusability | 4+ components used in 2+ screens | Code inspection |
| Visual Match | 90% layout similarity to reference | Visual comparison |
| Functionality | All CRUD operations work | Manual testing |

## Scope Definition

### In Scope (P0 - Must Have)
- Create reusable `ListRow` component (icon, text, chevron pattern)
- Create reusable `IconButton` component (circular icon buttons)
- Create reusable `SectionHeader` component (uppercase label)
- Create reusable `ModalHeader` component (close, title, action)
- Refactor StreakFormModal to use new components
- Themed backgrounds per screen type

### Should Have (P1)
- Category tabs for task filtering
- Search functionality in Add Task
- Smooth transitions between screens

### Out of Scope
- Health app integration
- Automatic task completion
- Multiple theme colors (stick with gradient for now)

## Technical Approach

### New Components (in `/src/components/common/`)

```
/src/components/common/
├── index.js              # Exports all common components
├── ListRow.js            # Row with icon, label, value, chevron
├── IconButton.js         # Circular icon button (for tabs, actions)
├── SectionHeader.js      # Uppercase section label
├── ModalHeader.js        # Header with close, title, optional action
├── InfoBanner.js         # Rounded info/warning message box
└── ThemedModal.js        # Modal wrapper with gradient background
```

### Component Specifications

#### 1. ListRow
```javascript
Props:
- icon: string (emoji) or ReactNode
- iconBackground: string (color)
- label: string
- value?: string (right-side text)
- badge?: ReactNode (e.g., heart icon)
- showChevron?: boolean (default true)
- onPress?: function
- disabled?: boolean
```

Layout:
```
[Icon Circle] [Badge] Label                    Value [>]
   36px        16px   flex:1                   auto  16px
```

Styling:
- Background: `rgba(255, 255, 255, 0.1)`
- Border radius: 12px
- Padding: 14px horizontal, 12px vertical
- Full width with consistent margins

#### 2. IconButton
```javascript
Props:
- icon: string (emoji) or ReactNode
- selected?: boolean
- onPress?: function
- size?: 'sm' | 'md' | 'lg' (default 'md')
- color?: string
- selectedColor?: string
```

Styling:
- Sizes: sm=36px, md=44px, lg=56px
- Unselected: `rgba(0, 0, 0, 0.15)` background
- Selected: accent color background (e.g., `#CDDC39`)
- Border radius: full (circular)

#### 3. SectionHeader
```javascript
Props:
- title: string
- style?: object
```

Styling:
- Uppercase text
- Font size: 11px
- Letter spacing: 1px
- Color: `rgba(255, 255, 255, 0.6)`
- Margin bottom: 12px

#### 4. ModalHeader
```javascript
Props:
- title: string
- onClose?: function
- onAction?: function
- actionIcon?: string (e.g., search icon)
- showBackArrow?: boolean
```

Layout:
```
[X or <]        Title        [Action?]
  40px          center         40px
```

#### 5. InfoBanner
```javascript
Props:
- icon?: string
- message: string
- variant?: 'info' | 'warning' | 'success'
```

Styling:
- Background: `rgba(255, 255, 255, 0.15)`
- Border radius: 12px
- Padding: 14px
- Icon + text layout

#### 6. ThemedModal
```javascript
Props:
- visible: boolean
- onClose: function
- theme?: 'purple' | 'green' | 'orange' (gradient presets)
- children: ReactNode
```

Gradient presets:
- purple: `['#5B9FED', '#8B7FD6', '#C96FB9', '#E85DA0']`
- green: `['#8BC34A', '#7CB342', '#689F38']`
- orange: `['#FF7043', '#F4511E', '#E64A19']`

### Refactored Screen Flow

**Current:** Single form modal
**New:** Two-step flow

1. **TaskSelectModal** - Select task type
   - Category tabs at top
   - List of predefined tasks OR custom task option
   - Uses: ModalHeader, IconButton, SectionHeader, ListRow

2. **TaskConfigModal** - Configure selected task
   - Preview of task (circle + icon + name)
   - Configuration options as ListRows
   - Save button at bottom
   - Uses: ModalHeader, ListRow, InfoBanner

### File Changes

**New Files:**
1. `/src/components/common/ListRow.js`
2. `/src/components/common/IconButton.js`
3. `/src/components/common/SectionHeader.js`
4. `/src/components/common/ModalHeader.js`
5. `/src/components/common/InfoBanner.js`
6. `/src/components/common/ThemedModal.js`
7. `/src/components/common/index.js`

**Modified Files:**
1. `/src/screens/StreakFormModal.js` - Refactor to use new components
2. `/src/components/index.js` - Export common components

## Implementation Phases

### Phase 1: Core Components
1. Create `/src/components/common/` directory
2. Implement ListRow component
3. Implement IconButton component
4. Implement SectionHeader component
5. Create index.js exports

### Phase 2: Modal Components
1. Implement ModalHeader component
2. Implement InfoBanner component
3. Implement ThemedModal component

### Phase 3: Refactor Form
1. Update StreakFormModal to use new components
2. Convert form sections to ListRow-based layout
3. Test all CRUD operations still work

### Phase 4: Polish
1. Verify visual match with reference
2. Test animations and transitions
3. Ensure consistent spacing throughout

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing functionality | High | Keep old code until new is verified |
| Over-engineering components | Med | Start simple, add props as needed |
| Inconsistent styling | Med | Use shared style constants |

## Success Criteria Checklist

### Components
- [ ] ListRow renders icon, label, optional value, optional chevron
- [ ] ListRow responds to onPress with opacity feedback
- [ ] IconButton shows selected/unselected states
- [ ] SectionHeader displays uppercase text with proper styling
- [ ] ModalHeader shows close button, centered title
- [ ] ThemedModal wraps content with gradient background

### Integration
- [ ] StreakFormModal uses at least 3 new common components
- [ ] Add task flow works end-to-end (add → save → appears in list)
- [ ] Edit task flow works (long press → edit → save → updates)
- [ ] Delete task flow works (long press → delete → removed)

### Visual
- [ ] ListRow matches reference styling (rounded, translucent bg)
- [ ] Spacing is consistent (16px margins, 8px row gaps)
- [ ] Typography matches (sizes, weights, colors)
