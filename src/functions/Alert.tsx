import swal from "sweetalert";

export function deleteWarning(): Promise<boolean> {
  return new Promise((resolve) => {
    swal({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      buttons: [true, true],
    }).then((result: boolean | null) => {
      resolve(result ?? false); // If result is null (e.g., user clicks outside), resolve with false
    });
  });
}

export function deleteSuccess(name: string) {
  swal({
    icon: "success",
    title: "Deleted!",
    text: `${name} has been deleted.`,
    buttons: [false],
    timer: 1000,
  });
}

export function updateSuccess(name: string) {
  swal({
    icon: "success",
    title: "Updated!",
    text: `${name} has been updated.`,
    timer: 1200,
    buttons: [false],
  });
}

export function addSuccess(name: string, price: number) {
  swal({
    icon: "success",
    title: "Added!",
    text: `${name} of $${price} has been Added.`,
    timer: 1000,
    buttons: [false],
  });
}

export function invalidInputWarning(
  name: string,
  price: number,
  image: any,
  date: Date,
  add: boolean
) {
  if (!name || !price || (add && !image)) {
    // Empty Input
    swal({
      icon: "error",
      title: "Error!",
      text: "All fields are required.",
    });
    return true;
  } else if (price <= 0) {
    // Invalid price
    swal({
      icon: "error",
      title: "Error!",
      text: "Price must be greater than 0",
    });
    return true;
  } else if (date < new Date()) {
    // Invalid Date
    swal({
      icon: "error",
      title: "Error!",
      text: "Selected date must be after current time",
    });
    return true;
  } else {
    if (image) {
      const imageExt = image.type.split("/")[1];
      if (imageExt !== "jpeg" && imageExt !== "jpg" && imageExt !== "png") {
        // Invalid image type
        swal({
          icon: "error",
          title: "Error!",
          text: "Invalid image, file extension must be .jpeg, .jpg or .png",
        });
        return true;
      }
    } else {
      // All validations pass
      return false;
    }
  }
}
