#!/bin/bash

# 1. Update globals.css to replace btn-pill-primary and add Emil's active state
sed -i '' 's/\.btn-pill-primary/\.btn-primary/g' app/globals.css
# We also want to remove rounded-full from the button definition if it exists in globals.css

# 2. Find and replace in all TSX files
find app components -name "*.tsx" -type f | xargs sed -i '' 's/btn-pill-primary/btn-primary/g'
find app components -name "*.tsx" -type f | xargs sed -i '' 's/rounded-full//g'
find app components -name "*.tsx" -type f | xargs sed -i '' 's/rounded-3xl//g'
find app components -name "*.tsx" -type f | xargs sed -i '' 's/rounded-2xl//g'
find app components -name "*.tsx" -type f | xargs sed -i '' 's/rounded-xl//g'
find app components -name "*.tsx" -type f | xargs sed -i '' 's/rounded-lg//g'
find app components -name "*.tsx" -type f | xargs sed -i '' 's/rounded-md//g'
find app components -name "*.tsx" -type f | xargs sed -i '' 's/rounded-sm//g'

# Add Emil's scale feedback to the primary buttons
find app components -name "*.tsx" -type f | xargs sed -i '' 's/btn-primary/btn-primary active:scale-[0.97] transition-transform duration-150 ease-out/g'

# 3. Fix tailwind.config.js default border radius (set to 0px)
# But deleting the classes is already enough. We will just ensure buttons are carbon.
