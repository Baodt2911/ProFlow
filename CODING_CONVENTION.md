# Coding Convention - Vyn Remix Core

Comprehensive coding standards and conventions for the Vyn Remix Core project.

## 📋 Table of Contents

- [Overview](#overview)
- [General Principles](#general-principles)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Code Style](#code-style)
- [TypeScript Guidelines](#typescript-guidelines)
- [React/Remix Guidelines](#reactremix-guidelines)
- [Database Guidelines](#database-guidelines)
- [API Guidelines](#api-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Git Guidelines](#git-guidelines)
- [Performance Guidelines](#performance-guidelines)
- [Security Guidelines](#security-guidelines)

---

## 🎯 Overview

This document defines the coding standards and conventions for the Vyn Remix Core project. All team members must follow these guidelines to maintain code quality, consistency, and maintainability.

### Key Principles
- **Readability**: Code should be self-documenting and easy to understand
- **Consistency**: Follow established patterns throughout the codebase
- **Maintainability**: Write code that is easy to modify and extend
- **Performance**: Consider performance implications in design decisions
- **Security**: Follow security best practices

---

## 🏗️ General Principles

### 1. **Code Organization**
- Keep functions and classes focused on a single responsibility
- Limit function length to 50 lines maximum
- Limit class length to 300 lines maximum
- Use meaningful variable and function names

### 2. **DRY (Don't Repeat Yourself)**
- Extract common functionality into reusable functions
- Use utility functions for repeated operations
- Create shared components for common UI patterns

### 3. **KISS (Keep It Simple, Stupid)**
- Prefer simple solutions over complex ones
- Avoid over-engineering
- Write code that is easy to understand and maintain

---

## 📁 File Organization

### 1. **Directory Structure**
```
src/
├── app/
│   ├── actions/          # Server actions
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── factories/        # Service & repository factories
│   ├── loaders/          # Server loaders
│   ├── models/           # TypeScript interfaces
│   ├── repositories/     # Data access layer
│   ├── routes/           # Application routes
│   ├── services/         # Business logic layer
│   ├── styles/           # CSS styles
│   ├── tests/            # Test files
│   └── utils/            # Utility functions
├── prisma/               # Database schema & migrations
├── public/               # Static assets
└── server/               # Infrastructure layer
```

### 2. **File Naming**
- Use kebab-case for route file names: `personal-token.ts`
- Use camelCase for service files: `userService.ts`
- Use camelCase for repository files: `userRepository.ts`
- Use camelCase for constants files: `errorConst.ts`
- Use PascalCase for component files: `UserProfile.tsx`
- Use camelCase for utility files: `dateUtils.ts`

### 3. **File Extensions**
- `.ts` for TypeScript files
- `.tsx` for React components
- `.css` for stylesheets
- `.test.ts` for test files
- `.d.ts` for type declaration files

---

## 🏷️ Naming Conventions

### 1. **Variables and Functions**
```typescript
// ✅ Good
const userName = 'John Doe';
const isAuthenticated = true;
const getUserById = (id: number) => { /* ... */ };
const handleSubmit = () => { /* ... */ };

// ❌ Bad
const u = 'John Doe';
const flag = true;
const get = (id: number) => { /* ... */ };
const submit = () => { /* ... */ };
```

### 2. **Classes and Interfaces**
```typescript
// ✅ Good
class UserService { /* ... */ }
interface IUserModel { /* ... */ }
type UserStatus = 'active' | 'inactive';

// ❌ Bad
class userService { /* ... */ }
interface userModel { /* ... */ }
type userStatus = 'active' | 'inactive';
```

### 3. **Constants**
```typescript
// ✅ Good
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 10;

// ❌ Bad
const apiBaseUrl = 'https://api.example.com';
const maxRetryAttempts = 3;
const defaultPageSize = 10;
```

### 4. **Database and API**
```typescript
// ✅ Good - Database tables
model User { /* ... */ }
model OAuthClient { /* ... */ }

// ✅ Good - API endpoints
POST /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
```

---

## 💻 Code Style

### 1. **Indentation and Spacing**
```typescript
// ✅ Good - 2 spaces indentation
function getUser(id: number): User {
  const user = users.find(u => u.id === id);
  if (user) {
    return user;
  }
  throw new Error('User not found');
}

// ❌ Bad - Inconsistent indentation
function getUser(id: number): User {
    const user = users.find(u => u.id === id);
  if (user) {
      return user;
  }
    throw new Error('User not found');
}
```

### 2. **Line Length**
- Maximum line length: 100 characters
- Break long lines at logical points
- Use template literals for long strings

```typescript
// ✅ Good
const message = `This is a very long message that needs to be broken 
  into multiple lines for better readability`;

// ❌ Bad
const message = "This is a very long message that goes beyond the recommended line length and makes the code hard to read";
```

### 3. **Comments**
```typescript
// ✅ Good - JSDoc for functions
/**
 * Creates a new user in the system
 * @param userData - The user data to create
 * @returns Promise<User> - The created user
 * @throws Error if user creation fails
 */
async function createUser(userData: CreateUserData): Promise<User> {
  // Validate user data
  if (!userData.email) {
    throw new Error('Email is required');
  }
  
  // Create user in database
  return await userRepository.create(userData);
}

// ✅ Good - Inline comments for complex logic
const sortedUsers = users.sort((a, b) => {
  // Sort by name first, then by email
  const nameComparison = a.name.localeCompare(b.name);
  if (nameComparison !== 0) return nameComparison;
  return a.email.localeCompare(b.email);
});

// ❌ Bad - Obvious comments
const userName = 'John'; // This is a user name
```

### 4. **Import Organization**
```typescript
// ✅ Good - Organized imports
// External libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal modules
import { UserService } from '~/services/userService';
import { IUserModel } from '~/models/userModel';

// Types
import type { User } from '~/types/user';

// Constants
import { API_ENDPOINTS } from '~/constants/api';
```

---

## 🔷 TypeScript Guidelines

### 1. **Type Definitions**
```typescript
// ✅ Good - Explicit types
interface IUser {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

type UserStatus = 'active' | 'inactive' | 'pending';
type CreateUserData = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;

// ❌ Bad - Implicit any
function getUser(id) { /* ... */ }
const user = { /* ... */ };
```

### 2. **Generic Types**
```typescript
// ✅ Good - Generic repository
class BaseRepository<T> {
  async findById(id: number): Promise<T | null> {
    // Implementation
  }
  
  async create(data: Omit<T, 'id'>): Promise<T> {
    // Implementation
  }
}

// ✅ Good - Generic API response
interface ApiResponse<T> {
  status: boolean;
  data?: T;
  error?: string;
}
```

### 3. **Type Guards**
```typescript
// ✅ Good - Type guards
function isUser(obj: any): obj is IUser {
  return obj && typeof obj.id === 'number' && typeof obj.name === 'string';
}

function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return obj && typeof obj.status === 'boolean';
}
```

### 4. **Enums vs Union Types**
```typescript
// ✅ Good - Union types for simple cases
type UserRole = 'admin' | 'user' | 'moderator';

// ✅ Good - Enums for complex cases
enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
```

---

## ⚛️ React/Remix Guidelines

### 1. **Component Structure**
```typescript
// ✅ Good - Functional component with hooks
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';

interface UserProfileProps {
  userId: number;
  onUpdate?: (user: IUser) => void;
}

export const UserProfile: FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await UserService.findById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};
```

### 2. **Hooks Usage**
```typescript
// ✅ Good - Custom hooks
function useUser(userId: number) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await UserService.findById(userId);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, refetch: loadUser };
}
```

### 3. **Event Handlers**
```typescript
// ✅ Good - Event handler naming
const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  // Handle form submission
};

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleUserClick = (userId: number) => {
  navigate(`/users/${userId}`);
};
```

---

## 🗄️ Database Guidelines

### 1. **Prisma Schema**
```prisma
// ✅ Good - Clear model definitions
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      String   @default("user")
  status    String   @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  oauthClients OAuthClient[]
  
  @@map("users")
}

model OAuthClient {
  id                    String   @id @default(cuid())
  userId               Int?
  name                 String
  secret               String?
  provider             String?
  redirect             String
  personalAccessClient Boolean  @default(false)
  passwordClient       Boolean  @default(false)
  revoked              Boolean  @default(false)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  // Relations
  user                 User?    @relation(fields: [userId], references: [id])
  accessTokens         OAuthAccessToken[]
  
  @@map("oauth_clients")
}
```

### 2. **Repository Pattern**
```typescript
// ✅ Good - Repository implementation
class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super('user');
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findActiveUsers(): Promise<IUser[]> {
    return this.prisma.user.findMany({
      where: { status: 'active' }
    });
  }
}
```

---

## 🌐 API Guidelines

### 1. **RESTful Endpoints**
```typescript
// ✅ Good - RESTful API structure
// Users
GET    /api/users          // List users
POST   /api/users          // Create user
GET    /api/users/:id      // Get user by ID
PUT    /api/users/:id      // Update user
DELETE /api/users/:id      // Delete user

// OAuth
POST   /api/oauth/token           // Generate access token
POST   /api/oauth/refresh-token   // Refresh access token
POST   /api/oauth/revoke-token    // Revoke token
```

### 2. **Response Format**
```typescript
// ✅ Good - Consistent API response
interface ApiResponse<T> {
  status: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Success response
{
  "status": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "User created successfully"
}

// Error response
{
  "status": false,
  "error": "Validation failed",
  "message": "Email is required"
}
```

### 3. **Error Handling**
```typescript
// ✅ Good - Consistent error handling
export async function userAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const userData = Object.fromEntries(formData);
    
    // Validate data
    const validation = validateUserData(userData);
    if (!validation.success) {
      return json({
        status: false,
        error: 'Validation failed',
        message: validation.errors.join(', ')
      }, { status: 400 });
    }
    
    // Create user
    const user = await UserService.create(validation.data);
    
    return json({
      status: true,
      data: user,
      message: 'User created successfully'
    });
    
  } catch (error) {
    logger.error('User creation failed:', error);
    
    return json({
      status: false,
      error: 'Internal server error',
      message: 'Failed to create user'
    }, { status: 500 });
  }
}
```

---

## 🧪 Testing Guidelines

### 1. **Test Structure**
```typescript
// ✅ Good - Well-structured test
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '~/services/userService';

vi.mock('~/factories/serviceFactory');

describe('UserService', () => {
  let mockUserRepository: any;
  
  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    vi.mocked(RepositoryFactory.getUserRepository).mockReturnValue(mockUserRepository);
  });

  describe('findById', () => {
    it('should return user when valid ID is provided', async () => {
      // Arrange
      const userId = 1;
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
      vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
      
      // Act
      const result = await UserService.findById(userId);
      
      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const userId = 999;
      vi.mocked(mockUserRepository.findById).mockResolvedValue(null);
      
      // Act & Assert
      await expect(UserService.findById(userId)).rejects.toThrow('User not found');
    });
  });
});
```

### 2. **Test Naming**
```typescript
// ✅ Good - Descriptive test names
it('should create user successfully when valid data is provided');
it('should return error when email already exists');
it('should validate required fields before creating user');
it('should hash password before saving to database');
```

---

## 📚 Documentation Guidelines

### 1. **Code Documentation**
```typescript
/**
 * User service for managing user operations
 * 
 * @example
 * ```typescript
 * const userService = new UserService();
 * const user = await userService.findById(1);
 * ```
 */
class UserService {
  /**
   * Find user by ID
   * 
   * @param id - User ID
   * @returns Promise<User | null> - User object or null if not found
   * @throws Error if database operation fails
   * 
   * @example
   * ```typescript
   * const user = await userService.findById(1);
   * if (user) {
   *   console.log(user.name);
   * }
   * ```
   */
  async findById(id: number): Promise<IUser | null> {
    // Implementation
  }
}
```

### 2. **README Documentation**
```markdown
# Component Name

Brief description of what this component does.

## Usage

```tsx
import { ComponentName } from '~/components/ComponentName';

<ComponentName 
  prop1="value1"
  prop2="value2"
  onEvent={handleEvent}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| prop1 | string | Yes | - | Description of prop1 |
| prop2 | number | No | 0 | Description of prop2 |
| onEvent | function | No | - | Event handler |

## Examples

### Basic Usage
```tsx
<ComponentName prop1="hello" />
```

### Advanced Usage
```tsx
<ComponentName 
  prop1="hello"
  prop2={42}
  onEvent={(value) => console.log(value)}
/>
```
```

---

## 🔄 Git Guidelines

### 1. **Commit Messages**
```bash
# ✅ Good - Conventional commits
feat: add user authentication system
fix: resolve user creation validation issue
docs: update API documentation
style: format code according to style guide
refactor: extract user validation logic
test: add unit tests for user service
chore: update dependencies

# ❌ Bad - Unclear commit messages
fix bug
update code
add stuff
```

### 2. **Branch Naming**
```bash
# ✅ Good - Feature branches
feature/user-authentication
feature/oauth-integration
bugfix/user-validation
hotfix/security-patch

# ❌ Bad - Unclear branch names
new-feature
fix
update
```

### 3. **Pull Request Guidelines**
- Use descriptive titles
- Include detailed descriptions
- Reference related issues
- Add screenshots for UI changes
- Ensure all tests pass
- Request reviews from appropriate team members

---

## ⚡ Performance Guidelines

### 1. **React Performance**
```typescript
// ✅ Good - Memoization for expensive operations
const ExpensiveComponent = React.memo(({ data }: Props) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyComputation(item)
    }));
  }, [data]);

  return <div>{/* render processed data */}</div>;
});

// ✅ Good - Callback memoization
const handleClick = useCallback((id: number) => {
  onUserSelect(id);
}, [onUserSelect]);
```

### 2. **Database Performance**
```typescript
// ✅ Good - Efficient queries
const users = await prisma.user.findMany({
  where: { status: 'active' },
  select: {
    id: true,
    name: true,
    email: true,
    // Only select needed fields
  },
  take: 10, // Limit results
  orderBy: { createdAt: 'desc' }
});

// ❌ Bad - Inefficient queries
const users = await prisma.user.findMany(); // Select all fields
```

### 3. **API Performance**
```typescript
// ✅ Good - Pagination
GET /api/users?page=1&limit=10&sort=name&order=asc

// ✅ Good - Caching headers
res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
```

---

## 🔒 Security Guidelines

### 1. **Input Validation**
```typescript
// ✅ Good - Input validation
function validateUserData(data: any): ValidationResult {
  const errors: string[] = [];
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.password || data.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  return {
    success: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : null
  };
}
```

### 2. **Authentication & Authorization**
```typescript
// ✅ Good - JWT token validation
function validateToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return !isTokenExpired(decoded);
  } catch (error) {
    return false;
  }
}

// ✅ Good - Role-based access control
function requireRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({
        status: false,
        error: 'Insufficient permissions'
      });
    }
    next();
  };
}
```

### 3. **Data Sanitization**
```typescript
// ✅ Good - SQL injection prevention (Prisma handles this)
const user = await prisma.user.findUnique({
  where: { email: userEmail } // Prisma sanitizes input
});

// ✅ Good - XSS prevention
const sanitizedHtml = DOMPurify.sanitize(userInput);
```

---

## 📋 Code Review Checklist

### Before Submitting Code
- [ ] **Code Formatting**: Format code using tools like TypeScript, ESLint, Prettier
- [ ] **Unit Tests**: If project has UT integrated, run all UTs locally and ensure they pass before pushing code and creating PR
- [ ] **Console Logs**: Remove all unnecessary console.log statements
- [ ] **Unused Code**: Remove unused code snippets; if needed in future, add clear TODO comments
- [ ] **Environment Variables**: If there are new environment keys, update them in .env.example file
- [ ] **Git Rebase**: Always rebase with target branch before creating PR (e.g., rebase develop before PR into develop)
- [ ] **Multi-language Support**: If system has multi-language integration, ensure all language files are complete for all languages
- [ ] **English Naming/Comments**: Comments, variable names, and file names should be written entirely in English with proper grammar
- [ ] **Validation Consistency**: If PR includes validation features, ensure validation is synchronized between add and edit screens
- [ ] **Database Migration Charset**: If PR includes migration, ensure table charset is utf8mb4_bin
- [ ] **PR Checks**: Ensure all checks in PR run completely without errors (lint, reviewdog, sonarQ, etc.)
- [ ] **Coding Convention**: Adhere to project coding conventions
- [ ] **Code follows naming conventions**
- [ ] **Functions are focused and not too long**
- [ ] **Tests are written and passing**
- [ ] **Documentation is updated**
- [ ] **No hardcoded values**
- [ ] **Security considerations are addressed**

### During Code Review
- [ ] **Code is readable and well-structured**
- [ ] **Logic is correct and efficient**
- [ ] **Error cases are handled properly**
- [ ] **Tests cover all scenarios**
- [ ] **Documentation is clear and complete**
- [ ] **No security vulnerabilities**
- [ ] **Follows established patterns**
- [ ] **No unnecessary complexity**
- [ ] **Type safety is maintained**
- [ ] **Error messages are user-friendly**
- [ ] **Logging is appropriate and informative**
- [ ] **Code duplication is minimized**
- [ ] **Dependencies are up-to-date and secure**

---

## 🆘 Getting Help

If you have questions about coding conventions:

1. **Check this document first**
2. **Review existing code** for examples
3. **Ask team members** for clarification
4. **Use linting tools** to catch style issues
5. **Run tests** to ensure code quality

---

*Happy coding! 🚀* 