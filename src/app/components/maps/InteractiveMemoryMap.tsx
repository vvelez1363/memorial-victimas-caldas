import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function InteractiveMemoryMap() {
  const memories = [
    {
      id: 1,
      position: [20.6736, -103.344],
      title: "Primer recuerdo",
      description: "Aquí ocurrió algo importante",
    },
    {
      id: 2,
      position: [20.68, -103.35],
      title: "Segundo recuerdo",
      description: "Otro lugar especial",
    },
  ];

  return (
    <MapContainer
      center={[20.6736, -103.344]}
      zoom={14}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {memories.map((memory) => (
        <Marker key={memory.id} position={memory.position}>
          <Popup>
            <h3>{memory.title}</h3>
            <p>{memory.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
