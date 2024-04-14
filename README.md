# Demo Coin Flip Game Back-end

This is the back-end of a demo coin flip game. It's written in Typescript and uses Express.js, MongoDB, and JWT for auth.

[Live Demo](https://coin-flip-game-7210e.web.app)

[Front End Repo](https://github.com/XDapps/coin-flip-game-front-end)

## Installation

1. Create a MongoDB instance either locally or in the cloud.
2. Create a .env file in the format of .example.env including your MongoDB connection string.
3. Navigate to your project directory and run:

```shell
npm install
```

### Run Locally

```shell
npm run dev
```

### Run Production

```shell
npm run build
npm start
```

### Game Rules

1. Users can wager up to their balance on a coin flip.
2. 3 consecutive wins awards the user a 3x payout.
3. 5 consecutive wins awards the user a 10x payout.
4. Streak resets after 5 wins.
