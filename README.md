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

## Deployment

Auth info is here:

https://portal.azure.com/#@davidsonrfb.org/resource/subscriptions/30916492-e53f-47fb-80df-8194d86f684d/resourceGroups/DefaultResourceGroup-EUS/providers/Microsoft.ContainerRegistry/registries/davidsonrfb/accessKey

First time login with:

    docker login davidsonrfb.azurecr.io

Then to deploy:

    docker build --tag checkonetwo .
    docker tag checkonetwo:latest davidsonrfb.azurecr.io/checkonetwo
    docker push davidsonrfb.azurecr.io/checkonetwo
