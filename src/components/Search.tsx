export const Search = ({ onSearch }: { onSearch: Function }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value); // Pass the name back to the parent component
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
        {/* <button type="button" className="searchButton">
          <i className="fa fa-search"></i>
        </button> */}
      </div>
    </div>
  );
};
