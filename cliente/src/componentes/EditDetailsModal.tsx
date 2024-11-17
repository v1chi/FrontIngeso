import React, { useState, useEffect } from "react";
import { Button } from "../componentes/ui/button.tsx";
import { Input } from "../componentes/ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../componentes/ui/select.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog.tsx";
import axios from "axios";

interface EditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: "estudiante";
  onSave: (data: any) => void;
}

export default function EditDetailsModal({ isOpen, onClose, data, type, onSave }: EditDetailsModalProps) {
  const [formData, setFormData] = useState(data || {});

  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Preparar los datos a enviar
      const updatedData = {
        nombreCompleto: formData.nombreCompleto,
        unidad: formData.unidad,
        carrera: formData.carrera,
        sedeEstudiante: formData.sedeEstudiante,
        egresado: formData.egresado === "true", // Convertir a booleano
      };

      // URL del endpoint PATCH
      const url = `http://localhost:3001/estudiantes/${formData.id}`;
      console.log("URL utilizada:", url);
      console.log("Datos actualizados enviados:", updatedData);

      // Realizar la solicitud PATCH
      const response = await axios.patch(url, updatedData);
      console.log("Estudiante actualizado con éxito:", response.data);

      onSave(response.data); // Actualizar el estado en el padre
      onClose();
    } catch (error) {
      console.error("Error al actualizar estudiante:", error);
      alert("Hubo un error al guardar los cambios.");
    }
  };

  const renderForm = () => {
    if (type === "estudiante") {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombreCompleto">Nombre Completo</Label>
            <Input
              id="nombreCompleto"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidad">Unidad</Label>
            <Input
              id="unidad"
              name="unidad"
              value={formData.unidad}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrera">Carrera</Label>
            <Input
              id="carrera"
              name="carrera"
              value={formData.carrera}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sedeEstudiante">Sede</Label>
            <Select
              name="sedeEstudiante"
              defaultValue={formData.sedeEstudiante}
              onValueChange={(value) =>
                handleSelectChange("sedeEstudiante", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Antofagasta">Antofagasta</SelectItem>
                <SelectItem value="Coquimbo">Coquimbo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="egresado">Egresado</Label>
            <Select
              name="egresado"
              defaultValue={formData.egresado ? "true" : "false"}
              onValueChange={(value) => handleSelectChange("egresado", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="¿El estudiante egresó?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      );
    }
    return <p>Tipo de formulario no reconocido</p>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Estudiante</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{renderForm()}</div>
      </DialogContent>
    </Dialog>
  );
}
