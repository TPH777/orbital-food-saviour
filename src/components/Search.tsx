export const Search = ({
  setQuery,
}: {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="wrap">
      <div className="search">
        <input
          type="text"
          className="searchTerm"
          placeholder="What are you looking for?"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
        />
      </div>
    </div>
  );
};
