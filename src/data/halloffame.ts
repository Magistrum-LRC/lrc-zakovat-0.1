import type { HallOfFameEntry } from "@/types";
import { mapHallOfFame } from "./mapZakovatData";
import { hallOfFame as rawHallOfFame } from "./zakovat_site_mock_data_expanded_topics";

const legacyPhotos: Partial<Record<HallOfFameEntry["season"], string>> = {
  "2022": "https://picsum.photos/seed/hof2022/600/400",
  "2023": "https://picsum.photos/seed/hof2023/600/400",
  "2024": "https://picsum.photos/seed/hof2024/600/400",
  "2025": "https://picsum.photos/seed/hof2025/600/400",
  "2026": "https://picsum.photos/seed/hof2026/600/400",
};

export const mockHallOfFame: HallOfFameEntry[] = mapHallOfFame(rawHallOfFame).map((entry) => ({
  ...entry,
  teamPhoto: entry.teamPhoto || legacyPhotos[entry.season],
}));
