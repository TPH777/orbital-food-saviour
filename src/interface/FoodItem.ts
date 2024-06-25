export interface FoodItem {
  id: string;         // Unique identifier for the food item, generated automatically by firestore
  name: string;       // Name of the food item
  price: number;      // Price of the food item 
  date: Date;         // Date of expiry of the food item
  post: boolean;      // Boolean indicating whether the food item is posted or not
  cuisine: string;    // Type of cuisine associated to the food item
  userId: string;     // ID of the user who posted the food item
  business: string;   // Name of the business posted the food item
  imageURL: string;   // URL to the image of the food item
  imagePath: string;  // Path to access the image of the food item in firebase storage
}
