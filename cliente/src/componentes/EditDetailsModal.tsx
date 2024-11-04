import React, { useState, useEffect } from 'react'
import { Button } from "../componentes/ui/button.tsx"
import { Input } from "../componentes/ui/input.tsx"
import { Label } from "./ui/label.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../componentes/ui/select.tsx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog.tsx"


interface EditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'formacion' | 'estudiante' | 'usuario' | 'competencia';
  onSave: (data: any) => void;
}

export default function EditDetailsModal({ isOpen, onClose, data, type, onSave }: EditDetailsModalProps) {
  const [formData, setFormData] = useState(data || {})

  useEffect(() => {
    setFormData(data || {})
  }, [data])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const renderForm = () => {
    switch (type) {
      case 'formacion':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sede">Sede</Label>
              <Select name="sede" defaultValue={formData.sede} onValueChange={(value) =>   handleSelectChange("sede", value)}>
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
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modalidad">Modalidad</Label>
              <Select name="modalidad" defaultValue={formData.modalidad} onValueChange={(value) => handleSelectChange("modalidad", value)}>
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
              <Input id="periodo" name="periodo" value={formData.periodo} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relator">Relator</Label>
              <Input id="relator" name="relator" value={formData.relator} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
              <Input type="date" id="fechaInicio" name="fechaInicio" value={formData.fechaInicio} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaTermino">Fecha de Término</Label>
              <Input type="date" id="fechaTermino" name="fechaTermino" value={formData.fechaTermino} onChange={handleInputChange} />
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Cambios
              </Button>
            </div>
          </form>
        )

      case 'estudiante':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Input id="rut" name="rut" value={formData.rut} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genero">Género</Label>
              <Select name="genero" defaultValue={formData.genero} onValueChange={(value) => handleSelectChange("genero", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo</Label>
              <Input type="email" id="correo" name="correo" value={formData.correo} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrera">Carrera</Label>
              <Input id="carrera" name="carrera" value={formData.carrera} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facultad">Facultad</Label>
              <Input id="facultad" name="facultad" value={formData.facultad} onChange={handleInputChange} />
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Cambios
              </Button>
            </div>
          </form>
        )

      case 'usuario':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Input id="rut" name="rut" value={formData.rut} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select name="tipo" defaultValue={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
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
                Guardar Cambios
              </Button>
            </div>
          </form>
        )

      case 'competencia':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input id="codigo" name="codigo" value={formData.codigo} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleInputChange} />
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Cambios
              </Button>
            </div>
          </form>
        )

      default:
        return <p>Tipo de formulario no reconocido</p>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Editar {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {renderForm()}
        </div>
      </DialogContent>
    </Dialog>
  )
}