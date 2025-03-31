import { getSectorByName, insertSector } from '$lib/server/db/queries/sectors';
import { getIndustryByName, insertIndustry } from '$lib/server/db/queries/industries';
import { getCompanyByName, insertCompany, updateCompany } from '$lib/server/db/queries/companies';
import type { NewCompany } from '$lib/server/db/schema/companies';

export async function getOrCreateCompany(data: any): Promise<number> {
  const sectorName = data.Sector?.trim();
  const industryName = data.Industry?.trim();

  const sector = sectorName
    ? await getSectorByName(sectorName) ?? await insertSector({ name: sectorName })
    : null;

  const industry = industryName
    ? await getIndustryByName(industryName) ?? await insertIndustry({ name: industryName, sectorId: sector?.id ?? null })
    : null;

  const existing = await getCompanyByName(data.Name);

  const company: NewCompany = {
    name: data.Name,
    description: data.Description,
    address: data.Address,
    country: data.Country,
    officialSite: data.OfficialSite,
    exchange: data.Exchange,
    industryId: industry?.id ?? null
  };

  if (existing) {
    await updateCompany(existing.id, company);
    return existing.id;
  } else {
    const inserted = await insertCompany(company);
    return inserted.id;
  }
}
