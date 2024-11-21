import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Home, Book, Users, UserPlus, FileText, BarChart2, Award, Trash2, Eye, Edit, MoreVertical, Plus, Download, Filter } from 'lucide-react'
import { Button } from '../componentes/ui/button.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../componentes/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../componentes/ui/select.tsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../componentes/ui/dropdown-menu'
import AddModal from '../componentes/AddModal.tsx'
import ViewDetailsModal from '../componentes/ViewDetailsModal.tsx'
import EditDetailsModal from '../componentes/EditDetailsModal.tsx'
import { Input } from '../componentes/ui/input.tsx'
import { format } from 'date-fns';
import * as XLSX from "xlsx";


const reporteParticipantes = [
  { rutEstudiante: "12345678-9", nombre: "Juan Pérez", correo: "juan.perez@example.com", carrera: "Ingeniería Civil", nombreFormacion: "Formación avanzada", periodo: "2024-II", estado: "Aprobado", fechaInicio: "2024-08-21", fechaTermino: "2024-09-15" },
  { rutEstudiante: "98765432-1", nombre: "María González", correo: "maria.gonzalez@example.com", carrera: "Psicología", nombreFormacion: "Formación inicial", periodo: "2024-II", estado: "Aprobado", fechaInicio: "2024-09-27", fechaTermino: "2024-10-08" },
]

export default function MainLayout() {
  const [activeSection, setActiveSection] = useState('home')
  const [formaciones, setFormaciones] = useState([])
  const [filteredFormaciones, setFilteredFormaciones] = useState(formaciones)
  const [filteredParticipantes, setFilteredParticipantes] = useState(reporteParticipantes)
  const [filters, setFilters] = useState({})
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalType, setModalType] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [competencias, setCompetencias] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [selectedFormacion, setSelectedFormacion] = useState(null);
  
  

  async function fetchEstudiantes() {
    try {
      const response = await axios.get('http://localhost:3001/estudiantes');
      setEstudiantes(response.data);
      setFilteredParticipantes(response.data);
    } catch (error) {
      console.error('Error al obtener los estudiantes:', error);
      return [];
    }
  }

  async function fetchUsuarios() {
    try {
      const response = await axios.get('http://localhost:3001/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      return [];
    }
  }

  async function fetchCompetencias() {
    try {
      const response = await axios.get('http://localhost:3001/competencias');
      setCompetencias(response.data);
    } catch (error) {
      console.error('Error al obtener las competencias:', error);
      return [];
    }
  }

  async function fetchFormaciones() {
    try {
      const response = await axios.get('http://localhost:3001/formaciones');
      setFormaciones(response.data);
      setFilteredFormaciones(response.data);
    } catch (error) {
      console.error('Error al obtener las formaciones:', error);
      return [];
    }
  }

  

  useEffect(() => {
    fetchUsuarios();
    fetchEstudiantes();
    fetchCompetencias();
    fetchFormaciones();
  }, []);

  const handleAsociar = async () => {
    if (!selectedEstudiante || !selectedFormacion) {
      alert('Por favor, selecciona un estudiante y una formación.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/estudiantes-formaciones', {
        estudianteId: selectedEstudiante,
        formacionId: selectedFormacion,
        estado: 'en curso', // Puedes cambiar el estado inicial si lo deseas
      });
  
      alert('Estudiante asociado exitosamente con la formación.');
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al asociar el estudiante con la formación:', error);
      alert('Hubo un error al realizar la asociación. Por favor, inténtalo de nuevo.');
    }
  };

  const handleFilterChange = (key, value, dataType) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    if (dataType === 'formaciones') {
      const filtered = formaciones.filter(formacion => 
        Object.entries(newFilters).every(([k, v]) => 
          v === '' || formacion[k].toString().toLowerCase().includes(v.toLowerCase())
        )
      )
      setFilteredFormaciones(filtered)
    } else if (dataType === 'participantes') {
      const filtered = estudiantes.filter(estudiante => 
        Object.entries(newFilters).every(([k, v]) => 
          v === '' || estudiante[k].toString().toLowerCase().includes(v.toLowerCase())
        )
      )
      setFilteredParticipantes(filtered)
    }
  }

  const exportToExcelFormaciones = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredFormaciones);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ReporteFormaciones');
    XLSX.writeFile(workbook, 'ReporteFormaciones.xlsx');
  }

  const exportToExcelEstudiante = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredParticipantes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ReporteParticipantes');
    XLSX.writeFile(workbook, 'ReporteParticipantes.xlsx');
  };

  const handleAdd = (type) => {
    setModalType(type)
    setIsAddModalOpen(true)
  }

  const handleView = (item, type) => {
    setSelectedItem(item)
    setModalType(type)
    setIsViewModalOpen(true)
  }

  const handleEdit = (item, type) => {
    setSelectedItem(item)
    setModalType(type)
    setIsEditModalOpen(true)
  }

  const handleDelete = (id, type) => {
    console.log(`Eliminando ${type} con ID: ${id}`)
    // Aquí iría la lógica para eliminar el elemento
  }

  const handleSave = (data) => {
    console.log("Guardando datos:", data)
    // Aquí iría la lógica para guardar los datos
    setIsEditModalOpen(false)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'formaciones':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Formaciones</h2>
              <Button onClick={() => handleAdd('formacion')}>+ Agregar Formación</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Sede</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Modalidad</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Relator</TableHead>
                  <TableHead>Fecha de Inicio</TableHead>
                  <TableHead>Fecha de Término</TableHead>
                  <TableHead>Aprobados</TableHead>
                  <TableHead>Reprobados</TableHead>
                  <TableHead>Deserción</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formaciones.map((formacion) => (
                  <TableRow key={formacion.id}>
                    <TableCell>{formacion.id}</TableCell>
                    <TableCell>{formacion.sedeFormacion}</TableCell>
                    <TableCell>{formacion.nombre}</TableCell>
                    <TableCell>{formacion.modalidad}</TableCell>
                    <TableCell>{formacion.semestre}</TableCell>
                    <TableCell>{formacion.estado}</TableCell>
                    <TableCell>{formacion.profesorRelator}</TableCell>
                    <TableCell>{format(new Date(formacion.fechaInicio), 'yyyy-MM-dd')}</TableCell>
                    <TableCell>{format(new Date(formacion.fechaTermino), 'yyyy-MM-dd')}</TableCell>
                    <TableCell>{formacion.aprobados}</TableCell>
                    <TableCell>{formacion.reprobados}</TableCell>
                    <TableCell>{formacion.desercion}</TableCell>
                    <TableCell>{formacion.total}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(formacion, 'formacion')}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(formacion, 'formacion')}><Edit className="h-4 w-4" /></Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => handleDelete(formacion.id, 'formacion')}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Eliminar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      case 'estudiantes':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Estudiantes</h2>
              <Button onClick={() => handleAdd('estudiante')}>+ Agregar Estudiante</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RUT</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Correo Electrónico</TableHead>
                  <TableHead>Sede</TableHead>
                  <TableHead>Egresado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estudiantes.map((estudiante) => (
                  <TableRow key={estudiante.rut}>
                    <TableCell>{estudiante.rut}</TableCell>
                    <TableCell>{estudiante.nombreCompleto}</TableCell>
                    <TableCell>{estudiante.unidad}</TableCell>
                    <TableCell>{estudiante.carrera}</TableCell>
                    <TableCell>{estudiante.correo}</TableCell>
                    <TableCell>{estudiante.sedeEstudiante}</TableCell>
                    <TableCell>{estudiante.egresado ? 'Sí' : 'No'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(estudiante, 'estudiante')}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(estudiante, 'estudiante')}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(estudiante.rut, 'estudiante')}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
        case 'asociar':
          return (
            <div>
              <h2 className="text-2xl font-bold mb-4">Asociar Estudiante con Formación</h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Seleccionar estudiante por RUT */}
                <div>
                  <label className="block mb-2">RUT del Estudiante</label>
                  <Select onValueChange={(value) => setSelectedEstudiante(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      {estudiantes.map((estudiante) => (
                        <SelectItem key={estudiante.rut} value={estudiante.id}>
                          {estudiante.rut} - {estudiante.nombreCompleto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
        
                {/* Seleccionar formación por ID */}
                <div>
                  <label className="block mb-2">ID de la Formación</label>
                  <Select onValueChange={(value) => setSelectedFormacion(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar formación" />
                    </SelectTrigger>
                    <SelectContent>
                      {formaciones.map((formacion) => (
                        <SelectItem key={formacion.id} value={formacion.id}>
                          {formacion.id} - {formacion.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
        
              {/* Botón para asociar */}
              <Button className="mt-4" onClick={handleAsociar}>
                Asociar
              </Button>
            </div>
          )
      case 'usuarios':
        return (
          <div>
            <div className="flex  justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Usuarios</h2>
              <Button onClick={() => handleAdd('usuario')}>+ Agregar Usuario</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Usuario</TableHead>
                  <TableHead>RUT</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.rut}>
                    <TableCell>{usuario.tipo}</TableCell>
                    <TableCell>{usuario.rut}</TableCell>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.correo}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(usuario, 'usuario')}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(usuario, 'usuario')}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(usuario.rut, 'usuario')}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      case 'competencias':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Competencias</h2>
              <Button onClick={() => handleAdd('competencia')}>+ Agregar Competencia</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cód.</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competencias.map((competencia) => (
                  <TableRow key={competencia.codigo}>
                    <TableCell>{competencia.codigo}</TableCell>
                    <TableCell>{competencia.nombre}</TableCell>
                    <TableCell>{competencia.descripcion}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(competencia, 'competencia')}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(competencia, 'competencia')}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(competencia.codigo, 'competencia')}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
        case 'reporte-formaciones':
          return (
            <div>
              {/* Encabezado con título y botón de exportar */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Reporte de Formaciones</h2>
                <Button onClick={exportToExcelFormaciones}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar a Excel
                </Button>
              </div>
        
              {/* Tabla con encabezados y filtros */}
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      { key: 'semestre', label: 'Semestre' },
                      { key: 'nombre', label: 'Nombre' },
                      { key: 'modalidad', label: 'Modalidad' },
                      { key: 'profesorRelator', label: 'Relator' },
                      { key: 'estado', label: 'Estado' },
                    ].map((column, index) => (
                      <TableHead key={index}>
                        <div className="flex items-center space-x-2">
                          <span>{column.label}</span>
                          {/* Filtro */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                                <Filter className="h-4 w-4" />
                                <span className="sr-only">Filtrar {column.label}</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Input
                                placeholder={`Filtrar ${column.label}`}
                                value={filters[column.key] || ''}
                                onChange={(e) =>
                                  handleFilterChange(column.key, e.target.value, 'formaciones')
                                }
                                className="px-3 py-2"
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead>Id</TableHead>
                    <TableHead>Sede</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Fecha de Inicio</TableHead>
                    <TableHead>Fecha de Término</TableHead>
                    <TableHead>Aprobados</TableHead>
                    <TableHead>Reprobados</TableHead>
                    <TableHead>Deserción</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
        
                {/* Cuerpo de la tabla */}
                <TableBody>
                  {filteredFormaciones.map((formacion) => (
                    <TableRow key={formacion.id}>
                      <TableCell>{formacion.semestre}</TableCell>
                      <TableCell>{formacion.nombre}</TableCell>
                      <TableCell>{formacion.modalidad}</TableCell>
                      <TableCell>{formacion.profesorRelator}</TableCell>
                      <TableCell>{formacion.estado}</TableCell>
                      <TableCell>{formacion.id}</TableCell>
                      <TableCell>{formacion.sedeFormacion}</TableCell>
                      <TableCell>{formacion.semestre}</TableCell>
                      <TableCell>{new Date(formacion.fechaInicio).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(formacion.fechaTermino).toLocaleDateString()}</TableCell>
                      <TableCell>{formacion.aprobados}</TableCell>
                      <TableCell>{formacion.reprobados}</TableCell>
                      <TableCell>{formacion.desercion}</TableCell>
                      <TableCell>{formacion.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
          case 'reporte-participantes':
            return (
              <div>
                {/* Encabezado con el título y el botón de exportar */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Reporte de Participantes</h2>
                  <Button onClick={exportToExcelEstudiante}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar a Excel
                  </Button>
                </div>
          
                {/* Tabla con encabezados y filtros */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      {[
                        { key: 'rut', label: 'RUT' },
                        { key: 'carrera', label: 'Carrera' },
                        { key: 'semestre', label: 'Semestre' }, // Mapeado como periodo
                      ].map((column, index) => (
                        <TableHead key={index}>
                          <div className="flex items-center space-x-2">
                            <span>{column.label}</span>
                            {/* Filtro */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                                  <Filter className="h-4 w-4" />
                                  <span className="sr-only">Filtrar {column.label}</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Input
                                  placeholder={`Filtrar ${column.label}`}
                                  value={filters[column.key] || ''}
                                  onChange={(e) =>
                                    handleFilterChange(column.key, e.target.value, 'participantes')
                                  }
                                  className="px-3 py-2"
                                />
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableHead>
                      ))}
                      {/* Agregamos el resto de las columnas sin filtros */}
                      <TableHead>Nombre</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead>Nombre Formación</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de Inicio</TableHead>
                      <TableHead>Fecha de Término</TableHead>
                    </TableRow>
                  </TableHeader>
          
                  {/* Cuerpo de la tabla */}
                  <TableBody>
                    {filteredParticipantes.map((participante, index) => (
                      <TableRow key={index}>
                        <TableCell>{participante.rut}</TableCell>
                        <TableCell>{participante.carrera}</TableCell>
                        <TableCell>{participante.semestre}</TableCell>
                        <TableCell>{participante.nombreCompleto}</TableCell>
                        <TableCell>{participante.correo}</TableCell>
                        <TableCell>{participante.nombreFormacion}</TableCell>
                        <TableCell>{participante.estado}</TableCell>
                        <TableCell>{new Date(participante.fechaInicio).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(participante.fechaTermino).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
      default:
        return <h2 className="text-2xl font-bold">Bienvenido a la Escuela de Ayudantes y Tutores</h2>
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Escuela de Ayudantes y Tutores</h1>
        </div>
        <nav className="mt-8">
          <button onClick={() => setActiveSection('home')} className="block w-full text-left py-2 px-4 hover:bg-blue-800">
            <Home className="inline-block mr-2" size={20} />
            Inicio
          </button>
          <button onClick={() => setActiveSection('formaciones')} className="block w-full text-left py-2 px-4 hover:bg-blue-800">
            <Book className="inline-block mr-2" size={20} />
            Formaciones
          </button>
          <button onClick={() => setActiveSection('estudiantes')} className="block w-full text-left py-2 px-4 hover:bg-blue-800">
            <Users className="inline-block mr-2" size={20} />
            Estudiantes
          </button>
          <button onClick={() => setActiveSection('asociar')} className="block w-full text-left py-2 px-4 hover:bg-blue-800">
            <UserPlus className="inline-block mr-2" size={20} />
            Asociar Estudiante con Formación
          </button>
          <button onClick={() => setActiveSection('usuarios')} className="block w-full text-left py-2 px-4 hover:bg-blue-800">
            <Users className="inline-block mr-2" size={20} />
            Usuarios
          </button>
          <button onClick={() => setActiveSection('reporte-formaciones')} className="block w-full text-left py-2 px-4 hover:bg-blue-800">
            <FileText className="inline-block mr-2" size={20} />
            Reporte de Formaciones
          </button>
          <button onClick={() => setActiveSection('reporte-participantes')} className="block w-full text-left py-2 px-4 hover:bg-blue-800">
            <BarChart2 className="inline-block mr-2" size={20} />
            Reporte de Participantes
          </button>
          <button onClick={() => setActiveSection('competencias')} className="block w-full text-left py-2 px-4 hover:bg-blue-800">
            <Award className="inline-block mr-2" size={20} />
            Competencias
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>

      {/* Modals */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => { 
          setIsAddModalOpen(false);
          fetchEstudiantes();
          fetchUsuarios();
        }}
        type={modalType}
      />
      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={selectedItem}
        type={modalType}
      />
      <EditDetailsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={selectedItem}
        type={modalType}
        onSave={handleSave}
      />
    </div>
  )
}