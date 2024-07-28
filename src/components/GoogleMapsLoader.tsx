import { useJsApiLoader, Libraries } from "@react-google-maps/api";

const libraries: Libraries = ["places"];

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

const GoogleMapsLoader = ({ children }: GoogleMapsLoaderProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_gmap,
    libraries,
  });

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  return isLoaded ? <>{children}</> : <div>Loading...</div>;
};

export default GoogleMapsLoader;
