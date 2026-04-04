# Kougka/Gin Score Tracker

A modern scorekeeping web app for the real-life card game **Koυνκάν (Gin)**.  
This app is **not** the game itself. It is a companion tool for tracking scores, rounds, dealer rotation, cutter rotation, busts, eliminations, and winner status while players play in real life.

This project was **VibeCoded with LovableAI** and then adjusted for local development and GitHub Pages deployment.

---

## Features

- Setup for **2 to 6 players**
- Enter player names before starting
- Random first dealer selection
- Automatic **dealer rotation**
- Automatic **cutter tracking**
- Round-by-round score entry
- Winner of the round gets **0 points**
- Losers receive manually entered penalty points
- Supports **100 points as safe**
- Bust only happens at **101+**
- First bust adds an **X** and resets score based on game rules
- Second bust eliminates the player
- Shows **remaining points before bust**
- **Perfect Cut** bonus support
- Round history tracking
- Winner detection when only one player remains
- Responsive UI for desktop and mobile
- Built with a polished, modern frontend

---

## Game Rules Implemented

### Basic scoring
- The winner of each round gets **0 points**
- The losing players receive the entered penalty points
- A player can safely have **100 points**
- A player busts only when they go to **101 or higher**

### First bust
When a player goes above 100 points for the **first time**:
- They are **not eliminated**
- They receive **one X**
- Their score is immediately reset to the **highest score among the other active players**

### Second bust
If a player who already has one X goes above 100 again:
- They are **eliminated**

### Perfect Cut
A Perfect Cut gives a player:
- **-10 points**
- Minimum score stays at **0**

Formula:
- `Perfect Cut total cards = number of players × 10 + 1`

Examples:
- 2 players = 21 cards
- 3 players = 31 cards
- 4 players = 41 cards
- 5 players = 51 cards
- 6 players = 61 cards

---

## Tech Stack

- **React**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **React Router**
- **TanStack Query**
- **Framer Motion**

---

## Local Development

Clone the repo:

```bash
git clone https://github.com/Georgewp3/KougkApp.git
cd KougkApp
