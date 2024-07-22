export function getCusLoc() {
  console.log("I was triggered during componentDidMount");
  return;
}
function handleLocationError(
  browserHasGeolocation: boolean,
  infoWindow: google.maps.InfoWindow,
  pos: google.maps.LatLng
) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
