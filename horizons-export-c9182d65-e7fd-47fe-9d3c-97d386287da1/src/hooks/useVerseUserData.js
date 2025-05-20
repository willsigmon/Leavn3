import { useState, useCallback } from 'react';
    import { getAllUserData, setUserData } from '@/lib/indexedDBHelper';
    import { useToast } from '@/components/ui/use-toast';
    import { useLocalization } from '@/hooks/useLocalization';

    export const useVerseUserData = () => {
      const [verseUserData, setVerseUserData] = useState({});
      const { toast } = useToast();
      const { t } = useLocalization();

      const loadAllUserData = useCallback(async () => {
        try {
          const allData = await getAllUserData();
          const userDataMap = allData.reduce((acc, data) => {
            acc[data.verseId] = data;
            return acc;
          }, {});
          setVerseUserData(userDataMap);
        } catch (error) {
          console.error("Failed to load user data from IndexedDB", error);
          toast({ title: t('error'), description: t('loadUserDataError'), variant: "destructive" });
        }
      }, [toast, t]);

      const updateVerseUserData = useCallback(async (verseId, newData, successTitle, successDescription, errorDescription) => {
        try {
          await setUserData(newData);
          setVerseUserData(prev => ({ ...prev, [verseId]: newData }));
          toast({ 
            title: successTitle || t('success'), 
            description: successDescription || t('userDataSaved'), 
            variant: "default" 
          });
        } catch (error) {
          console.error("Failed to save user data for verse " + verseId, error);
          toast({ 
            title: t('error'), 
            description: errorDescription || t('userDataSaveError'), 
            variant: "destructive" 
          });
        }
      }, [toast, t]);

      return { verseUserData, loadAllUserData, updateVerseUserData };
    };