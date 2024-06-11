import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

export function Home() {
  const [foodList, setFoodList] = useState<any[]>([]);
  const foodCollectionRef = collection(db, "food");

  const getFoodList = async () => {
    try {
      const data = await getDocs(foodCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setFoodList(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFoodList();
  }, []);

  return (
    <>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Food</th>
            <th scope="col">Price</th>
            <th scope="col">Business</th>
          </tr>
        </thead>
        <tbody>
          {foodList.map((food) => (
            <tr>
              <td>{food.name}</td>
              <td>${food.price}</td>
              <td>{food.business}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
