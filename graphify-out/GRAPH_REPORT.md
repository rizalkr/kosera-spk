# Graph Report - kosera-spk  (2026-11-19)

## Corpus Check
- 406 files · ~176,003 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 6, .example 1, .conf 1)

## Summary
- 2416 nodes · 5534 edges · 133 communities (117 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c060f1dd`
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
- fail
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
- seed-mamikos.ts
- 🎯 Kosera API Testing Summary
- useApi.ts
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
- scoring.ts
- app.py
- Cloudinary Integration Guide
- lib/ai/index.ts
- types/index.ts
- compilerOptions
- UserDetailCard.tsx
- admin/bookings/route.ts
- Deployment Guide: Vercel & HuggingFace Spaces
- dotenv
- users/page.tsx
- api/bookings/route.ts
- design-playground/page.tsx
- clsx
- Docker Setup Guide for Kosera API
- Dual Environment Setup Guide
- middleware.ts
- useSemanticSearch.ts
- ProductionMorphingSearchBar.tsx
- api.ts
- Types Structure
- README.md
- Implementation Details
- app
- migrate-to-cloudinary.js
- admin/dashboard/page.tsx
- ProtectedRoute
- ai/route.ts
- types/index.ts
- db
- ai-service
- pgadmin
- ai-chat.test.ts
- SidebarPanel.tsx
- API Response Standard
- Neon Test Database Setup
- copilot-instructions.md
- UnifiedKosCard.tsx
- users/[id]/route.ts
- login/page.tsx
- UsersTable.tsx
- UserRoleStatusSection.tsx
- Continuous Integration Workflow
- AdminUser
- RecentActivityPanel.tsx
- PlatformOverviewPanel.tsx
- volumes
- search.ts
- api-response.ts
- healthcheck
- db_test
- api/kos.ts
- RealMap.tsx
- lib/auth.ts
- RecentActivitiesPanel.tsx
- icons.ts
- EmptyState.tsx
- Platform Options
- environment
- RatingStars.tsx
- organisms/HeaderSection.tsx
- useAdminDashboard.ts
- recommendations/page.tsx
- 🚀 Kosera Deployment Guide
- Local Development Setup
- kecamatan.ts
- Button.tsx
- Monitoring and Logging
- Performance Optimization
- Database Deployment
- Security Configuration
- admin/kos/page.tsx
- KosCard.tsx
- OverviewStatsPanel.tsx
- SearchModeToggle.tsx
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
- useImageWithFallback.ts
- Features
- 1. AI Service Deployment (HuggingFace Spaces)
- postcss.config.mjs
- Monitoring and Limits
- autoprefixer@^10.4.21
- dotenv-cli@^8.0.0
- eslint@^9
- node-mocks-http@^1.17.2
- @testing-library/react@^16.3.0
- @vitest/ui@^3.2.4

## God Nodes (most connected - your core abstractions)
1. `react` - 163 edges
2. `fail()` - 121 edges
3. `ok()` - 121 edges
4. `next` - 62 edges
5. `scripts` - 61 edges
6. `Header()` - 53 edges
7. `drizzle-orm` - 53 edges
8. `db` - 50 edges
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

## Communities (133 total, 16 thin omitted)

### Community 0 - "envelope.ts"
Cohesion: 0.09
Nodes (40): Adding New Tests, Auto Migration Option, Docker-Based Testing Workflow, Environment Variables, Future Enhancements, Persistence vs Isolation, Safety Mechanisms, Scripts Overview (+32 more)

### Community 1 - "scripts"
Cohesion: 0.03
Nodes (61): scripts, ai:index, build, ci:test, cloudinary:migrate, cloudinary:test, db:clear-photos, db:drop (+53 more)

### Community 2 - "photos/route.ts"
Cohesion: 0.08
Nodes (23): cloudinary@^2.7.0, cloudinary, GET(), POST(), UsageData, UsageRecommendation, ImageTransformations, ResponsiveImageSets (+15 more)

### Community 3 - "kos/[id]/page.tsx"
Cohesion: 0.07
Nodes (42): SellerKosDetailPage(), ErrorStateProps, SellerKosDetailError(), SellerKosDetailLoading(), StatCard(), StatCardProps, valueColorMap, HeaderSection() (+34 more)

### Community 4 - "Header"
Cohesion: 0.16
Nodes (19): nextConfig, next, EditUserPage(), UserDetailPage(), ComplaintPage(), ContactPage(), PreferencesPage(), SellerLayout() (+11 more)

### Community 5 - "BookingAdminClient.tsx"
Cohesion: 0.09
Nodes (32): clsx, BookingAdminClient(), BookingStatusDropdown(), BookingStatusDropdownProps, BookingHistoryModal(), BookingHistoryModalProps, statusBadge(), useAdminBooking() (+24 more)

### Community 6 - "package.json"
Cohesion: 0.06
Nodes (51): devDependencies, eslint-config-next@15.3.1, eslint-config-prettier@^10.1.2, @eslint/eslintrc@^3, husky@^9.0.0, jsdom@^26.1.0, postcss@^8.5.3, prettier@^3.5.3 (+43 more)

### Community 7 - "drizzle-orm"
Cohesion: 0.07
Nodes (50): drizzle-orm, zod, DELETE, PATCH(), RouteContext, toggleFeaturedHandler(), DELETE, permanentDeleteKosHandler() (+42 more)

### Community 8 - "fail"
Cohesion: 0.10
Nodes (52): GET(), DELETE(), GET(), GET(), bulkCleanupHandler(), restoreKosHandler(), deleteKosHandler(), getAdminKosHandler() (+44 more)

### Community 9 - "view/page.tsx"
Cohesion: 0.14
Nodes (18): KosDetailPage(), Review, Breadcrumbs(), BreadcrumbsProps, FacilitiesList(), FacilitiesListProps, ImageGallery(), ImageGalleryProps (+10 more)

### Community 10 - "lib/ai/index.ts"
Cohesion: 0.23
Nodes (12): AIBatchVectorizeResponse, AIErrorResponse, AIServiceError, AIVectorizeResponse, BatchVectorizeResponse, buildHeaders(), fetchWithRetry(), getAIServiceUrl() (+4 more)

### Community 11 - "react"
Cohesion: 0.15
Nodes (23): Button(), AdminKosTable(), AdminKosTableProps, KosTable(), KosTableProps, KosTableActions(), KosTableActionsProps, RowActionButtons() (+15 more)

### Community 12 - "app"
Cohesion: 0.05
Nodes (45): build, container_name, depends_on, environment, healthcheck, networks, ports, restart (+37 more)

### Community 13 - "📦 Database Design: Kosera Platform"
Cohesion: 0.05
Nodes (41): 1. users, 2. posts, 3. kos, 4. bookings, 5. reviews, 6. images, 7. payments, 8. favorites (+33 more)

### Community 14 - "schema.ts"
Cohesion: 0.08
Nodes (25): Booking, BookingStatusHistory, Favorite, Kos, KosPhoto, kosPhotos, NewBooking, NewBookingStatusHistory (+17 more)

### Community 15 - "Features"
Cohesion: 0.05
Nodes (40): 10. Future Enhancements, 11. Support and Resources, 1. Enhanced Dashboard (`/admin/cloudinary`), 2. API Endpoints, 3. Optimization Features, 4. Monitoring Capabilities, 5. Database Integration, 6. Configuration (+32 more)

### Community 16 - "renter/bookings/page.tsx"
Cohesion: 0.10
Nodes (30): BookingItem, BookingsPage(), handleConfirm(), toBookingStatus(), handleSubmit(), BookingDetailPage(), RenterBookingsPage(), RenterBookingsPageInner() (+22 more)

### Community 17 - "Profile Matching DSS (Decision Support System)"
Cohesion: 0.05
Nodes (40): 1. Price Criteria (Core Factor) - Default Weight: 52%, 1. Price Level, 1. User Preferences Management, 2. Distance Level, 2. Location Criteria (Core Factor) - Default Weight: 27%, 2. Recommendation Engine, 3. Facilities Criteria (Secondary Factor) - Default Weight: 15%, 3. Rating Level (+32 more)

### Community 18 - "KosFormShell.tsx"
Cohesion: 0.13
Nodes (19): FormErrorAlert(), FormErrorAlertProps, KosFormShell(), KosFormShellProps, BasicInfoValues, SectionBasicInfo(), SectionBasicInfoProps, SectionCoordinates() (+11 more)

### Community 19 - "with"
Cohesion: 0.06
Nodes (37): env, name, needs, runs-on, steps, concurrency, cancel-in-progress, group (+29 more)

### Community 20 - "sweetalert.ts"
Cohesion: 0.14
Nodes (16): sweetalert2, EditKosPage(), GenericErrorResponse, GenericOkResponse, PhotosApiResponse, PhotosListResponse, SellerKosPhotosPage(), useCreateKosForm() (+8 more)

### Community 21 - "seed-mamikos.ts"
Cohesion: 0.27
Nodes (11): RFC-4180, cleanText(), CsvRow, formatRating(), mapGender(), NEEDED_COLUMNS, normalizeMonthlyPrice(), parseCsvFile() (+3 more)

### Community 22 - "🎯 Kosera API Testing Summary"
Cohesion: 0.06
Nodes (32): 1. **Automated Testing**, 1. **Comprehensive Test Suite Setup**, 1. **Quality Assurance**, 1. **Run Tests Regularly**, 2. **Add More Tests**, 2. **Development Speed**, 2. **Mock System**, 2. **Test Coverage** (+24 more)

### Community 23 - "useApi.ts"
Cohesion: 0.10
Nodes (18): @tanstack/react-query, useKosImage(), useKosImages(), useHomepageData(), useKosPhotos(), useKosRecommendations(), bookingsApi, CreateBookingData (+10 more)

### Community 24 - "admin.ts"
Cohesion: 0.11
Nodes (18): AnalyticsResponse, analyticsResponseSchema, analyticsSchema, BookingsOuterResponse, bookingsOuterResponseSchema, bookingsResponseSchema, CreateUserRequest, CreateUserResponse (+10 more)

### Community 25 - "profile-matching.ts"
Cohesion: 0.06
Nodes (51): MatchingResultCard(), MatchingResultCardProps, MatchingScoreBar(), MatchingScoreBarProps, MatchingScoreIndicator(), MatchingScoreIndicatorProps, BudgetSection(), FacilitiesSection() (+43 more)

### Community 26 - "dependencies"
Cohesion: 0.07
Nodes (29): dependencies, bcryptjs@^3.0.2, clsx@^2.1.1, drizzle-orm@^0.44.2, jsonwebtoken@^9.0.2, leaflet@^1.9.4, multer@^2.0.2, next@^15.3.6 (+21 more)

### Community 27 - "seller/dashboard/page.tsx"
Cohesion: 0.26
Nodes (8): SellerDashboard(), EmptyState(), QuickActionsPanel(), QuickActionsPanelProps, TipsInsightsPanel(), TipsInsightsPanelProps, TipsInsightsStats, useSellerDashboard()

### Community 28 - "seller/kos/page.tsx"
Cohesion: 0.15
Nodes (16): SellerKosPage(), SellerKosListError(), SellerKosListLoading(), KosGrid(), KosGridProps, KosTips(), Tip(), StatsRow() (+8 more)

### Community 29 - "types/kos.ts"
Cohesion: 0.07
Nodes (34): BookingModalProps, UseKosDetailViewResult, AppError, ErrorResponse, FormErrors, PaginatedResponse, SweetAlertResult, FavoriteKos (+26 more)

### Community 30 - "AuthContext.tsx"
Cohesion: 0.12
Nodes (23): ArrowRightIcon(), CalendarIcon(), getRoleBadgeColor(), getRoleDisplayName(), HeartIcon(), LockIcon(), LogoutIcon(), ProfileMenuItem (+15 more)

### Community 31 - "Providers.tsx"
Cohesion: 0.11
Nodes (24): @tanstack/react-query-devtools@^5.81.5, @tanstack/react-query-devtools, geistMono, geistSans, metadata, RootLayout(), KoseraChatWidget(), EXCLUDED_PREFIXES (+16 more)

### Community 32 - "chat.ts"
Cohesion: 0.11
Nodes (31): chatRequestSchema, dynamic, getToolStatusMessage(), maxDuration, runAgenticChat(), ChatMessageRow, ChatMessageRowProps, EXCLUDED_PREFIXES (+23 more)

### Community 34 - "scoring.ts"
Cohesion: 0.15
Nodes (29): userPreferences, HybridRecommendationOptions, HybridRecommendationResponse, getKosMatchingScore(), parseJsonArray(), ProfileMatchingOptions, calculateDistance(), calculateFacilitiesScore() (+21 more)

### Community 35 - "app.py"
Cohesion: 0.14
Nodes (8): _apply_prefix(), health(), _is_e5_model(), lifespan(), vectorize(), vectorize_batch(), VectorizeBatchRequest, VectorizeRequest

### Community 36 - "Cloudinary Integration Guide"
Cohesion: 0.09
Nodes (22): 1. Create Cloudinary Account, 2. Configure Environment Variables, 3. Database Migration, API Changes, Cloudinary Integration Guide, Common Issues, Debug Mode, Delete Endpoint: `DELETE /api/kos/[id]/photos` (+14 more)

### Community 37 - "lib/ai/index.ts"
Cohesion: 0.20
Nodes (10): RemoteLLMEvent, getHybridRecommendations(), computeHybridScore(), normalizeHybridWeights(), normalizeProfileMatchingScore(), normalizeSemanticScore(), PM_RAW_SCORE_MAX, toUnitScore() (+2 more)

### Community 38 - "types/index.ts"
Cohesion: 0.26
Nodes (12): DaftarKosPage(), extractFeaturedItems(), HomePage(), RecommendationCarousel(), FeaturedList(), FeaturedListProps, KosList(), KosListProps (+4 more)

### Community 39 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 40 - "UserDetailCard.tsx"
Cohesion: 0.26
Nodes (9): AvatarCircle(), AvatarCircleProps, UserActionButtons(), UserRoleDescription(), formatDate(), UserDetailCard(), UserDetailCardProps, UserDetailHeader() (+1 more)

### Community 41 - "admin/bookings/route.ts"
Cohesion: 0.15
Nodes (18): GET(), PATCH(), updateBookingStatusSchema, BookingItem, BookingKos, BookingsListData, BookingUser, GET() (+10 more)

### Community 42 - "Deployment Guide: Vercel & HuggingFace Spaces"
Cohesion: 0.12
Nodes (16): 2. Next.js Deployment (Vercel), 3. Cross-Origin Resource Sharing (CORS) Protocol, 4. Vector Database Provisioning (pgvector), 504 Gateway Timeout on Vercel, 5. End-to-End Integration Testing, 6. System Troubleshooting, Deployment Guide: Vercel & HuggingFace Spaces, Direct AI Service Validation (+8 more)

### Community 43 - "dotenv"
Cohesion: 0.13
Nodes (10): dotenv@^16.5.0, drizzle-kit@^0.31.4, dotenv, drizzle-kit, envLocalPath, assertTestDatabase(), closeDatabase(), resetDatabase() (+2 more)

### Community 44 - "users/page.tsx"
Cohesion: 0.19
Nodes (12): AdminUsersPage(), UsersFiltersBar(), UsersFiltersBarProps, UsersPagination(), UsersPaginationProps, UsersTable(), UsersEmptyState(), UsersEmptyStateProps (+4 more)

### Community 45 - "api/bookings/route.ts"
Cohesion: 0.25
Nodes (8): BookingFilters, createBookingSchema, GET, parseFilters(), POST, buildPaginationMeta(), BuildPaginationMetaArgs, ParsedPaginationQuery

### Community 46 - "design-playground/page.tsx"
Cohesion: 0.12
Nodes (30): DesignPlaygroundPage(), CompareKosItem, FloatingCompareDock(), FloatingCompareDockProps, BUDGET_PRESETS, DISTRICTS, MorphingSearchBar(), MorphingSearchBarProps (+22 more)

### Community 47 - "clsx"
Cohesion: 0.12
Nodes (6): CardHeaderProps, CardProps, paddingMap, InputProps, SelectOption, SelectProps

### Community 48 - "Docker Setup Guide for Kosera API"
Cohesion: 0.13
Nodes (14): Available Docker Commands, Database Operations, Development Commands, Development Environment, Docker Architecture, Docker Setup Guide for Kosera API, Health Checks, Networks (+6 more)

### Community 49 - "Dual Environment Setup Guide"
Cohesion: 0.11
Nodes (18): 1. Local Development: `.env.local`, 2. Docker Environment: `.env.docker` (copied to `.env` for Compose), 3. Production Database Scripts: `.env.production`, Command Line Interface (CLI) Directives, Deterministic Environment Detection, Docker Environment Commands, Docker Environment Setup, Docker Validation (+10 more)

### Community 50 - "middleware.ts"
Cohesion: 0.08
Nodes (29): GET, bulkArchiveHandler(), bulkPermanentDeleteHandler(), DELETE, POST, GET, hybridRecommendationSchema, hybridRecommendationsGetHandler() (+21 more)

### Community 51 - "useSemanticSearch.ts"
Cohesion: 0.48
Nodes (5): SemanticSearchFilters, SemanticSearchResponse, SemanticSearchResult, useAIServiceStatus(), useSemanticSearch()

### Community 52 - "ProductionMorphingSearchBar.tsx"
Cohesion: 0.14
Nodes (16): AdminKosFilterProps, FilterBar(), FilterBarProps, BUDGET_CAP_PRESETS, ProductionMorphingSearchBarProps, SEMANTIC_VIBE_PRESETS, SpkWeightsInput, VibePreset (+8 more)

### Community 53 - "api.ts"
Cohesion: 0.11
Nodes (18): checkRateLimit(), GeocodingData, GET, NominatimResult, querySchema, RateEntry, rateLimitStore, POST() (+10 more)

### Community 54 - "Types Structure"
Cohesion: 0.25
Nodes (7): Benefits, File Structure, Import from main index (recommended), Import from specific modules, Migration, Types Structure, Usage

### Community 55 - "README.md"
Cohesion: 0.15
Nodes (13): 1. Environment Initialization, 2. Build & Deploy Containers, 3. Schema Migration & Vector Seeding, Core Architecture & Hybrid Recommendation Engine, Core Logic & API, Documentation Modules, Infrastructure & Deployment, Intelligent Hybrid Recommendation (+5 more)

### Community 56 - "Implementation Details"
Cohesion: 0.15
Nodes (12): Benefits over Tremor, Chart.js Configuration, Chart.js Integration for Admin Dashboard, Component: VisualizationPanel.tsx, Current Status, Data Structure, Dependencies Added, Implementation Details (+4 more)

### Community 57 - "app"
Cohesion: 0.15
Nodes (13): condition, command, container_name, depends_on, environment, networks, ports, restart (+5 more)

### Community 58 - "migrate-to-cloudinary.js"
Cohesion: 0.06
Nodes (41): compat, __dirname, eslintConfig, __filename, postgres@^3.4.7, postgres, db, __dirname (+33 more)

### Community 59 - "admin/dashboard/page.tsx"
Cohesion: 0.16
Nodes (13): AdminDashboard(), FavoritesPage(), StatCard(), StatCardProps, defaultActions, QuickAction, QuickActionsPanel(), QuickActionsPanelProps (+5 more)

### Community 60 - "ProtectedRoute"
Cohesion: 0.22
Nodes (10): AdminBookingPage(), CreateUserPage(), BookingDetail, BookingDetailApiResponse, BookingDetailResponse, ErrorResponse, NewKosPage(), ProtectedRoute() (+2 more)

### Community 61 - "ai/route.ts"
Cohesion: 0.14
Nodes (20): main(), AIStatusData, GET, getAIStatusHandler(), IndexingResultData, POST, triggerIndexingHandler(), dynamic (+12 more)

### Community 62 - "types/index.ts"
Cohesion: 0.11
Nodes (22): defaultForm, editKosResponseSchema, authApi, LoginCredentials, RegisterData, apiClient, ApiClientConfig, RequestOptions (+14 more)

### Community 63 - "db"
Cohesion: 0.17
Nodes (11): container_name, image, networks, ports, restart, volumes, driver, networks (+3 more)

### Community 64 - "ai-service"
Cohesion: 0.18
Nodes (12): build, container_name, environment, networks, ports, restart, volumes, build (+4 more)

### Community 65 - "pgadmin"
Cohesion: 0.17
Nodes (12): PGADMIN_CONFIG_SERVER_MODE, PGADMIN_DEFAULT_EMAIL, PGADMIN_DEFAULT_PASSWORD, container_name, depends_on, environment, image, networks (+4 more)

### Community 66 - "ai-chat.test.ts"
Cohesion: 0.23
Nodes (9): ChatMarkdown, ChatMarkdownProps, renderInline(), sanitizeStreamingMarkdown(), formatSSE(), parseToolCalls(), makeMockSSEResponse(), mockGetHybridRecommendations (+1 more)

### Community 67 - "SidebarPanel.tsx"
Cohesion: 0.27
Nodes (7): buildWhatsappUrl(), OwnerInfoCard(), OwnerInfoCardProps, QuickStatsCard(), QuickStatsCardProps, DURATION_OPTIONS, SidebarPanelProps

### Community 68 - "API Response Standard"
Cohesion: 0.13
Nodes (11): API Response Standard, Core Principles, Envelope Structure, Examples, Future Enhancements (TODO), Helper Functions, HTTP Status Guidelines, Implementation Checklist Per Endpoint (+3 more)

### Community 69 - "Neon Test Database Setup"
Cohesion: 0.18
Nodes (10): Branching (Planned), Common Issues, Connection Pooling, Environment Variables, Migrations, Neon Test Database Setup, Purpose, Reset Strategy (+2 more)

### Community 70 - "copilot-instructions.md"
Cohesion: 0.18
Nodes (10): Code Style: ## Write clean, readable, and maintainable code. Add JSDoc comments for complex functions to explain their purpose, parameters, and return values., Commit Messages:, Components:, Documentation:, Framework:, Language:, LEAST BUT important:, NPM: (+2 more)

### Community 71 - "UnifiedKosCard.tsx"
Cohesion: 0.18
Nodes (17): UnifiedKosCard(), UnifiedKosCardProps, UnifiedKosSpkDetails, FeaturedCard(), FeaturedCardProps, KosPhoto, useKosDetailView(), useAddFavorite() (+9 more)

### Community 72 - "users/[id]/route.ts"
Cohesion: 0.10
Nodes (17): bcryptjs, DELETE, GET, PATCH, PUT, updateUserSchema, userIdParam, BasicUser (+9 more)

### Community 73 - "login/page.tsx"
Cohesion: 0.08
Nodes (29): DEMO_ACCOUNTS, FormErrors, FormState, LoginPage(), LoginPageInner(), PasswordInput(), PasswordInputProps, SubmitButton() (+21 more)

### Community 74 - "UsersTable.tsx"
Cohesion: 0.14
Nodes (13): ActionIconButton(), ActionIconButtonProps, variants, Checkbox(), CheckboxProps, colors, UserRolePill(), UserRolePillProps (+5 more)

### Community 75 - "UserRoleStatusSection.tsx"
Cohesion: 0.26
Nodes (8): InfoLabelValue(), InfoLabelValueProps, UserRoleBadge(), UserRoleBadgeProps, UserBasicInfoSection(), UserBasicInfoSectionProps, UserRoleStatusSection(), UserRoleStatusSectionProps

### Community 76 - "Continuous Integration Workflow"
Cohesion: 0.20
Nodes (9): Adding New Test Suites, Caching, Continuous Integration Workflow, Database Strategy, Environment Variables, Future Enhancements, Job Structure, Overview (+1 more)

### Community 77 - "AdminUser"
Cohesion: 0.24
Nodes (8): UserActionButtonsProps, UserEditFormProps, UserEditFormValues, UserRoleDescriptionProps, UseAdminUserResult, AdminUser, AdminUserDetailResponse, AdminUserUpdateResponse

### Community 78 - "RecentActivityPanel.tsx"
Cohesion: 0.27
Nodes (6): PerformanceSummaryPanel(), PerformanceSummaryPanelProps, RecentActivityKosItem, RecentActivityPanel(), RecentActivityPanelProps, formatCurrency()

### Community 79 - "PlatformOverviewPanel.tsx"
Cohesion: 0.24
Nodes (8): chart.js@^4.5.0, react-chartjs-2@^5.3.0, chart.js, react-chartjs-2, PlatformOverviewPanel(), PlatformOverviewPanelProps, UserCompositionChart(), UserCompositionData

### Community 80 - "volumes"
Cohesion: 0.22
Nodes (9): driver, driver, driver, driver, volumes, hf_cache, pgadmin_data, postgres_data (+1 more)

### Community 81 - "search.ts"
Cohesion: 0.24
Nodes (10): GET(), searchSchema, similarSchema, buildFilterConditions(), fallbackTextSearch(), findSimilarKos(), SearchFilters, SearchResult (+2 more)

### Community 82 - "api-response.ts"
Cohesion: 0.31
Nodes (8): ApiError, ApiResponse, ApiSuccess, buildHeaders(), json(), jsonError(), JsonInit, jsonSuccess()

### Community 83 - "healthcheck"
Cohesion: 0.46
Nodes (8): healthcheck, healthcheck, healthcheck, interval, retries, start_period, test, timeout

### Community 84 - "db_test"
Cohesion: 0.25
Nodes (8): container_name, image, networks, ports, profiles, restart, volumes, db_test

### Community 85 - "api/kos.ts"
Cohesion: 0.22
Nodes (9): KosFormData, UseCreateKosFormResult, createKos(), CreateKosRequest, createKosRequestSchema, CreateKosResponse, createKosResponseSchema, createAuthHeaders() (+1 more)

### Community 86 - "RealMap.tsx"
Cohesion: 0.22
Nodes (13): LeafletMap, MapSection(), MapSectionProps, SEMARANG_FALLBACK_CENTER, createFallbackCenterIcon(), createPricePinIcon(), isValidCoordinate(), MapCenterController() (+5 more)

### Community 87 - "lib/auth.ts"
Cohesion: 0.18
Nodes (13): `src/lib/upload.ts`, POST(), POST(), generateToken(), getJwtSecret(), JWTPayload, UserRole, verifyPassword() (+5 more)

### Community 88 - "RecentActivitiesPanel.tsx"
Cohesion: 0.48
Nodes (5): ActivityItem(), ActivityItemData, ActivityItemProps, RecentActivitiesPanel(), RecentActivitiesPanelProps

### Community 90 - "EmptyState.tsx"
Cohesion: 0.22
Nodes (6): EmptyStateProps, EmptyStateVariant, variantClasses, iconToneClasses, StatCardColor, StatCardProps

### Community 91 - "Platform Options"
Cohesion: 0.33
Nodes (6): 1. Vercel (Recommended), 2. Railway, 3. Digital Ocean App Platform, 4. AWS (Advanced), Platform Options, Production Deployment

### Community 92 - "environment"
Cohesion: 0.53
Nodes (6): environment, environment, PGDATA, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER

### Community 93 - "RatingStars.tsx"
Cohesion: 0.31
Nodes (8): RatingStars(), RatingStarsProps, sizeMap, ReviewItem(), ReviewItemProps, ReviewData, ReviewsSection(), ReviewsSectionProps

### Community 94 - "organisms/HeaderSection.tsx"
Cohesion: 0.17
Nodes (9): react, StatusBadgeProps, FavoriteButton(), FavoriteButtonProps, PriceTag(), PriceTagProps, StatItemProps, HeaderSection() (+1 more)

### Community 95 - "useAdminDashboard.ts"
Cohesion: 0.28
Nodes (8): DashboardStats, getRelativeTime(), getTimeFromRelative(), RecentActivity, useAdminDashboard(), AnalyticsData, BookingsData, UsersData

### Community 96 - "recommendations/page.tsx"
Cohesion: 0.25
Nodes (3): MIN_SCORE_PILLS, RecommendationsPage(), useGeolocation()

### Community 97 - "🚀 Kosera Deployment Guide"
Cohesion: 0.40
Nodes (4): CI/CD Pipeline, GitHub Actions, 🚀 Kosera Deployment Guide, Overview

### Community 98 - "Local Development Setup"
Cohesion: 0.40
Nodes (5): 1. Clone and Install, 2. Environment Setup, 3. Database Setup, 4. Start Development Server, Local Development Setup

### Community 99 - "kecamatan.ts"
Cohesion: 0.25
Nodes (5): CITIES, KECAMATAN_FILTER_OPTIONS, KECAMATAN_SEMARANG, KecamatanSemarang, KELURAHAN_BY_KECAMATAN

### Community 100 - "Button.tsx"
Cohesion: 0.33
Nodes (5): ButtonProps, ButtonSize, ButtonVariant, sizeClasses, variantClasses

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

### Community 105 - "admin/kos/page.tsx"
Cohesion: 0.36
Nodes (4): AdminKosPage(), AdminKosFilter(), AdminKosHeader(), AdminKosHeaderProps

### Community 106 - "KosCard.tsx"
Cohesion: 0.33
Nodes (4): KosCard(), KosCardBase, KosCardProps, KosStatistics

### Community 107 - "OverviewStatsPanel.tsx"
Cohesion: 0.50
Nodes (4): StatCard(), OverviewStatsPanel(), OverviewStatsPanelProps, OverviewStatsValues

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
Cohesion: 0.31
Nodes (3): adminApi, api, userApi

### Community 119 - "useImageWithFallback.ts"
Cohesion: 0.36
Nodes (6): SafeImage(), SafeImageProps, ImageWithFallbackOptions, useImageWithFallback(), useKosImages(), validateImageUrl()

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1006 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `organisms/HeaderSection.tsx` to `kos/[id]/page.tsx`, `Header`, `BookingAdminClient.tsx`, `package.json`, `view/page.tsx`, `react`, `renter/bookings/page.tsx`, `KosFormShell.tsx`, `sweetalert.ts`, `profile-matching.ts`, `dependencies`, `seller/dashboard/page.tsx`, `seller/kos/page.tsx`, `AuthContext.tsx`, `Providers.tsx`, `chat.ts`, `types/index.ts`, `UserDetailCard.tsx`, `users/page.tsx`, `design-playground/page.tsx`, `clsx`, `useSemanticSearch.ts`, `ProductionMorphingSearchBar.tsx`, `admin/dashboard/page.tsx`, `ProtectedRoute`, `types/index.ts`, `ai-chat.test.ts`, `SidebarPanel.tsx`, `UnifiedKosCard.tsx`, `login/page.tsx`, `UsersTable.tsx`, `UserRoleStatusSection.tsx`, `AdminUser`, `RecentActivityPanel.tsx`, `PlatformOverviewPanel.tsx`, `api/kos.ts`, `RealMap.tsx`, `RecentActivitiesPanel.tsx`, `EmptyState.tsx`, `RatingStars.tsx`, `useAdminDashboard.ts`, `recommendations/page.tsx`, `Button.tsx`, `admin/kos/page.tsx`, `KosCard.tsx`, `OverviewStatsPanel.tsx`, `react`, `useImageWithFallback.ts`?**
  _High betweenness centrality (0.263) - this node is a cross-community bridge._
- **What connects `RFC-4180` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `envelope.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08821548821548822 - nodes in this community are weakly interconnected._
- **Why does `zod` connect `drizzle-orm` to `kos/[id]/page.tsx`, `package.json`, `fail`, `admin.ts`, `profile-matching.ts`, `dependencies`, `seller/kos/page.tsx`, `types/kos.ts`, `AuthContext.tsx`, `chat.ts`, `admin/bookings/route.ts`, `api/bookings/route.ts`, `middleware.ts`, `api.ts`, `types/index.ts`, `users/[id]/route.ts`, `login/page.tsx`, `search.ts`, `api/kos.ts`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.03278688524590164 - nodes in this community are weakly interconnected._
- **Why does `Cloudinary Integration Guide` connect `Cloudinary Integration Guide` to `Features`, `API Response Standard`, `Monitoring and Limits`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Should `photos/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07807807807807808 - nodes in this community are weakly interconnected._