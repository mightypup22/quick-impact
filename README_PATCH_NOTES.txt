Quick Impact – iPhone Logo & Console Fixes (minimal patch on your previous build)
- PWA icons ensured (assets/icons/icon-192.png, icon-512.png), manifests use absolute paths, head links added.
- favicon.ico added to root.
- Header/Footer logos: absolute path '/assets/logo.svg'; removed srcset/sizes.
- Compact logo sizing in CSS (desktop 28px, mobile 20px); iOS clamp included.
- TeamSlider init guarded in main.js and components/teamSlider.js (only runs if .team-slider exists).
- anchors.smart.js ensured to avoid 404 if referenced.
