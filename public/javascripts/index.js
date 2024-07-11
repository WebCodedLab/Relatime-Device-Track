const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("user-location", { latitude, longitude });
  }),
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
}

let map = L.map('map').setView([0,0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution :'WebCodedLab',
}).addTo(map);

const markers = {};

socket.on('received-location', (location) => {
    const {id, latitude, longitude} = location;
    map.setView([latitude, longitude]);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on('disconnected', (id) => {
    if (markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})