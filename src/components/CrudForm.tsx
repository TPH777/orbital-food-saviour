import { useEffect, useState } from "react";
import { ButtonGroup, Form, ToggleButton } from "react-bootstrap";
import { toLocalTime } from "../functions/Date";
import { cuisineTypes } from "../interface/Cuisine";

interface CrudFormProps {
  add: boolean;
  name: string;
  price: number;
  date: Date;
  post: boolean;
  cuisine: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  setPost: React.Dispatch<React.SetStateAction<boolean>>;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  setCuisine: React.Dispatch<React.SetStateAction<string>>;
  handleForm: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CrudForm = ({
  add,
  name,
  price,
  date,
  post,
  cuisine,
  setName,
  setPrice,
  setPost,
  setDate,
  setCuisine,
  handleForm,
  handleImage,
  setInProgress,
}: CrudFormProps) => {
  const [oldDate, setOldDate] = useState<Date>(date);
  useEffect(() => {
    setOldDate(new Date(date));
  }, []);

  return (
    <form onSubmit={handleForm}>
      <h2>{add ? "Add" : "Update"} Food Item</h2>
      <div className="form-outline mb-4">
        <label>Name</label>
        {add ? (
          <input
            id="name"
            type="text"
            placeholder="Name"
            required
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <input
            id="name"
            type="text"
            placeholder="Name"
            required
            value={name}
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        )}
      </div>

      <div className="form-outline mb-4">
        <label>Price</label>
        {add ? (
          <input
            id="price"
            type="number"
            placeholder="Price"
            required
            min={1}
            className="form-control"
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        ) : (
          <input
            id="price"
            type="number"
            placeholder="Price"
            required
            min={1}
            value={price}
            className="form-control"
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        )}
      </div>

      <div className="mb-4">
        <label>Image</label>
        <input
          type="file"
          className="form-control"
          id="image"
          onChange={handleImage}
        />
      </div>

      <div className="mb-4">
        <label>Expiry Date</label>
        <span>
          :
          {add
            ? ` Must be after ${new Date().toString().slice(0, -38)}`
            : ` Was set on ${oldDate.toString().slice(0, -38)}`}
        </span>
        <input
          type="datetime-local"
          className="form-control"
          id="date"
          min={toLocalTime(new Date())}
          onChange={(e) => setDate(new Date(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label>Cuisine</label>
        <Form.Select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        >
          <option disabled>Cuisine</option>
          {cuisineTypes.map((cuisine) => (
            <option key={cuisine}>{cuisine}</option>
          ))}
        </Form.Select>
      </div>

      <div className="mb-4">
        <ButtonGroup>
          <ToggleButton
            id="post-checked"
            type="radio"
            variant={"outline-success"}
            value={1}
            checked={post === true}
            onChange={() => setPost(true)}
          >
            Post
          </ToggleButton>
          <ToggleButton
            id="post-unchecked"
            type="radio"
            variant={"outline-dark"}
            value={2}
            checked={post === false}
            onChange={() => setPost(false)}
          >
            Save
          </ToggleButton>
        </ButtonGroup>
        <input
          className="btn btn-primary ms-3"
          type="submit"
          value={add ? "Add" : "Update"}
        />
        <input
          style={{ marginLeft: "12px" }}
          className="btn btn-danger"
          type="button"
          value="Cancel"
          onClick={() => setInProgress(false)}
        />
      </div>
    </form>
  );
};
