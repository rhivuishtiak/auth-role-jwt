# auth-role-jwt (practice)
Quick start:
1) copy .env.example to .env and fill values
2) npm i
3) npm run typeorm -- -d ./src/db/data-source.ts migration:run
4) npm run dev

Login (seeded):
- admin@example.com / P@ssw0rd
- user1@example.com / P@ssw0rd

Test:
curl -s -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"P@ssw0rd"}'
