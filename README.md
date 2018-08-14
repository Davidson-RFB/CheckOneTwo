# CheckOneTwo
Streamlined vehicle and equipment checklists

## Personas

Anybody - An unauthenticated user who vists an ingress URL (eg via scanning a QR code affixed to a piece of a equipment). This is most likely a firefighter who is completing a checklist.

User - An authenticated user who has an authorised account. This is most likely an DC, EO, etc.

## Quickstart

You must have NodeJS, Yarn, Docker and Docker Compose installed. Then run:

```
yarn
npm run docker:migrate
npm run docker:test
```

And you should see a lovely passing test suite.

For development, run:

```
npm run docker:watch
```

And the suite will re-run every time you save a file. Happy hacking!

To run the dev server:

```
docker-compose up -d dev
```
