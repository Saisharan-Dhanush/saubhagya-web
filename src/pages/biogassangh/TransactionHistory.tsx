/**
 * Transaction History Page for BiogasSangh Cluster
 * Displays all dung collection transactions for the cluster
 * With role-based filtering for BIOGAS_OPERATOR and GAUSHALA_MANAGER
 */

import GaushalaTransactionHistory from '../gaushala/TransactionHistory';

// Create a simple language context for the component
const defaultLanguageContext = {
  language: 'en' as const,
  setLanguage: () => {},
  t: (key: string) => key
};

export default function TransactionHistory() {
  return <GaushalaTransactionHistory languageContext={defaultLanguageContext} />;
}
