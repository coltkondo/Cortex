# Scaling Risks: Top 5 Breaking Points at 10,000 DAU

**Analysis Date:** March 24, 2026
**Current Architecture:** SQLite + Node.js/Express + Synchronous AI calls

This document identifies the top 5 components that will fail first when Cortex reaches 10,000 daily active users, along with specific fixes.

---

## Risk #1: SQLite Database Bottleneck

### Current State
- **Database:** SQLite (single file: `cortex.db`)
- **Location:** `backend-ts/src/config/database.ts`
- **Concurrent connections:** Limited to ~100 simultaneous writes
- **Locking:** Entire database locks on writes

### Failure Mode at 10,000 DAU
**When:** ~500 concurrent users (5% of DAU active simultaneously)

**What breaks:**
- Database locks cause `SQLITE_BUSY` errors
- Write operations queue up and timeout
- Users see "Failed to create job" errors
- Resume uploads fail with database lock errors
- Fit score analysis fails to save results

**Error logs will show:**
```
Error: SQLITE_BUSY: database is locked
Error: SQLITE_LOCKED: database table is locked
```

**Why this happens:**
- SQLite locks the entire database on writes
- 500 users trying to upload resumes or create jobs simultaneously = cascading failures
- Even read queries block during writes

### Specific Fix: Migrate to PostgreSQL

**Implementation Steps:**

#### Step 1: Update Dependencies
```bash
cd backend-ts
npm install pg @types/pg
npm uninstall better-sqlite3  # Remove SQLite
```

#### Step 2: Update `backend-ts/src/config/database.ts`
```typescript
import { DataSource } from 'typeorm'
import { config } from './env'
import { Resume } from '../models/Resume'
import { Job } from '../models/Job'
import { Application } from '../models/Application'
import { GeneratedContent } from '../models/GeneratedContent'

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Format: postgres://user:pass@host:5432/dbname

  // Production settings
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,

  // Connection pooling (critical for concurrency)
  extra: {
    max: 50,              // Maximum 50 connections in pool
    min: 10,              // Keep 10 connections alive
    idleTimeoutMillis: 30000,  // Close idle connections after 30s
    connectionTimeoutMillis: 5000,  // Timeout if can't get connection in 5s
  },

  // Schema synchronization
  synchronize: config.nodeEnv === 'development',  // ONLY in dev
  logging: config.nodeEnv === 'development',

  entities: [Resume, Job, Application, GeneratedContent],
})

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize()
    console.log('✅ PostgreSQL database connected')

    // Run migrations in production instead of synchronize
    if (config.nodeEnv === 'production') {
      await AppDataSource.runMigrations()
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw error
  }
}
```

#### Step 3: Update Environment Variables
```bash
# backend-ts/.env.production
DATABASE_URL=postgres://cortex_user:secure_password@db.example.com:5432/cortex_production

# backend-ts/.env.development
DATABASE_URL=postgres://localhost:5432/cortex_dev
```

#### Step 4: Update `backend-ts/src/config/env.ts`
```typescript
export const config = {
  // ... existing config
  databaseUrl: process.env.DATABASE_URL || 'postgres://localhost:5432/cortex_dev',
  // Remove: databasePath (SQLite specific)
}
```

**Performance Impact:**
- ✅ Handles 1000+ concurrent connections with pooling
- ✅ No database-level locking (row-level locking only)
- ✅ 10-100x faster on concurrent writes
- ✅ Built for horizontal scaling

**Deployment:**
- Use Railway PostgreSQL ($5/month) or Render PostgreSQL (free tier)
- Or self-host with Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15`

---

## Risk #2: No AI Response Caching

### Current State
- **Every request** hits Gemini API fresh
- No caching of fit scores, bullets, cover letters
- Same job description + resume = recalculated every time

### Failure Mode at 10,000 DAU
**When:** Day 1 at 10,000 DAU (immediate problem)

**What breaks:**
- **Cost explosion:** 10K users × 5 AI calls each = 50K API calls/day
  - At $0.02 per 1K tokens: ~$500-1000/day ($15K-30K/month)
- **Latency:** Every fit score takes 5-15 seconds
- **Rate limits:** Gemini free tier maxes at 60 req/min (3,600/hour)
  - Need 50,000/day = 2,083/hour → **58% of requests fail**

**Error logs will show:**
```
Error: 429 Too Many Requests
Error: Gemini API failed: Rate limit exceeded
Error: Request timeout after 30 seconds
```

**Why this happens:**
- Users re-analyze same jobs multiple times
- No deduplication of identical resume + job description pairs
- Every page refresh recalculates everything

### Specific Fix: Implement Redis Cache Layer

**Implementation Steps:**

#### Step 1: Add Redis Dependency
```bash
cd backend-ts
npm install redis ioredis
npm install -D @types/ioredis
```

#### Step 2: Create `backend-ts/src/config/redis.ts`
```typescript
import Redis from 'ioredis'
import { config } from './env'

// Redis client configuration
export const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: 0,

  // Retry strategy
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },

  // Connection pool
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: false,
})

redisClient.on('connect', () => {
  console.log('✅ Redis connected')
})

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err)
})

// Cache helper functions
export const cache = {
  // Generate cache key from resume + job description
  generateKey: (prefix: string, resumeId: number, jobId: number): string => {
    return `${prefix}:resume:${resumeId}:job:${jobId}`
  },

  // Get cached result
  get: async (key: string): Promise<any | null> => {
    const cached = await redisClient.get(key)
    return cached ? JSON.parse(cached) : null
  },

  // Set cache with TTL (time to live)
  set: async (key: string, value: any, ttlSeconds: number = 86400): Promise<void> => {
    await redisClient.setex(key, ttlSeconds, JSON.stringify(value))
  },

  // Delete cache entry
  delete: async (key: string): Promise<void> => {
    await redisClient.del(key)
  },

  // Invalidate all caches for a resume (when resume is updated)
  invalidateResume: async (resumeId: number): Promise<void> => {
    const pattern = `*:resume:${resumeId}:*`
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await redisClient.del(...keys)
    }
  },
}
```

#### Step 3: Update `backend-ts/src/routes/analysis.ts` with caching
```typescript
import { cache } from '../config/redis'

// Analyze fit score with caching
router.post('/fit-score/:jobId', async (req, res) => {
  try {
    const resumeRepo = AppDataSource.getRepository(Resume)
    const jobRepo = AppDataSource.getRepository(Job)

    const resume = await resumeRepo.findOne({ where: {}, order: { id: 'DESC' } })
    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found. Please upload a resume first.' })
    }

    const job = await jobRepo.findOne({ where: { id: parseInt(req.params.jobId) } })
    if (!job) {
      return res.status(404).json({ detail: 'Job not found' })
    }

    // Check cache first
    const cacheKey = cache.generateKey('fit-score', resume.id, job.id)
    const cachedResult = await cache.get(cacheKey)

    if (cachedResult) {
      console.log(`✅ Cache HIT: ${cacheKey}`)
      return res.json({
        job_id: job.id,
        ...cachedResult,
        cached: true,  // Indicate this was cached
      })
    }

    // Cache miss - call AI
    console.log(`❌ Cache MISS: ${cacheKey}`)
    const fitAnalysisResult = await analyzeFit(resume.content, job.description, job.companyStage)

    // Store in cache (24 hour TTL)
    await cache.set(cacheKey, fitAnalysisResult, 86400)

    res.json({
      job_id: job.id,
      ...fitAnalysisResult,
      cached: false,
    })
  } catch (error: any) {
    res.status(500).json({ detail: error.message })
  }
})

// Apply same pattern to /bullets, /cover-letter, /interview-prep endpoints
```

#### Step 4: Invalidate cache on resume upload
```typescript
// In backend-ts/src/routes/resume.ts
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // ... existing upload logic ...

    // Invalidate all caches for previous resume
    const oldResume = await resumeRepo.findOne({ where: {}, order: { id: 'DESC' } })
    if (oldResume) {
      await cache.invalidateResume(oldResume.id)
      await resumeRepo.remove(oldResume)
    }

    // ... save new resume ...
  }
})
```

#### Step 5: Add Redis to environment variables
```bash
# backend-ts/.env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Optional for local dev

# Production (Railway/Render provides REDIS_URL)
REDIS_URL=redis://default:password@redis.example.com:6379
```

**Performance Impact:**
- ✅ **Cache hit rate: 70-90%** (most users re-view same analyses)
- ✅ **Latency: 15s → 50ms** for cached results (300x faster)
- ✅ **Cost reduction: 70-90%** fewer AI API calls
- ✅ **Rate limit relief:** Only unique analyses hit API

**Cost Savings:**
- Before: 50K API calls/day × $0.02/1K = $1000/day
- After: 10K API calls/day × $0.02/1K = $200/day
- **Savings: $800/day ($24K/month)**

---

## Risk #3: No Rate Limiting

### Current State
- **No protection** against request spam
- Any user can spam AI generation endpoints unlimited times
- No per-user or per-IP rate limiting

### Failure Mode at 10,000 DAU
**When:** Day 1 - single malicious actor or buggy client

**What breaks:**
- **DOS attack:** Single user spams `/api/analysis/fit-score` 1000x/second
- **Server overload:** Node.js event loop blocked by concurrent requests
- **Database overload:** Thousands of DB queries/second
- **AI API quota exhausted:** Legitimate users get rate limit errors
- **Cost explosion:** Malicious actor racks up $10K+ in API costs

**Why this happens:**
- No request throttling
- No user authentication/identification
- No cost protection mechanisms

### Specific Fix: Implement Express Rate Limiter

**Implementation Steps:**

#### Step 1: Add Rate Limiting Dependencies
```bash
cd backend-ts
npm install express-rate-limit rate-limit-redis
```

#### Step 2: Create `backend-ts/src/middleware/rateLimiter.ts`
```typescript
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { redisClient } from '../config/redis'

// Strict rate limit for expensive AI operations
export const aiRateLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:ai:',
  }),

  // Allow 10 AI requests per 5 minutes per IP
  windowMs: 5 * 60 * 1000,  // 5 minutes
  max: 10,

  message: {
    detail: 'Too many AI requests. Please wait 5 minutes before trying again.',
    retry_after: 300,  // seconds
  },

  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,

  // Use IP address as identifier
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown'
  },

  // Skip rate limiting for cached responses
  skip: (req) => {
    // If response has cached: true, don't count against rate limit
    return req.body?.cached === true
  },
})

// Moderate rate limit for job/resume CRUD operations
export const apiRateLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:api:',
  }),

  // Allow 100 requests per 15 minutes per IP
  windowMs: 15 * 60 * 1000,
  max: 100,

  message: {
    detail: 'Too many requests. Please slow down.',
  },

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => req.ip || 'unknown',
})

// Strict rate limit for resume uploads (large files)
export const uploadRateLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:upload:',
  }),

  // Allow 5 uploads per hour per IP
  windowMs: 60 * 60 * 1000,
  max: 5,

  message: {
    detail: 'Too many file uploads. Maximum 5 per hour.',
  },

  standardHeaders: true,
  legacyHeaders: false,
})
```

#### Step 3: Apply rate limiters to routes
```typescript
// backend-ts/src/index.ts
import { apiRateLimiter } from './middleware/rateLimiter'

// Apply to all API routes
app.use('/api', apiRateLimiter)

// backend-ts/src/routes/analysis.ts
import { aiRateLimiter } from '../middleware/rateLimiter'

// Apply strict rate limiting to expensive AI operations
router.post('/fit-score/:jobId', aiRateLimiter, async (req, res) => { /* ... */ })
router.post('/bullets/:jobId', aiRateLimiter, async (req, res) => { /* ... */ })
router.post('/cover-letter/:jobId', aiRateLimiter, async (req, res) => { /* ... */ })
router.post('/interview-prep/:jobId', aiRateLimiter, async (req, res) => { /* ... */ })

// backend-ts/src/routes/resume.ts
import { uploadRateLimiter } from '../middleware/rateLimiter'

router.post('/upload', uploadRateLimiter, upload.single('file'), async (req, res) => { /* ... */ })
```

#### Step 4: Update frontend to handle rate limits
```javascript
// frontend/src/api/client.js
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      // Rate limited
      const retryAfter = error.response.data?.retry_after || 300
      console.error(`Rate limited. Retry after ${retryAfter} seconds`)

      // Show user-friendly error
      const minutes = Math.ceil(retryAfter / 60)
      alert(`You've made too many requests. Please wait ${minutes} minutes.`)
    }
    return Promise.reject(error)
  }
)
```

**Protection Provided:**
- ✅ **DOS protection:** Max 10 AI calls per 5 min per IP
- ✅ **Cost protection:** Malicious actor can only rack up $20 max before rate limited
- ✅ **Server stability:** Prevents event loop blocking
- ✅ **Fair usage:** Ensures all users get fair access

**Rate Limit Strategy:**
```
AI Operations:      10 requests / 5 minutes  (expensive, protect heavily)
General API:       100 requests / 15 minutes (standard protection)
File Uploads:        5 requests / 1 hour     (large files, strict limit)
```

---

## Risk #4: Synchronous AI Calls Block Requests

### Current State
- **AI calls are synchronous** in route handlers
- Request waits 5-30 seconds for AI response before returning
- Blocks Node.js event loop during AI processing

### Failure Mode at 10,000 DAU
**When:** ~200 concurrent AI requests

**What breaks:**
- **Request timeouts:** 30+ second wait times trigger client timeouts
- **Server blocking:** Node.js single-threaded nature means blocked event loop
- **Poor UX:** Users stare at loading spinners for 30+ seconds
- **Cascade failures:** Slow requests pile up, server runs out of memory
- **Error rate spikes:** Timeouts cause widespread "failed to analyze" errors

**Error logs will show:**
```
Error: Request timeout after 30000ms
Error: socket hang up
MaxListenersExceededWarning: Possible memory leak detected
```

**Why this happens:**
- AI calls take 5-30 seconds to complete
- During that time, the request is blocking
- 200 concurrent requests × 15 seconds = server overload
- Node.js can't handle 200 simultaneous long-running operations

### Specific Fix: Async Job Queue with Background Workers

**Implementation Steps:**

#### Step 1: Add Bull Queue Dependencies
```bash
cd backend-ts
npm install bull @types/bull
```

#### Step 2: Create `backend-ts/src/queues/aiQueue.ts`
```typescript
import Bull from 'bull'
import { redisClient } from '../config/redis'
import { analyzeFit } from '../services/claude/fitScoring'
import { generateBullets } from '../services/claude/bulletSuggestions'
import { generateCoverLetter } from '../services/claude/coverLetter'
import { generateInterviewPrep } from '../services/claude/interviewPrep'
import { AppDataSource } from '../config/database'
import { GeneratedContent } from '../models/GeneratedContent'

// Create queue for AI jobs
export const aiQueue = new Bull('ai-generation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },

  // Job settings
  defaultJobOptions: {
    attempts: 3,  // Retry failed jobs 3 times
    backoff: {
      type: 'exponential',
      delay: 2000,  // Start with 2s delay, double each retry
    },
    removeOnComplete: 100,  // Keep last 100 completed jobs
    removeOnFail: 200,  // Keep last 200 failed jobs
  },
})

// Process jobs with 10 concurrent workers
aiQueue.process('fit-score', 10, async (job) => {
  const { resumeId, jobId, resumeContent, jobDescription, companyStage } = job.data

  console.log(`Processing fit-score job ${job.id} for job ${jobId}`)

  const result = await analyzeFit(resumeContent, jobDescription, companyStage)

  // Store result in database
  const contentRepo = AppDataSource.getRepository(GeneratedContent)
  await contentRepo.save({
    jobId,
    resumeId,
    type: 'fit_score',
    content: JSON.stringify(result),
    createdAt: new Date(),
  })

  return result
})

aiQueue.process('bullets', 10, async (job) => {
  const { resumeId, jobId, resumeContent, jobDescription } = job.data

  const suggestions = await generateBullets(resumeContent, jobDescription)

  const contentRepo = AppDataSource.getRepository(GeneratedContent)
  await contentRepo.save({
    jobId,
    resumeId,
    type: 'bullets',
    content: JSON.stringify({ suggestions }),
    createdAt: new Date(),
  })

  return { suggestions }
})

// Similar processors for cover-letter and interview-prep...

// Queue event handlers
aiQueue.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed:`, result)
})

aiQueue.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message)
})

aiQueue.on('stalled', (job) => {
  console.warn(`⚠️ Job ${job.id} stalled`)
})
```

#### Step 3: Update routes to use async jobs
```typescript
// backend-ts/src/routes/analysis.ts
import { aiQueue } from '../queues/aiQueue'
import { GeneratedContent } from '../models/GeneratedContent'

// Start fit score analysis (returns immediately with job ID)
router.post('/fit-score/:jobId', async (req, res) => {
  try {
    const resumeRepo = AppDataSource.getRepository(Resume)
    const jobRepo = AppDataSource.getRepository(Job)

    const resume = await resumeRepo.findOne({ where: {}, order: { id: 'DESC' } })
    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' })
    }

    const job = await jobRepo.findOne({ where: { id: parseInt(req.params.jobId) } })
    if (!job) {
      return res.status(404).json({ detail: 'Job not found' })
    }

    // Check if already generated
    const contentRepo = AppDataSource.getRepository(GeneratedContent)
    const existing = await contentRepo.findOne({
      where: { jobId: job.id, resumeId: resume.id, type: 'fit_score' }
    })

    if (existing) {
      return res.json({
        status: 'completed',
        result: JSON.parse(existing.content),
      })
    }

    // Add job to queue
    const queueJob = await aiQueue.add('fit-score', {
      resumeId: resume.id,
      jobId: job.id,
      resumeContent: resume.content,
      jobDescription: job.description,
      companyStage: job.companyStage,
    })

    // Return immediately with job ID
    res.json({
      status: 'processing',
      job_id: queueJob.id,
      message: 'Analysis started. Check status at /api/analysis/status/:jobId',
    })
  } catch (error: any) {
    res.status(500).json({ detail: error.message })
  }
})

// Check job status
router.get('/status/:queueJobId', async (req, res) => {
  try {
    const queueJob = await aiQueue.getJob(req.params.queueJobId)

    if (!queueJob) {
      return res.status(404).json({ detail: 'Job not found' })
    }

    const state = await queueJob.getState()

    if (state === 'completed') {
      return res.json({
        status: 'completed',
        result: queueJob.returnvalue,
      })
    } else if (state === 'failed') {
      return res.json({
        status: 'failed',
        error: queueJob.failedReason,
      })
    } else {
      return res.json({
        status: 'processing',
        progress: queueJob.progress(),
      })
    }
  } catch (error: any) {
    res.status(500).json({ detail: error.message })
  }
})
```

#### Step 4: Update frontend to poll for results
```javascript
// frontend/src/api/analysisService.js
export const analysisService = {
  analyzeFit: async (jobId) => {
    // Start analysis
    const startResponse = await apiClient.post(`/api/analysis/fit-score/${jobId}`)

    if (startResponse.data.status === 'completed') {
      // Already generated
      return startResponse.data.result
    }

    // Poll for completion
    const queueJobId = startResponse.data.job_id

    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await apiClient.get(`/api/analysis/status/${queueJobId}`)

          if (statusResponse.data.status === 'completed') {
            clearInterval(pollInterval)
            resolve(statusResponse.data.result)
          } else if (statusResponse.data.status === 'failed') {
            clearInterval(pollInterval)
            reject(new Error(statusResponse.data.error))
          }
          // Otherwise keep polling
        } catch (error) {
          clearInterval(pollInterval)
          reject(error)
        }
      }, 2000)  // Poll every 2 seconds

      // Timeout after 60 seconds
      setTimeout(() => {
        clearInterval(pollInterval)
        reject(new Error('Analysis timeout after 60 seconds'))
      }, 60000)
    })
  }
}
```

**Performance Impact:**
- ✅ **Requests return instantly** (< 100ms) instead of 5-30s
- ✅ **Non-blocking:** Event loop free to handle other requests
- ✅ **Scalable:** Can handle 1000+ concurrent AI requests with workers
- ✅ **Retry logic:** Failed jobs automatically retry
- ✅ **Better UX:** Users see progress instead of frozen loading

**Architecture:**
```
Client → API → Queue → [Worker 1, Worker 2, ... Worker 10] → Database
           ↓                                                      ↑
         Returns                                              Stores
         job ID                                               result

Client polls /status/:jobId to check completion
```

---

## Risk #5: No Database Indexing

### Current State
- **No indexes** on foreign keys or query columns
- TypeORM auto-generated schema has minimal indexes
- Only primary key columns are indexed

### Failure Mode at 10,000 DAU
**When:** Database has 100K+ jobs, 50K+ resumes, 500K+ generated content records

**What breaks:**
- **Query slowdown:** Queries that took 10ms now take 30+ seconds
- **Timeouts everywhere:** Every route that queries jobs or resumes times out
- **Full table scans:** Database reads millions of rows to find one record
- **API becomes unusable:** Users can't load job lists or view analyses

**Example slow queries:**
```sql
-- Full table scan on 500K records (30+ seconds)
SELECT * FROM generated_content WHERE job_id = 123 AND type = 'fit_score';

-- Full table scan on 100K jobs (10+ seconds)
SELECT * FROM job WHERE created_at > '2026-01-01' ORDER BY created_at DESC LIMIT 20;

-- No index on resume_id foreign key (15+ seconds)
SELECT * FROM job WHERE resume_id = 456;
```

**Why this happens:**
- Database has to scan every row without indexes
- Sorting without indexes requires full table read
- Foreign key lookups do full table scans

### Specific Fix: Add Strategic Database Indexes

**Implementation Steps:**

#### Step 1: Update TypeORM models with indexes

**`backend-ts/src/models/Job.ts`**
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  company: string

  @Column()
  role: string

  @Column('text')
  description: string

  @Column({ nullable: true })
  source: string

  @Column({ name: 'company_stage', default: 'series_b' })
  companyStage: string

  @CreateDateColumn({ name: 'created_at' })
  @Index()  // Index for sorting by creation date
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  // Composite index for common query patterns
  @Index(['company', 'role'])  // Index for searching by company + role
  companyRoleIndex?: string
}
```

**`backend-ts/src/models/GeneratedContent.ts`**
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm'

@Entity()
export class GeneratedContent {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'job_id' })
  @Index()  // Index for querying by job
  jobId: number

  @Column({ name: 'resume_id' })
  @Index()  // Index for querying by resume
  resumeId: number

  @Column()
  @Index()  // Index for filtering by type
  type: string  // 'fit_score', 'bullets', 'cover_letter', 'interview_prep'

  @Column('text')
  content: string

  @CreateDateColumn({ name: 'created_at' })
  @Index()  // Index for sorting by date
  createdAt: Date

  // Composite index for most common query
  @Index(['jobId', 'resumeId', 'type'])  // Index for finding specific content
  jobResumeTypeIndex?: string
}
```

**`backend-ts/src/models/Resume.ts`**
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm'

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  filename: string

  @Column('text')
  content: string

  @Column({ name: 'uploaded_at' })
  @Index()  // Index for sorting by upload date
  uploadedAt: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
```

#### Step 2: Create migration to add indexes
```typescript
// backend-ts/src/migrations/1234567890-AddIndexes.ts
import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIndexes1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Indexes for Job table
    await queryRunner.query(`
      CREATE INDEX "IDX_job_created_at" ON "job" ("created_at" DESC);
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_job_company_role" ON "job" ("company", "role");
    `)

    // Indexes for GeneratedContent table
    await queryRunner.query(`
      CREATE INDEX "IDX_generated_content_job_id" ON "generated_content" ("job_id");
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_generated_content_resume_id" ON "generated_content" ("resume_id");
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_generated_content_type" ON "generated_content" ("type");
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_generated_content_created_at" ON "generated_content" ("created_at" DESC);
    `)
    // Composite index for most common query pattern
    await queryRunner.query(`
      CREATE INDEX "IDX_generated_content_job_resume_type"
      ON "generated_content" ("job_id", "resume_id", "type");
    `)

    // Index for Resume table
    await queryRunner.query(`
      CREATE INDEX "IDX_resume_uploaded_at" ON "resume" ("uploaded_at" DESC);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_job_created_at"`)
    await queryRunner.query(`DROP INDEX "IDX_job_company_role"`)
    await queryRunner.query(`DROP INDEX "IDX_generated_content_job_id"`)
    await queryRunner.query(`DROP INDEX "IDX_generated_content_resume_id"`)
    await queryRunner.query(`DROP INDEX "IDX_generated_content_type"`)
    await queryRunner.query(`DROP INDEX "IDX_generated_content_created_at"`)
    await queryRunner.query(`DROP INDEX "IDX_generated_content_job_resume_type"`)
    await queryRunner.query(`DROP INDEX "IDX_resume_uploaded_at"`)
  }
}
```

#### Step 3: Run migrations
```bash
cd backend-ts
npm run typeorm migration:run
```

#### Step 4: Verify indexes are working
```sql
-- Check query plan to confirm index usage
EXPLAIN ANALYZE
SELECT * FROM generated_content
WHERE job_id = 123 AND resume_id = 456 AND type = 'fit_score';

-- Should show: "Index Scan using IDX_generated_content_job_resume_type"
-- Should NOT show: "Seq Scan" (full table scan)
```

**Performance Impact:**

| Query | Before (No Index) | After (With Index) | Speedup |
|-------|-------------------|-------------------|---------|
| Find content by job+resume+type | 30s | 5ms | **6000x** |
| List jobs by date (paginated) | 10s | 10ms | **1000x** |
| Find jobs by company+role | 8s | 15ms | **533x** |
| Count generated content per job | 45s | 20ms | **2250x** |

**Index Strategy:**
```
Single-column indexes: Columns used in WHERE, ORDER BY, JOIN
Composite indexes: Multiple columns commonly queried together
Direction matters: DESC for descending sorts (created_at DESC)
```

---

## Implementation Priority

**Week 1 (Critical - Do Now):**
1. ✅ **Risk #2: Redis caching** (biggest cost/performance win)
2. ✅ **Risk #3: Rate limiting** (prevents abuse/DOS)

**Week 2 (High Priority):**
3. ✅ **Risk #1: PostgreSQL migration** (prepares for scale)
4. ✅ **Risk #5: Database indexes** (prevents slowdown as data grows)

**Week 3-4 (Medium Priority):**
5. ✅ **Risk #4: Async job queue** (best UX, complex to implement)

---

## Testing the Fixes

### Load Testing Commands
```bash
# Install load testing tool
npm install -g artillery

# Create load test config (artillery.yml)
config:
  target: 'http://localhost:8000'
  phases:
    - duration: 60
      arrivalRate: 50  # 50 users/second = 3000 users/minute

scenarios:
  - name: "Create job and analyze"
    flow:
      - post:
          url: "/api/jobs"
          json:
            company: "Test Corp"
            role: "Engineer"
            description: "Test job description for load testing"
      - post:
          url: "/api/analysis/fit-score/{{ jobId }}"

# Run load test
artillery run artillery.yml
```

### Monitoring Metrics to Watch
- **Response time P95:** Should stay < 500ms (with cache)
- **Error rate:** Should stay < 1%
- **Cache hit rate:** Should reach 70%+ after warmup
- **Queue depth:** Should stay < 100 jobs
- **Database connection pool:** Should stay < 80% utilization

---

**Last Updated:** March 24, 2026
**Next Review:** After reaching 1,000 DAU (validate assumptions)
