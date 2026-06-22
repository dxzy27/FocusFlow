# FocusFlow

A minimal static web app for focus and flow — play curated music and ambient sounds while you work.

## Project Structure

- `index.html` — main page
- `script.js` — app logic
- `styles.css` — styles
- `images/` — UI images
- `music/` — music tracks (classical, lofi, nature)
- `sounds/` — short UI sounds

## Run Locally

Quick options from the project folder (`focusflow`):

- Open directly in your browser: double-click `index.html` or run:

```powershell
start index.html
```

- Run a local static server (recommended):

```powershell
# using Python
py -3 -m http.server 8000
# then open http://localhost:8000
```

- Using Node (if installed):

```powershell
npx serve .
# or
npx http-server .
```

- In VS Code: install Live Server, open `index.html`, then **Open with Live Server**.

## How to Use FocusFlow

1. Open the app in your browser.
2. Use the mode buttons to select:
   - `Pomodoro` for a focused work session.
   - `Short Break` for a quick rest.
   - `Long Break` for a longer recovery pause.
3. Press `START` to begin the selected timer and `STOP` to pause it.
4. In the music panel, choose a genre and use `prev`, `play/pause`, and `next` to control tracks.
5. Add tasks with a text description, estimated Pomodoro count, and optional notes.
6. Mark tasks complete with the checkbox or edit/delete them using the task controls.
7. Open the mini games panel to play quick breaks with games like Dino, Tetris, Pac-Man, and Snake.
8. Use the settings menu to customize timer durations, alarm sound, alarm volume, alarm repeat count, and ticking sound.
9. Download your activity log using the `Log` button to keep a record of completed focus sessions.

## Development

- Edit `index.html`, `script.js`, and `styles.css` to modify the UI and behavior.
- Media assets are under `music/`, `images/`, and `sounds/`.

## Contributing

1.  Fork the repository
2.  Create a feature branch
3.  Open a pull request

## License

This project is unlicensed. Add a `LICENSE` file if you want to set terms.
