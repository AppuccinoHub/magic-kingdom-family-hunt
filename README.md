# Magic Kingdom family bingo

A phone-first family bingo card and adventure passport for a Magic Kingdom visit. One phone is passed around the family. Big type. No timer. No sign-up. No account.

This is an independent fan activity. It is not an official Disney app and it is not affiliated with The Walt Disney Company or Walt Disney World.

## How a family uses it

1. Open the page on one phone.
2. Start a hunt and pass that phone to whoever is playing.
3. Read a challenge in big letters. The card wording is unchanged.
4. Do it together at the park.
5. Add a stamp. Five in a line is a bingo.
6. When all 25 are stamped, the family sees “You found everything!” once. They can open the souvenir certificate or play that moment again.

Show times and treats printed on the card can change. Check at the park that day.

## What is saved

Progress, notes, and optional photos stay in this browser on this device. Another phone does not share them. Clearing this browser’s saved data can erase them.

Photos are kept in the browser. They are not saved to the camera roll.

Not saved: email, phone number, or a family code. There is no shared server.

## Run it

```bash
npm install
npm test
npm run build
npx --yes serve out
```

`npm run build` writes a static site in `out/`. The app does not need a database or an API.

## Free hosting

GitHub Pages can publish the static `out/` folder. The workflow in `.github/workflows/pages.yml` builds with `GITHUB_PAGES=true`, which serves the site at `/magic-kingdom-family-hunt/`. The repository can stay private only if the GitHub plan allows Pages on a private repository. The published Pages address is still a public link. Do not put family names or photos in the site files. Those stay in the browser.
