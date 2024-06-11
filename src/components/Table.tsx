export const Table = ({
  user,
  foodList,
  updateFood,
  deleteFood,
}: {
  user: any;
  foodList: any[];
  updateFood: Function;
  deleteFood: Function;
}) => {
  return (
    <div className="contain-table">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Food</th>
            <th scope="col">Price</th>
            <th scope="col" className="text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {foodList.map(
            (food: any) =>
              food.userId == user.uid && (
                <tr key={food.id}>
                  <td>{food.name}</td>
                  <td>${food.price}</td>
                  <td>
                    <button
                      onClick={() => deleteFood(food.id)}
                      className="btn btn-outline-danger float-end ms-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => updateFood(food.id)}
                      className="btn btn-outline-secondary float-end"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};
