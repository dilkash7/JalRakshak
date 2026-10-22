import { describe, it, expect, beforeEach } from "vitest";
import { getStates, getDistricts, getTaluks, isValidTaluk } from "../../lib/geo-data";
import { findEligibleStaffForReport } from "../../lib/routing";
import { getDevUsers, getDevReports } from "../../lib/dev-store";

describe("Geographic Hierarchy & Deterministic Auto-Routing", () => {
  it("should return valid India states, UTs, and Karnataka districts from official LGD", () => {
    const states = getStates();
    // 28 States + 8 UTs = 36 total administrative units
    expect(states.length).toBe(36);
    expect(states).toContain("Karnataka");
    expect(states).toContain("Maharashtra");
    expect(states).toContain("Tamil Nadu");
    expect(states).toContain("Kerala");
    expect(states).toContain("Gujarat");
    expect(states).toContain("Uttar Pradesh");
    expect(states).toContain("Rajasthan");
    expect(states).toContain("Delhi");
    expect(states).toContain("Jammu and Kashmir");
    expect(states).toContain("Chandigarh");

    const karnatakaDistricts = getDistricts("Karnataka");
    expect(karnatakaDistricts).toContain("Dakshina Kannada");
    expect(karnatakaDistricts).toContain("Bengaluru Urban");
    expect(karnatakaDistricts).toContain("Udupi");
    expect(karnatakaDistricts).toContain("Mysuru");

    const dkTaluks = getTaluks("Karnataka", "Dakshina Kannada");
    expect(dkTaluks).toContain("Puttur");
    expect(dkTaluks).toContain("Mangaluru");
    expect(dkTaluks).toContain("Bantwal");
    expect(dkTaluks).toContain("Belthangady");
    expect(dkTaluks).toContain("Sullia");
    expect(dkTaluks).toContain("Kadaba");
    expect(dkTaluks).toContain("Moodabidri");

    expect(isValidTaluk("Karnataka", "Dakshina Kannada", "Puttur")).toBe(true);
    expect(isValidTaluk("Karnataka", "Dakshina Kannada", "NonExistentTaluk")).toBe(false);
  });

  it("should match Nominatim address components to official LGD directory entries", async () => {
    const { matchAddressToLgd } = await import("../../lib/geo-data");

    // Match Puttur town in Dakshina Kannada
    const matchPuttur = matchAddressToLgd({
      state: "Karnataka",
      county: "Dakshina Kannada",
      town: "Puttur",
    });
    expect(matchPuttur.state).toBe("Karnataka");
    expect(matchPuttur.district).toBe("Dakshina Kannada");
    expect(matchPuttur.taluk).toBe("Puttur");

    // Match Bandra suburb in Mumbai
    const matchBandra = matchAddressToLgd({
      state: "Maharashtra",
      district: "Mumbai Suburban",
      suburb: "Bandra",
    });
    expect(matchBandra.state).toBe("Maharashtra");
    expect(matchBandra.district).toBe("Mumbai Suburban");
    expect(matchBandra.taluk).toBe("Bandra");

    // Match Connaught Place in Delhi
    const matchDelhi = matchAddressToLgd({
      state: "Delhi",
      district: "New Delhi",
      subdistrict: "Connaught Place",
    });
    expect(matchDelhi.state).toBe("Delhi");
    expect(matchDelhi.district).toBe("New Delhi");
    expect(matchDelhi.taluk).toBe("Connaught Place");
  });

  it("should resolve offline GPS coordinates to accurate administrative boundaries", async () => {
    const { resolveOfflineLocation } = await import("../../lib/geo-data");

    // Puttur coordinates
    const putturLoc = resolveOfflineLocation(12.7663, 75.2045);
    expect(putturLoc.taluk).toBe("Puttur");
    expect(putturLoc.district).toBe("Dakshina Kannada");
    expect(putturLoc.state).toBe("Karnataka");

    // Mangaluru coordinates
    const mngLoc = resolveOfflineLocation(12.8702, 74.8436);
    expect(mngLoc.taluk).toBe("Mangaluru");
    expect(mngLoc.district).toBe("Dakshina Kannada");
    expect(mngLoc.state).toBe("Karnataka");

    // New Delhi coordinates
    const delhiLoc = resolveOfflineLocation(28.6139, 77.209);
    expect(delhiLoc.taluk).toBe("Connaught Place");
    expect(delhiLoc.district).toBe("New Delhi");
    expect(delhiLoc.state).toBe("Delhi");
  });

  it("should auto-route a Puttur report to Puttur Taluk Officer", async () => {
    const match = await findEligibleStaffForReport({
      state: "Karnataka",
      district: "Dakshina Kannada",
      taluk: "Puttur",
      city: "Puttur",
    });

    expect(match).not.toBeNull();
    expect(match?.name).toBe("Ramesh Bhat");
    expect(match?.taluk).toBe("Puttur");
  });

  it("should auto-route a Mangaluru report to Mangaluru Taluk Officer", async () => {
    const match = await findEligibleStaffForReport({
      state: "Karnataka",
      district: "Dakshina Kannada",
      taluk: "Mangaluru",
      city: "Mangaluru",
    });

    expect(match).not.toBeNull();
    expect(match?.name).toBe("Sunil Kumar");
    expect(match?.taluk).toBe("Mangaluru");
  });

  it("should return null (Unassigned Queue) if no officer is registered for a taluk", async () => {
    const match = await findEligibleStaffForReport({
      state: "Karnataka",
      district: "Dakshina Kannada",
      taluk: "Sullia", // No officer currently pre-seeded for Sullia
      city: "Sullia",
    });

    expect(match).toBeNull();
  });

  it("should return null if taluk is missing or undefined", async () => {
    const match = await findEligibleStaffForReport({
      state: "Karnataka",
      city: "Random Village",
    });

    expect(match).toBeNull();
  });
});
