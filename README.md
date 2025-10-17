# iCast Backend - Sports Prediction Platform API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Apollo-blue.svg)](https://graphql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

A comprehensive **GraphQL-based backend API** for sports prediction and fantasy sports platforms. Built with **Node.js**, **Apollo Server**, and **MongoDB**, iCast Backend provides real-time sports data integration, user management, and prediction pooling systems.

## 🚀 Features

### Core Functionality
- **Sports Prediction Pools** - Create and manage prediction contests for various sports
- **Real-time Sports Data** - Integration with GoalServe API for live soccer fixtures and statistics
- **User Management** - Complete authentication system with JWT tokens and phone verification
- **Casting System** - Advanced prediction casting with multiple prediction types (exact score, winner, draw, outcome)
- **Scoring & Distribution** - Automated scoring algorithms and prize distribution systems
- **Multi-sport Support** - Currently supports soccer with extensible architecture for other sports

### Technical Features
- **GraphQL API** - Type-safe, efficient API with Apollo Server
- **MongoDB Integration** - Scalable NoSQL database with Mongoose ODM
- **Real-time Updates** - Cron jobs for live score updates and data synchronization
- **RESTful Data Sources** - Integration with external sports APIs
- **Authentication & Authorization** - JWT-based auth with role-based access control
- **CORS Configuration** - Secure cross-origin resource sharing

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **API**: GraphQL with Apollo Server
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **External APIs**: GoalServe Sports API
- **Build Tools**: Babel, ESLint, Prettier
- **Deployment**: Heroku

### Project Structure
```
src/
├── configs/           # Configuration files
├── database/          # MongoDB models and seed data
│   ├── models/        # Mongoose schemas
│   └── seed/          # Database seeding scripts
├── engine/            # Core business logic
│   ├── apis/          # External API integrations
│   ├── crons/         # Scheduled tasks
│   └── services/      # Business services
├── graphql/           # GraphQL implementation
│   ├── datasources/   # Data source classes
│   ├── resolvers/     # GraphQL resolvers
│   └── schemas/       # GraphQL type definitions
├── lib/               # Utility libraries
└── utils/             # Helper functions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB Atlas account
- GoalServe API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anton-karlovskiy/icast-backend.git
   cd icast-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with the following variables:
   ```env
   NODE_ENV=development
   PORT=4000
   JWT_SECRET=your_jwt_secret
   GOAL_SERVE_API_KEY=your_goalserve_api_key
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Start development server**
   ```bash
   npm run dev-server-dev-db
   ```

5. **Access GraphQL Playground**
   Open [http://localhost:4000/graphql](http://localhost:4000/graphql)

## 📊 Database Seeding

### Initial Data Seeding
```bash
npm run seed
```

### Test Data Seeding
```bash
npm run seed-test
```

## 🚀 Deployment

### Heroku Deployment
```bash
npm run heroku-deploy
heroku logs -t
heroku open
```

### Environment Variables (Heroku)
Set the following environment variables in your Heroku dashboard:

- `GOAL_SERVE_API_KEY` - Your GoalServe API key
- `PORT` - Server port (automatically set by Heroku)
- `JWT_SECRET` - Secret key for JWT token signing
- `MONGODB_URI` - MongoDB connection string

```bash
heroku config:set NPM_CONFIG_PRODUCTION=false
```

## 🌐 API Endpoints

### Development
- **GraphQL Playground**: [https://icast-backend.herokuapp.com/graphql](https://icast-backend.herokuapp.com/graphql)
- **Health Check**: [https://icast-backend.herokuapp.com/ping](https://icast-backend.herokuapp.com/ping)

### Production
- **Live Site**: [https://i-cast.live](https://i-cast.live)
- **Admin Panel**: [https://admin.i-cast.live](https://admin.i-cast.live)

## 📚 GraphQL Schema

### Core Types
- **User** - User management and authentication
- **Pool** - Prediction pools and contests
- **Fixture** - Sports matches and games
- **Cast** - User predictions and submissions
- **League** - Sports leagues and tournaments
- **Team** - Sports teams and players

### Key Queries
```graphql
# Get available pools
query GetPools($filter: poolFilterInput) {
  pools(filter: $filter) {
    pools {
      _id
      name
      status
      startDate
      endDate
    }
  }
}

# Get user casts
query GetCasts($poolId: ID!) {
  casts(poolId: $poolId) {
    _id
    userId
    predictions
  }
}
```

### Key Mutations
```graphql
# Create a new cast (prediction)
mutation CreateCast($input: CastInput!) {
  createCast(input: $input) {
    _id
    success
  }
}

# Update pool settings
mutation UpdatePool($id: ID!, $input: PoolInput!) {
  updatePool(_id: $id, input: $input) {
    _id
    name
    status
  }
}
```

## 🔧 Development

### Available Scripts
```bash
npm run dev-server-dev-db    # Development with dev database
npm run dev-server-prod-db   # Development with production database
npm run build               # Build for production
npm run start               # Start production server
npm run lint                # Run ESLint
npm run lint-fix            # Fix ESLint issues
npm run format              # Format code with Prettier
```

### Code Quality
- **ESLint** - Code linting with Google style guide
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit linting
- **Lint-staged** - Run linters on staged files

## 🏆 Sports Prediction Features

### Prediction Types (Soccer)
- **Exact Score** - Predict exact match scores
- **Winner** - Predict match winners
- **Draw** - Predict draw outcomes
- **Outcome** - General match outcomes

### Pool Management
- **Pool Groups** - Organize pools by sport and time period
- **Pool Status** - Created, Opened, Published, Closed, Disabled
- **Scoring Algorithms** - Configurable scoring systems
- **Prize Distribution** - Automated prize calculation and distribution

### Real-time Features
- **Live Scores** - Real-time match updates
- **Cron Jobs** - Automated data synchronization
- **Fixture Updates** - Automatic match status updates
- **Score Calculation** - Real-time prediction scoring

## 🔒 Security

### Authentication
- JWT-based authentication
- Phone number verification
- Role-based access control (Super Admin, Admin, Paid User, Free User)
- Secure cookie handling

### CORS Configuration
- Whitelisted origins for security
- Credential support for authenticated requests
- Development and production environment separation

## 📈 Performance

### Database Optimization
- MongoDB Atlas for scalability
- Indexed queries for performance
- Efficient data modeling

### API Performance
- GraphQL query optimization
- Data source caching
- Efficient resolver implementation

## 🛠️ Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔮 Roadmap

### Planned Features
- **Multi-sport Support** - Cricket, Horse Racing, and more
- **Advanced Analytics** - User performance tracking
- **Mobile API** - Optimized endpoints for mobile apps
- **Real-time Notifications** - WebSocket support
- **Advanced Scoring** - Machine learning-based scoring

### Technical Improvements
- **Database Indexing** - Optimize MongoDB queries
- **API Rate Limiting** - Implement rate limiting
- **GraphQL Playground** - Disable in production
- **Security Hardening** - Enhanced security measures

---

**Built with ❤️ for sports prediction enthusiasts**

*Keywords: sports prediction, fantasy sports, GraphQL API, Node.js backend, MongoDB, real-time sports data, prediction pools, sports betting API, fantasy football, soccer predictions*