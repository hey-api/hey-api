export const SEA_MANIFEST_KEY = 'clients/__manifest__.json';

export function seaAssetKey(clientName: string, fileName: string): string {
  return `clients/${clientName}/${fileName}`;
}
