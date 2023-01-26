# relay-bot

This is a project I've done a while ago. It collects messages from different channels in a Discord server(s), and sends them to a Telegram channel. This was used to make a Telegram "announcements" channel, where

I have went back to it to update and release it to the public. **Support will be provided, but I can't guarantee new features will be developed.**

## Run the bot

- Fill out the .env file
- Run:

```bash
$ yarn install # Install depedencies

$ yarn start # Start the bot
```

## Build with Docker

- Build using `docker build -t relay-bot:latest .`
