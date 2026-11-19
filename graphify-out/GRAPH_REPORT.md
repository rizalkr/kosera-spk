# Graph Report - kosera-spk  (2026-11-19)

## Corpus Check
- 410 files · ~181,693 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 6, .example 1, .conf 1)

## Summary
- 2454 nodes · 5638 edges · 130 communities (120 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ca2fd3f6`
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
- algorithm.ts
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
- index.tsx
- dependencies
- KosCard.tsx
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
- ProductionMorphingSearchBar.tsx
- Types Structure
- KOSERA SPK (AI-Enhanced Indekos Decision Support & Recommendation System)
- Implementation Details
- app
- UserRoleStatusSection.tsx
- admin/dashboard/page.tsx
- RatingStars.tsx
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
- users/route.ts
- login/page.tsx
- UsersTable.tsx
- booking.ts
- Continuous Integration Workflow
- useAdminUsersList.ts
- types/index.ts
- scoring.ts
- volumes
- KoseraChatWidget.tsx
- api-response.ts
- healthcheck
- db_test
- RealMap.tsx
- UnifiedKosCard.tsx
- OverviewStatsPanel.tsx
- seller/dashboard/page.tsx
- icons.ts
- common.ts
- Platform Options
- environment
- profile-matching.ts
- cloudinary-advanced.ts
- chat/route.ts
- Part A: Base Application, Database & CPU Embedding Service
- 🚀 Kosera Deployment Guide
- Local Development Setup
- useProfileMatching.ts
- clsx
- Monitoring and Logging
- Performance Optimization
- Database Deployment
- Security Configuration
- features/profile-matching/index.ts
- admin/kos/page.tsx
- 3. **Test Categories Implemented**
- Card.tsx
- Backup and Recovery
- Scaling Considerations
- Troubleshooting
- Environment Configuration
- Security Checklist
- Prerequisites
- useImageWithFallback.ts
- 01-init.sh
- fix-lint-errors.sh
- design-playground/layout.tsx
- RecentActivitiesPanel.tsx
- types/user.ts
- 🏆 Key Features
- postcss.config.mjs
- 🎯 Benefits for Your Project
- 🔄 Next Steps
- useGeolocation.ts
- Environment Configurations

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
- `KOSERA SPK (AI-Enhanced Indekos Decision Support & Recommendation System)` --references--> `getHybridRecommendations()`  [INFERRED]
  README.md → src/lib/ai/hybrid.ts
- `KOSERA SPK (AI-Enhanced Indekos Decision Support & Recommendation System)` --references--> `semanticSearch()`  [INFERRED]
  README.md → src/lib/ai/search.ts
- `2. Dual AI Microservice Architecture` --references--> `getHybridRecommendations()`  [INFERRED]
  README.md → src/lib/ai/hybrid.ts
- `2. Dual AI Microservice Architecture` --references--> `scheduleKosReindex()`  [INFERRED]
  README.md → src/lib/ai/indexer.ts
- `2. Dual AI Microservice Architecture` --references--> `semanticSearch()`  [INFERRED]
  README.md → src/lib/ai/search.ts

## Import Cycles
- None detected.

## Communities (130 total, 10 thin omitted)

### Community 0 - "envelope.ts"
Cohesion: 0.09
Nodes (40): Adding New Tests, Auto Migration Option, Docker-Based Testing Workflow, Environment Variables, Future Enhancements, Persistence vs Isolation, Safety Mechanisms, Scripts Overview (+32 more)

### Community 1 - "scripts"
Cohesion: 0.03
Nodes (61): scripts, ai:index, build, ci:test, cloudinary:migrate, cloudinary:test, db:clear-photos, db:drop (+53 more)

### Community 2 - "photos/route.ts"
Cohesion: 0.06
Nodes (51): cloudinary@^2.7.0, cloudinary, GET(), GET(), POST(), DELETE(), GET(), GET() (+43 more)

### Community 3 - "kos/[id]/page.tsx"
Cohesion: 0.09
Nodes (32): SellerKosDetailPage(), ErrorStateProps, SellerKosDetailError(), SellerKosDetailLoading(), StatCard(), StatCardProps, valueColorMap, HeaderSection() (+24 more)

### Community 4 - "Header"
Cohesion: 0.11
Nodes (26): nextConfig, next, AdminBookingPage(), CreateUserPage(), EditUserPage(), UserDetailPage(), ContactPage(), FavoritesPage() (+18 more)

### Community 5 - "BookingAdminClient.tsx"
Cohesion: 0.11
Nodes (25): BookingAdminClient(), AdminKosFilterProps, BookingStatusDropdown(), BookingStatusDropdownProps, BookingHistoryModal(), BookingHistoryModalProps, statusBadge(), useAdminBooking() (+17 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (63): devDependencies, autoprefixer@^10.4.21, dotenv-cli@^8.0.0, eslint@^9, eslint-config-next@15.3.1, eslint-config-prettier@^10.1.2, @eslint/eslintrc@^3, husky@^9.0.0 (+55 more)

### Community 7 - "drizzle-orm"
Cohesion: 0.11
Nodes (33): drizzle-orm, DELETE, PATCH(), RouteContext, toggleFeaturedHandler(), DELETE, DELETE, GET (+25 more)

### Community 8 - "algorithm.ts"
Cohesion: 0.22
Nodes (13): HybridKosResult, getKosMatchingScore(), getProfileMatchingRecommendations(), mapDbPreferenceToData(), parseJsonArray(), ProfileMatchingOptions, DEFAULT_WEIGHT_FACILITIES, DEFAULT_WEIGHT_LOCATION (+5 more)

### Community 9 - "view/page.tsx"
Cohesion: 0.10
Nodes (24): react, KosDetailPage(), Review, StatusBadgeProps, StatItemProps, Breadcrumbs(), BreadcrumbsProps, FacilitiesList() (+16 more)

### Community 10 - "lib/ai/index.ts"
Cohesion: 0.16
Nodes (18): AIBatchVectorizeResponse, AIErrorResponse, AIServiceError, AIVectorizeResponse, BatchVectorizeResponse, buildHeaders(), fetchWithRetry(), getAIServiceUrl() (+10 more)

### Community 11 - "react"
Cohesion: 0.11
Nodes (24): Button(), AdminKosTable(), AdminKosTableProps, KosTable(), KosTableProps, KosTableActions(), KosTableActionsProps, RowActionButtons() (+16 more)

### Community 12 - "app"
Cohesion: 0.05
Nodes (45): build, container_name, depends_on, environment, healthcheck, networks, ports, restart (+37 more)

### Community 13 - "📦 Database Design: Kosera Platform"
Cohesion: 0.05
Nodes (41): 1. users, 2. posts, 3. kos, 4. bookings, 5. reviews, 6. images, 7. payments, 8. favorites (+33 more)

### Community 14 - "schema.ts"
Cohesion: 0.07
Nodes (27): GET(), NearbyKos, NearbyOwner, querySchema, Booking, BookingStatusHistory, ChatFeedback, Favorite (+19 more)

### Community 15 - "Features"
Cohesion: 0.05
Nodes (40): 10. Future Enhancements, 11. Support and Resources, 1. Enhanced Dashboard (`/admin/cloudinary`), 2. API Endpoints, 3. Optimization Features, 4. Monitoring Capabilities, 5. Database Integration, 6. Configuration (+32 more)

### Community 16 - "renter/bookings/page.tsx"
Cohesion: 0.10
Nodes (28): BookingItem, BookingsPage(), handleConfirm(), toBookingStatus(), BookingDetail, BookingDetailApiResponse, BookingDetailPage(), BookingDetailResponse (+20 more)

### Community 17 - "Profile Matching DSS (Decision Support System)"
Cohesion: 0.05
Nodes (40): 1. Price Criteria (Core Factor) - Default Weight: 52%, 1. Price Level, 1. User Preferences Management, 2. Distance Level, 2. Location Criteria (Core Factor) - Default Weight: 27%, 2. Recommendation Engine, 3. Facilities Criteria (Secondary Factor) - Default Weight: 15%, 3. Rating Level (+32 more)

### Community 18 - "KosFormShell.tsx"
Cohesion: 0.09
Nodes (24): FormErrorAlert(), FormErrorAlertProps, KosFormShell(), KosFormShellProps, BasicInfoValues, SectionBasicInfo(), SectionBasicInfoProps, SectionCoordinates() (+16 more)

### Community 19 - "with"
Cohesion: 0.06
Nodes (37): env, name, needs, runs-on, steps, concurrency, cancel-in-progress, group (+29 more)

### Community 20 - "sweetalert.ts"
Cohesion: 0.11
Nodes (24): sweetalert2, ComplaintPage(), handleSubmit(), GenericErrorResponse, GenericOkResponse, PhotosApiResponse, PhotosListResponse, SellerKosPhotosPage() (+16 more)

### Community 21 - "lib/auth.ts"
Cohesion: 0.12
Nodes (23): RFC-4180, loginSchema, POST(), POST(), registerSchema, cleanText(), CsvRow, formatRating() (+15 more)

### Community 22 - "🎯 Kosera API Testing Summary"
Cohesion: 0.22
Nodes (9): 🚀 Available Test Commands, 🔧 Integration Tests, 🎯 Kosera API Testing Summary, ✅ Performance Tests, 🎉 Success Metrics, 📞 Support, 📊 Test Results, 📋 Test Statistics (+1 more)

### Community 23 - "ai-reindex.test.ts"
Cohesion: 0.12
Nodes (15): PATCH, restoreKosHandler(), PUT, updateKosHandler(), POST, IndexingSummary, IndexResult, KosIndexData (+7 more)

### Community 24 - "admin.ts"
Cohesion: 0.09
Nodes (22): UserEditFormProps, UserEditFormValues, AdminUserDetailResponse, AdminUserUpdateResponse, AnalyticsResponse, analyticsResponseSchema, analyticsSchema, BookingsOuterResponse (+14 more)

### Community 25 - "index.tsx"
Cohesion: 0.15
Nodes (19): BudgetSection(), FacilitiesSection(), DEFAULT_FORM_DATA, PreferencesForm(), PreferencesFormProps, LOCATION_MODES, LocationSection(), LocationSectionProps (+11 more)

### Community 26 - "dependencies"
Cohesion: 0.07
Nodes (27): dependencies, bcryptjs@^3.0.2, drizzle-orm@^0.44.2, jsonwebtoken@^9.0.2, leaflet@^1.9.4, next@^15.3.6, pg@^8.16.3, react@^19.0.0 (+19 more)

### Community 27 - "KosCard.tsx"
Cohesion: 0.15
Nodes (9): EmptyStateProps, EmptyStateVariant, variantClasses, KosCardBase, KosCardProps, KosStatistics, iconToneClasses, StatCardColor (+1 more)

### Community 28 - "seller/kos/page.tsx"
Cohesion: 0.15
Nodes (16): SellerKosPage(), SellerKosListError(), SellerKosListLoading(), KosGrid(), KosGridProps, KosTips(), Tip(), StatsRow() (+8 more)

### Community 29 - "types/kos.ts"
Cohesion: 0.09
Nodes (23): BookingModalProps, createKosRequestSchema, CreateKosResponse, createKosResponseSchema, kosApi, createAuthHeaders(), getAuthToken(), AdminKosApiResponse (+15 more)

### Community 30 - "AuthContext.tsx"
Cohesion: 0.11
Nodes (24): ArrowRightIcon(), CalendarIcon(), getRoleBadgeColor(), getRoleDisplayName(), HeartIcon(), LockIcon(), LogoutIcon(), ProfileMenuItem (+16 more)

### Community 31 - "Providers.tsx"
Cohesion: 0.11
Nodes (24): @tanstack/react-query@^5.81.5, @tanstack/react-query, geistMono, geistSans, metadata, RootLayout(), KoseraChatWidget(), EXCLUDED_PREFIXES (+16 more)

### Community 32 - "chat.ts"
Cohesion: 0.20
Nodes (19): buildLLMHeaders(), executeChatTool(), fetchMetadataForKos(), formatOpenAICompatibleMessages(), getLLMApiKey(), parseFacilitiesList(), parseToolCalls(), pendingToolCallPrefixLength() (+11 more)

### Community 34 - "api.ts"
Cohesion: 0.19
Nodes (11): GET, getProfileHandler(), withAnyRole, ApiResponse, createError(), createSuccess(), isSuccess(), jsonResponse() (+3 more)

### Community 35 - "app.py"
Cohesion: 0.14
Nodes (8): _apply_prefix(), health(), _is_e5_model(), lifespan(), vectorize(), vectorize_batch(), VectorizeBatchRequest, VectorizeRequest

### Community 36 - "Cloudinary Integration Guide"
Cohesion: 0.05
Nodes (36): 1. Create Cloudinary Account, 1. Image Upload, 2. Configure Environment Variables, 2. Image Management, 3. Database Migration, 3. Image Optimization, API Changes, Cloudinary Integration Guide (+28 more)

### Community 37 - "lib/ai/index.ts"
Cohesion: 0.25
Nodes (12): DEFAULT_HYBRID_WEIGHT_PM, getHybridRecommendations(), HybridRecommendationOptions, HybridRecommendationResponse, computeHybridScore(), normalizeHybridWeights(), normalizeProfileMatchingScore(), normalizeSemanticScore() (+4 more)

### Community 38 - "types/index.ts"
Cohesion: 0.26
Nodes (12): DaftarKosPage(), extractFeaturedItems(), HomePage(), RecommendationCarousel(), FeaturedList(), FeaturedListProps, KosList(), KosListProps (+4 more)

### Community 39 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 40 - "useApi.ts"
Cohesion: 0.15
Nodes (15): KosImage(), KosImageProps, useKosImage(), useKosImages(), KosPhoto, useKosDetailView(), UseKosDetailViewResult, useAddFavorite() (+7 more)

### Community 41 - "admin/bookings/route.ts"
Cohesion: 0.17
Nodes (16): GET(), PATCH(), updateBookingStatusSchema, BookingItem, BookingKos, BookingsListData, BookingUser, GET() (+8 more)

### Community 42 - "Deployment Guide: Vercel & HuggingFace Spaces"
Cohesion: 0.10
Nodes (20): 1. AI Service Deployment (HuggingFace Spaces), 2. Next.js Deployment (Vercel), 3. Cross-Origin Resource Sharing (CORS) Protocol, 4. Vector Database Provisioning (pgvector), 504 Gateway Timeout on Vercel, 5. End-to-End Integration Testing, 6. System Troubleshooting, Deployment Guide: Vercel & HuggingFace Spaces (+12 more)

### Community 43 - "dotenv"
Cohesion: 0.13
Nodes (10): dotenv@^16.5.0, drizzle-kit@^0.31.4, dotenv, drizzle-kit, envLocalPath, assertTestDatabase(), closeDatabase(), resetDatabase() (+2 more)

### Community 44 - "users/page.tsx"
Cohesion: 0.20
Nodes (11): AdminUsersPage(), UsersFiltersBar(), UsersFiltersBarProps, UsersPagination(), UsersPaginationProps, UsersEmptyState(), UsersEmptyStateProps, UsersErrorState() (+3 more)

### Community 45 - "api/bookings/route.ts"
Cohesion: 0.13
Nodes (17): bcryptjs, BookingFilters, createBookingSchema, GET, parseFilters(), POST, DELETE(), favoriteBodySchema (+9 more)

### Community 46 - "design-playground/page.tsx"
Cohesion: 0.12
Nodes (30): DesignPlaygroundPage(), CompareKosItem, FloatingCompareDock(), FloatingCompareDockProps, BUDGET_PRESETS, DISTRICTS, MorphingSearchBar(), MorphingSearchBarProps (+22 more)

### Community 47 - "renter/bookings/page.tsx"
Cohesion: 0.22
Nodes (12): EditKosPage(), InputField(), InputFieldProps, TextAreaField(), TextAreaFieldProps, FacilitiesSuggestions(), FacilitiesSuggestionsProps, EditKosForm() (+4 more)

### Community 48 - "Docker Setup Guide for Kosera API"
Cohesion: 0.13
Nodes (14): Available Docker Commands, Database Operations, Development Commands, Development Environment, Docker Architecture, Docker Setup Guide for Kosera API, Health Checks, Networks (+6 more)

### Community 49 - "Dual Environment Setup Guide"
Cohesion: 0.13
Nodes (14): Command Line Interface (CLI) Directives, Deterministic Environment Detection, Docker Environment Commands, Docker Environment Setup, Docker Validation, Dual Environment Setup Guide, Infrastructure Validation, Local Development Commands (+6 more)

### Community 50 - "fail"
Cohesion: 0.05
Nodes (67): zod, getAIStatusHandler(), GET, bulkArchiveHandler(), bulkPermanentDeleteHandler(), DELETE, POST, bulkCleanupHandler() (+59 more)

### Community 51 - "useSemanticSearch.ts"
Cohesion: 0.48
Nodes (5): SemanticSearchFilters, SemanticSearchResponse, SemanticSearchResult, useAIServiceStatus(), useSemanticSearch()

### Community 52 - "UserDetailCard.tsx"
Cohesion: 0.22
Nodes (13): AvatarCircle(), AvatarCircleProps, UserActionButtons(), UserActionButtonsProps, UserRoleDescription(), UserRoleDescriptionProps, formatDate(), UserDetailCard() (+5 more)

### Community 53 - "ProductionMorphingSearchBar.tsx"
Cohesion: 0.13
Nodes (14): FilterBar(), FilterBarProps, BUDGET_CAP_PRESETS, ProductionMorphingSearchBarProps, SEMANTIC_VIBE_PRESETS, SpkWeightsInput, VibePreset, AIBadgeProps (+6 more)

### Community 54 - "Types Structure"
Cohesion: 0.25
Nodes (7): Benefits, File Structure, Import from main index (recommended), Import from specific modules, Migration, Types Structure, Usage

### Community 55 - "KOSERA SPK (AI-Enhanced Indekos Decision Support & Recommendation System)"
Cohesion: 0.17
Nodes (7): 1. Multi-Tenant Role-Based Access Control (RBAC), 2. Dual AI Microservice Architecture, Core Architecture & AI Engine, Documentation Modules, KOSERA SPK (AI-Enhanced Indekos Decision Support & Recommendation System), Technology Stack, Verification & Testing Commands

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
Cohesion: 0.13
Nodes (17): chart.js@^4.5.0, react-chartjs-2@^5.3.0, chart.js, react-chartjs-2, AdminDashboard(), StatCard(), StatCardProps, PlatformOverviewPanel() (+9 more)

### Community 60 - "RatingStars.tsx"
Cohesion: 0.17
Nodes (14): FavoriteButton(), FavoriteButtonProps, PriceTag(), PriceTagProps, RatingStars(), RatingStarsProps, sizeMap, ReviewItem() (+6 more)

### Community 61 - "ai/route.ts"
Cohesion: 0.11
Nodes (22): main(), AIStatusData, GET, IndexingResultData, POST, triggerIndexingHandler(), dynamic, GET() (+14 more)

### Community 62 - "dashboard.ts"
Cohesion: 0.18
Nodes (10): SellerDashboardKosItem, SellerDashboardKosItemParsed, sellerDashboardKosItemSchema, SellerDashboardKosStatistics, sellerDashboardKosStatisticsSchema, SellerDashboardResponseData, sellerDashboardResponseSchema, SellerDashboardStats (+2 more)

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
Cohesion: 0.22
Nodes (9): dynamic, POST(), chatFeedback, chatFeedbackSchema, computeAnonymizedSessionHash(), isFeedbackRateLimited(), rateLimitBuckets, resetFeedbackRateLimiter() (+1 more)

### Community 67 - "migrate-to-cloudinary.js"
Cohesion: 0.06
Nodes (41): compat, __dirname, eslintConfig, __filename, postgres@^3.4.7, postgres, db, __dirname (+33 more)

### Community 68 - "API Response Standard"
Cohesion: 0.18
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

### Community 72 - "users/route.ts"
Cohesion: 0.20
Nodes (10): BasicUser, createUserHandler(), createUserSchema, GET, getAllUsersHandler(), GetUsersQuery, parseQuery(), POST (+2 more)

### Community 73 - "login/page.tsx"
Cohesion: 0.09
Nodes (27): DEMO_ACCOUNTS, FormErrors, FormState, LoginPage(), LoginPageInner(), PasswordInput(), PasswordInputProps, SubmitButton() (+19 more)

### Community 74 - "UsersTable.tsx"
Cohesion: 0.23
Nodes (9): ActionIconButton(), ActionIconButtonProps, variants, Checkbox(), CheckboxProps, colors, UserRolePill(), UserRolePillProps (+1 more)

### Community 75 - "booking.ts"
Cohesion: 0.17
Nodes (12): BookingAdminClientProps, BookingApiResponse, BookingData, BookingDetailData, BookingDetailKos, BookingDetailPost, BookingDetailUser, BookingListQuery (+4 more)

### Community 76 - "Continuous Integration Workflow"
Cohesion: 0.20
Nodes (9): Adding New Test Suites, Caching, Continuous Integration Workflow, Database Strategy, Environment Variables, Future Enhancements, Job Structure, Overview (+1 more)

### Community 77 - "useAdminUsersList.ts"
Cohesion: 0.40
Nodes (5): UsersTableProps, UseAdminUsersListParams, UseAdminUsersListResult, AdminUserListItem, AdminUserListResponse

### Community 78 - "types/index.ts"
Cohesion: 0.14
Nodes (21): defaultForm, editKosResponseSchema, authApi, LoginCredentials, RegisterData, bookingsApi, CreateBookingData, GetBookingsParams (+13 more)

### Community 79 - "scoring.ts"
Cohesion: 0.27
Nodes (16): calculateDistance(), calculateFacilitiesScore(), calculateLocationScore(), calculateMatchingScore(), calculatePriceScore(), calculateRatingScore(), convertGapToWeight(), CORE_FACTOR_PERCENTAGE (+8 more)

### Community 80 - "volumes"
Cohesion: 0.22
Nodes (9): driver, driver, driver, driver, volumes, hf_cache, pgadmin_data, postgres_data (+1 more)

### Community 81 - "KoseraChatWidget.tsx"
Cohesion: 0.17
Nodes (14): ChatMarkdown, ChatMarkdownProps, renderInline(), sanitizeStreamingMarkdown(), ChatMessageRow, ChatMessageRowProps, EXCLUDED_PREFIXES, formatRupiah() (+6 more)

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
Cohesion: 0.22
Nodes (13): LeafletMap, MapSection(), MapSectionProps, SEMARANG_FALLBACK_CENTER, createFallbackCenterIcon(), createPricePinIcon(), isValidCoordinate(), MapCenterController() (+5 more)

### Community 86 - "UnifiedKosCard.tsx"
Cohesion: 0.15
Nodes (18): BookingCardActions, BookingCardProps, BookingDetails, BookingModal(), UnifiedKosCard(), UnifiedKosCardProps, UnifiedKosSpkDetails, FeaturedCard() (+10 more)

### Community 87 - "OverviewStatsPanel.tsx"
Cohesion: 0.21
Nodes (9): StatCard(), OverviewStatsPanel(), OverviewStatsPanelProps, OverviewStatsValues, PerformanceSummaryPanel(), PerformanceSummaryPanelProps, RecentActivityKosItem, RecentActivityPanelProps (+1 more)

### Community 88 - "seller/dashboard/page.tsx"
Cohesion: 0.23
Nodes (10): SellerDashboard(), EmptyState(), KosCard(), QuickActionsPanel(), QuickActionsPanelProps, RecentActivityPanel(), TipsInsightsPanel(), TipsInsightsPanelProps (+2 more)

### Community 90 - "common.ts"
Cohesion: 0.20
Nodes (12): AppError, ErrorResponse, FormErrors, PaginatedResponse, SweetAlertResult, FavoriteKos, FavoritesResponse, `booking.ts` (+4 more)

### Community 91 - "Platform Options"
Cohesion: 0.33
Nodes (6): 1. Vercel (Recommended), 2. Railway, 3. Digital Ocean App Platform, 4. AWS (Advanced), Platform Options, Production Deployment

### Community 92 - "environment"
Cohesion: 0.53
Nodes (6): environment, environment, PGDATA, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER

### Community 93 - "profile-matching.ts"
Cohesion: 0.14
Nodes (13): AvailableCity, AvailableFacility, DEFAULT_GAP_CONVERSION, DEFAULT_PROFILE_MATCHING_CONFIG, GapConversion, MatchingScoreDetails, ProfileMatchingConfig, ROOM_TYPES (+5 more)

### Community 95 - "chat/route.ts"
Cohesion: 0.27
Nodes (10): chatRequestSchema, dynamic, getToolStatusMessage(), maxDuration, POST(), runAgenticChat(), formatSSE(), getLLMServiceUrl() (+2 more)

### Community 96 - "Part A: Base Application, Database & CPU Embedding Service"
Cohesion: 0.20
Nodes (10): 1. Install Dependencies & Configure Environment, 2. Start PostgreSQL 16 (`pgvector`) & Apply Migrations, 3. Seed Kos Listings & Local Photos, 4. Start the CPU Embedding Service (Port `8000`) & Index Vectors, End-to-End Setup Guide (Base App + 3 AI Deployment Modes), Mode 1: Offline Setup (100% Local with Ollama GGUF), Mode 2: Hybrid Setup (Local App + Remote Google Colab Pro GPU), Mode 3: Online Setup (100% Cloud / Persistent Production) (+2 more)

### Community 97 - "🚀 Kosera Deployment Guide"
Cohesion: 0.40
Nodes (4): CI/CD Pipeline, GitHub Actions, 🚀 Kosera Deployment Guide, Overview

### Community 98 - "Local Development Setup"
Cohesion: 0.40
Nodes (5): 1. Clone and Install, 2. Environment Setup, 3. Database Setup, 4. Start Development Server, Local Development Setup

### Community 99 - "useProfileMatching.ts"
Cohesion: 0.44
Nodes (8): preferencesApi, profileMatchingKeys, useCreatePreferences(), useDeletePreferences(), usePreferencesManager(), useProfileMatching(), useUpdatePreferences(), useUserPreferences()

### Community 100 - "clsx"
Cohesion: 0.14
Nodes (10): clsx@^2.1.1, clsx, ButtonProps, ButtonSize, ButtonVariant, sizeClasses, variantClasses, InputProps (+2 more)

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

### Community 105 - "features/profile-matching/index.ts"
Cohesion: 0.31
Nodes (6): MatchingResultCard(), MatchingResultCardProps, MatchingScoreBar(), MatchingScoreBarProps, MatchingScoreIndicator(), MatchingScoreIndicatorProps

### Community 106 - "admin/kos/page.tsx"
Cohesion: 0.36
Nodes (4): AdminKosPage(), AdminKosFilter(), AdminKosHeader(), AdminKosHeaderProps

### Community 107 - "3. **Test Categories Implemented**"
Cohesion: 0.25
Nodes (8): 1. **Comprehensive Test Suite Setup**, 2. **Test Coverage**, 3. **Test Categories Implemented**, 🛡️ API Route Tests (`tests/auth/`, `tests/user/`, `tests/admin/`), 🔗 Integration Tests (`tests/integration/`), ⚡ Performance Tests (`tests/performance/`), 🔧 Unit Tests (`tests/unit/`), ✅ What We've Accomplished

### Community 108 - "Card.tsx"
Cohesion: 0.25
Nodes (3): CardHeaderProps, CardProps, paddingMap

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

### Community 115 - "useImageWithFallback.ts"
Cohesion: 0.36
Nodes (6): SafeImage(), SafeImageProps, ImageWithFallbackOptions, useImageWithFallback(), useKosImages(), validateImageUrl()

### Community 119 - "RecentActivitiesPanel.tsx"
Cohesion: 0.48
Nodes (5): ActivityItem(), ActivityItemData, ActivityItemProps, RecentActivitiesPanel(), RecentActivitiesPanelProps

### Community 120 - "types/user.ts"
Cohesion: 0.43
Nodes (6): `user.ts`, LoginRequest, LoginResponse, RegisterRequest, User, UserFormData

### Community 121 - "🏆 Key Features"
Cohesion: 0.40
Nodes (5): 1. **Automated Testing**, 2. **Mock System**, 3. **Security Testing**, 4. **Performance Monitoring**, 🏆 Key Features

### Community 126 - "🎯 Benefits for Your Project"
Cohesion: 0.40
Nodes (5): 1. **Quality Assurance**, 2. **Development Speed**, 3. **Documentation**, 4. **Production Readiness**, 🎯 Benefits for Your Project

### Community 127 - "🔄 Next Steps"
Cohesion: 0.40
Nodes (5): 1. **Run Tests Regularly**, 2. **Add More Tests**, 3. **CI/CD Integration**, 4. **Monitoring**, 🔄 Next Steps

### Community 128 - "useGeolocation.ts"
Cohesion: 0.40
Nodes (4): defaultOptions, GeolocationError, GeolocationState, UseGeolocationOptions

### Community 129 - "Environment Configurations"
Cohesion: 0.50
Nodes (4): 1. Local Development: `.env.local`, 2. Docker Environment: `.env.docker` (copied to `.env` for Compose), 3. Production Database Scripts: `.env.production`, Environment Configurations

## Knowledge Gaps
- **1 isolated node(s):** `RFC-4180`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1024 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `view/page.tsx` to `useGeolocation.ts`, `kos/[id]/page.tsx`, `Header`, `BookingAdminClient.tsx`, `package.json`, `react`, `renter/bookings/page.tsx`, `KosFormShell.tsx`, `sweetalert.ts`, `admin.ts`, `index.tsx`, `dependencies`, `KosCard.tsx`, `seller/kos/page.tsx`, `AuthContext.tsx`, `Providers.tsx`, `types/index.ts`, `useApi.ts`, `users/page.tsx`, `design-playground/page.tsx`, `renter/bookings/page.tsx`, `useSemanticSearch.ts`, `UserDetailCard.tsx`, `ProductionMorphingSearchBar.tsx`, `UserRoleStatusSection.tsx`, `admin/dashboard/page.tsx`, `RatingStars.tsx`, `useAdminDashboard.ts`, `login/page.tsx`, `UsersTable.tsx`, `useAdminUsersList.ts`, `types/index.ts`, `KoseraChatWidget.tsx`, `RealMap.tsx`, `UnifiedKosCard.tsx`, `OverviewStatsPanel.tsx`, `seller/dashboard/page.tsx`, `clsx`, `admin/kos/page.tsx`, `Card.tsx`, `useImageWithFallback.ts`, `RecentActivitiesPanel.tsx`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **What connects `RFC-4180` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `envelope.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08821548821548822 - nodes in this community are weakly interconnected._
- **Why does `zod` connect `fail` to `photos/route.ts`, `kos/[id]/page.tsx`, `package.json`, `drizzle-orm`, `schema.ts`, `sweetalert.ts`, `lib/auth.ts`, `ai-reindex.test.ts`, `admin.ts`, `dependencies`, `seller/kos/page.tsx`, `types/kos.ts`, `AuthContext.tsx`, `admin/bookings/route.ts`, `api/bookings/route.ts`, `dashboard.ts`, `feedback/route.ts`, `users/route.ts`, `login/page.tsx`, `types/index.ts`, `profile-matching.ts`, `chat/route.ts`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.03278688524590164 - nodes in this community are weakly interconnected._
- **Why does `KOSERA SPK (AI-Enhanced Indekos Decision Support & Recommendation System)` connect `KOSERA SPK (AI-Enhanced Indekos Decision Support & Recommendation System)` to `Part A: Base Application, Database & CPU Embedding Service`, `lib/ai/index.ts`, `lib/ai/index.ts`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `photos/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06233538191395961 - nodes in this community are weakly interconnected._