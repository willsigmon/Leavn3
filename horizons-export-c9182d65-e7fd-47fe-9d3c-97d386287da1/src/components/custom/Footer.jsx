import React from 'react';
    import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
    import { useLocalization } from '@/hooks/useLocalization';

    const FooterLink = ({ href = "#", children }) => (
      <li>
        <a href={href} className="text-sm text-muted-foreground hover:text-primary dark:hover:text-sky-300 transition-colors">
          {children}
        </a>
      </li>
    );

    const Footer = () => {
      const { t } = useLocalization();
      const currentYear = new Date().getFullYear();

      return (
        <footer className="bg-slate-100/70 dark:bg-slate-900/70 border-t border-slate-200 dark:border-slate-800/70 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-emerald-500 to-teal-500 dark:from-sky-400 dark:via-emerald-400 dark:to-teal-400 mb-2">
                  {t('appName')}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 max-w-md">
                  {t('footerDescription')}
                </p>
                <p className="text-xs text-muted-foreground/80 italic">
                  {t('footerTagline')}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">{t('footerResources')}</h4>
                <ul className="space-y-2">
                  <FooterLink>{t('footerBibleTranslations')}</FooterLink>
                  <FooterLink>{t('footerStudyGuides')}</FooterLink>
                  <FooterLink>{t('footerCommentary')}</FooterLink>
                  <FooterLink>{t('footerAudioBible')}</FooterLink>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">{t('footerCommunity')}</h4>
                <ul className="space-y-2">
                  <FooterLink>{t('footerOnlineGroups')}</FooterLink>
                  <FooterLink>{t('footerForums')}</FooterLink>
                  <FooterLink>{t('footerEvents')}</FooterLink>
                  <FooterLink>{t('footerPrayerRequests')}</FooterLink>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-3">{t('footerAbout')}</h4>
                <ul className="space-y-2">
                  <FooterLink>{t('footerOurMission')}</FooterLink>
                  <FooterLink>{t('footerOurAIApproach')}</FooterLink>
                  <FooterLink>{t('footerOurTeam')}</FooterLink>
                  <FooterLink>{t('footerContactUs')}</FooterLink>
                </ul>
              </div>

            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-xs text-muted-foreground mb-4 sm:mb-0">
                &copy; {currentYear} {t('appName')} {t('footerBibleStudy')}. {t('footerAllRightsReserved')}.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary dark:hover:text-sky-300 transition-colors" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary dark:hover:text-sky-300 transition-colors" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary dark:hover:text-sky-300 transition-colors" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary dark:hover:text-sky-300 transition-colors" aria-label="Youtube">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      );
    };

    export default Footer;
