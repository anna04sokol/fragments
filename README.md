# Fragments

A REST API for storing and retrieving user-owned text and image fragments.

I built this as the backend for a Seneca cloud-computing course. The service is a real microservice: authenticated CRUD, two storage backends, Docker, and CI/CD.

Companion UI: [fragments-ui](https://github.com/anna04sokol/fragments-ui)

## What it does

- Create, read, update, and delete fragments (text, Markdown, JSON, images)
- Convert some types on GET (for example Markdown to HTML)
- Identify the owner from the auth token; users only see their own data
- Store **metadata** in DynamoDB and **file bytes** in S3 when `AWS_REGION` is set
- Fall back to an in-memory store for local development without AWS

## Architecture

| Piece | Choice |
|---|---|
| API | Node.js, Express |
| Auth | Amazon Cognito, or HTTP Basic Auth for tests |
| Metadata | DynamoDB (or in-memory) |
| Objects | S3 (or in-memory) |
| Local AWS | LocalStack (S3) + DynamoDB Local via Docker Compose |
| Quality | ESLint, Jest unit tests, Hurl integration tests |
| Ship | Docker, GitHub Actions CI, tag-based CD to AWS |

## API

All `/v1` routes require authentication.

| Method | Path | Purpose |
|---|---|---|
| POST | `/v1/fragments` | Create a fragment |
| GET | `/v1/fragments` | List the current user's fragments |
| GET | `/v1/fragments/:id` | Get fragment data (optional conversion) |
| GET | `/v1/fragments/:id/info` | Get fragment metadata |
| PUT | `/v1/fragments/:id` | Replace fragment data |
| DELETE | `/v1/fragments/:id` | Delete a fragment |

## How to run

```bash
npm install
npm run dev
```

The API listens on `http://localhost:8080`.

**With local AWS (S3 + DynamoDB):**

```bash
docker compose up -d
./scripts/local-aws-setup.sh
npm start
```

## Tests

```bash
npm test                  # unit tests
npm run test:integration  # Hurl tests (needs Docker Compose)
npm run lint
```

CI on `main` runs lint, unit tests, integration tests, and a Docker image build.
