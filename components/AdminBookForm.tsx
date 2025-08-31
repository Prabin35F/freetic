import React, { useState, useEffect, FormEvent } from 'react';
import { Book, BookCategory } from '../types';
import { CATEGORIES } from '../constants';
import { useToast } from './Toast';
import { RichTextEditor } from './RichTextEditor';

interface AdminBookFormProps {
  bookToEdit?: Book | null;
  onSave: (book: Book, podcastFile?: File | null) => void;
  onCancel?: () => void;
}

export const AdminBookForm: React.FC<AdminBookFormProps> = ({ bookToEdit, onSave, onCancel }) => {
  const initialFormState: Book = {
    id: bookToEdit?.id || Date.now().toString(),
    title: bookToEdit?.title || '',
    author: bookToEdit?.author || '',
    publicationYear: bookToEdit?.publicationYear || undefined,
    coverImageUrl: bookToEdit?.coverImageUrl || 'https://picsum.photos/200/300',
    carouselCoverImageUrl: bookToEdit?.carouselCoverImageUrl || 'https://picsum.photos/1920/1080',
    visualSceneImageUrl: bookToEdit?.visualSceneImageUrl || 'https://picsum.photos/1200/675',
    caption: bookToEdit?.caption || '',
    tags: bookToEdit?.tags || [],
    detailedSummary: bookToEdit?.detailedSummary || '',
    brutalTruth: bookToEdit?.brutalTruth || '',
    coreValueParagraph: bookToEdit?.coreValueParagraph || '',
    whyThisBookIsPerfect: bookToEdit?.whyThisBookIsPerfect || '',
    podcastUrl: bookToEdit?.podcastUrl || '',
    podcastTitle: bookToEdit?.podcastTitle || '',
    podcastDuration: bookToEdit?.podcastDuration || '',
    trailerUrl: bookToEdit?.trailerUrl || '',
    externalLink: bookToEdit?.externalLink || '',
    oneLinerHook: bookToEdit?.oneLinerHook || '',
    category: bookToEdit?.category || CATEGORIES[0],
    createdAt: bookToEdit?.createdAt || undefined,
    isSignature: bookToEdit?.isSignature || false,
    isFeaturedInTopCarousel: bookToEdit?.isFeaturedInTopCarousel || false,
    isPushedToTop: bookToEdit?.isPushedToTop || false,
    isTrending: bookToEdit?.isTrending || false,
    isHot: bookToEdit?.isHot || false,
    isRecommended: bookToEdit?.isRecommended || false,
    isTodaysCoreIdea: bookToEdit?.isTodaysCoreIdea || false,
    isStaffPick: bookToEdit?.isStaffPick || false,
    secondaryCategories: bookToEdit?.secondaryCategories || [],
    difficultyLevel: bookToEdit?.difficultyLevel || 'Beginner',
    isAutoReadEnabled: bookToEdit?.isAutoReadEnabled || false,
    autoReadVoice: bookToEdit?.autoReadVoice || 'Default',
  };

  const [book, setBook] = useState<Book>(initialFormState);
  const [tagsInput, setTagsInput] = useState(bookToEdit?.tags?.join(', ') || '');
  const [podcastFile, setPodcastFile] = useState<File | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (bookToEdit) {
      // FIX for 'join' error: Ensure tags is an array.
      const currentTags = bookToEdit.tags || [];
      // Also ensure the local state `book` has the corrected tags array.
      setBook(prev => ({ ...initialFormState, ...bookToEdit, tags: currentTags }));
      setTagsInput(currentTags.join(', '));
      setPodcastFile(null);
    } else {
      setBook(initialFormState);
      setTagsInput('');
      setPodcastFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setBook(prev => ({ ...prev, [name]: checked }));
    } else if (name === "publicationYear") {
      setBook(prev => ({ ...prev, [name]: value ? parseInt(value, 10) : undefined }));
    } else {
      setBook(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRichTextChange = (fieldName: keyof Book, html: string) => {
    setBook(prev => ({ ...prev, [fieldName]: html }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    setBook(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) }));
  };
  
  const handlePodcastFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if ((file.type === 'audio/mpeg' || file.type === 'audio/wav' || file.type === 'audio/mp3') && file.size <= 100 * 1024 * 1024) {
        setPodcastFile(file);
        setBook(prev => ({ ...prev, podcastUrl: '' }));
        addToast(`File "${file.name}" selected. Save to upload.`, 'info');
      } else {
        addToast('Invalid file. Please select an MP3 or WAV file under 100MB.', 'error');
        e.target.value = '';
        setPodcastFile(null);
      }
    } else {
      setPodcastFile(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!book.title || !book.author || !book.category) {
      addToast("Title, Author, and Category are required.", "error");
      return;
    }

    let bookDataToSave = { ...book };
    
    // FIX for 'createdAt' error: Ensure createdAt is not undefined when saving.
    if (!bookDataToSave.createdAt) {
      bookDataToSave.createdAt = new Date().toISOString();
    }
    
    bookDataToSave.id = bookToEdit?.id || book.id || Date.now().toString();

    onSave(bookDataToSave, podcastFile);

    if (!bookToEdit) {
      setBook(initialFormState);
      setTagsInput('');
      setPodcastFile(null);
      // Find the file input and reset it
      const fileInput = document.getElementById('podcastFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const inputClass = "w-full px-3 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-md focus:ring-[var(--netflix-red)] focus:border-[var(--netflix-red)] outline-none disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-[var(--netflix-text-secondary)] mb-1";
  const checkboxLabelClass = "ml-2 text-sm text-[var(--netflix-text-secondary)]";

  const featureFlags = [
    { name: 'isTodaysCoreIdea', label: "Today's Core Idea" },
    { name: 'isFeaturedInTopCarousel', label: 'Add to Carousel' },
    { name: 'isTrending', label: 'Mark as Trending' },
    { name: 'isHot', label: 'Mark as Hot' },
    { name: 'isRecommended', label: 'Feature on Home Feed Row (Recommended)' },
    { name: 'isStaffPick', label: "Staff Pick (Feature on Home Feed Row)" },
    { name: 'isSignature', label: 'Signature Red Border Overlay' },
    { name: 'isPushedToTop', label: 'Push to Top (Manual Priority)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--netflix-dark-secondary)] p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-[var(--netflix-red)] mb-4">{bookToEdit ? 'Edit Book' : 'Add New Book'}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className={labelClass}>Title*</label>
          <input type="text" name="title" id="title" value={book.title} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="author" className={labelClass}>Author*</label>
          <input type="text" name="author" id="author" value={book.author} onChange={handleChange} className={inputClass} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="publicationYear" className={labelClass}>Publication Year</label>
          <input type="number" name="publicationYear" id="publicationYear" value={book.publicationYear || ''} onChange={handleChange} className={inputClass} placeholder="e.g., 2023" />
        </div>
        <div>
          <label htmlFor="category" className={labelClass}>Primary Category*</label>
          <select name="category" id="category" value={book.category} onChange={handleChange} className={inputClass} required>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="whyThisBookIsPerfect" className={labelClass}>Why This Book is Perfect for You (100-200 words)</label>
        <RichTextEditor 
            value={book.whyThisBookIsPerfect || ''} 
            onChange={(html) => handleRichTextChange('whyThisBookIsPerfect', html)} 
            placeholder="Explain why this book is a must-read for the target audience..."
        />
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="coverImageUrl" className={labelClass}>Cover Image URL (2:3)</label>
          <input type="url" name="coverImageUrl" id="coverImageUrl" value={book.coverImageUrl} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="carouselCoverImageUrl" className={labelClass}>Hero Carousel URL (16:9)</label>
          <input type="url" name="carouselCoverImageUrl" id="carouselCoverImageUrl" value={book.carouselCoverImageUrl} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="visualSceneImageUrl" className={labelClass}>Visual Scene URL (16:9)</label>
          <input type="url" name="visualSceneImageUrl" id="visualSceneImageUrl" value={book.visualSceneImageUrl} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="oneLinerHook" className={labelClass}>One-Liner Hook (for Hero)</label>
        <input type="text" name="oneLinerHook" id="oneLinerHook" value={book.oneLinerHook} onChange={handleChange} className={inputClass} />
      </div>

      <div>
        <label htmlFor="caption" className={labelClass}>Caption (7-10 words, why it matters)</label>
         <RichTextEditor 
            value={book.caption} 
            onChange={(html) => handleRichTextChange('caption', html)} 
            placeholder="Enter a short, powerful caption..."
        />
      </div>

      <div>
        <label htmlFor="tags" className={labelClass}>Tags (comma separated)</label>
        <input type="text" name="tags" id="tags" value={tagsInput} onChange={handleTagsChange} className={inputClass} />
      </div>

      <div>
        <label htmlFor="detailedSummary" className={labelClass}>Book Summary (Full Paragraph Format)</label>
        <RichTextEditor 
            value={book.detailedSummary} 
            onChange={(html) => handleRichTextChange('detailedSummary', html)} 
            placeholder="Enter the full summary here. You can use bold, italics, and links."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brutalTruth" className={labelClass}>Brutal Truth (for Hero & Modal)</label>
          <RichTextEditor 
            value={book.brutalTruth} 
            onChange={(html) => handleRichTextChange('brutalTruth', html)} 
            placeholder="A short, impactful, 'brutal truth' from the book."
        />
        </div>
        <div>
          <label htmlFor="coreValueParagraph" className={labelClass}>Core Idea Paragraph (for Modal)</label>
          <RichTextEditor 
            value={book.coreValueParagraph} 
            onChange={(html) => handleRichTextChange('coreValueParagraph', html)} 
            placeholder="Explain the central, core idea of the book."
        />
        </div>
      </div>
      
      <h4 className="text-lg font-medium text-[var(--netflix-red)] pt-4 border-t border-neutral-700">Book Podcast, Trailer & External Links</h4>
      <p className="text-xs text-[var(--netflix-text-muted)] mb-3 -mt-1">
        Upload a podcast file OR provide a direct URL. If you upload a file, it will override the URL field.
      </p>
      
      <div>
        <label htmlFor="podcastFile" className={labelClass}>Audio File Upload</label>
        <input
          type="file"
          id="podcastFile"
          onChange={handlePodcastFileChange}
          className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--netflix-red)] file:text-white hover:file:bg-red-700 cursor-pointer"
          accept=".mp3,.wav,.mpeg"
        />
        <p className="text-xs text-[var(--netflix-text-muted)] mt-1">Accept: .mp3, .wav. Max size: 100MB.</p>
        {podcastFile && <p className="text-sm text-green-400 mt-2">Selected: {podcastFile.name}</p>}
        {bookToEdit?.podcastUrl && !podcastFile && (
           <p className="text-sm text-sky-400 mt-2">Current URL: {bookToEdit.podcastUrl.substring(0, 50)}...</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div>
          <label htmlFor="podcastUrl" className={labelClass}>Podcast URL (MP3/WAV)</label>
          <input type="url" name="podcastUrl" id="podcastUrl" value={book.podcastUrl} onChange={handleChange} className={inputClass} disabled={!!podcastFile} />
        </div>
        <div>
          <label htmlFor="podcastTitle" className={labelClass}>Podcast Title</label>
          <input type="text" name="podcastTitle" id="podcastTitle" value={book.podcastTitle} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="podcastDuration" className={labelClass}>Podcast Duration</label>
          <input type="text" name="podcastDuration" id="podcastDuration" value={book.podcastDuration} onChange={handleChange} className={inputClass} placeholder="e.g., 5:32" />
        </div>
      </div>
      <div className="mt-6">
        <label htmlFor="trailerUrl" className={labelClass}>Trailer URL (YouTube)</label>
        <input type="url" name="trailerUrl" id="trailerUrl" value={book.trailerUrl} onChange={handleChange} className={inputClass} />
      </div>

      <div className="mt-4">
        <label htmlFor="externalLink" className={labelClass}>🔗 External Purchase Link (Optional)</label>
        <p className="text-xs text-[var(--netflix-text-muted)] mb-2">Paste a valid URL (e.g., Amazon product page) where users can optionally purchase the book.</p>
        <input
          type="url"
          name="externalLink"
          id="externalLink"
          value={book.externalLink || ''}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g., https://www.amazon.com/dp/..."
        />
      </div>

      <h4 className="text-lg font-medium text-[var(--netflix-red)] pt-4 border-t border-neutral-700">Feature Flags:</h4>
      <p className="text-xs text-[var(--netflix-text-muted)] mb-3 -mt-1">
        Configure how this book is highlighted. "Include in Recently Uploaded" and "New" badges are automatic.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {featureFlags.map(flag => (
          <div key={flag.name} className="flex items-center">
            <input
              type="checkbox"
              name={flag.name}
              id={flag.name}
              checked={book[flag.name as keyof Book] as boolean}
              onChange={handleChange}
              className="h-4 w-4 text-[var(--netflix-red)] bg-neutral-700 border-neutral-600 rounded focus:ring-[var(--netflix-red)]"
            />
            <label htmlFor={flag.name} className={checkboxLabelClass}>{flag.label}</label>
          </div>
        ))}
      </div>
      
      <h4 className="text-lg font-medium text-[var(--netflix-red)] pt-4 border-t border-neutral-700">AI Narration Settings:</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <div className="flex items-center">
            <input
              type="checkbox"
              name="isAutoReadEnabled"
              id="isAutoReadEnabled"
              checked={book.isAutoReadEnabled as boolean}
              onChange={handleChange}
              className="h-4 w-4 text-[var(--narration-blue)] bg-neutral-700 border-neutral-600 rounded focus:ring-[var(--narration-blue)]"
            />
            <label htmlFor="isAutoReadEnabled" className={checkboxLabelClass}>Enable "Auto Read" Summary</label>
          </div>
          <div>
            <label htmlFor="autoReadVoice" className={labelClass}>Narration Voice</label>
            <select name="autoReadVoice" id="autoReadVoice" value={book.autoReadVoice} onChange={handleChange} className={inputClass} disabled={!book.isAutoReadEnabled}>
                <option value="Default">Default</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
        </div>
      </div>


      <div className="flex justify-end space-x-3 pt-6 mt-4 border-t border-neutral-700">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-600 hover:bg-neutral-500 text-white rounded-md">
            Cancel
          </button>
        )}
        <button type="submit" className="primary-action-button px-6 py-2 rounded-md font-semibold">
          {bookToEdit ? 'Save Changes' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};
