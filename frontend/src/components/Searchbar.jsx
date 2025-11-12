import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Buscar..." }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} style={styles.searchForm}>
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    style={styles.searchInput}
                />
                <div style={styles.searchButtons}>
                    {searchTerm && (
                        <button 
                            type="button"
                            onClick={handleClear}
                            style={styles.clearButton}
                        >
                            ✕
                        </button>
                    )}
                    <button type="submit" style={styles.searchButton}>
                        🔍
                    </button>
                </div>
            </div>
        </form>
    );
};

const styles = {
    searchForm: {
        width: '100%',
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
        overflow: 'hidden',
    },
    searchInput: {
        flex: 1,
        padding: '12px 16px',
        border: 'none',
        outline: 'none',
        fontSize: '1rem',
    },
    searchButtons: {
        display: 'flex',
        alignItems: 'center',
    },
    clearButton: {
        backgroundColor: 'transparent',
        border: 'none',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '1rem',
        color: '#666',
    },
    searchButton: {
        backgroundColor: '#4a7c1f',
        border: 'none',
        padding: '12px 16px',
        cursor: 'pointer',
        fontSize: '1rem',
        color: 'white',
    },
};

export default SearchBar;