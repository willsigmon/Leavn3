
import { createClient } from '@supabase/supabase-js';
    import fs from 'fs';
    import path from 'path';
    import { fileURLToPath } from 'url';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const BOOK_ORDER_MAP = {
      "Genesis": 1, "Exodus": 2, "Leviticus": 3, "Numbers": 4, "Deuteronomy": 5, "Joshua": 6, "Judges": 7, "Ruth": 8, 
      "1 Samuel": 9, "2 Samuel": 10, "1 Kings": 11, "2 Kings": 12, "1 Chronicles": 13, "2 Chronicles": 14, "Ezra": 15, 
      "Nehemiah": 16, "Esther": 17, "Job": 18, "Psalms": 19, "Proverbs": 20, "Ecclesiastes": 21, "Song of Solomon": 22, 
      "Isaiah": 23, "Jeremiah": 24, "Lamentations": 25, "Ezekiel": 26, "Daniel": 27, "Hosea": 28, "Joel": 29, "Amos": 30, 
      "Obadiah": 31, "Jonah": 32, "Micah": 33, "Nahum": 34, "Habakkuk": 35, "Zephaniah": 36, "Haggai": 37, "Zechariah": 38, 
      "Malachi": 39, "Matthew": 40, "Mark": 41, "Luke": 42, "John": 43, "Acts": 44, "Romans": 45, "1 Corinthians": 46, 
      "2 Corinthians": 47, "Galatians": 48, "Ephesians": 49, "Philippians": 50, "Colossians": 51, "1 Thessalonians": 52, 
      "2 Thessalonians": 53, "1 Timothy": 54, "2 Timothy": 55, "Titus": 56, "Philemon": 57, "Hebrews": 58, "James": 59, 
      "1 Peter": 60, "2 Peter": 61, "1 John": 62, "2 John": 63, "3 John": 64, "Jude": 65, "Revelation": 66
    };
    
    const TESTAMENT_MAP = {
        "Genesis": "Old", "Exodus": "Old", "Leviticus": "Old", "Numbers": "Old", "Deuteronomy": "Old", "Joshua": "Old", 
        "Judges": "Old", "Ruth": "Old", "1 Samuel": "Old", "2 Samuel": "Old", "1 Kings": "Old", "2 Kings": "Old", 
        "1 Chronicles": "Old", "2 Chronicles": "Old", "Ezra": "Old", "Nehemiah": "Old", "Esther": "Old", "Job": "Old", 
        "Psalms": "Old", "Proverbs": "Old", "Ecclesiastes": "Old", "Song of Solomon": "Old", "Isaiah": "Old", "Jeremiah": "Old", 
        "Lamentations": "Old", "Ezekiel": "Old", "Daniel": "Old", "Hosea": "Old", "Joel": "Old", "Amos": "Old", "Obadiah": "Old", 
        "Jonah": "Old", "Micah": "Old", "Nahum": "Old", "Habakkuk": "Old", "Zephaniah": "Old", "Haggai": "Old", "Zechariah": "Old", 
        "Malachi": "Old",
        "Matthew": "New", "Mark": "New", "Luke": "New", "John": "New", "Acts": "New", "Romans": "New", "1 Corinthians": "New", 
        "2 Corinthians": "New", "Galatians": "New", "Ephesians": "New", "Philippians": "New", "Colossians": "New", 
        "1 Thessalonians": "New", "2 Thessalonians": "New", "1 Timothy": "New", "2 Timothy": "New", "Titus": "New", 
        "Philemon": "New", "Hebrews": "New", "James": "New", "1 Peter": "New", "2 Peter": "New", "1 John": "New", 
        "2 John": "New", "3 John": "New", "Jude": "New", "Revelation": "New"
    };


    async function getOrCreate(tableName, matchData, insertData) {
      let { data, error } = await supabase.from(tableName).select('id').match(matchData).maybeSingle();
      if (error && error.code !== 'PGRST116') { 
        console.error(`Error checking for ${tableName} with match ${JSON.stringify(matchData)}:`, error);
        throw error;
      }
      if (data) return data.id;

      let { data: newData, error: insertError } = await supabase.from(tableName).insert(insertData).select('id').single();
      if (insertError) {
        console.error(`Error inserting into ${tableName} with data ${JSON.stringify(insertData)}:`, insertError);
        throw insertError;
      }
      return newData.id;
    }

    async function processBibleFile(filePath, versionAbbr, versionFullName, languageCode = "en") {
      console.log(`Processing ${filePath} for version ${versionAbbr}...`);
      const rawData = fs.readFileSync(filePath);
      const bibleData = JSON.parse(rawData);

      const versionId = await getOrCreate('bible_versions', 
        { abbreviation: versionAbbr }, 
        { name: versionFullName, abbreviation: versionAbbr, language_code: languageCode }
      );
      console.log(`Using Version ID: ${versionId} for ${versionAbbr}`);

      const bookNameFromFile = path.basename(filePath).split('_')[0]; 
      const bookName = bookNameFromFile.charAt(0).toUpperCase() + bookNameFromFile.slice(1);


      const bookOrder = BOOK_ORDER_MAP[bookName] || 999; // Default for unmapped books
      const testament = TESTAMENT_MAP[bookName] || "Unknown";

      const bookId = await getOrCreate('bible_books', 
        { name: bookName }, 
        { name: bookName, book_order: bookOrder, testament: testament }
      );
      console.log(`  Using Book ID: ${bookId} for ${bookName}`);

      for (const chapterNumStr in bibleData) {
        const chapterNumber = parseInt(chapterNumStr);
        console.log(`    Processing Chapter: ${chapterNumber}`);
        
        const chapterId = await getOrCreate('bible_chapters', 
          { book_id: bookId, chapter_number: chapterNumber },
          { book_id: bookId, chapter_number: chapterNumber }
        );

        const verses = bibleData[chapterNumStr];
        for (let i = 0; i < verses.length; i++) {
          const verseData = verses[i];
          const verseNumber = i + 1; // Assuming verse numbers are 1-indexed by their position in array

          const { data: existingVerse, error: checkVerseError } = await supabase
            .from('bible_verses')
            .select('id')
            .eq('version_id', versionId)
            .eq('chapter_id', chapterId)
            .eq('verse_number', verseNumber)
            .maybeSingle();

          if (checkVerseError && checkVerseError.code !== 'PGRST116') {
            console.error(`Error checking existing verse ${bookName} ${chapterNumber}:${verseNumber} (${versionAbbr})`, checkVerseError);
            continue; 
          }
          
          let currentVerseId;
          if (existingVerse) {
            currentVerseId = existingVerse.id;
          } else {
            const { data: newVerse, error: verseInsertError } = await supabase
              .from('bible_verses')
              .insert({
                version_id: versionId,
                chapter_id: chapterId,
                verse_number: verseNumber,
                text: verseData.text,
              })
              .select('id')
              .single();

            if (verseInsertError) {
              console.error(`Error inserting verse ${bookName} ${chapterNumber}:${verseNumber} (${versionAbbr})`, verseInsertError);
              continue; 
            }
            currentVerseId = newVerse.id;
          }


          if (verseData.tags && Array.isArray(verseData.tags)) {
            for (const tag of verseData.tags) {
              const tagId = await getOrCreate('tags', 
                { name: tag.name, type: tag.type || 'general' },
                { name: tag.name, type: tag.type || 'general', description: tag.description || '' }
              );
              
              const { error: verseTagError } = await supabase
                .from('verse_tags')
                .upsert({ verse_id: currentVerseId, tag_id: tagId }, { onConflict: 'verse_id,tag_id' });
              if (verseTagError) console.error(`Error linking tag '${tag.name}' to verse ${currentVerseId}`, verseTagError);
            }
          }

          if (verseData.location && typeof verseData.location === 'object') {
            const { error: locationError } = await supabase
              .from('verse_locations')
              .upsert({
                verse_id: currentVerseId,
                location_name: verseData.location.name,
                latitude: verseData.location.lat,
                longitude: verseData.location.lon,
                zoom_level: verseData.location.zoom,
              }, { onConflict: 'verse_id' });
            if (locationError) console.error(`Error inserting location for verse ${currentVerseId}`, locationError);
          }
        }
        console.log(`    Finished Chapter: ${chapterNumber}`);
      }
      console.log(`Finished processing ${bookName} for ${versionAbbr}.`);
    }

    async function main() {
      try {
        // Construct absolute paths to JSON files
        const filePathKJV_Genesis = path.resolve(__dirname, 'public', 'bible_data', 'genesis_kjv.json');
        const filePathWEB_Genesis = path.resolve(__dirname, 'public', 'bible_data', 'genesis_web.json');
        // You can add more file paths here, e.g., for Exodus:
        // const filePathKJV_Exodus = path.resolve(__dirname, 'public', 'bible_data', 'exodus_kjv.json');
        // const filePathWEB_Exodus = path.resolve(__dirname, 'public', 'bible_data', 'exodus_web.json');


        await processBibleFile(filePathKJV_Genesis, 'KJV', 'King James Version');
        await processBibleFile(filePathWEB_Genesis, 'WEB', 'World English Bible');
        
        // Example for Exodus (uncomment and ensure files exist if you want to run it)
        // await processBibleFile(filePathKJV_Exodus, 'KJV', 'King James Version');
        // await processBibleFile(filePathWEB_Exodus, 'WEB', 'World English Bible');

        console.log("Data population script finished.");
      } catch (error) {
        console.error("An error occurred during the data population process:", error);
      }
    }

    main();
