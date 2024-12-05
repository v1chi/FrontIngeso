import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface RegisterAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { fecha: string; estudiante: string; asistio: boolean }) => void;
  estudiantes: { id: string; nombreCompleto: string }[];
}

export function RegisterAttendanceModal({ isOpen, onClose, onSubmit, estudiantes }: RegisterAttendanceModalProps) {
  const [fecha, setFecha] = useState('');
  const [estudiante, setEstudiante] = useState('');
  const [asistio, setAsistio] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fecha && estudiante && asistio !== null) {
      onSubmit({ fecha, estudiante, asistio });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Nueva Asistencia</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="estudiante">Estudiante</Label>
              <Select onValueChange={setEstudiante} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {estudiantes.map((est) => (
                    <SelectItem key={est.id} value={est.id}>
                      {est.nombreCompleto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Asistió</Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={asistio === true ? 'default' : 'outline'}
                  onClick={() => setAsistio(true)}
                >
                  Sí
                </Button>
                <Button
                  type="button"
                  variant={asistio === false ? 'default' : 'outline'}
                  onClick={() => setAsistio(false)}
                >
                  No
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit">Registrar Asistencia</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

