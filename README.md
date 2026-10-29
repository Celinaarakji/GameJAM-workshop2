# The Glitched Arcade

Three corrupted systems. One way out. A 13-minute, pair-programming escape room for an AI-assisted debugging workshop.

## Play and edit

1. Download this repository using **Code → Download ZIP**, then extract the ZIP completely. Or clone the repository.
2. Open `index.html` in Chrome, Edge, or Safari. No installation, server, internet connection, or API key is needed.
3. Click **Start Game**. Use **WASD / arrow keys** to move and **E / Enter** beside a terminal or exit to interact.
4. Investigate unexpected behaviour using your editor and AI assistant. Save your changes and reload the local page to test them. Reload starts a fresh run.
5. Restore three systems, keep the access words, and reach the final exit.

**Reset Run** restarts the game without changing your source files. If you collect an item and need to try again, reset or reload. The game has no saved progress and no enforced countdown.

The glowing terminals are marked M, I, and S. Your purple character starts in the left sector. Walk onto the gold key to collect it. Locked gates connect the three sectors.

The hosted demo lets you preview the workshop game. **Your local edits do not change the hosted demo.** Test your fixes by opening your own extracted `index.html`.

## Work with AI

Describe what you did, what you expected, and what actually happened. Share relevant code, ask for an explanation and a small change, then test the suggestion. You are responsible for understanding your fix.

## Publish the participant demo to GitHub Pages

The repository is a plain static website. Publish only these participant files.

1. Open repository **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose **main** and **/ (root)**, then Save.
4. Wait for GitHub's Pages deployment to finish. The expected URL is:
   https://celinaarakji.github.io/GameJAM-workshop2/

If GitHub uses a different default branch, select the branch containing `index.html`. All asset paths are relative, so both a project Pages URL and a local file work.

## Workshop format

- 3 minutes: story, setup, and briefing.
- 13 minutes: pairs investigate, ask AI, repair, and test.
- 4 minutes: reveal and discussion with the instructor.

No embedded editor, external assets, packages, analytics, backend, or AI service is included. Use your own AI tool alongside your editor.
