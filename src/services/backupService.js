import { dbService } from './dbService';

const COLLECTIONS = [
  'settings', 'members', 'fundTransactions', 'donations', 
  'expenses', 'arrears', 'notices', 'activities', 
  'encouragement', 'constitutionChapters', 'constitutionClauses', 
  'constitutionVersions', 'auditLogs'
];

export const exportFullBackup = async () => {
  const backupData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    organization: 'Koztiraj Welfare Organization (KWO)',
    data: {}
  };

  for (const col of COLLECTIONS) {
    backupData.data[col] = await dbService.getAll(col);
  }

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `KWO_Backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const restoreFullBackup = async (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.data || typeof parsed.data !== 'object') {
      throw new Error('غلط فائل فارمیٹ! صحیح KWO بیک اپ فائل فراہم کریں۔');
    }

    for (const [colName, records] of Object.entries(parsed.data)) {
      if (Array.isArray(records)) {
        for (const record of records) {
          const { id, ...data } = record;
          if (id) {
            await dbService.setWithId(colName, id, data);
          } else {
            await dbService.add(colName, data);
          }
        }
      }
    }
    await dbService.logAudit('BACKUP_RESTORE', 'مکمل سسٹمی ڈیٹا بیس کی بحالی (Restore) کی گئی۔');
    return { success: true, message: 'ڈیٹا کامیابی سے بحال کر دیا گیا ہے!' };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
