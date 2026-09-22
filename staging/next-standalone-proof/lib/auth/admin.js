export async function loadAdminOverview({ requireAdmin, getAdminOverview }) {
  const admin = await requireAdmin();
  const overview = await getAdminOverview();
  return { admin, overview };
}
