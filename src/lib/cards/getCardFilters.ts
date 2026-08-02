export async function getCardFilters(
  searchParams: Promise<{
    q?: string;
    tcg?: string;
    rarity?: string;
    set?: string;
  }>,
) {
  const params = await searchParams;

  return {
    query: params.q,

    tcgs: params.tcg ? params.tcg.split(",") : [],

    rarities: params.rarity ? params.rarity.split(",") : [],

    sets: params.set ? params.set.split(",") : [],
  };
}
