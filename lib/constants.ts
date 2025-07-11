// Framework definitions
export const BACKEND_FRAMEWORKS = [
  "Ruby on Rails",
  "Node.js Express",
  "Python Django",
  "Python FastAPI",
  "Python Flask",
  "PHP Laravel 11",
  "PHP Laravel 12",
  "PHP Symfony",
  "Rust Actix",
  "Rust Axum",
  "Kotlin Spring Boot",
  "Go Gin",
  "Go Fiber",
  "Go Echo",
]

export const FRONTEND_FRAMEWORKS = [
  // React Ecosystem
  "Next.js",
  "React",
  "Remix",
  // Vue Ecosystem
  "NuxtJS",
  "Vue.js",
  // Angular Ecosystem
  "Angular",
  // Other Popular Frameworks
  "React Native Expo",
  "Vite + React",
  "Vite + Vue",
  // Mobile Frameworks
  "Flutter",
  "React Native",
  "Flutter Desktop",
]

// Database options
export const DATABASE_OPTIONS = [
  {
    value: "postgresql",
    label: "PostgreSQL",
    description: "Advanced open-source relational database",
    icon: "🐘",
    features: ["ACID compliance", "JSON support", "Advanced indexing", "Full-text search"]
  },
  {
    value: "mysql",
    label: "MySQL",
    description: "Popular open-source relational database",
    icon: "🐬",
    features: ["High performance", "Replication", "Partitioning", "Wide adoption"]
  },
  {
    value: "mariadb",
    label: "MariaDB",
    description: "MySQL-compatible database with enhanced features",
    icon: "🦭",
    features: ["MySQL compatibility", "Enhanced performance", "Advanced security", "Open source"]
  },
  {
    value: "sqlite",
    label: "SQLite",
    description: "Lightweight file-based database",
    icon: "🪶",
    features: ["Zero configuration", "Serverless", "Self-contained", "Cross-platform"]
  }
]

// Base prompt templates
export const BASE_PROMPTS = {
  backend: {
    prefix: "Generate a complete, production-ready",
    suffix: `application based on the Swagger specification provided below. The application should include:

CORE REQUIREMENTS:
- Complete implementation of all API endpoints from the Swagger specification
- Proper project structure following framework best practices
- Database models/entities with appropriate relationships and validations
- Controllers/handlers with proper request/response handling
- Authentication and authorization implementation
- Input validation and error handling
- Comprehensive test suite (unit and integration tests)
- Docker configuration (Dockerfile and docker-compose.yml)
- Environment configuration and secrets management
- API documentation integration
- Logging and monitoring setup
- Health check endpoints

TECHNICAL REQUIREMENTS:
- Follow RESTful API conventions
- Implement proper HTTP status codes
- Use appropriate design patterns (Repository, Service, etc.)
- Include database migrations/schema setup
- Implement proper CORS configuration
- Add rate limiting and security middleware
- Include API versioning strategy
- Implement proper exception handling
- Add request/response logging
- Include performance optimization

TESTING & DEPLOYMENT:
- Unit tests for all business logic
- Integration tests for API endpoints
- Test fixtures and mock data
- CI/CD pipeline configuration
- Production-ready configuration
- Database seeding scripts
- API documentation (Swagger/OpenAPI integration)`,
  },
  frontend: {
    prefix: "Generate a complete, professional-grade",
    suffix: `application based on the Swagger specification provided below. The application should include:

CORE REQUIREMENTS:
- Complete UI implementation for all API endpoints from the Swagger specification
- Modern, responsive design with clean UX/UI
- Proper routing and navigation structure
- State management implementation
- API integration with proper error handling
- Authentication and authorization flows
- Form validation and user feedback
- Loading states and error boundaries
- Comprehensive component library
- Docker configuration (Dockerfile and docker-compose.yml)
- Environment configuration
- Build optimization and deployment setup

TECHNICAL REQUIREMENTS:
- TypeScript implementation (where applicable)
- Responsive design (mobile-first approach)
- Accessibility compliance (WCAG guidelines)
- SEO optimization
- Performance optimization (lazy loading, code splitting)
- Progressive Web App features (where applicable)
- Internationalization support (i18n)
- Theme support (light/dark mode)
- Component testing setup
- Proper error handling and user feedback
- API caching and optimization
- Security best practices (XSS, CSRF protection)

STYLING & COMPONENTS:
- Modern CSS framework integration (Tailwind CSS preferred)
- Reusable component architecture
- Design system implementation
- Animation and micro-interactions
- Consistent spacing and typography
- Icon library integration
- Image optimization
- Responsive breakpoints

TESTING & DEPLOYMENT:
- Component testing (Jest, Testing Library)
- E2E testing setup (Cypress/Playwright)
- Visual regression testing
- Performance testing
- Build optimization
- Static analysis and linting
- CI/CD pipeline configuration
- Production deployment configuration`,
  },
}

// Framework-specific configurations with database support
export const FRAMEWORK_CONFIGS = {
  backend: {
    "Ruby on Rails": {
      name: "Ruby on Rails 8",
      features: ["ActiveRecord ORM", "RSpec testing", "Devise authentication", "Sidekiq background jobs"],
      databases: {
        postgresql: "PostgreSQL with pg gem",
        mysql: "MySQL with mysql2 gem", 
        mariadb: "MariaDB with mysql2 gem",
        sqlite: "SQLite with sqlite3 gem"
      }
    },
    "PHP Laravel 11": {
      name: "PHP Laravel 11",
      features: ["Eloquent ORM", "PHPUnit testing", "Laravel Passport", "Queue jobs", "Artisan commands"],
      databases: {
        postgresql: "PostgreSQL with pdo_pgsql",
        mysql: "MySQL with pdo_mysql",
        mariadb: "MariaDB with pdo_mysql",
        sqlite: "SQLite with pdo_sqlite"
      }
    },
    "PHP Laravel 12": {
      name: "PHP Laravel 12",
      features: ["Eloquent ORM", "PHPUnit testing", "Laravel Passport", "Queue jobs", "Artisan commands"],
      databases: {
        postgresql: "PostgreSQL with pdo_pgsql",
        mysql: "MySQL with pdo_mysql",
        mariadb: "MariaDB with pdo_mysql",
        sqlite: "SQLite with pdo_sqlite"
      }
    },
    "Node.js Express": {
      name: "Node.js Express",
      features: ["TypeScript", "Prisma ORM", "Jest testing", "JWT authentication", "Redis caching"],
      databases: {
        postgresql: "PostgreSQL with Prisma",
        mysql: "MySQL with Prisma",
        mariadb: "MariaDB with Prisma", 
        sqlite: "SQLite with Prisma"
      }
    },
    "Python Django": {
      name: "Python Django",
      features: ["Django REST Framework", "PostgreSQL", "Celery", "pytest testing", "Django authentication"],
      databases: {
        postgresql: "PostgreSQL with psycopg2",
        mysql: "MySQL with mysqlclient",
        mariadb: "MariaDB with mysqlclient",
        sqlite: "SQLite (built-in)"
      }
    },
    "Python FastAPI": {
      name: "Python FastAPI",
      features: ["SQLAlchemy ORM", "Pydantic validation", "pytest testing", "OAuth2 authentication", "Async support"],
      databases: {
        postgresql: "PostgreSQL with asyncpg",
        mysql: "MySQL with aiomysql",
        mariadb: "MariaDB with aiomysql",
        sqlite: "SQLite with aiosqlite"
      }
    },
    "Python Flask": {
      name: "Python Flask",
      features: [
        "SQLAlchemy ORM",
        "Flask-RESTful",
        "pytest testing",
        "JWT authentication",
        "Marshmallow serialization",
      ],
      databases: {
        postgresql: "PostgreSQL with psycopg2",
        mysql: "MySQL with PyMySQL",
        mariadb: "MariaDB with PyMySQL",
        sqlite: "SQLite (built-in)"
      }
    },
    "Go Gin": {
      name: "Go Gin framework",
      features: ["GORM ORM", "Go testing", "JWT authentication", "Redis integration", "Docker optimization"],
      databases: {
        postgresql: "PostgreSQL with GORM",
        mysql: "MySQL with GORM",
        mariadb: "MariaDB with GORM",
        sqlite: "SQLite with GORM"
      }
    },
    "Go Fiber": {
      name: "Go Fiber framework",
      features: ["GORM ORM", "Go testing", "JWT middleware", "High performance", "Swagger integration"],
      databases: {
        postgresql: "PostgreSQL with GORM",
        mysql: "MySQL with GORM", 
        mariadb: "MariaDB with GORM",
        sqlite: "SQLite with GORM"
      }
    },
    "Go Echo": {
      name: "Go Echo framework",
      features: ["GORM ORM", "Go testing", "JWT middleware", "WebSocket support", "Prometheus metrics"],
      databases: {
        postgresql: "PostgreSQL with GORM",
        mysql: "MySQL with GORM",
        mariadb: "MariaDB with GORM", 
        sqlite: "SQLite with GORM"
      }
    },
    "PHP Symfony": {
      name: "PHP Symfony",
      features: ["Doctrine ORM", "PHPUnit testing", "Symfony Security", "Messenger component", "API Platform"],
      databases: {
        postgresql: "PostgreSQL with Doctrine DBAL",
        mysql: "MySQL with Doctrine DBAL",
        mariadb: "MariaDB with Doctrine DBAL",
        sqlite: "SQLite with Doctrine DBAL"
      }
    },
    "Rust Actix": {
      name: "Rust Actix Web",
      features: ["Diesel ORM", "Rust testing", "JWT authentication", "High performance", "Async support"],
      databases: {
        postgresql: "PostgreSQL with Diesel",
        mysql: "MySQL with Diesel",
        mariadb: "MariaDB with Diesel",
        sqlite: "SQLite with Diesel"
      }
    },
    "Rust Axum": {
      name: "Rust Axum framework",
      features: ["SQLx", "Rust testing", "Tower middleware", "Tokio async", "Serde serialization"],
      databases: {
        postgresql: "PostgreSQL with SQLx",
        mysql: "MySQL with SQLx",
        mariadb: "MariaDB with SQLx",
        sqlite: "SQLite with SQLx"
      }
    },
    "Kotlin Spring Boot": {
      name: "Kotlin Spring Boot",
      features: ["Spring Data JPA", "Spring Security", "JUnit testing", "Coroutines", "Kotlin DSL"],
      databases: {
        postgresql: "PostgreSQL with JDBC",
        mysql: "MySQL with JDBC",
        mariadb: "MariaDB with JDBC",
        sqlite: "SQLite with JDBC"
      }
    },
  },
  frontend: {
    "Next.js": {
      name: "Next.js",
      features: ["TypeScript", "Tailwind CSS", "App Router", "Server Components", "Vercel deployment"],
    },
    React: {
      name: "React",
      features: ["TypeScript", "React Router", "Zustand/Redux Toolkit", "Tailwind CSS", "Vite"],
    },
    "React Native": {
      name: "React Native",
      features: ["TypeScript", "React Navigation", "Expo", "NativeBase/Tamagui", "AsyncStorage"],
    },
    Remix: {
      name: "Remix",
      features: ["TypeScript", "Tailwind CSS", "Progressive enhancement", "Nested routing", "Form handling"],
    },
    NuxtJS: {
      name: "NuxtJS",
      features: ["TypeScript", "Tailwind CSS", "Pinia", "Auto-imports", "SSR/SSG"],
    },
    "Vue.js": {
      name: "Vue.js 3",
      features: ["TypeScript", "Vue Router", "Pinia", "Tailwind CSS", "Composition API"],
    },
    Angular: {
      name: "Angular",
      features: ["TypeScript", "Angular Router", "NgRx", "Angular Material", "PWA"],
    },
    Flutter: {
      name: "Flutter",
      features: ["Dart", "Material Design", "Cupertino", "State management", "Cross-platform"],
    },
    "React Native Expo": {
      name: "React Native with Expo",
      features: ["TypeScript", "Expo SDK", "React Navigation", "Expo Router", "OTA updates"],
    },
    "Vite + React": {
      name: "Vite + React",
      features: ["TypeScript", "React Router", "Tailwind CSS", "Fast HMR", "Modern build"],
    },
    "Vite + Vue": {
      name: "Vite + Vue",
      features: ["TypeScript", "Vue Router", "Pinia", "Tailwind CSS", "Fast HMR"],
    },
    "Flutter Desktop": {
      name: "Flutter Desktop",
      features: ["Dart", "Cross-platform", "Native performance", "Material Design", "Desktop-specific APIs"],
    },
  },
}

export interface FrameworkOptions {
  backend: string
  frontend: string
  database?: string
  backendRepo?: string
  frontendRepo?: string
  generateBackend?: boolean
  generateFrontend?: boolean
  includeDocker?: boolean
}

export interface CodeGenJob {
  id: string
  status: "loading_processing" | "running" | "completed" | "failed"
  type: "backend" | "frontend"
  framework?: string
  database?: string
  repository?: string
  createdAt: string
  completedAt?: string
  pullRequestUrl?: string
  repositoryUrl?: string
  error?: string
  progress?: number
}
