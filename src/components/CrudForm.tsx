import { useEffect, useState } from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { toLocalTime } from "../functions/Date";

interface CrudFormProps {
  add: boolean;
  name: string;
  price: number;
  date: Date;
  post: boolean;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  setPost: React.Dispatch<React.SetStateAction<boolean>>;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
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
  setName,
  setPrice,
  setPost,
  setDate,
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
            name="name"
            required
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <input
            id="name"
            type="text"
            name="name"
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
            name="price"
            min={1}
            className="form-control"
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        ) : (
          <input
            id="price"
            type="number"
            name="price"
            min={1}
            value={price}
            className="form-control"
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        )}
      </div>
      <label>Image</label>
      <div className="input-group mb-3">
        <input
          type="file"
          className="form-control"
          id="image"
          onChange={handleImage}
        />
      </div>
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
      <br />
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
    </form>
  );
};
