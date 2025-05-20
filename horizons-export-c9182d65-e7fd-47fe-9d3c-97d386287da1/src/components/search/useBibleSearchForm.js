import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from "@/components/ui/use-toast";
    import { useLocalization } from '@/hooks/useLocalization';

    export const useBibleSearchForm = () => {
      const { t } = useLocalization();
      const { toast } = useToast();

      const [searchTerm, setSearchTerm] = useState('');
      const [selectedVersion, setSelectedVersion] = useState('KJV');
      const [searchRange, setSearchRange] = useState('all'); 
      const [searchType, setSearchType] = useState('keyword'); 
      const [caseSensitive, setCaseSensitive] = useState(false);
      const [wholeWord, setWholeWord] = useState(false);
      const [selectedBooks, setSelectedBooks] = useState([]);
      const [availableBooks, setAvailableBooks] = useState([]);
      
      const [showAdvanced, setShowAdvanced] = useState(false); 
      const [displayFormat, setDisplayFormat] = useState('verse');


      useEffect(() => {
        const fetchBooks = async () => {
          const { data, error: dbError } = await supabase
            .from('bible_books')
            .select('id, name, testament, book_order')
            .order('book_order', { ascending: true });
          if (dbError) {
            console.error('Error fetching Bible books:', dbError);
            toast({ title: t('error'), description: t('errorFetchingBooks'), variant: "destructive" });
            setAvailableBooks([]);
          } else {
            setAvailableBooks(data || []);
          }
        };
        fetchBooks();
      }, [t, toast]);

      const handleBookSelection = useCallback((bookId) => {
        setSelectedBooks(prev =>
          prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
        );
      }, []);

      const clearSelectedBooks = useCallback(() => {
        setSelectedBooks([]);
      }, []);

      const selectAllBooks = useCallback(() => {
        setSelectedBooks(availableBooks.map(b => b.id));
      }, [availableBooks]);
      
      const bookColumns = Math.ceil(availableBooks.length / 15);
      const booksPerColumn = Math.ceil(availableBooks.length / (bookColumns > 0 ? bookColumns : 1));


      return {
        searchTerm, setSearchTerm,
        selectedVersion, setSelectedVersion,
        searchRange, setSearchRange,
        searchType, setSearchType,
        caseSensitive, setCaseSensitive,
        wholeWord, setWholeWord,
        selectedBooks, setSelectedBooks, handleBookSelection, clearSelectedBooks, selectAllBooks,
        availableBooks,
        bookColumns, booksPerColumn,
        showAdvanced, setShowAdvanced,
        displayFormat, setDisplayFormat,
      };
    };