# Vodafone Tourist Pack — Backend

Spring Boot (Java 25) backend for the purchase-to-activation flow: select a
pack → pay → get an emailed QR → scan to activate.

No backend existed anywhere in this workspace before this (no `pom.xml`, no
`.java` files) — this is a new standalone service, not yet wired into the
Next.js frontend's existing (fully client-side/mocked) purchase flow. See
"What's still simulated on the frontend" below.

## Stack

Spring Boot 3.3.4, Spring Web, Spring Data JPA, Spring Security, Spring Mail,
PostgreSQL, Lombok, ZXing (QR generation). Built with Maven (wrapper included
— no local Maven install needed, just `./mvnw`).

## Running locally

```bash
# 1. Start Postgres (any way you like), then create a database:
#    createdb touristpack   # or via docker: postgres:16, db "touristpack"

# 2. Run
./mvnw spring-boot:run
```

Defaults (all overridable via env vars, see `application.yml`):
- DB: `jdbc:postgresql://localhost:5432/touristpack`, user/pass `touristpack`/`touristpack`
- Server: `:8080`
- `payment.mock-enabled=true` — no real gateway, payments auto-succeed
- `mail-sending.mock-enabled=true` — no real SMTP, emails are logged instead of sent
- `redemption.expiry-days=30` — placeholder, needs confirming (see below)

No Postgres handy? Point `SPRING_DATASOURCE_URL` etc. at an H2 in-memory DB and
add `org.h2.Driver` to the classpath, or just run the test suite (`./mvnw test`),
which does exactly that via `src/test/resources/application-test.yml`.

## What's implemented

- **Entities**: `User`, `TravelPackage` (named to avoid shadowing
  `java.lang.Package`), `Order`, `ActivePackage` — matching the spec, with
  JPA auditing for timestamps.
- **Endpoints**: all 5 from the spec, plus `GET /api/packages` and
  `GET /api/packages/{id}` (not in the spec — added because the frontend
  needs *some* way to get real package ids to send into `POST /api/orders`;
  seeded from `data/packs.ts`'s four packs via `DataSeeder`).
- **QR codes**: ZXing, generated on demand and cached to local disk
  (`app.qr-storage-dir`). Encodes `{frontend-base-url}/activate/{token}` —
  see the "QR scan mechanism" decision below for why it's a URL and not a
  bare token.
- **Email**: HTML email with the QR inline (`cid` attachment), localized via
  a small backend-local `i18n/email*.properties` set (en + sq populated;
  other locales fall back to English — see the file's comment for how to add
  the rest).
- **Validation**: single-use tokens, structured error codes
  (`INVALID_TOKEN` / `ALREADY_USED` / `EXPIRED` / ...), lazy expiry check on
  read/redeem (no scheduled job in this pass).
- **Tests**: 11 tests — Mockito unit tests for `OrderService` and
  `ActivePackageService` (creation, payment confirmation → QR+email,
  redeem's valid/already-used/expired/invalid cases), plus one
  `@SpringBootTest` that boots the full context against H2 to catch
  wiring/mapping issues the unit tests wouldn't.
- **Frontend**: added `app/activate/[token]/page.tsx` to the Next.js app —
  the page a customer's phone camera lands on when scanning the QR. Calls
  `GET`/`POST /api/active-packages/{token}` against
  `NEXT_PUBLIC_BACKEND_URL` (defaults to `http://localhost:8080`).

## Decisions made (per your answers) and other things flagged

**QR scan mechanism → customer's own phone camera.** The QR encodes a URL
(`{frontend-base-url}/activate/{token}`), not a bare token — a bare UUID
scanned by a phone's camera app just shows as text with nothing to tap; a
URL is what makes "scan to activate" actually work. No user/order data is
in it, only the opaque token, so this still satisfies the "never encode raw
user/order data" rule in spirit.

**Auth → simple for now, no login.** `GET /api/users/{userId}/active-packages`
takes `userId` directly with no auth check, matching the frontend's current
reality (no password field anywhere, just a demo `localStorage` profile).
**This is explicitly not production-safe** — anyone can currently query
anyone else's active packages by guessing/incrementing an id. Spring
Security is wired in (`SecurityConfig`) but currently `permitAll()`s
everything; see its class comment for what to tighten first.

**Payment gateway → still needed from you.** No gateway is integrated.
`payment.mock-enabled=true` (default) auto-succeeds every
`confirm-payment` call; set it `false` and the endpoint requires an explicit
`{"outcome": "SUCCESS"|"FAILURE"}` body or throws. `PaymentGatewayService`
is the seam a real provider's webhook handler would call into instead. Tell
me which provider (Stripe, a local Albanian PSP, other) and I'll wire it up
and remove the mock.

**Email provider → still needed from you.** No SMTP/API credentials are
configured (`application.yml`'s `spring.mail.*` are placeholders).
`mail-sending.mock-enabled=true` (default) logs the email instead of
sending it. Give me real credentials (SendGrid, Mailgun, your own relay,
...) via env vars and I'll flip the flag.

**Redemption expiry → needs your confirmation.** Defaulted to 30 days
(`redemption.expiry-days`) as a placeholder — is that the right window for
an unscanned purchase, or should it not expire at all (`expiry-days=0`
disables it)?

**Database → defaulted to PostgreSQL** since none was configured anywhere
in the project. `spring.jpa.hibernate.ddl-auto=update` is fine for local
dev; swap for a real migration tool (Flyway/Liquibase) + `validate` before
production.

## What's still simulated on the frontend

`PaymentActivationModal` / `PackContext` still run the *entire* purchase
flow as local component state (a "Simulate scan" button, no network calls
at all) — that's how the frontend worked before this backend existed. This
backend is not yet wired into that flow; only the new
`/activate/[token]` page talks to it (needed to make the "customer scans
with their own phone" decision actually functional end-to-end). Rewiring
`PaymentActivationModal` to call `POST /api/orders` →
`POST /api/orders/{id}/confirm-payment` for real is a separate follow-up —
flagging it rather than changing the existing working demo flow in the same
pass as adding the backend.

## Note on toolchain versions in `pom.xml`

This machine builds with JDK 25. Lombok is pinned to 1.18.38 and
Mockito/byte-buddy are bumped past the Spring Boot 3.3.4 BOM's defaults, plus
a `-Dnet.bytebuddy.experimental=true` surefire flag, to keep annotation
processing and mock bytecode instrumentation working on this runtime.
