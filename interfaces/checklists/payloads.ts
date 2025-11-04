import { ChecklistCategory } from "./types";

export const VEHICLE_PRE_TRIP_CATEGORIES: ChecklistCategory[] = [
  {
    id: "motor",
    title: "Motor y Fluidos",
    iconKey: "tool",
    items: [
      { id: "aceite", label: "Nivel de aceite" },
      { id: "refrigerante", label: "Nivel de refrigerante" },
      { id: "perdidas", label: "Sin pérdidas de fluidos" },
      {
        id: "direccion-freno-mano",
        label: "Dirección y freno de mano operativos",
      },
    ],
  },
  {
    id: "luces",
    title: "Luces y Señalización",
    iconKey: "bulb1",
    items: [
      { id: "posicion", label: "Luces de posición" },
      { id: "freno", label: "Luces de freno" },
      { id: "giro", label: "Luces de giro / balizas" },
      { id: "retroceso", label: "Luces de retroceso" },
      { id: "bocina", label: "Bocina" },
    ],
  },
  {
    id: "neumaticos",
    title: "Neumáticos y Carrocería",
    iconKey: "car",
    items: [
      { id: "cubiertas", label: "Estado de cubiertas" },
      { id: "espejos", label: "Estado de espejos" },
      { id: "parabrisas", label: "Estado del parabrisas" },
      { id: "combustible", label: "Tapa de combustible" },
      { id: "auxilio", label: "Rueda de auxilio + accesorios" },
    ],
  },
  {
    id: "seguridad",
    title: "Seguridad y Emergencia",
    iconKey: "safety",
    items: [
      { id: "cinturones", label: "Cinturones de seguridad" },
      { id: "apoyacabezas", label: "Apoyacabezas" },
      { id: "matafuego", label: "Matafuego vigente" },
      { id: "chaleco", label: "Chaleco reflectivo" },
      { id: "balizas", label: "Balizas y botiquín" },
    ],
  },
];
