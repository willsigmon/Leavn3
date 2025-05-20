import React from 'react';
    import { MapPin } from 'lucide-react';
    import { useLocalization } from '@/hooks/useLocalization';

    const MiniMap = ({ location }) => {
      const { t } = useLocalization();
      const defaultLocation = { lat: 31.7683, lon: 35.2137, zoom: 7, name: t('defaultLocationName') }; 
      const displayLocation = location && location.lat && location.lon ? { ...location, name: t(location.name) || location.name } : defaultLocation;
      const { lat, lon } = displayLocation;
      
      const effectiveZoom = displayLocation.zoom || (location ? 10 : 7);
      const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lon) - (18 / Math.pow(2, effectiveZoom))},${parseFloat(lat) - (9 / Math.pow(2, effectiveZoom))},${parseFloat(lon) + (18 / Math.pow(2, effectiveZoom))},${parseFloat(lat) + (9 / Math.pow(2, effectiveZoom))}&layer=mapnik&marker=${lat},${lon}`;


      return (
        <div className="aspect-video bg-muted dark:bg-muted/50 rounded-lg overflow-hidden relative border border-border dark:border-border/50">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={mapEmbedUrl}
            title={`${t('map')} of ${displayLocation.name}`}
            aria-label={`Embedded map showing ${displayLocation.name}`}
            style={{ border: 0 }}
          ></iframe>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <MapPin className="h-6 w-6 text-red-500 opacity-80" style={{transform: 'translateY(-50%)'}}/>
          </div>
        </div>
      );
    };

    export default MiniMap;