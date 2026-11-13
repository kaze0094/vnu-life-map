> **Superseded for the 13/11 Student-first release:** use [current handoff/UAT](final-student-release.md) and [current QA](qa-student-final.md). Older hours/UI/access observations below are historical.

# VNU LIFE MAP — B2 competition handoff

Deadline: **15 November 2026**. Branch: `sprint-1-campus-map`, PR #1. Continue this branch; do not merge or deploy Production without approval.

## What is implemented

- A clear **Khám phá B2** homepage entry, `/b2` landing, and linked detailed real-location pages:
  - `/locations/ULIS-HOMIES-B2`
  - `/parking/ULIS-PARKING-B2`
- Vietnamese mobile-first UI, source/field-report badges, observation dates, map popups, search/categories, list navigation and tile-error fallback.
- Field facts supplied by the project team, surveyed **11/11/2026**, reported to this release on **12/11/2026**. These are separate dates. No photograph or identity document is published.
- Homies: **98 ghế ghi nhận khi khảo sát**, unknown official maximum, free use, ULIS student card checked by supervising staff. Amenities remain unverified. Specific schedule slots were not supplied, so no hours are invented; staff/student/approved-group activity sections are separated and schedule validity is pending confirmation. This is not unrestricted all-day access.
- Parking: mapped shared entrance/exit gate; approximately 480 motorcycles as team-reported operational capacity; historical approximately 400 figure kept separately in source notes; approximately 480–500 observed motorcycles is explicitly a past 11/11 observation. No current occupancy, free-space count or occupancy percentage is calculated. Fee 5,000 VND/entry; entry/exit card workflow and camera station are described without collecting any data.
- All XT-P01–XT-P11 records are preserved, pending and unplaced. Homies C3 and Đa năng remain pending with null coordinates. The original four public-source points remain source-verified, never relabeled field-verified.
- The three fictional Smart Parking lots remain in demo mode only, with accepted/rejected events, reset, recommendations and no geographic map/route.

## Limitations and remaining release gates

1. Detailed B2 schedule slots/document were not supplied. Effectiveness remains pending; ask supervising staff before visiting. No exact opening hours appear.
2. The historical guide is attributed to the team's supplied information; no public URL was supplied. It is not presented as current operational capacity or as a document inspected by this application.
3. Current occupancy/free-space counts, official maximum capacities and parking system provider remain unknown. Camera/card descriptions are field observations, not an implemented connection.
4. External basemap imagery must be checked on the team's network. This cloud browser previously rejected the tile certificate; list/details remain usable without imagery. TLS validation is never disabled and blocked services are not bypassed.
5. Supplied deployment URL `https://vnu-life-2q8bgefqi-vnu-life-map.vercel.app` redirects unauthenticated requests to Vercel SSO. It is **not currently a no-login public preview**. Hosting settings cannot be changed through the tools/account access available here. Follow the owner steps below and test in an incognito browser.

## Demo script — Vietnamese, about 2–3 minutes

| Time | Show | Suggested narration |
| --- | --- | --- |
| 0:00–0:25 | Homepage → Khám phá B2 | “VNU LIFE MAP giúp sinh viên tìm không gian học tập và gửi xe, với thông tin có nguồn. Bản thử nghiệm này tập trung vào hai địa điểm B2 được nhóm khảo sát ngày 11/11/2026.” |
| 0:25–1:00 | Homies B2 detail | “Tại Homies B2, nhóm đếm được 98 ghế. Đây là số ghế ghi nhận khi khảo sát, không phải sức chứa tối đa chính thức. Sinh viên cần thẻ ULIS và được cán bộ giám sát kiểm tra. Lịch còn chờ xác nhận, nên website không khẳng định được vào cả ngày. Những tiện ích chưa biết được ghi rõ là chưa xác minh.” |
| 1:00–1:40 | Nhà xe B2 detail and map popup | “Nhà xe dùng chung cổng vào và ra. Sức chứa vận hành được báo cáo khoảng 480 xe máy; số khoảng 400 trong hướng dẫn thi trước đây được ghi riêng. Khoảng 480–500 xe là quan sát quá khứ, không phải số xe hiện tại. Phí theo khảo sát là 5.000 đồng mỗi lượt. Chúng tôi không suy ra số chỗ còn trống từ các số liệu này.” |
| 1:40–2:05 | Search `C3`, show pending; map/list | “Website phân biệt thông tin khảo sát, thông tin từ nguồn công khai và địa điểm còn chờ xác minh. C3, Đa năng và 11 ứng viên bãi xe chưa có tọa độ được giữ trong danh sách, không đặt ghim tùy ý. Khi nền bản đồ lỗi, vẫn có thể dùng danh sách và xem nguồn.” |
| 2:05–2:35 | Demo mode → full lot, simulate exit, reset | “Đây là mô phỏng hoàn toàn hư cấu. Xe vào, xe ra làm thay đổi số chỗ trong mô phỏng và bãi đầy có gợi ý thay thế. Không có dữ liệu mô phỏng nào đưa lên bản đồ thực. Website hiện chưa kết nối hệ thống thẻ, camera hay biển số.” |
| 2:35–2:50 | Return to B2 | “Bản thử nghiệm ưu tiên thông tin rõ nguồn, điều kiện tiếp cận và trạng thái chưa biết. Kết nối hệ thống trong tương lai chỉ được thực hiện khi có sự cho phép và dữ liệu phù hợp.” |

If tiles are unavailable, demonstrate the list and location details; explain the network limitation rather than claiming a working geographic basemap. Do not label the fictional simulator as B2 occupancy.

## Future integration — not implemented or authorized

No backend, Supabase, AI API, card reader, camera, payment system, license-plate processing or parking-provider API is connected. Any future institution-approved card-system integration requires operator permission, technical access, privacy/data-minimization design, source/freshness semantics and separate implementation. Existing camera hardware does not establish API access or a usable occupancy count.

## Final user acceptance checklist

Run on Chrome and Edge desktop and a **390px-wide mobile viewport / actual phone**. Record URL, deployment commit, browser/device, network, tester and date.

- [ ] Open the deployment from incognito/mobile without Vercel login. Confirm the correct branch/commit and **Preview** environment. Do not infer Preview from the hostname.
- [ ] Homepage Khám phá B2 reaches `/b2`; both location cards and cross-links work. Directly reload both detail URLs.
- [ ] Homies shows exact wording “98 ghế ghi nhận khi khảo sát”, unknown official maximum, free fee, student-card/staff conditions and pending schedule validity. Staff/student/approved-group schedule sections are distinct. Unknown amenities remain unverified.
- [ ] Parking shows approximately 480 operational capacity, historical 400 separately, past 480–500 observation on 11/11 and no current free-space count/percentage. Fee, shared gate and entry/exit workflow are clear.
- [ ] Map shows two B2 team-reported points plus the four original public-source points, with different verification scope. B2 parking is explicitly a shared gate; Homies point is not described as a confirmed entrance.
- [ ] Actual tiles load with correct attribution on an authorized network. If not, fallback remains nonblocking, list link works and manual retry can recover.
- [ ] Source/date labels distinguish survey 11/11 from record/report date 12/11. No unrestricted access, institutional authorization or live integration claim appears.
- [ ] Search `B2` returns both B2 records; parking/study filters split them correctly. Search `C3` and `Đa năng`: pending, no geographic markers. XT-P01–XT-P11 inventory remains intact.
- [ ] Nonexistent search shows reset; invalid detail IDs return not-found UI. Navigation, keyboard focus and popup links work without horizontal page overflow.
- [ ] Demo mode is visibly fictional with no geographic map/route. Entry/exit/rejection/reset/recommendations work and returning to real mode does not leak counts.
- [ ] No names of individual students/staff, plates, card identifiers, images or sensitive credentials appear in pages/screenshots.
- [ ] Record any failing item and whether it blocks submission. Do not claim public/real-device acceptance until actually tested.

## Vercel Preview — owner actions

The existing Preview goal is authorized by the release request; Production is not. No paid service is needed.

1. Open the **existing** Vercel project associated with the supplied URL. GitHub reports a prior successful Vercel deployment for commit `4a1781b` at `https://vercel.com/vnu-life-map/vnu-life-map/8T97PtjWwHSAPyCyWVzcFkNH6CCk`; confirm the intended project/environment in the dashboard. Confirm linked repository `kaze0094/vnu-life-map`, production branch `main`, and prior deployment history. Do not create a new project whose first deployment would be Production-classified.
2. Use Next.js, root `./`, Node 22.x, `npm ci`, `npm run build`, framework-default output. No required environment variables; optional public tile URL/credit must be configured together according to provider policy. See [deployment-vercel.md](deployment-vercel.md).
3. Use **Deployments → Create Deployment**, branch `sprint-1-campus-map`, after checking the environment will be **Preview**. If Git integration automatically creates a Preview for the pushed commit, use that deployment instead of creating duplicates. Never promote or merge to trigger production.
4. To meet no-login competition access, an authorized project owner should open **Settings → Deployment Protection → Vercel Authentication**, disable authentication for the intended Preview scope if supported, and save. Review the scope displayed by Vercel; this can affect all previews in the project. Do not disable unrelated protection, add paid features, expose tokens or use bypass URLs as the competition URL. The app's public content contains no student identities, images or credentials.
5. If another access layer remains (password/trusted-IP/team-only protection), the owner must intentionally choose permitted public Preview access or report it as blocked; no bypass or account sharing. Do not change Production access settings.
6. Verify the latest commit, environment and URL in deployment details. Test the generated deployment URL from an incognito browser and a second mobile network with no Vercel session. Verify both detail pages and actual tile delivery, then complete UAT above.
7. Give the final public Preview URL to the team. A previous immutable deployment URL will not automatically serve a later release; confirm B2 content rather than reusing an old link by assumption.

No Vercel CLI, authentication-protection mutation or Production deployment was performed from this environment. No live integration has been added.

## Validation and submission artifacts

See [qa-b2-release.md](qa-b2-release.md) for commands, browser results, screenshots, changed-file groups and deployment blockers. Submission screenshots show the local production build unless expressly marked otherwise; they are not evidence that the protected Vercel URL has become public.

### Latest observed Preview

The Vercel bot reports **Ready** for B2 application commit `8d6bd31`: [branch Preview](https://vnu-life-map-git-sprint-1-campus-map-vnu-life-map.vercel.app), [deployment details](https://vercel.com/vnu-life-map/vnu-life-map/9M955Vxem6WxkAZLA5nL9q8Zjp1K). The branch URL returns HTTP 302 without authentication. It is a deployment link, **not yet a verified public no-login submission link**. Fix Preview access using owner steps above and complete UAT; do not share authentication bypass tokens.
