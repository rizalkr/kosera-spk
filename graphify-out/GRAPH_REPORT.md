# Graph Report - kosera-spk  (2026-11-18)

## Corpus Check
- 382 files · ~146,841 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 6, .example 1, .conf 1)

## Summary
- 2223 nodes · 5073 edges · 126 communities (114 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `513d2eaf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- envelope.ts
- scripts
- verifyToken
- kos/[id]/page.tsx
- Header
- types/index.ts
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
- photos/page.tsx
- lib/auth.ts
- 🎯 Kosera API Testing Summary
- useApi.ts
- admin.ts
- index.tsx
- dependencies
- seller/dashboard/page.tsx
- seller/kos/page.tsx
- types/kos.ts
- showSuccess
- AuthContext.tsx
- admin/bookings/route.ts
- ApiClient
- scoring.ts
- app.py
- Cloudinary Integration Guide
- hybrid.ts
- app/page.tsx
- compilerOptions
- UserDetailCard.tsx
- profile-matching.ts
- Deployment Guide: Vercel & HuggingFace Spaces
- dotenv
- users/page.tsx
- api/bookings/route.ts
- KosCard.tsx
- clsx
- Docker Setup Guide for Kosera API
- Dual Environment Setup Guide
- zod
- list/page.tsx
- admin/kos/page.tsx
- api.ts
- Files Overview
- README.md
- Implementation Details
- app
- transform-complete-kos.ts
- admin/dashboard/page.tsx
- register/page.tsx
- UsersTable.tsx
- api/auth.ts
- db
- ai-service
- pgadmin
- migrate-to-cloudinary.js
- UserRoleStatusSection.tsx
- API Response Standard
- Neon Test Database Setup
- copilot-instructions.md
- transform-scraped-kos.ts
- users/route.ts
- login/page.tsx
- dashboard.ts
- upload.ts
- Continuous Integration Workflow
- PlatformOverviewPanel.tsx
- cloudinary
- useProfileMatching.ts
- volumes
- useAdminDashboard.ts
- api-response.ts
- healthcheck
- db_test
- ref_path
- RealMap.tsx
- test-cloudinary.js
- RecentActivitiesPanel.tsx
- RecentActivityPanel.tsx
- types/user.ts
- Platform Options
- environment
- Card.tsx
- useAdminUsersList.ts
- features/profile-matching/index.ts
- BookingModal.tsx
- 🚀 Kosera Deployment Guide
- Local Development Setup
- useGeolocation.ts
- Features
- Monitoring and Logging
- Performance Optimization
- Database Deployment
- Security Configuration
- 6. System Troubleshooting
- Environment Configurations
- Documentation Modules
- Monitoring and Limits
- Backup and Recovery
- Scaling Considerations
- Troubleshooting
- Environment Configuration
- Security Checklist
- Prerequisites
- StatusBadge.tsx
- 01-init.sh
- fix-lint-errors.sh
- prettier@^3.5.3
- supertest@^7.1.1
- @types/supertest@^6.0.3
- typescript@^5
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `react` - 149 edges
2. `ok()` - 119 edges
3. `fail()` - 119 edges
4. `scripts` - 61 edges
5. `Header()` - 58 edges
6. `drizzle-orm` - 52 edges
7. `next` - 51 edges
8. `Footer()` - 49 edges
9. `db` - 49 edges
10. `verifyToken()` - 47 edges

## Surprising Connections (you probably didn't know these)
- ``src/lib/cloudinary.ts`` --references--> `extractPublicIdFromUrl()`  [INFERRED]
  blob/docs/cloudinary/cloudinary-integration.md → src/lib/cloudinary.ts
- ``src/lib/upload.ts`` --references--> `parseFormData()`  [INFERRED]
  blob/docs/cloudinary/cloudinary-integration.md → src/lib/upload.ts
- ``src/lib/upload.ts`` --references--> `validateImageFile()`  [INFERRED]
  blob/docs/cloudinary/cloudinary-integration.md → src/lib/upload.ts
- `Adding New Tests` --references--> `testFetch()`  [INFERRED]
  blob/docs/testing/docker-test-workflow.md → tests/helpers/testFetch.ts
- `Adding New Tests` --references--> `authFetch()`  [INFERRED]
  blob/docs/testing/docker-test-workflow.md → tests/helpers/testFetch.ts

## Import Cycles
- None detected.

## Communities (126 total, 12 thin omitted)

### Community 0 - "envelope.ts"
Cohesion: 0.07
Nodes (41): Adding New Tests, Auto Migration Option, Docker-Based Testing Workflow, Environment Variables, Future Enhancements, Persistence vs Isolation, Safety Mechanisms, Scripts Overview (+33 more)

### Community 1 - "scripts"
Cohesion: 0.03
Nodes (61): scripts, ai:index, build, ci:test, cloudinary:migrate, cloudinary:test, db:clear-photos, db:drop (+53 more)

### Community 2 - "verifyToken"
Cohesion: 0.07
Nodes (43): bcryptjs, GET(), GET(), POST(), DELETE(), GET(), GET(), UsageData (+35 more)

### Community 3 - "kos/[id]/page.tsx"
Cohesion: 0.07
Nodes (42): SellerKosDetailPage(), ErrorStateProps, SellerKosDetailError(), SellerKosDetailLoading(), colorMap, StatCard(), StatCardProps, HeaderSection() (+34 more)

### Community 4 - "Header"
Cohesion: 0.12
Nodes (30): nextConfig, next, CreateUserPage(), EditUserPage(), UserDetailPage(), BookingItem, BookingsPage(), ComplaintPage() (+22 more)

### Community 5 - "types/index.ts"
Cohesion: 0.08
Nodes (39): BookingAdminClient(), AdminBookingPage(), BookingStatusDropdown(), BookingStatusDropdownProps, BookingHistoryModal(), BookingHistoryModalProps, statusBadge(), useAdminBooking() (+31 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (55): devDependencies, autoprefixer@^10.4.21, dotenv-cli@^8.0.0, eslint@^9, eslint-config-next@15.3.1, eslint-config-prettier@^10.1.2, @eslint/eslintrc@^3, husky@^9.0.0 (+47 more)

### Community 7 - "drizzle-orm"
Cohesion: 0.12
Nodes (32): drizzle-orm, DELETE, POST, DELETE, PATCH(), RouteContext, toggleFeaturedHandler(), DELETE (+24 more)

### Community 8 - "fail"
Cohesion: 0.07
Nodes (47): GET, bulkArchiveHandler(), bulkPermanentDeleteHandler(), bulkCleanupHandler(), permanentDeleteKosHandler(), restoreKosHandler(), deleteKosHandler(), getAdminKosHandler() (+39 more)

### Community 9 - "view/page.tsx"
Cohesion: 0.07
Nodes (37): KosDetailPage(), Review, FavoriteButton(), FavoriteButtonProps, PriceTag(), PriceTagProps, RatingStars(), RatingStarsProps (+29 more)

### Community 10 - "lib/ai/index.ts"
Cohesion: 0.09
Nodes (41): main(), AIStatusData, GET, getAIStatusHandler(), IndexingResultData, POST, triggerIndexingHandler(), dynamic (+33 more)

### Community 11 - "react"
Cohesion: 0.11
Nodes (29): react, AdminKosTable(), AdminKosTableProps, KosTable(), KosTableProps, KosTableActions(), KosTableActionsProps, RowActionButtons() (+21 more)

### Community 12 - "app"
Cohesion: 0.05
Nodes (45): build, container_name, depends_on, environment, healthcheck, networks, ports, restart (+37 more)

### Community 13 - "📦 Database Design: Kosera Platform"
Cohesion: 0.05
Nodes (41): 1. users, 2. posts, 3. kos, 4. bookings, 5. reviews, 6. images, 7. payments, 8. favorites (+33 more)

### Community 14 - "schema.ts"
Cohesion: 0.06
Nodes (34): DELETE(), GET(), POST(), uploadPhotoSchema, POST(), Booking, BookingStatusHistory, Favorite (+26 more)

### Community 15 - "Features"
Cohesion: 0.05
Nodes (40): 10. Future Enhancements, 11. Support and Resources, 1. Enhanced Dashboard (`/admin/cloudinary`), 2. API Endpoints, 3. Optimization Features, 4. Monitoring Capabilities, 5. Database Integration, 6. Configuration (+32 more)

### Community 16 - "renter/bookings/page.tsx"
Cohesion: 0.10
Nodes (32): RenterBookingsPage(), RenterBookingsPageInner(), STATUS_VALUES, DetailRow(), fetchBooking(), SellerBookingDetailPage(), SellerBookingsPage(), SellerBookingsPageInner() (+24 more)

### Community 17 - "Profile Matching DSS (Decision Support System)"
Cohesion: 0.05
Nodes (40): 1. Price Criteria (Core Factor) - Default Weight: 52%, 1. Price Level, 1. User Preferences Management, 2. Distance Level, 2. Location Criteria (Core Factor) - Default Weight: 27%, 2. Recommendation Engine, 3. Facilities Criteria (Secondary Factor) - Default Weight: 15%, 3. Rating Level (+32 more)

### Community 18 - "KosFormShell.tsx"
Cohesion: 0.08
Nodes (27): FormErrorAlert(), FormErrorAlertProps, KosFormShell(), KosFormShellProps, BasicInfoValues, SectionBasicInfo(), SectionBasicInfoProps, SectionCoordinates() (+19 more)

### Community 19 - "with"
Cohesion: 0.06
Nodes (37): env, name, needs, runs-on, steps, concurrency, cancel-in-progress, group (+29 more)

### Community 20 - "photos/page.tsx"
Cohesion: 0.09
Nodes (29): sweetalert2, BookingDetail, BookingDetailApiResponse, BookingDetailPage(), BookingDetailResponse, BookingStatus, ErrorResponse, GenericErrorResponse (+21 more)

### Community 21 - "lib/auth.ts"
Cohesion: 0.10
Nodes (30): RFC-4180, loginSchema, POST(), POST(), registerSchema, favorites, reviews, cleanText() (+22 more)

### Community 22 - "🎯 Kosera API Testing Summary"
Cohesion: 0.06
Nodes (32): 1. **Automated Testing**, 1. **Comprehensive Test Suite Setup**, 1. **Quality Assurance**, 1. **Run Tests Regularly**, 2. **Add More Tests**, 2. **Development Speed**, 2. **Mock System**, 2. **Test Coverage** (+24 more)

### Community 23 - "useApi.ts"
Cohesion: 0.15
Nodes (17): RecommendationCarousel(), FeaturedCard(), FeaturedCardProps, ImageWithFallbackOptions, useKosImages(), validateImageUrl(), KosPhoto, useKosDetailView() (+9 more)

### Community 24 - "admin.ts"
Cohesion: 0.09
Nodes (22): UserEditFormProps, UserEditFormValues, AdminUserDetailResponse, AdminUserUpdateResponse, AnalyticsResponse, analyticsResponseSchema, analyticsSchema, BookingsOuterResponse (+14 more)

### Community 25 - "index.tsx"
Cohesion: 0.18
Nodes (17): BudgetSection(), FacilitiesSection(), DEFAULT_FORM_DATA, PreferencesForm(), PreferencesFormProps, LocationSection(), LocationSectionProps, RoomSection() (+9 more)

### Community 26 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs@^3.0.2, drizzle-orm@^0.44.2, jsonwebtoken@^9.0.2, next@^15.3.6, pg@^8.16.3, react@^19.0.0, react-dom@^19.0.0 (+15 more)

### Community 27 - "seller/dashboard/page.tsx"
Cohesion: 0.17
Nodes (15): SellerDashboard(), Button(), StatCard(), OverviewStatsPanel(), OverviewStatsPanelProps, OverviewStatsValues, PerformanceSummaryPanel(), PerformanceSummaryPanelProps (+7 more)

### Community 28 - "seller/kos/page.tsx"
Cohesion: 0.15
Nodes (16): SellerKosPage(), SellerKosListError(), SellerKosListLoading(), KosGrid(), KosGridProps, KosTips(), Tip(), StatsRow() (+8 more)

### Community 29 - "types/kos.ts"
Cohesion: 0.11
Nodes (20): KosImage(), KosImageProps, useKosImage(), useKosImages(), useKosPhotos(), AdminKosApiResponse, baseKosOwnerSchema, BaseKosPhoto (+12 more)

### Community 30 - "showSuccess"
Cohesion: 0.16
Nodes (19): handleConfirm(), handleSubmit(), ArrowRightIcon(), getRoleBadgeColor(), getRoleDisplayName(), LockIcon(), LogoutIcon(), ProfileMenuItem (+11 more)

### Community 31 - "AuthContext.tsx"
Cohesion: 0.11
Nodes (14): @tanstack/react-query@^5.81.5, @tanstack/react-query, geistMono, geistSans, metadata, RootLayout(), Providers(), AuthContext (+6 more)

### Community 32 - "admin/bookings/route.ts"
Cohesion: 0.16
Nodes (17): GET(), PATCH(), updateBookingStatusSchema, BookingItem, BookingKos, BookingsListData, BookingUser, GET() (+9 more)

### Community 34 - "scoring.ts"
Cohesion: 0.27
Nodes (17): calculateDistance(), calculateFacilitiesScore(), calculateLocationScore(), calculateMatchingScore(), calculatePriceScore(), calculateRatingScore(), convertGapToWeight(), CORE_FACTOR_PERCENTAGE (+9 more)

### Community 35 - "app.py"
Cohesion: 0.14
Nodes (8): _apply_prefix(), health(), _is_e5_model(), lifespan(), vectorize(), vectorize_batch(), VectorizeBatchRequest, VectorizeRequest

### Community 36 - "Cloudinary Integration Guide"
Cohesion: 0.10
Nodes (20): 1. Create Cloudinary Account, 2. Configure Environment Variables, 3. Database Migration, API Changes, Cloudinary Integration Guide, Common Issues, Debug Mode, Delete Endpoint: `DELETE /api/kos/[id]/photos` (+12 more)

### Community 37 - "hybrid.ts"
Cohesion: 0.17
Nodes (18): userPreferences, DEFAULT_HYBRID_WEIGHT_AI, DEFAULT_HYBRID_WEIGHT_PM, getHybridRecommendations(), HybridRecommendationOptions, HybridRecommendationResponse, normalizeSemanticScore(), getKosMatchingScore() (+10 more)

### Community 38 - "app/page.tsx"
Cohesion: 0.24
Nodes (14): HomePage(), LeafletMap, MapSection(), FeaturedList(), FilterBar(), FilterBarProps, KosList(), KosListProps (+6 more)

### Community 39 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 40 - "UserDetailCard.tsx"
Cohesion: 0.22
Nodes (13): AvatarCircle(), AvatarCircleProps, UserActionButtons(), UserActionButtonsProps, UserRoleDescription(), UserRoleDescriptionProps, formatDate(), UserDetailCard() (+5 more)

### Community 41 - "profile-matching.ts"
Cohesion: 0.12
Nodes (16): MatchingResultCardProps, HybridKosResult, AVAILABLE_FACILITIES, AvailableCity, AvailableFacility, DEFAULT_GAP_CONVERSION, DEFAULT_PROFILE_MATCHING_CONFIG, GapConversion (+8 more)

### Community 42 - "Deployment Guide: Vercel & HuggingFace Spaces"
Cohesion: 0.12
Nodes (16): 1. AI Service Deployment (HuggingFace Spaces), 2. Next.js Deployment (Vercel), 3. Cross-Origin Resource Sharing (CORS) Protocol, 4. Vector Database Provisioning (pgvector), 5. End-to-End Integration Testing, Deployment Guide: Vercel & HuggingFace Spaces, Direct AI Service Validation, Option A: Supabase (Recommended for direct pgvector support) (+8 more)

### Community 43 - "dotenv"
Cohesion: 0.13
Nodes (10): dotenv@^16.5.0, drizzle-kit@^0.31.4, dotenv, drizzle-kit, envLocalPath, assertTestDatabase(), closeDatabase(), resetDatabase() (+2 more)

### Community 44 - "users/page.tsx"
Cohesion: 0.20
Nodes (11): AdminUsersPage(), UsersFiltersBar(), UsersFiltersBarProps, UsersPagination(), UsersPaginationProps, UsersEmptyState(), UsersEmptyStateProps, UsersErrorState() (+3 more)

### Community 45 - "api/bookings/route.ts"
Cohesion: 0.19
Nodes (13): BookingFilters, createBookingSchema, GET, parseFilters(), POST, DELETE(), favoriteBodySchema, GET() (+5 more)

### Community 46 - "KosCard.tsx"
Cohesion: 0.15
Nodes (13): Card(), CardFooter(), EmptyState(), EmptyStateProps, EmptyStateVariant, variantClasses, KosCard(), KosCardBase (+5 more)

### Community 47 - "clsx"
Cohesion: 0.14
Nodes (10): clsx@^2.1.1, clsx, ButtonProps, ButtonSize, ButtonVariant, sizeClasses, variantClasses, InputProps (+2 more)

### Community 48 - "Docker Setup Guide for Kosera API"
Cohesion: 0.13
Nodes (14): Available Docker Commands, Database Operations, Development Commands, Development Environment, Docker Architecture, Docker Setup Guide for Kosera API, Health Checks, Networks (+6 more)

### Community 49 - "Dual Environment Setup Guide"
Cohesion: 0.13
Nodes (14): Command Line Interface (CLI) Directives, Deterministic Environment Detection, Docker Environment Commands, Docker Environment Setup, Docker Validation, Dual Environment Setup Guide, Infrastructure Validation, Local Development Commands (+6 more)

### Community 50 - "zod"
Cohesion: 0.14
Nodes (13): zod, checkRateLimit(), GeocodingData, GET, NominatimResult, querySchema, RateEntry, rateLimitStore (+5 more)

### Community 51 - "list/page.tsx"
Cohesion: 0.26
Nodes (11): DaftarKosPage(), AIBadge(), AIBadgeProps, SearchMode, SearchModeToggle(), SearchModeToggleProps, SemanticSearchFilters, SemanticSearchResponse (+3 more)

### Community 52 - "admin/kos/page.tsx"
Cohesion: 0.26
Nodes (10): AdminKosPage(), AdminKosFilter(), AdminKosFilterProps, AdminKosHeader(), AdminKosHeaderProps, useAdminKos(), useDebounce(), useFiltersDebounce() (+2 more)

### Community 53 - "api.ts"
Cohesion: 0.19
Nodes (11): GET, getProfileHandler(), withAnyRole, ApiResponse, createError(), createSuccess(), isSuccess(), jsonResponse() (+3 more)

### Community 54 - "Files Overview"
Cohesion: 0.14
Nodes (13): SweetAlertResult, Benefits, `booking.ts`, `common.ts`, `favorites.ts`, File Structure, Files Overview, Import from main index (recommended) (+5 more)

### Community 55 - "README.md"
Cohesion: 0.15
Nodes (9): 1. Environment Initialization, 2. Build & Deploy Containers, 3. Schema Migration & Vector Seeding, Core Architecture & Hybrid Recommendation Engine, Intelligent Hybrid Recommendation, KOSERA (Indekos Recommendation System Comparison), Local Development & Setup, Multi-Tenant Role-Based Access Control (RBAC) (+1 more)

### Community 56 - "Implementation Details"
Cohesion: 0.15
Nodes (12): Benefits over Tremor, Chart.js Configuration, Chart.js Integration for Admin Dashboard, Component: VisualizationPanel.tsx, Current Status, Data Structure, Dependencies Added, Implementation Details (+4 more)

### Community 57 - "app"
Cohesion: 0.15
Nodes (13): condition, command, container_name, depends_on, environment, networks, ports, restart (+5 more)

### Community 58 - "transform-complete-kos.ts"
Cohesion: 0.24
Nodes (12): cleanAddress(), extractFacilities(), extractKecamatan(), filterValidReviews(), generateDescription(), generatePrice(), main(), ScrapedKos (+4 more)

### Community 59 - "admin/dashboard/page.tsx"
Cohesion: 0.23
Nodes (9): AdminDashboard(), StatCard(), StatCardProps, defaultActions, QuickAction, QuickActionsPanel(), QuickActionsPanelProps, BookingData (+1 more)

### Community 60 - "register/page.tsx"
Cohesion: 0.22
Nodes (12): BaseInputProps, FormErrors, FormState, PasswordInput(), PasswordInputProps, RegisterPage(), SelectInput(), SelectInputProps (+4 more)

### Community 61 - "UsersTable.tsx"
Cohesion: 0.23
Nodes (9): ActionIconButton(), ActionIconButtonProps, variants, Checkbox(), CheckboxProps, colors, UserRolePill(), UserRolePillProps (+1 more)

### Community 62 - "api/auth.ts"
Cohesion: 0.18
Nodes (11): authApi, LoginCredentials, RegisterData, authTokenResponseSchema, AuthTokenResponseSchema, loginResponseSchema, loginSchema, LoginSchema (+3 more)

### Community 63 - "db"
Cohesion: 0.17
Nodes (11): container_name, image, networks, ports, restart, volumes, driver, networks (+3 more)

### Community 64 - "ai-service"
Cohesion: 0.18
Nodes (12): build, container_name, environment, networks, ports, restart, volumes, build (+4 more)

### Community 65 - "pgadmin"
Cohesion: 0.17
Nodes (12): PGADMIN_CONFIG_SERVER_MODE, PGADMIN_DEFAULT_EMAIL, PGADMIN_DEFAULT_PASSWORD, container_name, depends_on, environment, image, networks (+4 more)

### Community 66 - "migrate-to-cloudinary.js"
Cohesion: 0.18
Nodes (10): postgres@^3.4.7, postgres, db, __dirname, __filename, kosPhotos, migrateLocalImagesToCloudinary(), rl (+2 more)

### Community 67 - "UserRoleStatusSection.tsx"
Cohesion: 0.26
Nodes (8): InfoLabelValue(), InfoLabelValueProps, UserRoleBadge(), UserRoleBadgeProps, UserBasicInfoSection(), UserBasicInfoSectionProps, UserRoleStatusSection(), UserRoleStatusSectionProps

### Community 68 - "API Response Standard"
Cohesion: 0.18
Nodes (11): API Response Standard, Core Principles, Envelope Structure, Examples, Future Enhancements (TODO), Helper Functions, HTTP Status Guidelines, Implementation Checklist Per Endpoint (+3 more)

### Community 69 - "Neon Test Database Setup"
Cohesion: 0.18
Nodes (10): Branching (Planned), Common Issues, Connection Pooling, Environment Variables, Migrations, Neon Test Database Setup, Purpose, Reset Strategy (+2 more)

### Community 70 - "copilot-instructions.md"
Cohesion: 0.18
Nodes (10): Code Style: ## Write clean, readable, and maintainable code. Add JSDoc comments for complex functions to explain their purpose, parameters, and return values., Commit Messages:, Components:, Documentation:, Framework:, Language:, LEAST BUT important:, NPM: (+2 more)

### Community 71 - "transform-scraped-kos.ts"
Cohesion: 0.29
Nodes (10): extractFacilities(), extractNameFromUrl(), generateAddress(), generateDescription(), generatePrice(), main(), ScrapedKos, ScrapedReview (+2 more)

### Community 72 - "users/route.ts"
Cohesion: 0.20
Nodes (10): BasicUser, createUserHandler(), createUserSchema, GET, getAllUsersHandler(), GetUsersQuery, parseQuery(), POST (+2 more)

### Community 73 - "login/page.tsx"
Cohesion: 0.25
Nodes (10): FormErrors, FormState, LoginPage(), LoginPageInner(), PasswordInput(), PasswordInputProps, SubmitButton(), SubmitButtonProps (+2 more)

### Community 74 - "dashboard.ts"
Cohesion: 0.18
Nodes (10): SellerDashboardKosItem, SellerDashboardKosItemParsed, sellerDashboardKosItemSchema, SellerDashboardKosStatistics, sellerDashboardKosStatisticsSchema, SellerDashboardResponseData, sellerDashboardResponseSchema, SellerDashboardStats (+2 more)

### Community 75 - "upload.ts"
Cohesion: 0.22
Nodes (9): `src/lib/cloudinary.ts`, `src/lib/upload.ts`, Utility Functions, multer@^2.0.2, multer, MulterFile, parseFormData(), upload (+1 more)

### Community 76 - "Continuous Integration Workflow"
Cohesion: 0.20
Nodes (9): Adding New Test Suites, Caching, Continuous Integration Workflow, Database Strategy, Environment Variables, Future Enhancements, Job Structure, Overview (+1 more)

### Community 77 - "PlatformOverviewPanel.tsx"
Cohesion: 0.24
Nodes (8): chart.js@^4.5.0, react-chartjs-2@^5.3.0, chart.js, react-chartjs-2, PlatformOverviewPanel(), PlatformOverviewPanelProps, UserCompositionChart(), UserCompositionData

### Community 78 - "cloudinary"
Cohesion: 0.20
Nodes (4): cloudinary@^2.7.0, cloudinary, ImageTransformations, ResponsiveImageSets

### Community 79 - "useProfileMatching.ts"
Cohesion: 0.44
Nodes (8): preferencesApi, profileMatchingKeys, useCreatePreferences(), useDeletePreferences(), usePreferencesManager(), useProfileMatching(), useUpdatePreferences(), useUserPreferences()

### Community 80 - "volumes"
Cohesion: 0.22
Nodes (9): driver, driver, driver, driver, volumes, hf_cache, pgadmin_data, postgres_data (+1 more)

### Community 81 - "useAdminDashboard.ts"
Cohesion: 0.28
Nodes (8): DashboardStats, getRelativeTime(), getTimeFromRelative(), RecentActivity, useAdminDashboard(), AnalyticsData, BookingsData, UsersData

### Community 82 - "api-response.ts"
Cohesion: 0.31
Nodes (8): ApiError, ApiResponse, ApiSuccess, buildHeaders(), json(), jsonError(), JsonInit, jsonSuccess()

### Community 83 - "healthcheck"
Cohesion: 0.46
Nodes (8): healthcheck, healthcheck, healthcheck, interval, retries, start_period, test, timeout

### Community 84 - "db_test"
Cohesion: 0.25
Nodes (8): container_name, image, networks, ports, profiles, restart, volumes, db_test

### Community 85 - "ref_path"
Cohesion: 0.25
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 86 - "RealMap.tsx"
Cohesion: 0.29
Nodes (5): leaflet@^1.9.4, react-leaflet@^5.0.0, leaflet, react-leaflet, Props

### Community 87 - "test-cloudinary.js"
Cohesion: 0.38
Nodes (5): deleteFromCloudinary(), __dirname, __filename, testCloudinaryIntegration(), uploadToCloudinary()

### Community 88 - "RecentActivitiesPanel.tsx"
Cohesion: 0.48
Nodes (5): ActivityItem(), ActivityItemData, ActivityItemProps, RecentActivitiesPanel(), RecentActivitiesPanelProps

### Community 89 - "RecentActivityPanel.tsx"
Cohesion: 0.38
Nodes (5): RecentActivityKosItem, RecentActivityPanel(), RecentActivityPanelProps, ActivityType, getActivityIcon()

### Community 90 - "types/user.ts"
Cohesion: 0.43
Nodes (6): `user.ts`, LoginRequest, LoginResponse, RegisterRequest, User, UserFormData

### Community 91 - "Platform Options"
Cohesion: 0.33
Nodes (6): 1. Vercel (Recommended), 2. Railway, 3. Digital Ocean App Platform, 4. AWS (Advanced), Platform Options, Production Deployment

### Community 92 - "environment"
Cohesion: 0.53
Nodes (6): environment, environment, PGDATA, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER

### Community 93 - "Card.tsx"
Cohesion: 0.33
Nodes (3): CardHeaderProps, CardProps, paddingMap

### Community 94 - "useAdminUsersList.ts"
Cohesion: 0.40
Nodes (5): UsersTableProps, UseAdminUsersListParams, UseAdminUsersListResult, AdminUserListItem, AdminUserListResponse

### Community 95 - "features/profile-matching/index.ts"
Cohesion: 0.47
Nodes (4): MatchingScoreBar(), MatchingScoreBarProps, MatchingScoreIndicator(), MatchingScoreIndicatorProps

### Community 96 - "BookingModal.tsx"
Cohesion: 0.47
Nodes (5): BookingDetails, BookingModal(), BookingModalProps, useCreateBooking(), showCustomAlert()

### Community 97 - "🚀 Kosera Deployment Guide"
Cohesion: 0.40
Nodes (4): CI/CD Pipeline, GitHub Actions, 🚀 Kosera Deployment Guide, Overview

### Community 98 - "Local Development Setup"
Cohesion: 0.40
Nodes (5): 1. Clone and Install, 2. Environment Setup, 3. Database Setup, 4. Start Development Server, Local Development Setup

### Community 99 - "useGeolocation.ts"
Cohesion: 0.40
Nodes (4): defaultOptions, GeolocationError, GeolocationState, UseGeolocationOptions

### Community 100 - "Features"
Cohesion: 0.50
Nodes (4): 1. Image Upload, 2. Image Management, 3. Image Optimization, Features

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

### Community 105 - "6. System Troubleshooting"
Cohesion: 0.50
Nodes (4): 504 Gateway Timeout on Vercel, 6. System Troubleshooting, HuggingFace Container Fails to Start, Vector Embedding Fails to Persist

### Community 106 - "Environment Configurations"
Cohesion: 0.50
Nodes (4): 1. Local Development: `.env.local`, 2. Docker Environment: `.env.docker` (copied to `.env` for Compose), 3. Production Database Scripts: `.env.production`, Environment Configurations

### Community 107 - "Documentation Modules"
Cohesion: 0.50
Nodes (4): Core Logic & API, Documentation Modules, Infrastructure & Deployment, Quality Assurance

### Community 108 - "Monitoring and Limits"
Cohesion: 0.67
Nodes (3): Free Tier Limits (Cloudinary), Monitoring and Limits, Recommendations

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

## Knowledge Gaps
- **1 isolated node(s):** `RFC-4180`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 928 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `kos/[id]/page.tsx`, `Header`, `types/index.ts`, `package.json`, `view/page.tsx`, `renter/bookings/page.tsx`, `KosFormShell.tsx`, `photos/page.tsx`, `useApi.ts`, `admin.ts`, `index.tsx`, `dependencies`, `seller/dashboard/page.tsx`, `seller/kos/page.tsx`, `showSuccess`, `AuthContext.tsx`, `app/page.tsx`, `UserDetailCard.tsx`, `users/page.tsx`, `KosCard.tsx`, `clsx`, `list/page.tsx`, `admin/kos/page.tsx`, `admin/dashboard/page.tsx`, `register/page.tsx`, `UsersTable.tsx`, `UserRoleStatusSection.tsx`, `login/page.tsx`, `PlatformOverviewPanel.tsx`, `useAdminDashboard.ts`, `RecentActivitiesPanel.tsx`, `RecentActivityPanel.tsx`, `Card.tsx`, `useAdminUsersList.ts`, `BookingModal.tsx`, `useGeolocation.ts`, `StatusBadge.tsx`?**
  _High betweenness centrality (0.233) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Header()` (e.g. with `handleClickOutside()` and `handleScroll()`) actually correct?**
  _`Header()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `envelope.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0745637228979376 - nodes in this community are weakly interconnected._
- **Why does `zod` connect `zod` to `verifyToken`, `kos/[id]/page.tsx`, `types/index.ts`, `package.json`, `drizzle-orm`, `fail`, `lib/ai/index.ts`, `schema.ts`, `photos/page.tsx`, `lib/auth.ts`, `admin.ts`, `dependencies`, `seller/kos/page.tsx`, `types/kos.ts`, `AuthContext.tsx`, `admin/bookings/route.ts`, `profile-matching.ts`, `api/bookings/route.ts`, `register/page.tsx`, `api/auth.ts`, `users/route.ts`, `login/page.tsx`, `dashboard.ts`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.03278688524590164 - nodes in this community are weakly interconnected._
- **Why does `Cloudinary Integration Guide` connect `Cloudinary Integration Guide` to `Monitoring and Limits`, `upload.ts`, `Features`, `README.md`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._