// Framework definitions
export const BACKEND_FRAMEWORKS = [
  "Ruby on Rails",
  "PHP Laravel 11",
  "PHP Laravel 12",
  "Django (Python)",
  "Go (Gin framework)",
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
    suffix: (includeDocker: boolean) => `application based on the Swagger specification provided below. The application should include:

CORE REQUIREMENTS:
- Comprehensive test suite (unit and integration tests)
- Include API versioning strategy
- Unit tests for all business logic
- Integration tests for API endpoints
- Test fixtures and mock data
- CI/CD pipeline configuration
- Production-ready configuration
- Database seeding scripts
- API documentation (Swagger/OpenAPI integration)
- ${includeDocker ? 'Docker configuration (Dockerfile and docker-compose.yml)' : 'Local development setup and configuration'}
- Environment configuration and secrets management

${includeDocker ? `DOCKER REQUIREMENTS:
- Complete Docker setup with Dockerfile and docker-compose.yml
- Multi-stage builds for production optimization
- Database service configuration in docker-compose
- Health checks for all services
- Container monitoring and logging` : `LOCAL DEVELOPMENT REQUIREMENTS:
- Local development environment setup
- Database installation and configuration instructions
- Local dependencies installation guide
- Development server configuration`}

TECHNICAL REQUIREMENTS:
- RESTful API design principles
- Input validation and sanitization
- Error handling and logging
- Authentication and authorization
- Rate limiting and security middleware
- Database migrations and seeders
- Background job processing
- Caching strategy implementation
- Monitoring and health checks

${includeDocker ? `DEPLOYMENT & CONTAINERIZATION:
- Docker images optimized for production
- Container orchestration ready
- CI/CD pipeline configuration with Docker` : `DEPLOYMENT & SETUP:
- Local installation instructions
- Environment-specific configurations
- CI/CD pipeline configuration for local deployment`}`,
  },
  frontend: {
    prefix: "Generate a complete, professional-grade",
    suffix: (includeDocker: boolean) => `application based on the Swagger specification provided below. The application should include:

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
- ${includeDocker ? 'Docker configuration (Dockerfile and docker-compose.yml)' : 'Local development setup and configuration'}
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
- Image optimization

${includeDocker ? `DOCKER REQUIREMENTS:
- Complete Docker setup with Dockerfile and docker-compose.yml
- Multi-stage builds for production optimization
- Static file serving configuration
- Container health checks
- Production-ready containerization` : `LOCAL DEVELOPMENT REQUIREMENTS:
- Local development environment setup
- Node.js and dependencies installation guide
- Local build and development server configuration
- Environment variables setup`}

${includeDocker ? `DEPLOYMENT & CONTAINERIZATION:
- Docker images optimized for production
- Static file serving and CDN integration
- Container orchestration ready
- CI/CD pipeline configuration with Docker` : `DEPLOYMENT & SETUP:
- Local build and deployment instructions
- Static hosting configuration
- CI/CD pipeline configuration for local deployment`}`,
  },
}

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
    "Django (Python)": {
      name: "Python Django",
      features: ["Django REST Framework", "PostgreSQL", "Celery", "pytest testing", "Django authentication"],
      databases: {
        postgresql: "PostgreSQL with psycopg2",
        mysql: "MySQL with mysqlclient",
        mariadb: "MariaDB with mysqlclient",
        sqlite: "SQLite (built-in)"
      }
    },
    "Go (Gin framework)": {
      name: "Go Gin framework",
      features: ["GORM ORM", "Go testing", "JWT authentication", "Redis integration", "Docker optimization"],
      databases: {
        postgresql: "PostgreSQL with GORM",
        mysql: "MySQL with GORM",
        mariadb: "MariaDB with GORM",
        sqlite: "SQLite with GORM"
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