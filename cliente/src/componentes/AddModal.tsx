import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog.tsx";
import { Button } from '../componentes/ui/button.tsx';
import { Input } from '../componentes/ui/input.tsx';
import { Label } from './ui/label.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';
import axios from 'axios';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'formacion' | 'estudiante' | 'usuario' | 'competencia';
  onSave?: (data: any) => void;
}

export default function AddModal({ isOpen, onClose, type, onSave }: AddModalProps) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (type === 'competencia') {
      setFormData({ 
        codigo: '', 
        nombre: '', 
        descripcion: '' 
      });
    } else if (type === 'estudiante') {
      setFormData({
        rut: '',
        nombreCompleto: '',
        unidad: '',
        carrera: '',
        correo: '',
        sedeEstudiante: '',
        egresado: false,
      });
    } else if (type === 'usuario') {
      setFormData({ 
        nombre: '', 
        rut: '', 
        correo: '', 
        clave: '', 
        tipo: '' 
      });
    } else if (type === 'formacion') {
      setFormData({
        sede: '',
        nombre: '',
        modalidad: '',
        periodo: '',
        relator: '',
        fechaInicio: '',
        fechaTermino: '',
      });
    }
  }, [type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function addData(endpoint: string, data: any) {
    try {
      const response = await axios.post(endpoint, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }
    if (onSave) onSave(data);
    onClose();
    window.location.reload();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'competencia') {
      addData('http://localhost:3001/competencias', formData);
    } else if (type === 'estudiante') {
      addData('http://localhost:3001/estudiantes', formData);
    } else if (type === 'usuario') {
      addData('http://localhost:3001/usuarios', formData);
    } else if (type === 'formacion') {
      addData('http://localhost:3001/formaciones', formData);
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'competencia':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input id="codigo" name="codigo" onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input id="descripcion" name="descripcion" onChange={handleInputChange} />
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Agregar Competencia</Button>
            </div>
          </form>
        );
      case 'estudiante':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Input id="rut" name="rut" onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombreCompleto">Nombre Completo</Label>
              <Input id="nombreCompleto" name="nombreCompleto" onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unidad">Unidad</Label>
              <Input id="unidad" name="unidad" onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrera">Carrera</Label>
              <Input id="carrera" name="carrera" onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo</Label>
              <Input type="email" id="correo" name="correo" onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sedeEstudiante">Sede</Label>
              <Select name="sedeEstudiante" onValueChange={(value) => handleSelectChange("sedeEstudiante", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sede del estudiante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Coquimbo">Coquimbo</SelectItem>
                  <SelectItem value="Antofagasta">Antofagasta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="egresado">Egresado</Label>
              <Select name="egresado" onValueChange={(value) => handleSelectChange("egresado", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="¿El estudiante egresó?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Si</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Agregar Estudiante
              </Button>
            </div>
          </form> 
        )

      case 'usuario':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Input id="rut" name="rut" onChange={handleInputChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="correo">Correo</Label>
              <Input id="correo" name="correo" onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clave">Contraseña</Label>
              <Input type='password' id="clave" name="clave" onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select name="tipo" onValueChange={(value) => handleSelectChange("tipo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Usuario">Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Agregar Usuario
              </Button>
            </div>
          </form>
        );
      case 'formacion':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sede">Sede</Label>
              <Select name="sede" onValueChange={(value) => handleSelectChange("sede", value)}>
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
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modalidad">Modalidad</Label>
              <Select name="modalidad" onValueChange={(value) => handleSelectChange("modalidad", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="B-Learning">B-Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo">Periodo</Label>
              <Input id="periodo" name="periodo" onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relator">Relator</Label>
              <Input id="relator" name="relator" onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
              <Input type="date" id="fechaInicio" name="fechaInicio" onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaTermino">Fecha de Término</Label>
              <Input type="date" id="fechaTermino" name="fechaTermino" onChange={handleInputChange} />
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Agregar Formación
              </Button>
            </div>
          </form>
        )
      default:
        return <p>Tipo de formulario no reconocido</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Agregar {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">{renderForm()}</div>
      </DialogContent>
    </Dialog>
  );
}
