# Magic Kingdom family bingo

A phone-first family bingo card and adventure passport for a Magic Kingdom visit. One link can start a new private hunt for each family. Big type. No timer. No sign-up.

This is an independent fan activity. It is not an official Disney app and it is not affiliated with The Walt Disney Company or Walt Disney World.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:47291](http://127.0.0.1:47291).

```bash
npm test
npm run test:e2e
```

## How a family uses it

1. Start a hunt, or join with a family code.
2. Read a challenge in big letters. The card wording is unchanged.
3. Do it together at the park.
4. Add a stamp. Five in a line is a bingo.
5. When all 25 are stamped, the family sees “You found everything!” once. They can open the souvenir certificate or play that moment again.

Show times and treats printed on the card can change. Check at the park that day.

## What is saved

On the shared hunt server:

- Family name, optional travel-advisor display name, nicknames, and picture choices
- Stamps, notes, and optional photos

Not saved: email, phone number, or a public list of families. The family code is the only key. Anyone with the code can see and edit that hunt, including photos.

Photos stay on the server and are sent only with that hunt’s cookie.

Choose **Use this phone only** if the server cannot be reached. That copy is stored in this browser. It has no family code and does not sync.

## Hosting

Shared play needs this Node server and a disk folder that stays put.

```bash
HUNT_DATA_DIR=/var/lib/family-bingo npm run build
HUNT_DATA_DIR=/var/lib/family-bingo npm start
```

Use HTTPS in public so the browser keeps the cookie private. A static host cannot sync two phones. The in-memory guess limit is per server process.

If the code is lost, the hunt cannot be looked up from a list. Open **Family code and settings** while a phone is still in the hunt.
