# Graph Report - kosera-spk  (2026-11-19)

## Corpus Check
- 407 files · ~177,504 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 6, .example 1, .conf 1)

## Summary
- 2430 nodes · 5577 edges · 124 communities (114 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eff05b0e`
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
- ai-reindex.test.ts
- admin.ts
- index.tsx
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
- useApi.ts
- compilerOptions
- UserDetailCard.tsx
- admin/bookings/route.ts
- Deployment Guide: Vercel & HuggingFace Spaces
- dotenv
- users/page.tsx
- api.ts
- design-playground/page.tsx
- clsx
- Docker Setup Guide for Kosera API
- Dual Environment Setup Guide
- middleware.ts
- useSemanticSearch.ts
- ProductionMorphingSearchBar.tsx
- useEditKos.ts
- Types Structure
- README.md
- Implementation Details
- app
- test-cloudinary.js
- admin/dashboard/page.tsx
- profile-matching.ts
- ai/route.ts
- types/index.ts
- db
- ai-service
- pgadmin
- ai-chat.test.ts
- transform-complete-kos.ts
- API Response Standard
- Neon Test Database Setup
- copilot-instructions.md
- migrate-to-cloudinary.js
- users/[id]/route.ts
- login/page.tsx
- UsersTable.tsx
- UserRoleStatusSection.tsx
- Continuous Integration Workflow
- transform-scraped-kos.ts
- RecentActivityPanel.tsx
- features/profile-matching/index.ts
- volumes
- useProfileMatching.ts
- api-response.ts
- healthcheck
- db_test
- 3. **Test Categories Implemented**
- recommendations/page.tsx
- lib/auth.ts
- RecentActivitiesPanel.tsx
- icons.ts
- EmptyState.tsx
- Platform Options
- environment
- RatingStars.tsx
- cloudinary-advanced.ts
- useAdminDashboard.ts
- useAdminUsersList.ts
- 🚀 Kosera Deployment Guide
- Local Development Setup
- 🏆 Key Features
- Button.tsx
- Monitoring and Logging
- Performance Optimization
- Database Deployment
- Security Configuration
- 🔄 Next Steps
- KosCard.tsx
- OverviewStatsPanel.tsx
- useGeolocation.ts
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
- Documentation Modules
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `react` - 163 edges
2. `fail()` - 121 edges
3. `ok()` - 121 edges
4. `next` - 64 edges
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

## Communities (124 total, 10 thin omitted)

### Community 0 - "envelope.ts"
Cohesion: 0.08
Nodes (43): Adding New Tests, Auto Migration Option, Docker-Based Testing Workflow, Environment Variables, Future Enhancements, Persistence vs Isolation, Safety Mechanisms, Scripts Overview (+35 more)

### Community 1 - "scripts"
Cohesion: 0.03
Nodes (61): scripts, ai:index, build, ci:test, cloudinary:migrate, cloudinary:test, db:clear-photos, db:drop (+53 more)

### Community 2 - "photos/route.ts"
Cohesion: 0.12
Nodes (16): cloudinary@^2.7.0, cloudinary, UsageData, UsageRecommendation, CloudinaryUploadResult, BulkOptimizationResult, OptimizationResult, CloudinaryAccountResponse (+8 more)

### Community 3 - "kos/[id]/page.tsx"
Cohesion: 0.10
Nodes (29): SellerKosDetailPage(), ErrorStateProps, SellerKosDetailError(), SellerKosDetailLoading(), StatCard(), StatCardProps, valueColorMap, HeaderSection() (+21 more)

### Community 4 - "Header"
Cohesion: 0.12
Nodes (28): nextConfig, next, AdminBookingPage(), AdminKosPage(), CreateUserPage(), EditUserPage(), UserDetailPage(), ComplaintPage() (+20 more)

### Community 5 - "BookingAdminClient.tsx"
Cohesion: 0.09
Nodes (31): clsx, BookingAdminClient(), BookingStatusDropdown(), BookingStatusDropdownProps, BookingHistoryModal(), BookingHistoryModalProps, statusBadge(), useAdminBooking() (+23 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (63): devDependencies, autoprefixer@^10.4.21, dotenv-cli@^8.0.0, eslint@^9, eslint-config-next@15.3.1, eslint-config-prettier@^10.1.2, @eslint/eslintrc@^3, husky@^9.0.0 (+55 more)

### Community 7 - "drizzle-orm"
Cohesion: 0.08
Nodes (43): drizzle-orm, DELETE, DELETE, GET, POST(), registerSchema, dynamic, FeaturedKos (+35 more)

### Community 8 - "fail"
Cohesion: 0.08
Nodes (64): GET, GET(), GET(), POST(), DELETE(), GET(), GET(), bulkCleanupHandler() (+56 more)

### Community 9 - "view/page.tsx"
Cohesion: 0.09
Nodes (28): KosDetailPage(), Review, Breadcrumbs(), BreadcrumbsProps, FacilitiesList(), FacilitiesListProps, ImageGallery(), ImageGalleryProps (+20 more)

### Community 10 - "lib/ai/index.ts"
Cohesion: 0.15
Nodes (19): AIBatchVectorizeResponse, AIErrorResponse, AIServiceError, AIVectorizeResponse, BatchVectorizeResponse, buildHeaders(), fetchWithRetry(), getAIServiceUrl() (+11 more)

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
Cohesion: 0.07
Nodes (32): Booking, BookingStatusHistory, Favorite, Kos, KosPhoto, kosPhotos, NewBooking, NewBookingStatusHistory (+24 more)

### Community 15 - "Features"
Cohesion: 0.05
Nodes (40): 10. Future Enhancements, 11. Support and Resources, 1. Enhanced Dashboard (`/admin/cloudinary`), 2. API Endpoints, 3. Optimization Features, 4. Monitoring Capabilities, 5. Database Integration, 6. Configuration (+32 more)

### Community 16 - "renter/bookings/page.tsx"
Cohesion: 0.08
Nodes (35): BookingItem, BookingsPage(), handleConfirm(), toBookingStatus(), RenterBookingsPage(), RenterBookingsPageInner(), STATUS_VALUES, DetailRow() (+27 more)

### Community 17 - "Profile Matching DSS (Decision Support System)"
Cohesion: 0.05
Nodes (40): 1. Price Criteria (Core Factor) - Default Weight: 52%, 1. Price Level, 1. User Preferences Management, 2. Distance Level, 2. Location Criteria (Core Factor) - Default Weight: 27%, 2. Recommendation Engine, 3. Facilities Criteria (Secondary Factor) - Default Weight: 15%, 3. Rating Level (+32 more)

### Community 18 - "KosFormShell.tsx"
Cohesion: 0.09
Nodes (25): NewKosPage(), FormErrorAlert(), FormErrorAlertProps, KosFormShell(), KosFormShellProps, BasicInfoValues, SectionBasicInfo(), SectionBasicInfoProps (+17 more)

### Community 19 - "with"
Cohesion: 0.06
Nodes (37): env, name, needs, runs-on, steps, concurrency, cancel-in-progress, group (+29 more)

### Community 20 - "sweetalert.ts"
Cohesion: 0.10
Nodes (31): sweetalert2, handleSubmit(), BookingDetail, BookingDetailApiResponse, BookingDetailPage(), BookingDetailResponse, ErrorResponse, GenericErrorResponse (+23 more)

### Community 21 - "seed-mamikos.ts"
Cohesion: 0.27
Nodes (11): RFC-4180, cleanText(), CsvRow, formatRating(), mapGender(), NEEDED_COLUMNS, normalizeMonthlyPrice(), parseCsvFile() (+3 more)

### Community 22 - "🎯 Kosera API Testing Summary"
Cohesion: 0.14
Nodes (14): 1. **Quality Assurance**, 2. **Development Speed**, 3. **Documentation**, 4. **Production Readiness**, 🚀 Available Test Commands, 🎯 Benefits for Your Project, 🔧 Integration Tests, 🎯 Kosera API Testing Summary (+6 more)

### Community 23 - "ai-reindex.test.ts"
Cohesion: 0.13
Nodes (13): PATCH, restoreKosHandler(), PUT, updateKosHandler(), createKosSchema, GET(), parseKosQuery(), POST (+5 more)

### Community 24 - "admin.ts"
Cohesion: 0.09
Nodes (22): UserEditFormProps, UserEditFormValues, AdminUserDetailResponse, AdminUserUpdateResponse, AnalyticsResponse, analyticsResponseSchema, analyticsSchema, BookingsOuterResponse (+14 more)

### Community 25 - "index.tsx"
Cohesion: 0.16
Nodes (18): BudgetSection(), FacilitiesSection(), DEFAULT_FORM_DATA, PreferencesForm(), PreferencesFormProps, LOCATION_MODES, LocationSection(), LocationSectionProps (+10 more)

### Community 26 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, bcryptjs@^3.0.2, clsx@^2.1.1, drizzle-orm@^0.44.2, jsonwebtoken@^9.0.2, leaflet@^1.9.4, multer@^2.0.2, next@^15.3.6 (+22 more)

### Community 27 - "seller/dashboard/page.tsx"
Cohesion: 0.26
Nodes (8): SellerDashboard(), EmptyState(), QuickActionsPanel(), QuickActionsPanelProps, TipsInsightsPanel(), TipsInsightsPanelProps, TipsInsightsStats, useSellerDashboard()

### Community 28 - "seller/kos/page.tsx"
Cohesion: 0.15
Nodes (16): SellerKosPage(), SellerKosListError(), SellerKosListLoading(), KosGrid(), KosGridProps, KosTips(), Tip(), StatsRow() (+8 more)

### Community 29 - "types/kos.ts"
Cohesion: 0.07
Nodes (33): KosFormData, BookingModalProps, UseKosDetailViewResult, CreateKosRequest, createKosRequestSchema, CreateKosResponse, createKosResponseSchema, kosApi (+25 more)

### Community 30 - "AuthContext.tsx"
Cohesion: 0.20
Nodes (17): ArrowRightIcon(), CalendarIcon(), getRoleBadgeColor(), getRoleDisplayName(), HeartIcon(), LockIcon(), LogoutIcon(), ProfileMenuItem (+9 more)

### Community 31 - "Providers.tsx"
Cohesion: 0.08
Nodes (26): geistMono, geistSans, metadata, RootLayout(), EXCLUDED_PREFIXES, formatRupiah(), GlobalCompareDock(), normalizeScoreToPercent() (+18 more)

### Community 32 - "chat.ts"
Cohesion: 0.15
Nodes (25): chatRequestSchema, dynamic, getToolStatusMessage(), maxDuration, POST(), runAgenticChat(), UiChatMessage, buildLLMHeaders() (+17 more)

### Community 34 - "scoring.ts"
Cohesion: 0.23
Nodes (20): HybridRecommendationResponse, getKosMatchingScore(), calculateDistance(), calculateFacilitiesScore(), calculateLocationScore(), calculateMatchingScore(), calculatePriceScore(), calculateRatingScore() (+12 more)

### Community 35 - "app.py"
Cohesion: 0.14
Nodes (8): _apply_prefix(), health(), _is_e5_model(), lifespan(), vectorize(), vectorize_batch(), VectorizeBatchRequest, VectorizeRequest

### Community 36 - "Cloudinary Integration Guide"
Cohesion: 0.07
Nodes (29): 1. Create Cloudinary Account, 1. Image Upload, 2. Configure Environment Variables, 2. Image Management, 3. Database Migration, 3. Image Optimization, API Changes, Cloudinary Integration Guide (+21 more)

### Community 37 - "lib/ai/index.ts"
Cohesion: 0.32
Nodes (9): getHybridRecommendations(), computeHybridScore(), normalizeHybridWeights(), normalizeProfileMatchingScore(), normalizeSemanticScore(), PM_RAW_SCORE_MAX, toUnitScore(), AIServiceError (+1 more)

### Community 38 - "useApi.ts"
Cohesion: 0.11
Nodes (30): DaftarKosPage(), extractFeaturedItems(), HomePage(), RecommendationCarousel(), UnifiedKosCard(), UnifiedKosCardProps, UnifiedKosSpkDetails, FeaturedCard() (+22 more)

### Community 39 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 40 - "UserDetailCard.tsx"
Cohesion: 0.22
Nodes (13): AvatarCircle(), AvatarCircleProps, UserActionButtons(), UserActionButtonsProps, UserRoleDescription(), UserRoleDescriptionProps, formatDate(), UserDetailCard() (+5 more)

### Community 41 - "admin/bookings/route.ts"
Cohesion: 0.16
Nodes (17): GET(), PATCH(), updateBookingStatusSchema, BookingItem, BookingKos, BookingsListData, BookingUser, GET() (+9 more)

### Community 42 - "Deployment Guide: Vercel & HuggingFace Spaces"
Cohesion: 0.10
Nodes (20): 1. AI Service Deployment (HuggingFace Spaces), 2. Next.js Deployment (Vercel), 3. Cross-Origin Resource Sharing (CORS) Protocol, 4. Vector Database Provisioning (pgvector), 504 Gateway Timeout on Vercel, 5. End-to-End Integration Testing, 6. System Troubleshooting, Deployment Guide: Vercel & HuggingFace Spaces (+12 more)

### Community 43 - "dotenv"
Cohesion: 0.20
Nodes (7): dotenv@^16.5.0, drizzle-kit@^0.31.4, dotenv, drizzle-kit, envLocalPath, candidates, required

### Community 44 - "users/page.tsx"
Cohesion: 0.13
Nodes (17): react, AdminUsersPage(), AdminKosFilter(), StatusBadgeProps, UsersFiltersBar(), UsersFiltersBarProps, UsersPagination(), UsersPaginationProps (+9 more)

### Community 45 - "api.ts"
Cohesion: 0.11
Nodes (19): BookingFilters, createBookingSchema, GET, parseFilters(), POST, bodySchema, buildPaginationMeta(), BuildPaginationMetaArgs (+11 more)

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
Nodes (34): zod, bulkArchiveHandler(), bulkPermanentDeleteHandler(), DELETE, POST, PATCH(), RouteContext, toggleFeaturedHandler() (+26 more)

### Community 51 - "useSemanticSearch.ts"
Cohesion: 0.33
Nodes (7): swr@^2.3.4, swr, SemanticSearchFilters, SemanticSearchResponse, SemanticSearchResult, useAIServiceStatus(), useSemanticSearch()

### Community 52 - "ProductionMorphingSearchBar.tsx"
Cohesion: 0.12
Nodes (15): EditKosPage(), FilterBar(), FilterBarProps, BUDGET_CAP_PRESETS, ProductionMorphingSearchBarProps, SEMANTIC_VIBE_PRESETS, SpkWeightsInput, VibePreset (+7 more)

### Community 53 - "useEditKos.ts"
Cohesion: 0.17
Nodes (12): defaultForm, editKosResponseSchema, sellerApi, AppError, ErrorResponse, FormErrors, SweetAlertResult, adminKosDataSchema (+4 more)

### Community 54 - "Types Structure"
Cohesion: 0.18
Nodes (10): Benefits, `booking.ts`, File Structure, Files Overview, Import from main index (recommended), Import from specific modules, `kos.ts`, Migration (+2 more)

### Community 55 - "README.md"
Cohesion: 0.14
Nodes (9): 1. Environment Initialization, 2. Build & Deploy Containers, 3. Schema Migration & Vector Seeding, Core Architecture & Hybrid Recommendation Engine, Intelligent Hybrid Recommendation, KOSERA (Indekos Recommendation System Comparison), Local Development & Setup, Multi-Tenant Role-Based Access Control (RBAC) (+1 more)

### Community 56 - "Implementation Details"
Cohesion: 0.15
Nodes (12): Benefits over Tremor, Chart.js Configuration, Chart.js Integration for Admin Dashboard, Component: VisualizationPanel.tsx, Current Status, Data Structure, Dependencies Added, Implementation Details (+4 more)

### Community 57 - "app"
Cohesion: 0.15
Nodes (13): condition, command, container_name, depends_on, environment, networks, ports, restart (+5 more)

### Community 58 - "test-cloudinary.js"
Cohesion: 0.16
Nodes (9): compat, __dirname, eslintConfig, __filename, deleteFromCloudinary(), __dirname, __filename, testCloudinaryIntegration() (+1 more)

### Community 59 - "admin/dashboard/page.tsx"
Cohesion: 0.13
Nodes (17): chart.js@^4.5.0, react-chartjs-2@^5.3.0, chart.js, react-chartjs-2, AdminDashboard(), StatCard(), StatCardProps, PlatformOverviewPanel() (+9 more)

### Community 60 - "profile-matching.ts"
Cohesion: 0.13
Nodes (14): AVAILABLE_FACILITIES, AvailableCity, AvailableFacility, DEFAULT_GAP_CONVERSION, DEFAULT_PROFILE_MATCHING_CONFIG, GapConversion, ProfileMatchingConfig, ProfileMatchingResponse (+6 more)

### Community 61 - "ai/route.ts"
Cohesion: 0.12
Nodes (23): main(), AIStatusData, GET, getAIStatusHandler(), IndexingResultData, POST, triggerIndexingHandler(), dynamic (+15 more)

### Community 62 - "types/index.ts"
Cohesion: 0.11
Nodes (21): bookingsApi, CreateBookingData, GetBookingsParams, UpdateBookingData, apiClient, ApiClientConfig, RequestOptions, UpdatePasswordData (+13 more)

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
Cohesion: 0.14
Nodes (17): ChatMarkdown, ChatMarkdownProps, renderInline(), sanitizeStreamingMarkdown(), ChatMessageRow, ChatMessageRowProps, EXCLUDED_PREFIXES, formatRupiah() (+9 more)

### Community 67 - "transform-complete-kos.ts"
Cohesion: 0.24
Nodes (12): cleanAddress(), extractFacilities(), extractKecamatan(), filterValidReviews(), generateDescription(), generatePrice(), main(), ScrapedKos (+4 more)

### Community 68 - "API Response Standard"
Cohesion: 0.18
Nodes (11): API Response Standard, Core Principles, Envelope Structure, Examples, Future Enhancements (TODO), Helper Functions, HTTP Status Guidelines, Implementation Checklist Per Endpoint (+3 more)

### Community 69 - "Neon Test Database Setup"
Cohesion: 0.18
Nodes (10): Branching (Planned), Common Issues, Connection Pooling, Environment Variables, Migrations, Neon Test Database Setup, Purpose, Reset Strategy (+2 more)

### Community 70 - "copilot-instructions.md"
Cohesion: 0.18
Nodes (10): Code Style: ## Write clean, readable, and maintainable code. Add JSDoc comments for complex functions to explain their purpose, parameters, and return values., Commit Messages:, Components:, Documentation:, Framework:, Language:, LEAST BUT important:, NPM: (+2 more)

### Community 71 - "migrate-to-cloudinary.js"
Cohesion: 0.18
Nodes (10): postgres@^3.4.7, postgres, db, __dirname, __filename, kosPhotos, migrateLocalImagesToCloudinary(), rl (+2 more)

### Community 72 - "users/[id]/route.ts"
Cohesion: 0.09
Nodes (22): bcryptjs, DELETE, deleteUserHandler(), extractUserId(), GET, getUserHandler(), PATCH, PUT (+14 more)

### Community 73 - "login/page.tsx"
Cohesion: 0.06
Nodes (38): DEMO_ACCOUNTS, FormErrors, FormState, LoginPage(), LoginPageInner(), PasswordInput(), PasswordInputProps, SubmitButton() (+30 more)

### Community 74 - "UsersTable.tsx"
Cohesion: 0.23
Nodes (9): ActionIconButton(), ActionIconButtonProps, variants, Checkbox(), CheckboxProps, colors, UserRolePill(), UserRolePillProps (+1 more)

### Community 75 - "UserRoleStatusSection.tsx"
Cohesion: 0.26
Nodes (8): InfoLabelValue(), InfoLabelValueProps, UserRoleBadge(), UserRoleBadgeProps, UserBasicInfoSection(), UserBasicInfoSectionProps, UserRoleStatusSection(), UserRoleStatusSectionProps

### Community 76 - "Continuous Integration Workflow"
Cohesion: 0.20
Nodes (9): Adding New Test Suites, Caching, Continuous Integration Workflow, Database Strategy, Environment Variables, Future Enhancements, Job Structure, Overview (+1 more)

### Community 77 - "transform-scraped-kos.ts"
Cohesion: 0.29
Nodes (10): extractFacilities(), extractNameFromUrl(), generateAddress(), generateDescription(), generatePrice(), main(), ScrapedKos, ScrapedReview (+2 more)

### Community 78 - "RecentActivityPanel.tsx"
Cohesion: 0.27
Nodes (6): PerformanceSummaryPanel(), PerformanceSummaryPanelProps, RecentActivityKosItem, RecentActivityPanel(), RecentActivityPanelProps, formatCurrency()

### Community 79 - "features/profile-matching/index.ts"
Cohesion: 0.25
Nodes (8): MatchingResultCard(), MatchingResultCardProps, MatchingScoreBar(), MatchingScoreBarProps, MatchingScoreIndicator(), MatchingScoreIndicatorProps, HybridKosResult, KosMatchingResult

### Community 80 - "volumes"
Cohesion: 0.22
Nodes (9): driver, driver, driver, driver, volumes, hf_cache, pgadmin_data, postgres_data (+1 more)

### Community 81 - "useProfileMatching.ts"
Cohesion: 0.44
Nodes (8): preferencesApi, profileMatchingKeys, useCreatePreferences(), useDeletePreferences(), usePreferencesManager(), useProfileMatching(), useUpdatePreferences(), useUserPreferences()

### Community 82 - "api-response.ts"
Cohesion: 0.32
Nodes (7): ApiError, ApiResponse, ApiSuccess, buildHeaders(), json(), JsonInit, jsonSuccess()

### Community 83 - "healthcheck"
Cohesion: 0.46
Nodes (8): healthcheck, healthcheck, healthcheck, interval, retries, start_period, test, timeout

### Community 84 - "db_test"
Cohesion: 0.25
Nodes (8): container_name, image, networks, ports, profiles, restart, volumes, db_test

### Community 85 - "3. **Test Categories Implemented**"
Cohesion: 0.25
Nodes (8): 1. **Comprehensive Test Suite Setup**, 2. **Test Coverage**, 3. **Test Categories Implemented**, 🛡️ API Route Tests (`tests/auth/`, `tests/user/`, `tests/admin/`), 🔗 Integration Tests (`tests/integration/`), ⚡ Performance Tests (`tests/performance/`), 🔧 Unit Tests (`tests/unit/`), ✅ What We've Accomplished

### Community 86 - "recommendations/page.tsx"
Cohesion: 0.13
Nodes (22): MIN_SCORE_PILLS, RecommendationsPage(), LeafletMap, MapSection(), MapSectionProps, SEMARANG_FALLBACK_CENTER, createFallbackCenterIcon(), createPricePinIcon() (+14 more)

### Community 87 - "lib/auth.ts"
Cohesion: 0.33
Nodes (7): `src/lib/upload.ts`, POST(), uploadToCloudinary(), MulterFile, parseFormData(), upload, validateImageFile()

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
Cohesion: 0.17
Nodes (14): FavoriteButton(), FavoriteButtonProps, PriceTag(), PriceTagProps, RatingStars(), RatingStarsProps, sizeMap, ReviewItem() (+6 more)

### Community 95 - "useAdminDashboard.ts"
Cohesion: 0.28
Nodes (8): DashboardStats, getRelativeTime(), getTimeFromRelative(), RecentActivity, useAdminDashboard(), AnalyticsData, BookingsData, UsersData

### Community 96 - "useAdminUsersList.ts"
Cohesion: 0.40
Nodes (5): UsersTableProps, UseAdminUsersListParams, UseAdminUsersListResult, AdminUserListItem, AdminUserListResponse

### Community 97 - "🚀 Kosera Deployment Guide"
Cohesion: 0.40
Nodes (4): CI/CD Pipeline, GitHub Actions, 🚀 Kosera Deployment Guide, Overview

### Community 98 - "Local Development Setup"
Cohesion: 0.40
Nodes (5): 1. Clone and Install, 2. Environment Setup, 3. Database Setup, 4. Start Development Server, Local Development Setup

### Community 99 - "🏆 Key Features"
Cohesion: 0.40
Nodes (5): 1. **Automated Testing**, 2. **Mock System**, 3. **Security Testing**, 4. **Performance Monitoring**, 🏆 Key Features

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

### Community 105 - "🔄 Next Steps"
Cohesion: 0.40
Nodes (5): 1. **Run Tests Regularly**, 2. **Add More Tests**, 3. **CI/CD Integration**, 4. **Monitoring**, 🔄 Next Steps

### Community 106 - "KosCard.tsx"
Cohesion: 0.33
Nodes (4): KosCard(), KosCardBase, KosCardProps, KosStatistics

### Community 107 - "OverviewStatsPanel.tsx"
Cohesion: 0.50
Nodes (4): StatCard(), OverviewStatsPanel(), OverviewStatsPanelProps, OverviewStatsValues

### Community 108 - "useGeolocation.ts"
Cohesion: 0.40
Nodes (4): defaultOptions, GeolocationError, GeolocationState, UseGeolocationOptions

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
Cohesion: 0.25
Nodes (5): AdminKosFilterProps, adminApi, api, userApi, AdminKosFilters

### Community 119 - "Documentation Modules"
Cohesion: 0.50
Nodes (4): Core Logic & API, Documentation Modules, Infrastructure & Deployment, Quality Assurance

## Knowledge Gaps
- **1 isolated node(s):** `RFC-4180`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1015 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `users/page.tsx` to `kos/[id]/page.tsx`, `Header`, `BookingAdminClient.tsx`, `package.json`, `view/page.tsx`, `react`, `renter/bookings/page.tsx`, `KosFormShell.tsx`, `sweetalert.ts`, `admin.ts`, `index.tsx`, `dependencies`, `seller/dashboard/page.tsx`, `seller/kos/page.tsx`, `AuthContext.tsx`, `Providers.tsx`, `useApi.ts`, `UserDetailCard.tsx`, `design-playground/page.tsx`, `clsx`, `useSemanticSearch.ts`, `ProductionMorphingSearchBar.tsx`, `useEditKos.ts`, `admin/dashboard/page.tsx`, `ai-chat.test.ts`, `login/page.tsx`, `UsersTable.tsx`, `UserRoleStatusSection.tsx`, `RecentActivityPanel.tsx`, `recommendations/page.tsx`, `RecentActivitiesPanel.tsx`, `EmptyState.tsx`, `RatingStars.tsx`, `useAdminDashboard.ts`, `useAdminUsersList.ts`, `Button.tsx`, `KosCard.tsx`, `OverviewStatsPanel.tsx`, `useGeolocation.ts`, `react`?**
  _High betweenness centrality (0.222) - this node is a cross-community bridge._
- **What connects `RFC-4180` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `envelope.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0768361581920904 - nodes in this community are weakly interconnected._
- **Why does `zod` connect `middleware.ts` to `chat.ts`, `package.json`, `drizzle-orm`, `users/[id]/route.ts`, `admin/bookings/route.ts`, `fail`, `login/page.tsx`, `api.ts`, `profile-matching.ts`, `sweetalert.ts`, `useEditKos.ts`, `ai-reindex.test.ts`, `admin.ts`, `dependencies`, `seller/kos/page.tsx`, `types/kos.ts`, `types/index.ts`, `Providers.tsx`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.03278688524590164 - nodes in this community are weakly interconnected._
- **Why does `Cloudinary Integration Guide` connect `Cloudinary Integration Guide` to `README.md`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Should `photos/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11857707509881422 - nodes in this community are weakly interconnected._