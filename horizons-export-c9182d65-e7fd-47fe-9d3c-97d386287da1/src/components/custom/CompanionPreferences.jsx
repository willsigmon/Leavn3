import React from 'react';
    import { motion } from 'framer-motion';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import SegmentedControl from '@/components/custom/SegmentedControl';
    import { Users, Smile, Coffee, Briefcase, Landmark, Feather, Building } from 'lucide-react';
    import { useLocalization } from '@/hooks/useLocalization';

    const CompanionPreferences = ({
      generationalTone,
      setGenerationalTone,
      theologicalViewpoint,
      setTheologicalViewpoint,
      denomination,
      setDenomination
    }) => {
      const { t } = useLocalization();

      const generationalTones = [
        { value: 'Gen Z', label: t('genZ'), icon: <Smile className="h-4 w-4" /> },
        { value: 'Millennial', label: t('millennial'), icon: <Coffee className="h-4 w-4" /> },
        { value: 'Gen X', label: t('genX'), icon: <Briefcase className="h-4 w-4" /> },
        { value: 'Boomer', label: t('boomer'), icon: <Users className="h-4 w-4" /> },
      ];

      const theologicalViewpoints = [
        { value: 'Jewish', label: t('jewish') },
        { value: 'Evangelical / Protestant', label: t('evangelicalProtestant') },
        { value: 'Catholic', label: t('catholic') },
        { value: 'Orthodox (Eastern)', label: t('orthodoxEastern') },
        { value: 'Agnostic', label: t('agnostic') },
        { value: 'Atheist', label: t('atheist') },
        { value: 'Academic / Critical', label: t('academicCritical') },
      ];

      const denominations = [
        { value: 'Baptist', label: t('baptist') },
        { value: 'Methodist', label: t('methodist') },
        { value: 'Lutheran', label: t('lutheran') },
        { value: 'Anglican / Episcopal', label: t('anglicanEpiscopal') },
        { value: 'Presbyterian', label: t('presbyterian') },
        { value: 'Reformed', label: t('reformed') },
        { value: 'Pentecostal', label: t('pentecostal') },
        { value: 'Charismatic', label: t('charismatic') },
        { value: 'Church of Christ', label: t('churchOfChrist') },
        { value: 'Adventist', label: t('adventist') },
        { value: 'Mennonite', label: t('mennonite') },
        { value: 'Quaker', label: t('quaker') },
        { value: 'Evangelical Free', label: t('evangelicalFree') },
        { value: 'Non-denominational', label: t('nonDenominational') },
        { value: 'N/A', label: t('denominationNotApplicable') },
      ];

      return (
        <div className="mb-6 space-y-4 p-1">
          <h3 className="text-base font-semibold text-foreground/90 mb-2 flex items-center">
            <Feather className="h-4 w-4 mr-2 opacity-80 text-primary" />
            {t('preferences')}
          </h3>
          <div>
            <label className="text-xs font-medium text-muted-foreground flex items-center mb-1.5">
              {t('generationalTone')}
            </label>
            <SegmentedControl
              options={generationalTones}
              value={generationalTone}
              onChange={setGenerationalTone}
              name="generationalTone"
            />
          </div>
          <div>
            <label htmlFor="theological-viewpoint" className="text-xs font-medium text-muted-foreground flex items-center mb-1.5">
              <Landmark className="h-3.5 w-3.5 mr-1.5 opacity-80" />
              {t('theologicalViewpoint')}
            </label>
            <Select value={theologicalViewpoint} onValueChange={setTheologicalViewpoint}>
              <SelectTrigger id="theological-viewpoint" className="w-full rounded-lg text-xs h-9" aria-label={t('theologicalViewpoint')}>
                <SelectValue placeholder={t('selectViewpoint')} />
              </SelectTrigger>
              <SelectContent>
                {theologicalViewpoints.map(vp => (
                  <SelectItem key={vp.value} value={vp.value} className="text-xs">{vp.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {theologicalViewpoint === 'Evangelical / Protestant' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div>
                <label htmlFor="denomination" className="text-xs font-medium text-muted-foreground flex items-center mb-1.5">
                   <Building className="h-3.5 w-3.5 mr-1.5 opacity-80" />
                  {t('denomination')}
                </label>
                <Select value={denomination} onValueChange={setDenomination}>
                  <SelectTrigger id="denomination" className="w-full rounded-lg text-xs h-9" aria-label={t('denomination')}>
                    <SelectValue placeholder={t('selectDenomination')} />
                  </SelectTrigger>
                  <SelectContent>
                    {denominations.map(d => (
                      <SelectItem key={d.value} value={d.value} className="text-xs">{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>
      );
    };

    export default CompanionPreferences;
