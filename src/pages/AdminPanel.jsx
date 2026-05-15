import { useEffect, useState } from "react";
import { getVehicles, addVehicle, deleteVehicle } from "../services/vehicleService";

const [vehicles, setVehicles] = useState([]);

const loadVehicles = async () => {
  const { data } = await getVehicles();
  setVehicles(data);
};

useEffect(() => {
  loadVehicles();
}, []);