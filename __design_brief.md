Objective: Transform the personal songs site into a premium, elegant music library with a strong visual identity, a responsive 2x2 card layout on desktop, theme switching, and an add-song workflow that can update songs.json from the browser when supported.

Audience: A personal/private music library for one user. The experience should feel polished, emotional, and easy to maintain.

Aesthetic direction: Luxe glassmorphism with a cinematic but restrained mood. Use deep layered gradients, soft glows, crisp cards, and a refined romantic palette. Avoid generic default UI. Make the interface feel intentional and premium.

Content structure:
- Hero header with title, short subtitle, search, theme toggle, and add-song controls.
- Utility panel for adding a song with title, artist, filename, cover filename, and a save action.
- Main library area showing song cards in a 2x2 grid on larger screens and a single column on small screens.
- Loading state, status messaging, and footer.

Typography direction: Use a distinct display font for the title and a clean sans-serif for body text. The title should feel elegant and expressive, while controls and metadata remain highly legible.

Color direction: Dark indigo/rose base with amber or coral accents for the default theme. Provide a light theme that feels warm, creamy, and sophisticated rather than flat white. Keep contrast strong.

Functional constraints:
- Keep the existing songs.json structure as the source of truth.
- Allow adding songs from the UI.
- If browser file write access is available, save directly back to songs.json.
- If not, provide a download/export fallback that preserves the updated JSON content.
- Search must continue filtering the visible cards.
- Theme toggle should persist across reloads.
- Audio should remain streaming only, no download feature.

Layout constraint: Desktop should present the songs as a 2x2 format with balanced spacing and responsive behavior.

Output path: Update the existing app files in e:\songs_website, mainly index.html, styles.css, and app.js.

Image needs: No external imagery. Use the existing cover art files already in covers/.
