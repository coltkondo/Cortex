# Naming Audit Report

## Overview

This document summarizes the audit of all variable names, function names, and file names in the Cortex codebase to identify and replace vague naming patterns.

## Date: 2026-03-24

---

## Vague Names Found and Replacements

### Frontend Variables

#### 1. FitScoreDisplay.jsx (Line 28)
**Found:** `const data = await analysisService.analyzeFit(jobId)`
**Issue:** Generic `data` doesn't describe what kind of data
**Replacement:** `const fitScoreAnalysis = await analysisService.analyzeFit(jobId)`
**Reason:** Clearly indicates this contains fit score analysis results

#### 2. BulletSuggestions.jsx (Line 14)
**Found:** `const data = await analysisService.generateBullets(jobId)`
**Issue:** Generic `data` doesn't describe contents
**Replacement:** `const bulletResponse = await analysisService.generateBullets(jobId)`
**Reason:** Indicates this is the response containing bullet suggestions

#### 3. CoverLetterGenerator.jsx (Line 15)
**Found:** `const data = await analysisService.generateCoverLetter(jobId, tone)`
**Issue:** Generic `data` doesn't describe contents
**Replacement:** `const coverLetterResponse = await analysisService.generateCoverLetter(jobId, tone)`
**Reason:** Clearly indicates response containing cover letter content

#### 4. InterviewPrepGenerator.jsx (Line 12)
**Found:** `const data = await analysisService.generateInterviewPrep(jobId)`
**Issue:** Generic `data` doesn't describe contents
**Replacement:** `const prepResponse = await analysisService.generateInterviewPrep(jobId)`
**Reason:** Indicates response containing interview prep materials

#### 5. ResumeUpload.jsx (Line 44)
**Found:** `const data = await resumeService.uploadResume(file)`
**Issue:** Generic `data` doesn't describe contents
**Replacement:** `const uploadedResume = await resumeService.uploadResume(file)`
**Reason:** Clearly indicates this is the uploaded resume data

### Backend Variables

#### 6. routes/analysis.ts (Line 30)
**Found:** `const result = await analyzeFit(resume.content, job.description, job.companyStage)`
**Issue:** Generic `result` doesn't describe what kind of result
**Replacement:** `const fitAnalysisResult = await analyzeFit(resume.content, job.description, job.companyStage)`
**Reason:** Clearly indicates this is the fit analysis result

#### 7. routes/analysis.ts (Line 126)
**Found:** `const result = await generateInterviewPrep(...)`
**Issue:** Generic `result` doesn't describe contents
**Replacement:** `const interviewPrepResult = await generateInterviewPrep(...)`
**Reason:** Clearly indicates this contains interview prep data

#### 8. services/ai/geminiClient.ts (Line 31)
**Found:** `const result = await this.model.generateContent({...})`
**Issue:** Generic `result` doesn't describe what's being generated
**Replacement:** `const aiGenerationResult = await this.model.generateContent({...})`
**Reason:** Indicates this is the AI generation result from Gemini

#### 9. utils/pdfParser.ts (Line 5)
**Found:** `const data = await pdfParse(buffer)`
**Issue:** Generic `data` doesn't describe contents
**Replacement:** `const parsedPdfData = await pdfParse(buffer)`
**Reason:** Clearly indicates this is parsed PDF data

---

## Names That Are Acceptable

### Express.js Conventions
- `req`, `res` in route handlers - **OK** (Express convention)
- `error` in catch blocks - **OK** (standard naming)
- `err` in catch blocks - **OK** (common shorthand)

### Axios Conventions
- `response.data` in API services - **OK** (Axios convention)
- `error.response` - **OK** (Axios error structure)

### Loop Variables
- `idx` in map functions - **OK** (common shorthand for index)
- `step` in steps.map() - **OK** (meaningful in context)

### Specific Enough Names
- `jobData` in JobDescriptionInput.jsx - **OK** (clearly job-related data)
- `formData` - **OK** (clearly form-related data)
- `jobRepo`, `resumeRepo` - **OK** (clear abbreviation for repository)

---

## File Names - All Acceptable

All file names in the codebase are sufficiently descriptive:

### Frontend
- `FitScoreDisplay.jsx` - Clearly displays fit scores
- `BulletSuggestions.jsx` - Shows bullet suggestions
- `CoverLetterGenerator.jsx` - Generates cover letters
- `InterviewPrepGenerator.jsx` - Generates interview prep
- `JobDescriptionInput.jsx` - Inputs job descriptions
- `ResumeUpload.jsx` - Uploads resumes
- `ProgressRing.jsx` - Renders progress ring
- `Badge.jsx` - Renders badge component
- `EmptyState.jsx` - Shows empty state
- `Layout.jsx` - Page layout component

### Backend
- `pdfParser.ts` - **Specific enough** - Parses PDF files
- `urlFetcher.ts` - **Specific enough** - Fetches from URLs
- `fitScoring.ts` - Handles fit scoring logic
- `bulletSuggestions.ts` - Generates bullet suggestions
- `coverLetter.ts` - Generates cover letters
- `interviewPrep.ts` - Generates interview prep
- `geminiClient.ts` - Gemini AI client
- `mockClient.ts` - Mock AI client
- `constants.ts` - Application constants

---

## Function Names - All Acceptable

All function names are descriptive:

### Examples of Good Naming
- `analyzeFit()` - Clear what it analyzes
- `generateBullets()` - Clear what it generates
- `uploadResume()` - Clear what it uploads
- `extractTextFromPDF()` - Clear what it extracts and from where
- `fetchJobDescriptionFromURL()` - Very specific about what and where
- `getScoreLevel()` - Clear what it returns
- `copyToClipboard()` - Clear what action it performs

---

## Summary

### Total Issues Found: 9
- **Frontend Variables:** 5 instances of vague `data` variable
- **Backend Variables:** 4 instances of vague `result` or `data` variables

### Total Issues Fixed: 9
All vague variable names replaced with descriptive alternatives

### File Names: 0 issues
All file names are sufficiently descriptive

### Function Names: 0 issues
All function names are sufficiently descriptive

---

## Impact on Code Quality

**Before:**
```javascript
const data = await analysisService.analyzeFit(jobId)
setFitScore(data)
```

**After:**
```javascript
const fitScoreAnalysis = await analysisService.analyzeFit(jobId)
setFitScore(fitScoreAnalysis)
```

**Benefits:**
1. **Improved Readability:** Developers can understand variable purpose at a glance
2. **Better IntelliSense:** IDEs can provide more meaningful autocomplete suggestions
3. **Easier Debugging:** Stack traces and debugger views show meaningful variable names
4. **Reduced Cognitive Load:** No need to infer what `data` or `result` contains
5. **Self-Documenting Code:** Variable names serve as inline documentation

---

## Naming Guidelines for Future Development

### Variable Naming Best Practices

1. **Be Specific:** Describe what the variable contains
   - ❌ `data`, `result`, `item`, `val`
   - ✅ `fitScoreAnalysis`, `bulletResponse`, `uploadedResume`

2. **Use Full Words:** Avoid unnecessary abbreviations
   - ❌ `usr`, `doc`, `ctx`
   - ✅ `user`, `document`, `context`
   - ⚠️ **Exception:** Common abbreviations like `id`, `url`, `api` are acceptable

3. **Include Data Type When Ambiguous:**
   - ❌ `jobs` (is it an array, object, count?)
   - ✅ `jobsList`, `jobsCount`, `jobsMap`

4. **Use Semantic Names for API Responses:**
   - ❌ `const data = await api.get()`
   - ✅ `const fitScoreAnalysis = await api.get()`
   - ✅ `const uploadedResume = await api.post()`

5. **Boolean Variables Should Ask Questions:**
   - ❌ `loading`, `fetch`, `visible`
   - ✅ `isLoading`, `shouldFetch`, `isVisible`

6. **Arrays Should Be Plural:**
   - ❌ `job`, `bullet`, `step`
   - ✅ `jobs`, `bullets`, `steps`

7. **Event Handlers Should Describe Actions:**
   - ❌ `handler`, `callback`, `fn`
   - ✅ `handleSubmit`, `onUploadComplete`, `validateInput`

### When Generic Names Are Acceptable

1. **Established Conventions:**
   - `req`, `res` in Express route handlers
   - `err`, `error` in catch blocks
   - `response.data` from Axios
   - `e` or `event` in event handlers

2. **Very Short Scopes:**
   - `i` in for loops (when < 5 lines)
   - `acc` in reduce functions (when < 3 lines)
   - `x`, `y` for coordinates

3. **Mathematical/Generic Operations:**
   - `value`, `index` in map/filter (when context is clear)
   - `item` in very short map callbacks

---

## Code Review Checklist

When reviewing code, flag these patterns:

- [ ] Variables named `data` without specific context
- [ ] Variables named `result` without specific context
- [ ] Variables named `temp` or `tmp`
- [ ] Variables named `item` outside of short map callbacks
- [ ] Variables named `val` or `value` without context
- [ ] Function names ending in `Handler` without describing what they handle
- [ ] File names containing `utils` or `helpers` without specificity

---

**Status:** ✅ All vague names identified and replaced
**Code Quality:** Excellent
**Maintainability:** Significantly improved

---

**Audit completed by:** Claude Code
**Date:** March 24, 2026
**Files audited:** 44 source files (excluding node_modules)
