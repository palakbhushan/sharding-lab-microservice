# Sharding Lab with PostgreSQL, PgBouncer, Redis, and Node.js (TypeScript)

This project is a hands-on lab for learning database sharding using PostgreSQL, with a microservice written in Node.js (TypeScript).  
We also use PgBouncer for connection pooling and Redis for caching/session management.  

---

## Project Structure

```
sharding-lab/
│── docker-compose.yml        # Orchestration for services
│── sql/                      # Database init scripts
│   ├── shard1/01-init.sql
│   └── shard2/01-init.sql
│── pgbouncer/                # PgBouncer configs
│   ├── pgbouncer.ini
│   └── userlist.txt
│── services/                 # Microservices
│   └── users-api/
│       ├── Dockerfile
│       ├── package.json
│       ├── tsconfig.json
│       ├── .env.example
│       └── src/
│           ├── index.ts
│           ├── db.ts
│           └── routes.ts
```

---

## Setup Instructions

### 1. Clone the repository
```bash
  git clone https://github.com/<your-username>/sharding-lab.git
  cd sharding-lab
```

### 2. Create database init scripts
Add SQL schema for each shard. Example (`sql/shard1/01-init.sql` and same for shard2):

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);
```

### 3. Build and start services
```bash
  docker-compose up --build
```

This will start:
- shard1 → Postgres instance
- shard2 → Postgres instance
- pgbouncer → connection pooler & router
- redis → cache layer
- users-api → Node.js/TypeScript microservice

---

## Users API (TypeScript)

### Run locally inside container
API is exposed at:  
http://localhost:3000

### Endpoints

#### Create User
```bash
  curl -X POST http://localhost:3000/users   -H "Content-Type: application/json"   -d '{"name":"Alice","email":"alice@example.com"}'
```

#### Get User
```bash
  curl http://localhost:3000/users/<uuid>
```

User is automatically routed to the correct shard based on UUID.

---

## Sharding Logic

- Each user ID (UUID) is hashed to decide which shard (shard1 or shard2) to store it in.  
- `db.ts` handles shard selection:
  - Convert UUID → integer
  - Modulo by number of shards
  - Connect to the right Postgres instance via PgBouncer

---

## Useful Commands

### Connect to Shard1 DB
```bash
  docker exec -it shard1 psql -U app -d shard1
```

### Connect to Shard2 DB
```bash
  docker exec -it shard2 psql -U app -d shard2
```

### Connect to PgBouncer
```bash
    docker exec -it pgbouncer psql -U app -d shard1 -p 6432 -h localhost
```

### View logs
```bash
  docker-compose logs -f users-api
```

---

## Learning Goals

- Understand database sharding in PostgreSQL  
- Learn PgBouncer for connection pooling  
- Build microservices in Node.js (TypeScript)  
- Use Docker Compose to run everything locally  
- Prepare for production deployment with Kubernetes  

---

Author: Palak Bhushan  
Repo: https://github.com/palakbhushan/sharding-lab-microservice
