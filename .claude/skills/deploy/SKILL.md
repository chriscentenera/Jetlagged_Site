---
description: Deploy the develop branch to production by merging into main and pushing to GitHub, which triggers a Netlify build.
---

# Deploy to Production

Merge `develop` into `main` and push both to GitHub. This triggers a Netlify deployment on the `main` branch (jetlaggedcards.ca).

## Steps

1. Confirm the user wants to deploy — this triggers a Netlify build and uses a deploy token.
2. Run the following commands in sequence:
   ```
   git checkout main
   git merge develop --no-edit
   git push origin main
   git checkout develop
   ```
3. Report the result. If the push succeeded, let the user know that Netlify will pick up the change and deploy automatically. If it failed, show the error and do not retry without the user's confirmation.

## Notes

- Never push to main outside of this skill — all regular work stays on `develop`.
- Do not run this automatically as part of other tasks. Only run when the user explicitly asks to deploy or go to production.
- The Netlify site is at jetlaggedcards.ca (main branch). The staging site is at develop--fabulous-sable-e20c8b.netlify.app (develop branch).
