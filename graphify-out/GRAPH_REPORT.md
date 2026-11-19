# Graph Report - kosera-spk  (2026-11-19)

## Corpus Check
- 409 files · ~181,102 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 6, .example 1, .conf 1)

## Summary
- 2449 nodes · 5627 edges · 123 communities (107 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cb245068`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- envelope.ts
- scripts
- photos/route.ts
- kos/[id]/page.tsx
- Header
- BookingAdminClient.tsx
- package.json
- drizzle-orm
- verifyToken
- view/page.tsx
- lib/ai/index.ts
- react
- app
- 📦 Database Design: Kosera Platform
- schema.ts
- Features
- renter/bookings/page.tsx
- Profile Matching DSS (Decision Support System)
- KosFormShell.tsx
- with
- sweetalert.ts
- lib/auth.ts
- 🎯 Kosera API Testing Summary
- ai-reindex.test.ts
- admin.ts
- profile-matching.ts
- dependencies
- seller/dashboard/page.tsx
- seller/kos/page.tsx
- types/kos.ts
- AuthContext.tsx
- Providers.tsx
- chat.ts
- ApiClient
- api.ts
- app.py
- Cloudinary Integration Guide
- lib/ai/index.ts
- types/index.ts
- compilerOptions
- useApi.ts
- admin/bookings/route.ts
- Deployment Guide: Vercel & HuggingFace Spaces
- dotenv
- users/page.tsx
- api/bookings/route.ts
- design-playground/page.tsx
- renter/bookings/page.tsx
- Docker Setup Guide for Kosera API
- Dual Environment Setup Guide
- fail
- useSemanticSearch.ts
- UserDetailCard.tsx
- AuthContext.tsx
- Types Structure
- README.md
- Implementation Details
- app
- UserRoleStatusSection.tsx
- admin/dashboard/page.tsx
- upload/route.ts
- ai/route.ts
- dashboard.ts
- db
- ai-service
- pgadmin
- feedback/route.ts
- migrate-to-cloudinary.js
- API Response Standard
- Neon Test Database Setup
- copilot-instructions.md
- useAdminDashboard.ts
- middleware.ts
- login/page.tsx
- UsersTable.tsx
- booking.ts
- Continuous Integration Workflow
- useAdminUsersList.ts
- api/client.ts
- semanticSearch
- volumes
- next.config.ts
- api-response.ts
- healthcheck
- db_test
- RealMap.tsx
- recommendations/page.tsx
- api/kos.ts
- @testing-library/jest-dom@^6.6.3
- icons.ts
- @types/multer@^2.0.0
- Platform Options
- environment
- @types/react@^19
- cloudinary-advanced.ts
- @types/swiper@^5.4.3
- PlatformOverviewPanel.tsx
- 🚀 Kosera Deployment Guide
- Local Development Setup
- Button.tsx
- Monitoring and Logging
- Performance Optimization
- Database Deployment
- Security Configuration
- admin/kos/page.tsx
- Backup and Recovery
- Scaling Considerations
- Troubleshooting
- Environment Configuration
- Security Checklist
- Prerequisites
- react
- 01-init.sh
- fix-lint-errors.sh
- design-playground/layout.tsx
- Features
- 1. AI Service Deployment (HuggingFace Spaces)
- postcss.config.mjs
- Monitoring and Limits

## God Nodes (most connected - your core abstractions)
1. `react` - 163 edges
2. `fail()` - 123 edges
3. `ok()` - 123 edges
4. `next` - 64 edges
5. `scripts` - 61 edges
6. `Header()` - 53 edges
7. `drizzle-orm` - 53 edges
8. `db` - 51 edges
9. `Footer()` - 49 edges
10. `verifyToken()` - 47 edges

## Surprising Connections (you probably didn't know these)
- ``src/lib/cloudinary.ts`` --references--> `extractPublicIdFromUrl()`  [INFERRED]
  blob/docs/cloudinary/cloudinary-integration.md → src/lib/cloudinary.ts
- `Adding New Tests` --references--> `authFetch()`  [INFERRED]
  blob/docs/testing/docker-test-workflow.md → tests/helpers/testFetch.ts
- `Adding New Tests` --references--> `testFetch()`  [INFERRED]
  blob/docs/testing/docker-test-workflow.md → tests/helpers/testFetch.ts
- ``src/lib/upload.ts`` --references--> `parseFormData()`  [INFERRED]
  blob/docs/cloudinary/cloudinary-integration.md → src/lib/upload.ts
- ``src/lib/upload.ts`` --references--> `validateImageFile()`  [INFERRED]
  blob/docs/cloudinary/cloudinary-integration.md → src/lib/upload.ts

## Import Cycles
- None detected.

## Communities (123 total, 16 thin omitted)

### Community 0 - "envelope.ts"
Cohesion: 0.08
Nodes (43): Adding New Tests, Auto Migration Option, Docker-Based Testing Workflow, Environment Variables, Future Enhancements, Persistence vs Isolation, Safety Mechanisms, Scripts Overview (+35 more)

### Community 1 - "scripts"
Cohesion: 0.03
Nodes (61): scripts, ai:index, build, ci:test, cloudinary:migrate, cloudinary:test, db:clear-photos, db:drop (+53 more)

### Community 2 - "photos/route.ts"
Cohesion: 0.08
Nodes (29): cloudinary, GET(), GET(), POST(), GET(), UsageData, UsageRecommendation, DELETE() (+21 more)

### Community 3 - "kos/[id]/page.tsx"
Cohesion: 0.09
Nodes (33): SellerKosDetailPage(), ErrorStateProps, SellerKosDetailError(), SellerKosDetailLoading(), StatCard(), StatCardProps, valueColorMap, HeaderSection() (+25 more)

### Community 4 - "Header"
Cohesion: 0.14
Nodes (25): next, AdminBookingPage(), CreateUserPage(), EditUserPage(), UserDetailPage(), ComplaintPage(), ContactPage(), FavoritesPage() (+17 more)

### Community 5 - "BookingAdminClient.tsx"
Cohesion: 0.13
Nodes (19): clsx, BookingAdminClient(), SelectOption, SelectProps, BookingStatusDropdown(), BookingStatusDropdownProps, BookingHistoryModal(), BookingHistoryModalProps (+11 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (55): devDependencies, autoprefixer@^10.4.21, dotenv-cli@^8.0.0, eslint@^9, eslint-config-next@15.3.1, eslint-config-prettier@^10.1.2, @eslint/eslintrc@^3, husky@^9.0.0 (+47 more)

### Community 7 - "drizzle-orm"
Cohesion: 0.09
Nodes (39): drizzle-orm, DELETE, DELETE, DELETE, GET, dynamic, updateKosSchema, GET() (+31 more)

### Community 8 - "verifyToken"
Cohesion: 0.12
Nodes (30): bcryptjs, DELETE(), GET(), GET(), BookingDetail, DELETE(), GET(), PUT() (+22 more)

### Community 9 - "view/page.tsx"
Cohesion: 0.06
Nodes (41): KosDetailPage(), Review, FavoriteButton(), FavoriteButtonProps, PriceTag(), PriceTagProps, RatingStars(), RatingStarsProps (+33 more)

### Community 10 - "lib/ai/index.ts"
Cohesion: 0.23
Nodes (12): AIBatchVectorizeResponse, AIErrorResponse, AIServiceError, AIVectorizeResponse, BatchVectorizeResponse, buildHeaders(), fetchWithRetry(), getAIServiceUrl() (+4 more)

### Community 11 - "react"
Cohesion: 0.15
Nodes (22): AdminKosTable(), AdminKosTableProps, KosTable(), KosTableProps, KosTableActions(), KosTableActionsProps, RowActionButtons(), RowActionButtonsProps (+14 more)

### Community 12 - "app"
Cohesion: 0.05
Nodes (45): build, container_name, depends_on, environment, healthcheck, networks, ports, restart (+37 more)

### Community 13 - "📦 Database Design: Kosera Platform"
Cohesion: 0.05
Nodes (41): 1. users, 2. posts, 3. kos, 4. bookings, 5. reviews, 6. images, 7. payments, 8. favorites (+33 more)

### Community 14 - "schema.ts"
Cohesion: 0.08
Nodes (23): Booking, BookingStatusHistory, ChatFeedback, Favorite, Kos, KosPhoto, NewBooking, NewBookingStatusHistory (+15 more)

### Community 15 - "Features"
Cohesion: 0.05
Nodes (40): 10. Future Enhancements, 11. Support and Resources, 1. Enhanced Dashboard (`/admin/cloudinary`), 2. API Endpoints, 3. Optimization Features, 4. Monitoring Capabilities, 5. Database Integration, 6. Configuration (+32 more)

### Community 16 - "renter/bookings/page.tsx"
Cohesion: 0.10
Nodes (23): @tanstack/react-query, BookingItem, BookingsPage(), handleConfirm(), toBookingStatus(), DetailRow(), fetchBooking(), SellerBookingDetailPage() (+15 more)

### Community 17 - "Profile Matching DSS (Decision Support System)"
Cohesion: 0.05
Nodes (40): 1. Price Criteria (Core Factor) - Default Weight: 52%, 1. Price Level, 1. User Preferences Management, 2. Distance Level, 2. Location Criteria (Core Factor) - Default Weight: 27%, 2. Recommendation Engine, 3. Facilities Criteria (Secondary Factor) - Default Weight: 15%, 3. Rating Level (+32 more)

### Community 18 - "KosFormShell.tsx"
Cohesion: 0.05
Nodes (39): FormErrorAlert(), FormErrorAlertProps, KosFormShell(), KosFormShellProps, BasicInfoValues, SectionBasicInfo(), SectionBasicInfoProps, SectionCoordinates() (+31 more)

### Community 19 - "with"
Cohesion: 0.06
Nodes (37): env, name, needs, runs-on, steps, concurrency, cancel-in-progress, group (+29 more)

### Community 20 - "sweetalert.ts"
Cohesion: 0.11
Nodes (27): sweetalert2, handleSubmit(), BookingDetail, BookingDetailApiResponse, BookingDetailPage(), BookingDetailResponse, ErrorResponse, GenericErrorResponse (+19 more)

### Community 21 - "lib/auth.ts"
Cohesion: 0.13
Nodes (21): RFC-4180, loginSchema, POST(), POST(), registerSchema, cleanText(), CsvRow, formatRating() (+13 more)

### Community 22 - "🎯 Kosera API Testing Summary"
Cohesion: 0.06
Nodes (32): 1. **Automated Testing**, 1. **Comprehensive Test Suite Setup**, 1. **Quality Assurance**, 1. **Run Tests Regularly**, 2. **Add More Tests**, 2. **Development Speed**, 2. **Mock System**, 2. **Test Coverage** (+24 more)

### Community 23 - "ai-reindex.test.ts"
Cohesion: 0.11
Nodes (18): PATCH, restoreKosHandler(), PUT, updateKosHandler(), createKosSchema, GET(), parseKosQuery(), POST (+10 more)

### Community 24 - "admin.ts"
Cohesion: 0.09
Nodes (22): UserEditFormProps, UserEditFormValues, AdminUserDetailResponse, AdminUserUpdateResponse, AnalyticsResponse, analyticsResponseSchema, analyticsSchema, BookingsOuterResponse (+14 more)

### Community 25 - "profile-matching.ts"
Cohesion: 0.05
Nodes (68): MatchingResultCard(), MatchingResultCardProps, MatchingScoreBar(), MatchingScoreBarProps, MatchingScoreIndicator(), MatchingScoreIndicatorProps, BudgetSection(), FacilitiesSection() (+60 more)

### Community 26 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, bcryptjs@^3.0.2, cloudinary@^2.7.0, clsx@^2.1.1, drizzle-orm@^0.44.2, jsonwebtoken@^9.0.2, leaflet@^1.9.4, multer@^2.0.2 (+22 more)

### Community 27 - "seller/dashboard/page.tsx"
Cohesion: 0.06
Nodes (32): SellerDashboard(), CardHeaderProps, CardProps, paddingMap, InputProps, EmptyState(), EmptyStateProps, EmptyStateVariant (+24 more)

### Community 28 - "seller/kos/page.tsx"
Cohesion: 0.15
Nodes (16): SellerKosPage(), SellerKosListError(), SellerKosListLoading(), KosGrid(), KosGridProps, KosTips(), Tip(), StatsRow() (+8 more)

### Community 29 - "types/kos.ts"
Cohesion: 0.10
Nodes (24): UseKosDetailViewResult, BookingData, ErrorResponse, FormErrors, PaginatedResponse, FavoriteKos, FavoritesResponse, AdminKosApiResponse (+16 more)

### Community 30 - "AuthContext.tsx"
Cohesion: 0.21
Nodes (16): ArrowRightIcon(), CalendarIcon(), getRoleBadgeColor(), getRoleDisplayName(), HeartIcon(), LockIcon(), LogoutIcon(), ProfileMenuItem (+8 more)

### Community 31 - "Providers.tsx"
Cohesion: 0.09
Nodes (32): geistMono, geistSans, metadata, RootLayout(), ChatMarkdown, ChatMarkdownProps, renderInline(), sanitizeStreamingMarkdown() (+24 more)

### Community 32 - "chat.ts"
Cohesion: 0.12
Nodes (32): chatRequestSchema, dynamic, getToolStatusMessage(), maxDuration, runAgenticChat(), UiChatMessage, buildLLMHeaders(), checkLLMHealth() (+24 more)

### Community 34 - "api.ts"
Cohesion: 0.09
Nodes (23): zod, FeaturedKos, FeaturedOwner, GET(), querySchema, GET(), querySchema, RecommendationItem (+15 more)

### Community 35 - "app.py"
Cohesion: 0.14
Nodes (8): _apply_prefix(), health(), _is_e5_model(), lifespan(), vectorize(), vectorize_batch(), VectorizeBatchRequest, VectorizeRequest

### Community 36 - "Cloudinary Integration Guide"
Cohesion: 0.09
Nodes (22): 1. Create Cloudinary Account, 2. Configure Environment Variables, 3. Database Migration, API Changes, Cloudinary Integration Guide, Common Issues, Debug Mode, Delete Endpoint: `DELETE /api/kos/[id]/photos` (+14 more)

### Community 37 - "lib/ai/index.ts"
Cohesion: 0.16
Nodes (13): KOSERA_TOOL_SCHEMAS, LLMProviderType, RemoteLLMEvent, getHybridRecommendations(), computeHybridScore(), normalizeHybridWeights(), normalizeProfileMatchingScore(), normalizeSemanticScore() (+5 more)

### Community 38 - "types/index.ts"
Cohesion: 0.22
Nodes (16): DaftarKosPage(), extractFeaturedItems(), HomePage(), RecommendationCarousel(), MapSection(), UnifiedKosCard(), FeaturedList(), FeaturedListProps (+8 more)

### Community 39 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 40 - "useApi.ts"
Cohesion: 0.17
Nodes (13): UnifiedKosCardProps, UnifiedKosSpkDetails, useKosImages(), KosPhoto, useKosDetailView(), useAddFavorite(), useHomepageData(), useKosDetails() (+5 more)

### Community 41 - "admin/bookings/route.ts"
Cohesion: 0.15
Nodes (18): GET(), PATCH(), updateBookingStatusSchema, BookingItem, BookingKos, BookingsListData, BookingUser, GET() (+10 more)

### Community 42 - "Deployment Guide: Vercel & HuggingFace Spaces"
Cohesion: 0.12
Nodes (16): 2. Next.js Deployment (Vercel), 3. Cross-Origin Resource Sharing (CORS) Protocol, 4. Vector Database Provisioning (pgvector), 504 Gateway Timeout on Vercel, 5. End-to-End Integration Testing, 6. System Troubleshooting, Deployment Guide: Vercel & HuggingFace Spaces, Direct AI Service Validation (+8 more)

### Community 43 - "dotenv"
Cohesion: 0.20
Nodes (7): dotenv@^16.5.0, drizzle-kit@^0.31.4, dotenv, drizzle-kit, envLocalPath, candidates, required

### Community 44 - "users/page.tsx"
Cohesion: 0.14
Nodes (14): react, AdminUsersPage(), StatusBadgeProps, UsersFiltersBar(), UsersFiltersBarProps, UsersPagination(), UsersPaginationProps, UsersEmptyState() (+6 more)

### Community 45 - "api/bookings/route.ts"
Cohesion: 0.24
Nodes (10): BookingFilters, createBookingSchema, GET, parseFilters(), POST, GET(), buildPaginationMeta(), BuildPaginationMetaArgs (+2 more)

### Community 46 - "design-playground/page.tsx"
Cohesion: 0.12
Nodes (30): DesignPlaygroundPage(), CompareKosItem, FloatingCompareDock(), FloatingCompareDockProps, BUDGET_PRESETS, DISTRICTS, MorphingSearchBar(), MorphingSearchBarProps (+22 more)

### Community 47 - "renter/bookings/page.tsx"
Cohesion: 0.16
Nodes (17): RenterBookingsPage(), RenterBookingsPageInner(), STATUS_VALUES, SellerBookingsPage(), SellerBookingsPageInner(), STATUS_VALUES, InputField(), InputFieldProps (+9 more)

### Community 48 - "Docker Setup Guide for Kosera API"
Cohesion: 0.13
Nodes (14): Available Docker Commands, Database Operations, Development Commands, Development Environment, Docker Architecture, Docker Setup Guide for Kosera API, Health Checks, Networks (+6 more)

### Community 49 - "Dual Environment Setup Guide"
Cohesion: 0.11
Nodes (18): 1. Local Development: `.env.local`, 2. Docker Environment: `.env.docker` (copied to `.env` for Compose), 3. Production Database Scripts: `.env.production`, Command Line Interface (CLI) Directives, Deterministic Environment Detection, Docker Environment Commands, Docker Environment Setup, Docker Validation (+10 more)

### Community 50 - "fail"
Cohesion: 0.07
Nodes (44): GET, bulkArchiveHandler(), bulkPermanentDeleteHandler(), DELETE, POST, bulkCleanupHandler(), permanentDeleteKosHandler(), deleteKosHandler() (+36 more)

### Community 51 - "useSemanticSearch.ts"
Cohesion: 0.33
Nodes (7): swr@^2.3.4, swr, SemanticSearchFilters, SemanticSearchResponse, SemanticSearchResult, useAIServiceStatus(), useSemanticSearch()

### Community 52 - "UserDetailCard.tsx"
Cohesion: 0.22
Nodes (13): AvatarCircle(), AvatarCircleProps, UserActionButtons(), UserActionButtonsProps, UserRoleDescription(), UserRoleDescriptionProps, formatDate(), UserDetailCard() (+5 more)

### Community 53 - "AuthContext.tsx"
Cohesion: 0.15
Nodes (14): PhotoUploadForm(), PhotoUploadFormProps, AuthContext, AuthContextType, useAuth(), User, userPayloadSchema, VerifyResponse (+6 more)

### Community 54 - "Types Structure"
Cohesion: 0.12
Nodes (18): SweetAlertResult, Benefits, `booking.ts`, `common.ts`, File Structure, Files Overview, Import from main index (recommended), Import from specific modules (+10 more)

### Community 55 - "README.md"
Cohesion: 0.15
Nodes (13): 1. Environment Initialization, 2. Build & Deploy Containers, 3. Schema Migration & Vector Seeding, Core Architecture & Hybrid Recommendation Engine, Core Logic & API, Documentation Modules, Infrastructure & Deployment, Intelligent Hybrid Recommendation (+5 more)

### Community 56 - "Implementation Details"
Cohesion: 0.15
Nodes (12): Benefits over Tremor, Chart.js Configuration, Chart.js Integration for Admin Dashboard, Component: VisualizationPanel.tsx, Current Status, Data Structure, Dependencies Added, Implementation Details (+4 more)

### Community 57 - "app"
Cohesion: 0.15
Nodes (13): condition, command, container_name, depends_on, environment, networks, ports, restart (+5 more)

### Community 58 - "UserRoleStatusSection.tsx"
Cohesion: 0.26
Nodes (8): InfoLabelValue(), InfoLabelValueProps, UserRoleBadge(), UserRoleBadgeProps, UserBasicInfoSection(), UserBasicInfoSectionProps, UserRoleStatusSection(), UserRoleStatusSectionProps

### Community 59 - "admin/dashboard/page.tsx"
Cohesion: 0.16
Nodes (14): AdminDashboard(), StatCard(), StatCardProps, ActivityItem(), ActivityItemData, ActivityItemProps, defaultActions, QuickAction (+6 more)

### Community 60 - "upload/route.ts"
Cohesion: 0.33
Nodes (7): `src/lib/upload.ts`, POST(), uploadToCloudinary(), MulterFile, parseFormData(), upload, validateImageFile()

### Community 61 - "ai/route.ts"
Cohesion: 0.18
Nodes (15): main(), AIStatusData, GET, getAIStatusHandler(), IndexingResultData, POST, triggerIndexingHandler(), dynamic (+7 more)

### Community 62 - "dashboard.ts"
Cohesion: 0.18
Nodes (11): sellerApi, SellerDashboardKosItem, SellerDashboardKosItemParsed, sellerDashboardKosItemSchema, SellerDashboardKosStatistics, sellerDashboardKosStatisticsSchema, SellerDashboardResponseData, sellerDashboardResponseSchema (+3 more)

### Community 63 - "db"
Cohesion: 0.17
Nodes (11): container_name, image, networks, ports, restart, volumes, driver, networks (+3 more)

### Community 64 - "ai-service"
Cohesion: 0.18
Nodes (12): build, container_name, environment, networks, ports, restart, volumes, build (+4 more)

### Community 65 - "pgadmin"
Cohesion: 0.17
Nodes (12): PGADMIN_CONFIG_SERVER_MODE, PGADMIN_DEFAULT_EMAIL, PGADMIN_DEFAULT_PASSWORD, container_name, depends_on, environment, image, networks (+4 more)

### Community 66 - "feedback/route.ts"
Cohesion: 0.17
Nodes (11): chatFeedbackSchema, computeAnonymizedSessionHash(), dynamic, isRateLimited(), POST(), rateLimitBuckets, resetFeedbackRateLimiter(), chatFeedback (+3 more)

### Community 67 - "migrate-to-cloudinary.js"
Cohesion: 0.06
Nodes (41): compat, __dirname, eslintConfig, __filename, postgres@^3.4.7, postgres, db, __dirname (+33 more)

### Community 68 - "API Response Standard"
Cohesion: 0.13
Nodes (11): API Response Standard, Core Principles, Envelope Structure, Examples, Future Enhancements (TODO), Helper Functions, HTTP Status Guidelines, Implementation Checklist Per Endpoint (+3 more)

### Community 69 - "Neon Test Database Setup"
Cohesion: 0.18
Nodes (10): Branching (Planned), Common Issues, Connection Pooling, Environment Variables, Migrations, Neon Test Database Setup, Purpose, Reset Strategy (+2 more)

### Community 70 - "copilot-instructions.md"
Cohesion: 0.18
Nodes (10): Code Style: ## Write clean, readable, and maintainable code. Add JSDoc comments for complex functions to explain their purpose, parameters, and return values., Commit Messages:, Components:, Documentation:, Framework:, Language:, LEAST BUT important:, NPM: (+2 more)

### Community 71 - "useAdminDashboard.ts"
Cohesion: 0.28
Nodes (8): DashboardStats, getRelativeTime(), getTimeFromRelative(), RecentActivity, useAdminDashboard(), AnalyticsData, BookingsData, UsersData

### Community 72 - "middleware.ts"
Cohesion: 0.08
Nodes (27): PATCH(), RouteContext, toggleFeaturedHandler(), BasicUser, createUserHandler(), createUserSchema, GET, getAllUsersHandler() (+19 more)

### Community 73 - "login/page.tsx"
Cohesion: 0.09
Nodes (27): DEMO_ACCOUNTS, FormErrors, FormState, LoginPage(), LoginPageInner(), PasswordInput(), PasswordInputProps, SubmitButton() (+19 more)

### Community 74 - "UsersTable.tsx"
Cohesion: 0.23
Nodes (9): ActionIconButton(), ActionIconButtonProps, variants, Checkbox(), CheckboxProps, colors, UserRolePill(), UserRolePillProps (+1 more)

### Community 75 - "booking.ts"
Cohesion: 0.12
Nodes (14): bookingsApi, CreateBookingData, GetBookingsParams, UpdateBookingData, BookingAdminClientProps, BookingApiResponse, BookingDetailData, BookingDetailKos (+6 more)

### Community 76 - "Continuous Integration Workflow"
Cohesion: 0.20
Nodes (9): Adding New Test Suites, Caching, Continuous Integration Workflow, Database Strategy, Environment Variables, Future Enhancements, Job Structure, Overview (+1 more)

### Community 77 - "useAdminUsersList.ts"
Cohesion: 0.40
Nodes (5): UsersTableProps, UseAdminUsersListParams, UseAdminUsersListResult, AdminUserListItem, AdminUserListResponse

### Community 78 - "api/client.ts"
Cohesion: 0.16
Nodes (15): AdminBookingResponse, adminBookingsApi, authApi, LoginCredentials, RegisterData, apiClient, ApiClientConfig, RequestOptions (+7 more)

### Community 79 - "semanticSearch"
Cohesion: 1.00
Nodes (3): buildFilterConditions(), fallbackTextSearch(), semanticSearch()

### Community 80 - "volumes"
Cohesion: 0.22
Nodes (9): driver, driver, driver, driver, volumes, hf_cache, pgadmin_data, postgres_data (+1 more)

### Community 82 - "api-response.ts"
Cohesion: 0.32
Nodes (7): ApiError, ApiResponse, ApiSuccess, buildHeaders(), json(), JsonInit, jsonSuccess()

### Community 83 - "healthcheck"
Cohesion: 0.46
Nodes (8): healthcheck, healthcheck, healthcheck, interval, retries, start_period, test, timeout

### Community 84 - "db_test"
Cohesion: 0.25
Nodes (8): container_name, image, networks, ports, profiles, restart, volumes, db_test

### Community 85 - "RealMap.tsx"
Cohesion: 0.23
Nodes (12): LeafletMap, MapSectionProps, SEMARANG_FALLBACK_CENTER, createFallbackCenterIcon(), createPricePinIcon(), isValidCoordinate(), MapCenterController(), MapKosMarkerItem (+4 more)

### Community 86 - "recommendations/page.tsx"
Cohesion: 0.13
Nodes (15): MIN_SCORE_PILLS, RecommendationsPage(), FeaturedCard(), FeaturedCardProps, defaultOptions, GeolocationError, GeolocationState, useGeolocation() (+7 more)

### Community 87 - "api/kos.ts"
Cohesion: 0.20
Nodes (8): createKosRequestSchema, CreateKosResponse, createKosResponseSchema, kosApi, createAuthHeaders(), getAuthToken(), KosSearchApiResponse, SearchParams

### Community 91 - "Platform Options"
Cohesion: 0.33
Nodes (6): 1. Vercel (Recommended), 2. Railway, 3. Digital Ocean App Platform, 4. AWS (Advanced), Platform Options, Production Deployment

### Community 92 - "environment"
Cohesion: 0.53
Nodes (6): environment, environment, PGDATA, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER

### Community 96 - "PlatformOverviewPanel.tsx"
Cohesion: 0.24
Nodes (8): chart.js@^4.5.0, react-chartjs-2@^5.3.0, chart.js, react-chartjs-2, PlatformOverviewPanel(), PlatformOverviewPanelProps, UserCompositionChart(), UserCompositionData

### Community 97 - "🚀 Kosera Deployment Guide"
Cohesion: 0.40
Nodes (4): CI/CD Pipeline, GitHub Actions, 🚀 Kosera Deployment Guide, Overview

### Community 98 - "Local Development Setup"
Cohesion: 0.40
Nodes (5): 1. Clone and Install, 2. Environment Setup, 3. Database Setup, 4. Start Development Server, Local Development Setup

### Community 100 - "Button.tsx"
Cohesion: 0.29
Nodes (6): Button(), ButtonProps, ButtonSize, ButtonVariant, sizeClasses, variantClasses

### Community 101 - "Monitoring and Logging"
Cohesion: 0.50
Nodes (4): 1. Application Monitoring, 2. Health Checks, 3. Error Tracking, Monitoring and Logging

### Community 102 - "Performance Optimization"
Cohesion: 0.50
Nodes (4): 1. Database Optimization, 2. Caching Strategy, 3. Build Optimization, Performance Optimization

### Community 103 - "Database Deployment"
Cohesion: 0.50
Nodes (4): 1. Managed PostgreSQL (Recommended), 2. Self-Managed PostgreSQL, 3. Database Migrations, Database Deployment

### Community 104 - "Security Configuration"
Cohesion: 0.50
Nodes (4): 1. SSL/TLS Setup, 2. Security Headers, 3. Rate Limiting, Security Configuration

### Community 106 - "admin/kos/page.tsx"
Cohesion: 0.26
Nodes (7): AdminKosPage(), AdminKosFilter(), AdminKosFilterProps, AdminKosHeader(), AdminKosHeaderProps, useSearchDebounce(), AdminKosFilters

### Community 109 - "Backup and Recovery"
Cohesion: 0.67
Nodes (3): 1. Database Backups, 2. Application Backups, Backup and Recovery

### Community 110 - "Scaling Considerations"
Cohesion: 0.67
Nodes (3): 1. Horizontal Scaling, 2. Load Balancing, Scaling Considerations

### Community 111 - "Troubleshooting"
Cohesion: 0.67
Nodes (3): Common Issues, Debug Mode, Troubleshooting

### Community 112 - "Environment Configuration"
Cohesion: 0.67
Nodes (3): Configuration Validation, Environment Configuration, Environment Files

### Community 113 - "Security Checklist"
Cohesion: 0.67
Nodes (3): Infrastructure Security, Production Security, Security Checklist

### Community 114 - "Prerequisites"
Cohesion: 0.67
Nodes (3): Prerequisites, Required Environment Variables, System Requirements

### Community 115 - "react"
Cohesion: 0.28
Nodes (4): adminApi, favoritesApi, api, userApi

### Community 120 - "Features"
Cohesion: 0.50
Nodes (4): 1. Image Upload, 2. Image Management, 3. Image Optimization, Features

### Community 121 - "1. AI Service Deployment (HuggingFace Spaces)"
Cohesion: 0.50
Nodes (4): 1. AI Service Deployment (HuggingFace Spaces), Step 1: Repository Initialization, Step 2: Codebase Injection, Step 3: Deployment Verification

### Community 126 - "Monitoring and Limits"
Cohesion: 0.67
Nodes (3): Free Tier Limits (Cloudinary), Monitoring and Limits, Recommendations

## Knowledge Gaps
- **1 isolated node(s):** `RFC-4180`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1021 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `users/page.tsx` to `kos/[id]/page.tsx`, `Header`, `BookingAdminClient.tsx`, `package.json`, `view/page.tsx`, `react`, `renter/bookings/page.tsx`, `KosFormShell.tsx`, `sweetalert.ts`, `admin.ts`, `profile-matching.ts`, `dependencies`, `seller/dashboard/page.tsx`, `seller/kos/page.tsx`, `AuthContext.tsx`, `Providers.tsx`, `types/index.ts`, `useApi.ts`, `design-playground/page.tsx`, `renter/bookings/page.tsx`, `useSemanticSearch.ts`, `UserDetailCard.tsx`, `AuthContext.tsx`, `UserRoleStatusSection.tsx`, `admin/dashboard/page.tsx`, `useAdminDashboard.ts`, `login/page.tsx`, `UsersTable.tsx`, `useAdminUsersList.ts`, `api/client.ts`, `RealMap.tsx`, `recommendations/page.tsx`, `PlatformOverviewPanel.tsx`, `Button.tsx`, `admin/kos/page.tsx`, `react`?**
  _High betweenness centrality (0.207) - this node is a cross-community bridge._
- **What connects `RFC-4180` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `envelope.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0768361581920904 - nodes in this community are weakly interconnected._
- **Why does `zod` connect `api.ts` to `photos/route.ts`, `kos/[id]/page.tsx`, `package.json`, `drizzle-orm`, `verifyToken`, `sweetalert.ts`, `lib/auth.ts`, `ai-reindex.test.ts`, `admin.ts`, `profile-matching.ts`, `dependencies`, `seller/kos/page.tsx`, `types/kos.ts`, `chat.ts`, `admin/bookings/route.ts`, `api/bookings/route.ts`, `fail`, `AuthContext.tsx`, `dashboard.ts`, `feedback/route.ts`, `middleware.ts`, `login/page.tsx`, `api/client.ts`, `api/kos.ts`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.03278688524590164 - nodes in this community are weakly interconnected._
- **Why does `Cloudinary Integration Guide` connect `Cloudinary Integration Guide` to `Features`, `API Response Standard`, `Monitoring and Limits`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Should `photos/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08076923076923077 - nodes in this community are weakly interconnected._