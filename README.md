# Pokopia Tracker

A friendly companion for **Pokémon Pokopia**. Lay out your island the way it
actually is — the habitats you've built and who lives where — keep track of the
Pokémon you've befriended, and get suggestions for who to go after next.

It runs in your web browser, saves your progress automatically, and can be added
to your phone like an app.

---

## What it's for

Pokopia has a lot of Pokémon, and most of them can show up in more than one place,
which gets overwhelming fast. This tracker keeps three things straight for you:

- **What you've caught** — your progress toward all 310.
- **What's on your island** — which habitats you've built, who's living in them, and who's tucked away in houses.
- **What to do next** — which habitat to build, which one's sitting empty and ready, and which occupied one is worth freeing up.

---

## Getting started

1. Open the app and pick an **area** using the buttons near the top (Wasteland, Beach, Ridge, and so on). You look at one area at a time.
2. See a Pokémon you still want in the **"Recommended here — still to get"** row? Tap it. It'll show you which habitat spawns it, with the easiest one marked **Recommended** — tap that to add it to your island.
3. When a Pokémon actually moves in, record where it lives (more on that below). That's it — everything else builds from there.

The bar up top always shows how many you've befriended out of 310, and how many habitats you've built.

---

## The three zones in each area

**Habitats** — the habitats you've built here. Tap **Add habitat** to add one. Each
habitat is its own tile showing who lives in it (or "empty" if no one has moved in
yet). Built two of the same habitat? Add it twice — each tile tracks its own
resident, and duplicates get a little **dup** badge.

**Houses** — the Pokémon you've moved into houses. Tap **Add** to record one.

**Recommended here — still to get** — Pokémon suggested for this area that you
haven't caught yet. These lists are *just suggestions* — since most Pokémon can be
found in several areas, you're free to put anyone anywhere. The **Any Pokémon…**
button lets you search the whole roster and drop in whoever you like.

---

## Logging as you play

Everything is **tap-to-place** — no dragging needed (though on a computer you *can*
drag if you prefer).

- **Want a Pokémon you don't have yet?** Tap it in the "still to get" row. You'll see every habitat it comes from, with build requirements. Tap one to build it.
- **Just caught something?** Tap it and either pick the ready habitat it moved into ("Ready — got it?"), or tap **Caught it — house here** to put it in a house. Placing a Pokémon anywhere marks it as befriended automatically.
- **Set or change who's in a habitat:** tap the habitat's tile and pick a resident, mark it empty, or remove the habitat.
- **Move a Pokémon out of a house:** tap it and send it to a habitat, or remove it.
- **Chasing a second copy from the same spot?** In Pokopia you can build two of the same habitat to draw a second Pokémon from it. Add the habitat again and you'll have two independent tiles to fill.

---

## "Next up" — your to-do list

The **Next up** panel at the top reads your island for the area you're viewing and
sorts your best moves into three buckets:

- **Empty & ready** — a habitat you've built that's sitting open and can still give you something you're missing. Just wait for it.
- **Free a slot** — a habitat that's occupied, but could still produce something new. Move its current resident to a house to reopen it.
- **Build next** — habitats worth building for this area, ranked by how many new Pokémon they could give you. If you've already got one and want another, it'll say **build another**.

Heads up: when you free a habitat, the game picks a *random* one of the species
you're still missing from it — so a habitat with one missing target is a sure
thing, and one with several is a roll of the dice.

---

## Events & Legends

The **Event** and **Legends** tabs are for Pokémon that come from special encounters
rather than habitats. There's nothing to build — just tap one to mark it caught.

---

## Your progress & backups

Your data is saved automatically in **this browser, on this device**. A few things
worth knowing, using the buttons in the top corner:

- **Export** downloads a backup file. Good to do now and then.
- **Import** loads a backup — that's also how you move your progress to another phone or computer (export on one, import on the other).
- **Reset** (the red trash button) wipes everything and starts fresh. It asks first.

Because it's per-device, your phone and your computer keep separate progress unless
you move a backup between them.

---

## Add it to your phone (and use it offline)

- **iPhone / iPad:** open the site in Safari, tap the **Share** button, then **Add to Home Screen**. This is worth doing — it gives you an app icon *and* keeps your saved progress from being cleared, which Safari can otherwise do after about a week of not opening it.
- **Android / computer:** your browser will offer **Install** or **Add to Home screen**.

After you've opened it online once, it works **offline** — the one thing that needs a
connection is the little Pokémon and habitat pictures, which quietly hide when
you're offline.

---

## Which version am I on?

There's a small version tag (like `v5.0`) right next to the title. If you ever
update the app, glance there to confirm you're on the new one.

---

## Credits

- Built with **Claude** (Anthropic).
- Habitat build data adapted from Polygon's *Pokémon Pokopia Habitat Dex*.
- Pokémon sprites via **PokeAPI**.

## Fine print

This is an unofficial, non-commercial fan project. It is not affiliated with,
endorsed by, or sponsored by Nintendo, Game Freak, Koei Tecmo, or The Pokémon
Company. "Pokémon," "Pokémon Pokopia," and all related names, sprites, and imagery
belong to their respective owners and appear here for identification only.

---

<details>
<summary><strong>For the tech-minded: hosting &amp; updating</strong></summary>

This is a single self-contained `index.html` plus a service worker, manifest, and
icons — no build step. To host it on GitHub Pages, put every file in the repo root
and set **Settings &rarr; Pages &rarr; Deploy from a branch &rarr; main &rarr; /(root)**.
Everything uses relative paths, so the repo name doesn't matter.

When you change `index.html`, bump the `CACHE` name in `sw.js` (e.g.
`pokopia-shell-v5.1`) so returning visitors get the new files instead of the cached
ones — the version tag next to the title is kept in sync with it. Set a real
contact address in place of `YOUR-EMAIL@example.com` in the page footer.

The app code is MIT-licensed (see `LICENSE`); that license covers only the original
code and grants no rights to any third-party Pokémon assets.

</details>
