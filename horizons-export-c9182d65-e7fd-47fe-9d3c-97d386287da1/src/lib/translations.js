export const getInitialLanguage = () => {
      const savedLanguage = localStorage.getItem('appLanguage');
      if (savedLanguage && translations[savedLanguage]) {
        return savedLanguage;
      }
    
      const browserLanguage = navigator.language.split('-')[0];
      if (translations[browserLanguage]) {
        return browserLanguage;
      }
    
      return 'en'; 
    };

    export const translations = {
      en: {
        appName: "Leavn",
        searchPlaceholder: "E.g., Gen 1:1 or John 3:16-18",
        searchError: "Search Error",
        invalidFormat: "Invalid format. Use 'Book Chapter:Verse' (e.g., Gen 1:1).",
        bookNotFound: "Book '{{book}}' not found.",
        verseNotFound: "Verse not found.",
        settings: "Settings",
        language: "Language",
        darkMode: "Dark Mode",
        lightMode: "Light Mode",
        selectLanguage: "Select Language",
        languagePlaceholder: "Lang",
        featureComingSoon: "Feature Coming Soon",
        loading: "Loading...",
        error: "Error",
        success: "Success",
        noVerses: "No verses found for this chapter or the content is currently unavailable.",
        addNote: "Add Note",
        addNoteTo: "Add Note to",
        writeYourNoteBelow: "Write your personal reflections or notes for this verse below.",
        typeYourNoteHere: "Type your note here...",
        noteInput: "Note text input",
        editNote: "Edit Note",
        saveNote: "Save Note",
        deleteNote: "Delete Note",
        noteSaved: "Note saved!",
        noteDeleted: "Note deleted!",
        confirmDeleteNoteTitle: "Confirm Delete",
        confirmDeleteNoteMessage: "Are you sure you want to delete this note?",
        cancel: "Cancel",
        delete: "Delete",
        highlight: "Highlight",
        removeHighlight: "Remove Highlight",
        highlightApplied: "Highlight applied!",
        highlightRemoved: "Highlight removed!",
        tagVerse: "Tag Verse",
        tagSaved: "Tag saved!",
        tagRemoved: "Tag removed!",
        selectTag: "Select Tag",
        addCustomTag: "Add Custom Tag",
        customTagPlaceholder: "Enter custom tag...",
        scriptureReadingPane: "Scripture Reading Pane",
        companionSidebar: "Companion Sidebar",
        companionTitle: "Companion",
        aiInsights: "AI Insights",
        aiGeneratedContentFor: "AI-generated content for",
        mockDisclaimer: "(This is AI-generated mock data for demonstration purposes. Verify all information.)",
        maps: "Maps",
        noLocationData: "No location data available for this verse.",
        commentaries: "Commentaries",
        commentaryForVerse: "Commentary for {{verseId}}:",
        commentariesFeaturePlaceholder: "Commentary details will be shown here.",
        crossReferences: "Cross-References",
        crossReferencesFeaturePlaceholder: "Cross-references will appear here.",
        mockCrossRefText: "See also context in this chapter.",
        mockCrossRefTextAlt: "Compare with early Creation accounts.",
        anotherMockCrossRef: "Relevant psalm for thematic link.",
        historicalContext: "Historical Context",
        historicalContextFeaturePlaceholder: "Historical context information will appear here.",
        keyFigures: "Key Figures",
        keyFiguresFeaturePlaceholder: "Information about key figures will appear here.",
        viewRelatedVerses: "View Related Verses",
        noVerseSelected: "No verse selected.",
        noVerseSelectedForInsights: "Select a verse or multiple verses to see AI-powered insights.",
        noVerseSelectedForMap: "Select a verse with location data to display map.",
        noVerseSelectedForCommentaries: "Select a verse to see commentaries.",
        noDataAvailableForCommentaries: "No commentary data available for the selected verse(s).",
        noVerseSelectedForCrossReferences: "Select a verse to see cross-references.",
        noDataAvailableForCrossReferences: "No cross-reference data available for the selected verse(s).",
        noVerseSelectedForHistoricalContext: "Select a verse to see historical context.",
        noDataAvailableForHistoricalContext: "No historical context data available for the selected verse(s).",
        noVerseSelectedForKeyFigures: "Select a verse to see key figures.",
        noDataAvailableForKeyFigures: "No key figure data available for the selected verse(s).",
        noDataAvailableForAiInsights: "No AI insights available for the selected verse(s).",
        noDataAvailableForMaps: "No map data available for the selected verse(s).",
        openCompanionPanel: "Open Companion Panel",
        openStudyToolsPanel: "Open Study Tools Panel",
        studyToolsSidebar: "Study Tools Sidebar",
        studyToolsTitle: "Study Tools",
        preferences: "Preferences",
        generationalTone: "Generational Tone",
        genZ: "Gen Z",
        millennial: "Millennial",
        genX: "Gen X",
        boomer: "Boomer",
        theologicalViewpoint: "Theological Viewpoint",
        selectViewpoint: "Select Viewpoint...",
        jewish: "Jewish",
        evangelicalProtestant: "Evangelical / Protestant",
        catholic: "Catholic",
        orthodoxEastern: "Orthodox (Eastern)",
        agnostic: "Agnostic",
        atheist: "Atheist",
        academicCritical: "Academic / Critical",
        denomination: "Denomination",
        selectDenomination: "Select Denomination...",
        denominationNotApplicable: "N/A",
        baptist: "Baptist",
        methodist: "Methodist",
        lutheran: "Lutheran",
        anglicanEpiscopal: "Anglican / Episcopal",
        presbyterian: "Presbyterian",
        reformed: "Reformed",
        pentecostal: "Pentecostal",
        charismatic: "Charismatic",
        churchOfChrist: "Church of Christ",
        adventist: "Adventist",
        mennonite: "Mennonite",
        quaker: "Quaker",
        evangelicalFree: "Evangelical Free",
        nonDenominational: "Non-denominational",
        showTags: "Show Tags",
        verseDetails: "Verse Details",
        insightsFor: "Insights for",
        insights: "Insights",
        forVerse: "for verse",
        tagLabel: "Tag:",
        verseLabel: "Verse",
        clickToSelectVerse: "Click to select this verse.",
        noteIndicator: "Note indicator",
        highlightIndicator: "Highlight indicator",
        loadUserDataError: "Failed to load user data from local storage.",
        userDataSaved: "User data saved.",
        userDataSaveError: "Failed to save user data.",
        tagModalTitle: "Tag: {{tagName}}",
        loadingTagInfo: "Loading information for tag '{{tagName}}'...",
        exploreTagInsights: "Explore insights and related verses for '{{tagName}}'.",
        explanation: "Explanation",
        keyInsights: "Key Insights",
        relatedVerses: "Related Verses",
        close: "Close",
        tagErrorTitle: "Tag Information Error",
        tagErrorDescription: "Could not load details for this tag at the moment.",
        noTagDetails: "No details available for this tag.",
        goToVerse: "Go to verse",
        explanationForTag: "Detailed explanation for '{{tagName}}'",
        specificallyRelatedToVerse: "specifically related to {{book}} {{chapter}}:{{verseNum}}",
        tagSignifiesThemes: "This tag often signifies themes of {{tagName}} and its impact within biblical narratives",
        conceptOfTagFundamental: "The concept of '{{tagName}}' is foundational to understanding this passage.",
        considerTagInteraction: "Consider how '{{tagName}}' interacts with other themes in {{book}} {{chapter}}.",
        tagLinksToBroaderDiscussions: "This tag links {{book}} {{chapter}}:{{verseNum}} to broader biblical discussions on {{tagName}}.",
        exploringTagRevealsDeeperMeaning: "Exploring '{{tagName}}' reveals deeper theological implications.",
        historicalContextShedsLight: "Historical context often sheds light on the meaning of '{{tagName}}'.",

        "Grace": "Grace",
        "Faith": "Faith",
        "Love": "Love",
        "Hope": "Hope",
        "Redemption": "Redemption",
        "Salvation": "Salvation",
        "Sin": "Sin",
        "Repentance": "Repentance",
        "Forgiveness": "Forgiveness",
        "Prayer": "Prayer",
        "Prophecy": "Prophecy",
        "Miracle": "Miracle",
        "Covenant": "Covenant",
        "Law": "Law",
        "Messiah": "Messiah",
        "Resurrection": "Resurrection",
        "Kingdom of God": "Kingdom of God",
        "Holy Spirit": "Holy Spirit",
        "Discipleship": "Discipleship",
        "Worship": "Worship",
        "Exodus Event": "Exodus Event",
        "Davidic Kingdom": "Davidic Kingdom",
        "Babylonian Exile": "Babylonian Exile",
        "Crucifixion": "Crucifixion",
        "Pauline Epistles": "Pauline Epistles",
        "Creation": "Creation",
        "Fall of Man": "Fall of Man",
        "Abrahamic Covenant": "Abrahamic Covenant",
        "Mosaic Law": "Mosaic Law",
        "Judges Period": "Judges Period",
        "Temple Worship": "Temple Worship",
        "Wisdom Literature": "Wisdom Literature",
        "Apocalyptic Literature": "Apocalyptic Literature",
        "Genealogy": "Genealogy",
        "Parable": "Parable",
        "Sermon on the Mount": "Sermon on the Mount",
        "Last Supper": "Last Supper",
        "Early Church": "Early Church",
        "Missionary Journeys": "Missionary Journeys",
        "End Times": "End Times"
      },
      es: {
        appName: "Leavn",
        searchPlaceholder: "Ej., Gén 1:1 o Juan 3:16-18",
        searchError: "Error de Búsqueda",
        invalidFormat: "Formato inválido. Usa 'Libro Capítulo:Versículo' (ej., Gén 1:1).",
        bookNotFound: "Libro '{{book}}' no encontrado.",
        verseNotFound: "Versículo no encontrado.",
        settings: "Ajustes",
        language: "Idioma",
        darkMode: "Modo Oscuro",
        lightMode: "Modo Claro",
        selectLanguage: "Seleccionar Idioma",
        languagePlaceholder: "Idioma",
        featureComingSoon: "Función Próximamente",
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        noVerses: "No se encontraron versículos para este capítulo o el contenido no está disponible actualmente.",
        addNote: "Añadir Nota",
        addNoteTo: "Añadir Nota a",
        writeYourNoteBelow: "Escribe tus reflexiones personales o notas para este versículo abajo.",
        typeYourNoteHere: "Escribe tu nota aquí...",
        noteInput: "Entrada de texto de nota",
        editNote: "Editar Nota",
        saveNote: "Guardar Nota",
        deleteNote: "Eliminar Nota",
        noteSaved: "¡Nota guardada!",
        noteDeleted: "¡Nota eliminada!",
        confirmDeleteNoteTitle: "Confirmar Eliminación",
        confirmDeleteNoteMessage: "¿Estás seguro de que quieres eliminar esta nota?",
        cancel: "Cancelar",
        delete: "Eliminar",
        highlight: "Resaltar",
        removeHighlight: "Quitar Resaltado",
        highlightApplied: "¡Resaltado aplicado!",
        highlightRemoved: "¡Resaltado quitado!",
        tagVerse: "Etiquetar Versículo",
        tagSaved: "¡Etiqueta guardada!",
        tagRemoved: "¡Etiqueta eliminada!",
        selectTag: "Seleccionar Etiqueta",
        addCustomTag: "Añadir Etiqueta Personalizada",
        customTagPlaceholder: "Introduce etiqueta personalizada...",
        scriptureReadingPane: "Panel de Lectura de Escrituras",
        companionSidebar: "Barra Lateral Compañera",
        companionTitle: "Compañero",
        aiInsights: "Perspectivas IA",
        aiGeneratedContentFor: "Contenido generado por IA para",
        mockDisclaimer: "(Estos son datos simulados generados por IA para fines de demostración. Verifique toda la información.)",
        maps: "Mapas",
        noLocationData: "No hay datos de ubicación disponibles para este versículo.",
        commentaries: "Comentarios",
        commentaryForVerse: "Comentario para {{verseId}}:",
        commentariesFeaturePlaceholder: "Los detalles del comentario se mostrarán aquí.",
        crossReferences: "Referencias Cruzadas",
        crossReferencesFeaturePlaceholder: "Las referencias cruzadas aparecerán aquí.",
        mockCrossRefText: "Ver también contexto en este capítulo.",
        mockCrossRefTextAlt: "Comparar con relatos tempranos de la Creación.",
        anotherMockCrossRef: "Salmo relevante para vínculo temático.",
        historicalContext: "Contexto Histórico",
        historicalContextFeaturePlaceholder: "La información del contexto histórico aparecerá aquí.",
        keyFigures: "Figuras Clave",
        keyFiguresFeaturePlaceholder: "La información sobre figuras clave aparecerá aquí.",
        viewRelatedVerses: "Ver Versículos Relacionados",
        noVerseSelected: "Ningún versículo seleccionado.",
        noVerseSelectedForInsights: "Selecciona un versículo o varios para ver perspectivas potenciadas por IA.",
        noVerseSelectedForMap: "Selecciona un versículo con datos de ubicación para mostrar el mapa.",
        noVerseSelectedForCommentaries: "Selecciona un versículo para ver comentarios.",
        noDataAvailableForCommentaries: "No hay datos de comentarios disponibles para los versículos seleccionados.",
        noVerseSelectedForCrossReferences: "Selecciona un versículo para ver referencias cruzadas.",
        noDataAvailableForCrossReferences: "No hay datos de referencias cruzadas disponibles para los versículos seleccionados.",
        noVerseSelectedForHistoricalContext: "Selecciona un versículo para ver el contexto histórico.",
        noDataAvailableForHistoricalContext: "No hay datos de contexto histórico disponibles para los versículos seleccionados.",
        noVerseSelectedForKeyFigures: "Selecciona un versículo para ver figuras clave.",
        noDataAvailableForKeyFigures: "No hay datos de figuras clave disponibles para los versículos seleccionados.",
        noDataAvailableForAiInsights: "No hay perspectivas de IA disponibles para los versículos seleccionados.",
        noDataAvailableForMaps: "No hay datos de mapas disponibles para los versículos seleccionados.",
        openCompanionPanel: "Abrir Panel Compañero",
        openStudyToolsPanel: "Abrir Panel de Herramientas de Estudio",
        studyToolsSidebar: "Barra Lateral de Herramientas de Estudio",
        studyToolsTitle: "Herramientas de Estudio",
        preferences: "Preferencias",
        generationalTone: "Tono Generacional",
        genZ: "Gen Z",
        millennial: "Milenial",
        genX: "Gen X",
        boomer: "Boomer",
        theologicalViewpoint: "Punto de Vista Teológico",
        selectViewpoint: "Seleccionar Punto de Vista...",
        jewish: "Judío",
        evangelicalProtestant: "Evangélico / Protestante",
        catholic: "Católico",
        orthodoxEastern: "Ortodoxo (Oriental)",
        agnostic: "Agnóstico",
        atheist: "Ateo",
        academicCritical: "Académico / Crítico",
        denomination: "Denominación",
        selectDenomination: "Seleccionar Denominación...",
        denominationNotApplicable: "N/A",
        baptist: "Bautista",
        methodist: "Metodista",
        lutheran: "Luterano",
        anglicanEpiscopal: "Anglicano / Episcopal",
        presbyterian: "Presbiteriano",
        reformed: "Reformado",
        pentecostal: "Pentecostal",
        charismatic: "Carismático",
        churchOfChrist: "Iglesia de Cristo",
        adventist: "Adventista",
        mennonite: "Menonita",
        quaker: "Cuáquero",
        evangelicalFree: "Evangélico Libre",
        nonDenominational: "No Denominacional",
        showTags: "Mostrar Etiquetas",
        verseDetails: "Detalles del Versículo",
        insightsFor: "Perspectivas para",
        insights: "Perspectivas",
        forVerse: "para el versículo",
        tagLabel: "Etiqueta:",
        verseLabel: "Versículo",
        clickToSelectVerse: "Haz clic para seleccionar este versículo.",
        noteIndicator: "Indicador de nota",
        highlightIndicator: "Indicador de resaltado",
        loadUserDataError: "Error al cargar datos de usuario del almacenamiento local.",
        userDataSaved: "Datos de usuario guardados.",
        userDataSaveError: "Error al guardar datos de usuario.",
        tagModalTitle: "Etiqueta: {{tagName}}",
        loadingTagInfo: "Cargando información para la etiqueta '{{tagName}}'...",
        exploreTagInsights: "Explora perspectivas y versículos relacionados para '{{tagName}}'.",
        explanation: "Explicación",
        keyInsights: "Perspectivas Clave",
        relatedVerses: "Versículos Relacionados",
        close: "Cerrar",
        tagErrorTitle: "Error de Información de Etiqueta",
        tagErrorDescription: "No se pudieron cargar los detalles de esta etiqueta en este momento.",
        noTagDetails: "No hay detalles disponibles para esta etiqueta.",
        goToVerse: "Ir al versículo",
        explanationForTag: "Explicación detallada para '{{tagName}}'",
        specificallyRelatedToVerse: "específicamente relacionado con {{book}} {{chapter}}:{{verseNum}}",
        tagSignifiesThemes: "Esta etiqueta a menudo significa temas de {{tagName}} y su impacto dentro de las narrativas bíblicas",
        conceptOfTagFundamental: "El concepto de '{{tagName}}' es fundamental para entender este pasaje.",
        considerTagInteraction: "Considera cómo '{{tagName}}' interactúa con otros temas en {{book}} {{chapter}}.",
        tagLinksToBroaderDiscussions: "Esta etiqueta vincula {{book}} {{chapter}}:{{verseNum}} con discusiones bíblicas más amplias sobre {{tagName}}.",
        exploringTagRevealsDeeperMeaning: "Explorar '{{tagName}}' revela implicaciones teológicas más profundas.",
        historicalContextShedsLight: "El contexto histórico a menudo arroja luz sobre el significado de '{{tagName}}'.",
        
        "Grace": "Gracia",
        "Faith": "Fe",
        "Love": "Amor",
        "Hope": "Esperanza",
        "Redemption": "Redención",
        "Salvation": "Salvación",
        "Sin": "Pecado",
        "Repentance": "Arrepentimiento",
        "Forgiveness": "Perdón",
        "Prayer": "Oración",
        "Prophecy": "Profecía",
        "Miracle": "Milagro",
        "Covenant": "Pacto",
        "Law": "Ley",
        "Messiah": "Mesías",
        "Resurrection": "Resurrección",
        "Kingdom of God": "Reino de Dios",
        "Holy Spirit": "Espíritu Santo",
        "Discipleship": "Discipulado",
        "Worship": "Adoración",
        "Exodus Event": "Éxodo",
        "Davidic Kingdom": "Reino Davídico",
        "Babylonian Exile": "Exilio Babilónico",
        "Crucifixion": "Crucifixión",
        "Pauline Epistles": "Epístolas Paulinas",
        "Creation": "Creación",
        "Fall of Man": "Caída del Hombre",
        "Abrahamic Covenant": "Pacto Abrahámico",
        "Mosaic Law": "Ley Mosaica",
        "Judges Period": "Período de los Jueces",
        "Temple Worship": "Adoración en el Templo",
        "Wisdom Literature": "Literatura Sapiencial",
        "Apocalyptic Literature": "Literatura Apocalíptica",
        "Genealogy": "Genealogía",
        "Parable": "Parábola",
        "Sermon on the Mount": "Sermón del Monte",
        "Last Supper": "Última Cena",
        "Early Church": "Iglesia Primitiva",
        "Missionary Journeys": "Viajes Misioneros",
        "End Times": "Tiempos Finales"
      }
    };

