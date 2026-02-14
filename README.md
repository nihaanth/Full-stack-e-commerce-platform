# Full-Stack E-Commerce Platform with AI Recommendations

Portfolio project demonstrating microservices architecture with ML-powered product recommendations.

## Tech Stack
- Frontend: React + TypeScript + Redux Toolkit
- Backend: Express (Node.js) + FastAPI (Python)
- Databases: MongoDB, PostgreSQL, Redis, Milvus
- ML: Collaborative Filtering + Content-Based (HuggingFace)
- DevOps: Docker Compose

## Getting Started

### Prerequisites
- Docker Desktop
- Node.js 20+
- Python 3.11+

### Quick Start

```bash
# Start all services
docker compose up -d

# Initialize data
docker compose exec product-service npm run seed
docker compose exec recommendation-service python -m app.ml.embed_products

# Access services
# Frontend: http://localhost:3000
# Product API: http://localhost:3001
# Recommendation API: http://localhost:8000
```

## Architecture

See `docs/plans/2026-02-13-ecommerce-platform-design.md` for detailed design.

## Development

Each service can be developed independently:
- Product Service: `cd product-service && npm run dev`
- Recommendation Service: `cd recommendation-service && uvicorn app.main:app --reload`
- Frontend: `cd frontend && npm start`
