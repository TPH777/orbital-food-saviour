export const Search = ({ setQuery }: { setQuery: Function }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); // Pass the name back to the parent component
  };

  return (
    <div className="wrap">
      <div className="search">
        <input
          type="text"
          className="searchTerm"
          placeholder="What are you looking for?"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
