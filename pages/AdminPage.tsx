
import React, { useState } from 'react';
import { AdminBookForm } from '../components/AdminBookForm';
import AdminAdInjector from '../components/AdminAdInjector';
import { Book, AdConfiguration } from '../types';
import { useAppContext } from '../AppContext';
import { ArrowLeftOnRectangleIcon, BookOpenIcon, MegaphoneIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

type AdminSection = 'manageBooks' | 'adSettings' | 'otherSettings'; // 'otherSettings' can be added later

const AdminPage: React.FC = () => {
  const {
    logoutAdmin,
    books,
    addBook,
    updateBook,
    deleteBook,
    adConfig,
    setAdConfig,
  } = useAppContext();

  const [currentSection, setCurrentSection] = useState<AdminSection>('manageBooks');
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleSaveBook = (bookData: Book, podcastFile?: File | null) => {
    if (editingBook) {
      updateBook(bookData, podcastFile);
    } else {
      addBook(bookData, podcastFile);
    }
    setEditingBook(null); 
    setCurrentSection('manageBooks'); // Go back to book list view
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setCurrentSection('manageBooks'); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleSaveAdConfig = (newConfig: AdConfiguration) => {
    setAdConfig(newConfig);
  };
  
  const NavButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    icon?: React.ReactNode;
  }> = ({ onClick, isActive, children, icon }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-md transition-colors duration-150 flex items-center
        ${isActive 
          ? 'bg-[var(--netflix-red)] text-white shadow-md' 
          : 'hover:bg-neutral-700 text-[var(--netflix-text-secondary)] hover:text-white'
        }`}
    >
      {icon && <span className="inline-block mr-3 w-5 h-5 flex-shrink-0">{icon}</span>}
      <span className="flex-grow">{children}</span>
    </button>
  );

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 text-white bg-[var(--netflix-dark)] min-h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--netflix-red)]">Admin Panel</h1>
        <button
          onClick={logoutAdmin}
          className="primary-action-button px-3 sm:px-4 py-2 rounded-md font-semibold flex items-center text-sm sm:text-base"
        >
         <ArrowLeftOnRectangleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        <nav className="w-full md:w-64 lg:w-72 flex-shrink-0 space-y-2 md:sticky md:top-24 self-start bg-[var(--netflix-dark-secondary)] p-3 sm:p-4 rounded-lg shadow-lg">
          <NavButton 
            onClick={() => { setCurrentSection('manageBooks'); setEditingBook(null); }} 
            isActive={currentSection === 'manageBooks' && !editingBook} 
            icon={<BookOpenIcon />}
          >
            Manage Books
          </NavButton>
          {editingBook && currentSection === 'manageBooks' && (
            <NavButton 
              onClick={() => { /* Already on edit form, or could clear */ }} 
              isActive={true} 
              icon={<BookOpenIcon className="text-[var(--netflix-red)]" />} // Indicate active edit
            >
              Editing: {editingBook.title.substring(0,15)}{editingBook.title.length > 15 ? '...' : ''}
            </NavButton>
          )}
          {/* The empty NavButton was here and has been removed. */}
          <NavButton 
            onClick={() => setCurrentSection('adSettings')} 
            isActive={currentSection === 'adSettings'} 
            icon={<MegaphoneIcon />}
          >
            Ad Settings
          </NavButton>
          {/* Example for future section
          <NavButton 
            onClick={() => setCurrentSection('otherSettings')} 
            isActive={currentSection === 'otherSettings'} 
            icon={<Cog6ToothIcon />}
          >
            Other Settings
          </NavButton> 
          */}
        </nav>

        <main className="flex-grow min-w-0"> {/* min-w-0 for flex child to shrink properly */}
          {currentSection === 'manageBooks' && (
            <div className="space-y-10">
              <AdminBookForm
                key={editingBook ? editingBook.id : 'new-book-form'} // Ensure form re-renders or resets
                bookToEdit={editingBook}
                onSave={handleSaveBook}
                onCancel={editingBook ? () => setEditingBook(null) : undefined}
              />
              <div className="mt-12">
                <h3 className="text-xl sm:text-2xl font-semibold text-[var(--netflix-red)] mb-6">Existing Books List</h3>
                {books.length > 0 ? (
                  <div className="space-y-4">
                    {books.slice().sort((a,b) => (a.title || '').localeCompare(b.title || '')).map(book => (
                      <div key={book.id} className="bg-[var(--netflix-dark-secondary)] p-3 sm:p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="min-w-0"> {/* For text truncation */}
                          <p className="font-semibold text-md sm:text-lg text-white truncate" title={book.title}>{book.title}</p>
                          <p className="text-xs sm:text-sm text-[var(--netflix-text-secondary)]">{book.author} - <span className="text-xs text-[var(--netflix-red)]/80">{book.category}</span></p>
                        </div>
                        <div className="space-x-2 flex-shrink-0 self-start sm:self-center">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="text-xs sm:text-sm primary-action-button px-2.5 sm:px-3 py-1 sm:py-1.5 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${book.title}"? This cannot be undone.`)) {
                                deleteBook(book.id);
                                if (editingBook?.id === book.id) {
                                  setEditingBook(null);
                                }
                              }
                            }}
                            className="text-xs sm:text-sm bg-neutral-600 hover:bg-neutral-500 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--netflix-text-muted)] italic">No books added yet. Use the form above to add one.</p>
                )}
              </div>
            </div>
          )}

          {currentSection === 'adSettings' && (
            <AdminAdInjector initialConfig={adConfig} onSave={handleSaveAdConfig} />
          )}

          {/* Placeholder for other settings
          {currentSection === 'otherSettings' && (
            <div className="bg-[var(--netflix-dark-secondary)] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[var(--netflix-red)] mb-4">Other Settings</h3>
              <p className="text-[var(--netflix-text-muted)]">This section is a placeholder for future settings.</p>
            </div>
          )}
          */}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;