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

## Development

- Edit `index.html`, `script.js`, and `styles.css` to modify the UI and behavior.
- Media assets are under `music/`, `images/`, and `sounds/`.

## Contributing

1.  Fork the repository
2.  Create a feature branch
3.  Open a pull request

## License

This project is unlicensed. Add a `LICENSE` file if you want to set terms.
