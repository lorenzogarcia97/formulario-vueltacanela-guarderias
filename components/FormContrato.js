import React, { useState, useCallback, memo, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Componente InputField memoizado
const InputField = memo(({ label, name, value, onChange, placeholder, type = "text", error, inputRef, options, tabIndex }) => {
  return (
    <div className="input-container">
      <label htmlFor={name}>{label}</label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${error ? "shake" : ""}`}
          ref={inputRef}
          tabIndex={tabIndex}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`${error ? "shake" : ""}`}
          ref={inputRef}
          tabIndex={tabIndex}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${error ? "shake" : ""}`}
          ref={inputRef}
          tabIndex={tabIndex}
        />
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
});

InputField.displayName = "InputField"; // Agregar displayName al componente InputField

const FormularioContrato = () => {
  // Estado inicial completo
  const [formData, setFormData] = useState({
    apellidos: "",
    nombres: "",
    cedula: "",
    fechaNacimiento: "",
    pais: "",
    sala: "",
    nivel: "",
    fechaIngreso: "",
    alergias: "",
    condicionesSalud: "",
    otraInformacionSalud: "",
    medicacion: "",
    seguroSalud: "",
    seguroSaludNombre: "",
    numeroPoliza: "",
    // Contactos de emergencia 1
    contactoEmergenciaUnoNombre: "",
    contactoEmergenciaUnoApellido: "",
    contactoEmergenciaUnoMovil: "",
    contactoEmergenciaUnoParentesco: "",
    // Contactos de emergencia 2
    contactoEmergenciaDosNombre: "",
    contactoEmergenciaDosApellido: "",
    contactoEmergenciaDosMovil: "",
    contactoEmergenciaDosParentesco: "",
    // Contactos de emergencia 3
    contactoEmergenciaTresNombre: "",
    contactoEmergenciaTresApellido: "",
    contactoEmergenciaTresMovil: "",
    contactoEmergenciaTresParentesco: "",
    domicilio: "",
    calleDomicilio: "",
    nDomicilio: "",
    casaDeptoDomicilio: "",
    blockTorreDomicilio: "",
    comunaDomicilio: "",
    otroDomicilio: "",
    apoderadoCedula: "",
    apoderadoFirma: "",
    apoderadoNombres: "",
    apoderadoApellidos: "",
    apoderadoOcupacion: "",
    apoderadoEmail: "",
    apoderadoMovil: "",
    apoderadoTelefonoTrabajo: "",
    otroApoderado: "",
    papaNombre: "",
    papaCedula: "",
    papaFirma: "",
    mamaNombre: "",
    mamaCedula: "",
    mamaFirma: "",
    personasAutorizadasUno: "",
    personasAutorizadasDos: "",
    personasAutorizadasTres: "",
    autorizacionImagenes: "",
    fechaContrato: "",
    aceptaUsoImagen: false,
    noAceptaUsoImagen: false,
    // Domicilio de la madre
    calleDomicilioMama: "",
    nDomicilioMama: "",
    casaDeptoDomicilioMama: "",
    blockTorreDomicilioMama: "",
    comunaDomicilioMama: "",
    otroDomicilioMama: "",
    // Papá
    apellidosPapa: "",
    nombresPapa: "",
    correoPapa: "",
    movilPapa: "",
    ocupacionPapa: "",
    // Domicilio del padre
    calleDomicilioPapa: "",
    nDomicilioPapa: "",
    casaDeptoDomicilioPapa: "",
    blockTorreDomicilioPapa: "",
    comunaDomicilioPapa: "",
    otroDomicilioPapa: "",
    // Personas autorizadas
    personaAutorizadaUnoNombre: "",
    personaAutorizadaUnoApellido: "",
    personaAutorizadaUnoCI: "",
    personaAutorizadaUnoParentesco: "",
    personaAutorizadaDosNombre: "",
    personaAutorizadaDosApellido: "",
    personaAutorizadaDosCI: "",
    personaAutorizadaDosParentesco: "",
    personaAutorizadaTresNombre: "",
    personaAutorizadaTresApellido: "",
    personaAutorizadaTresCI: "",
    personaAutorizadaTresParentesco: "",
  });

  const [errors, setErrors] = useState({
    contactosEmergencia: ["", "", ""],
  }); // Estado para almacenar errores

  // Referencias para los campos
  const apellidosRef = useRef(null);
  const nombresRef = useRef(null);
  const cedulaRef = useRef(null);
  const paisRef = useRef(null);
  const salaRef = useRef(null);
  const nivelRef = useRef(null);
  const fechaNacimientoRef = useRef(null);
  const fechaIngresoRef = useRef(null);
  const condicionesSaludRef = useRef(null);
  const alergiasRef = useRef(null);
  const medicacionRef = useRef(null);
  const calleDomicilioRef = useRef(null);
  const nDomicilioRef = useRef(null);
  const casaDeptoDomicilioRef = useRef(null);
  const comunaDomicilioRef = useRef(null);
  const apoderadoApellidosRef = useRef(null);
  const apoderadoNombresRef = useRef(null);
  const apoderadoCedulaRef = useRef(null);
  const apoderadoEmailRef = useRef(null);
  const apoderadoMovilRef = useRef(null);
  const contactoEmergenciaUnoRef = useRef(null);
  const contactoEmergenciaDosRef = useRef(null);
  const contactoEmergenciaTresRef = useRef(null);

  const generarPDF = () => {
    const formulario = document.getElementById("formulario-contrato");

    if (!formulario) {
      console.error("No se encontró el contenedor del formulario.");
      return;
    }

    console.log("Formulario encontrado, iniciando generación de PDF...");

    // Ocultar elementos que no deben aparecer en el PDF
    const botonEnviar = formulario.querySelector('.no-print');
    const inputs = formulario.querySelectorAll('input, textarea');
    
    if (botonEnviar) botonEnviar.style.display = 'none';
    
    // Guardar los placeholders originales y hacerlos transparentes
    const originalPlaceholders = [];
    inputs.forEach((input, index) => {
      originalPlaceholders[index] = input.placeholder;
      input.placeholder = '';
    });

    // Crear PDF en formato carta (215.9 x 279.4 mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });

    // Función para capturar una sección específica con el diseño completo
    const captureSection = async (sectionId) => {
      // Clonar el formulario completo para mantener el diseño
      const formClone = formulario.cloneNode(true);
      formClone.style.position = 'absolute';
      formClone.style.left = '-9999px';
      document.body.appendChild(formClone);

      // Ocultar todas las secciones excepto la que queremos capturar
      const sections = formClone.querySelectorAll('[id^="section-"]');
      sections.forEach(section => {
        if (section.id !== sectionId) {
          section.style.display = 'none';
        }
      });

      // Ocultar el botón de envío en el clon
      const cloneBotonEnviar = formClone.querySelector('.no-print');
      if (cloneBotonEnviar) cloneBotonEnviar.style.display = 'none';

      // Ajustes específicos para la sección 5-6 (tercera página)
      if (sectionId === 'section-5-6') {
        formClone.style.width = '1024px';
        formClone.style.height = '1450px';
        formClone.style.overflow = 'hidden';
      }

      // Capturar la sección
      const canvas = await html2canvas(formClone, {
        scale: 3,
        useCORS: true,
        logging: true,
        windowWidth: 1024,
        windowHeight: 1450,
        letterRendering: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          if (sectionId === 'section-5-6') {
            const clonedForm = clonedDoc.getElementById('formulario-contrato');
            if (clonedForm) {
              clonedForm.style.transform = 'scale(0.8)';
              clonedForm.style.transformOrigin = 'top left';
            }
          }
        }
      });

      // Limpiar el clon
      document.body.removeChild(formClone);

      return canvas.toDataURL("image/png", 1.0);
    };

    // Función para agregar una imagen al PDF
    const addImageToPDF = (imgData, pageNumber) => {
      if (pageNumber > 0) {
        pdf.addPage();
      }

      const pageWidth = 215.9;
      const pageHeight = 279.4;
      const margin = 12.7;

      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (pageHeight - (margin * 2));

      pdf.addImage(
        imgData,
        "PNG",
        margin,
        margin,
        imgWidth,
        imgHeight
      );
    };

    // Capturar y agregar cada sección
    const processSections = async () => {
      try {
        // Sección 1 y 2 (primera página)
        const section1_2 = await captureSection('section-1-2');
        if (section1_2) addImageToPDF(section1_2, 0);

        // Sección 3 y 4 (segunda página)
        const section3_4 = await captureSection('section-3-4');
        if (section3_4) addImageToPDF(section3_4, 1);

        // Sección 5 y 6 (tercera página)
        const section5_6 = await captureSection('section-5-6');
        if (section5_6) addImageToPDF(section5_6, 2);

        // Sección 7 (cuarta página)
        const section7 = await captureSection('section-7');
        if (section7) addImageToPDF(section7, 3);

        // Restaurar los elementos ocultos
        if (botonEnviar) botonEnviar.style.display = 'block';
        
        // Restaurar los placeholders originales
        inputs.forEach((input, index) => {
          input.placeholder = originalPlaceholders[index];
        });

          // Generar el nombre del archivo usando el nombre del niño
          const nombreArchivo = `Ficha de Ingreso Vuelta Canela - ${formData.nombres} ${formData.apellidos}.pdf`;
          console.log("Nombre del archivo generado:", nombreArchivo);

          // Guardar el PDF con el nombre personalizado
          pdf.save(nombreArchivo);
          console.log("PDF guardado correctamente.");
      } catch (error) {
          console.error("Error al generar el PDF:", error);
        
        // Restaurar los elementos ocultos en caso de error
        if (botonEnviar) botonEnviar.style.display = 'block';
        
        // Restaurar los placeholders originales en caso de error
        inputs.forEach((input, index) => {
          input.placeholder = originalPlaceholders[index];
        });
      }
    };

    // Iniciar el proceso de generación del PDF
    processSections();
  };

  // Memoizar la función handleChange
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;

    if (name === "aceptaUsoImagen" && checked) {
      setFormData((prevData) => ({
        ...prevData,
        aceptaUsoImagen: true,
        noAceptaUsoImagen: false,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, autorizacionImagenes: "" })); // Limpia el error
    } else if (name === "noAceptaUsoImagen" && checked) {
      setFormData((prevData) => ({
        ...prevData,
        aceptaUsoImagen: false,
        noAceptaUsoImagen: true,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, autorizacionImagenes: "" })); // Limpia el error
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));

      // Limpiar el error si el campo tiene valor
      if (value.trim() !== "") {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("handleSubmit ejecutado");
    const newErrors = {};

    // Validación de campos obligatorios
    const validations = {
      apellidos: "Los apellidos son obligatorios.",
      nombres: "Los nombres son obligatorios.",
      cedula: "La cédula es obligatoria.",
      pais: "El país es obligatorio.",
      sala: "La sala es obligatoria.",
      nivel: "El nivel al que postula es obligatorio.",
      fechaNacimiento: "La fecha de nacimiento es obligatoria.",
      fechaIngreso: "La fecha de ingreso es obligatoria.",
      condicionesSalud: "La condición de salud es obligatoria.",
      alergias: "Informar sobre si el niño tiene algún tipo de alergia es obligatorio.",
      medicacion: "Remedios es obligatorio.",
      calleDomicilio: "La calle del domicilio es obligatorio.",
      nDomicilio: "Ingresar el N° del domicilio es obligatorio.",
      casaDeptoDomicilio: "Ingresar la casa/depto del domicilio es obligatorio.",
      comunaDomicilio: "Ingresar la comuna del domicilio es obligatorio.",
      apoderadoApellidos: "Ingresar los apellidos del apoderado es obligtaroio.",
      apoderadoNombres: "Ingresar los nombres del apoderado es obligatorio",
      apoderadoCedula: "Ingresar la cédula de identidad del apoderado es obligatorio",
      apoderadoEmail: "Ingresar el correo electronico del apoderado es obligatorio",
      apoderadoMovil: "Ingresar el móvil del apoderado es obligatorio",
      contactoEmergenciaUno: "Debe ingresar minimo un contacto de emergencia",
    };

    for (const [field, message] of Object.entries(validations)) {
      if (!formData[field]) {
        newErrors[field] = message;
      }
    }

    console.log("Errores de validación:", newErrors);

    // Validar autorización de imágenes
    if (!formData.aceptaUsoImagen && !formData.noAceptaUsoImagen) {
      newErrors.autorizacionImagenes = "Debe seleccionar una opción de autorización de imágenes.";
    }

    // Verificar si hay errores
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log("Errores encontrados, no se genera PDF");

      // Hacer scroll al primer campo con error
      const fieldRefs = {
        apellidos: apellidosRef,
        nombres: nombresRef,
        cedula: cedulaRef,
        pais: paisRef,
        sala: salaRef,
        nivel: nivelRef,
        fechaNacimiento: fechaNacimientoRef,
        fechaIngreso: fechaIngresoRef,
        calleDomicilio: calleDomicilioRef,
        nDomicilio: nDomicilioRef,
        casaDeptoDomicilio: casaDeptoDomicilioRef,
        comunaDomicilio: comunaDomicilioRef,
        apoderadoApellidos: apoderadoApellidosRef,
        apoderadoNombres: apoderadoNombresRef,
        apoderadoCedula: apoderadoCedulaRef,
        apoderadoEmail: apoderadoEmailRef,
        apoderadoMovil: apoderadoMovilRef,
        contactoEmergenciaUno: contactoEmergenciaUnoRef,
        contactoEmergenciaDos: contactoEmergenciaDosRef,
        contactoEmergenciaTres: contactoEmergenciaTresRef,
      };

      for (const [field, ref] of Object.entries(fieldRefs)) {
        if (newErrors[field] && ref.current) {
          ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
          break; // Detener el bucle después de hacer scroll al primer campo con error
        }
      }

      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log("Errores encontrados, no se genera PDF");
      return;
    }

    console.log("Formulario válido, generando PDF...");
    generarPDF();
  };

  return (
    <div 
      id="formulario-contrato" 
      className="formulario-contenedor max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200"
      style={{
        position: 'relative'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderRadius: '0.5rem',
          zIndex: 1
        }}
      />
      <div className="logo-container">
        <img 
          src="/logo2.jpg" 
          alt="Logo Vuelta Canela" 
        />
      </div>
      <div className="title-container">
        <h2>Ficha de Ingreso - Vuelta Canela</h2>
      </div>
      <form onSubmit={handleSubmit} className="w-full" style={{ position: 'relative', zIndex: 2 }}>
        {/* Sección 1 y 2: Identificación del niño/a e Información de salud */}
        <div id="section-1-2" className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">1.- Identificación del niño(a)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Columna izquierda */}
            <div className="flex flex-col space-y-4">
        <InputField
                label="Apellidos"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          placeholder="Ingrese los apellidos"
          error={errors.apellidos}
          inputRef={apellidosRef}
                tabIndex={1}
              />
          <InputField
            label="País"
            name="pais"
            value={formData.pais}
            onChange={handleChange}
                placeholder="Ingrese el país"
            error={errors.pais}
            inputRef={paisRef}
                tabIndex={4}
          />
          <InputField
            label="Nivel al que postula"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
                type="select"
            error={errors.nivel}
            inputRef={nivelRef}
                tabIndex={7}
                options={[
                  { value: "", label: "Seleccione un nivel" },
                  { value: "Sala cuna menor", label: "Sala cuna menor" },
                  { value: "Sala cuna mayor", label: "Sala cuna mayor" },
                  { value: "Medio menor", label: "Medio menor" },
                  { value: "Medio mayor", label: "Medio mayor" },
                  { value: "Pre-Kinder", label: "Pre-Kinder" },
                  { value: "Kinder", label: "Kinder" },
                  { value: "Afterschool", label: "Afterschool" }
                ]}
              />
            </div>
            {/* Columna central */}
            <div className="flex flex-col space-y-4">
              <InputField
                label="Nombre completo"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Ingrese el nombre completo"
                error={errors.nombres}
                inputRef={nombresRef}
                tabIndex={2}
          />
          <InputField
            label="Fecha de Nacimiento"
            name="fechaNacimiento"
                type="date"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            error={errors.fechaNacimiento}
                tabIndex={5}
              />
              <InputField
                label="Sala"
                name="sala"
                value={formData.sala}
                onChange={handleChange}
                placeholder="Ingrese la sala"
                error={errors.sala}
                inputRef={salaRef}
                tabIndex={8}
              />
            </div>
            {/* Columna derecha */}
            <div className="flex flex-col space-y-4">
              <InputField
                label="Cédula de Identidad"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="Ingrese la cédula"
                error={errors.cedula}
                inputRef={cedulaRef}
                tabIndex={3}
          />
          <InputField
            label="Fecha de ingreso"
            name="fechaIngreso"
                type="date"
            value={formData.fechaIngreso}
            onChange={handleChange}
            error={errors.fechaIngreso}
                tabIndex={6}
          />
        </div>
        </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">2.- Información de salud</h3>
          <div className="border border-gray-400 bg-gray-100 p-4 rounded-md text-gray-700 shadow-md mb-4">
          </div>
          <div className="space-y-4">
        <InputField
          label="¿El menor presenta alguna condición de salud de cuidado?"
          name="condicionesSalud"
          value={formData.condicionesSalud}
          onChange={handleChange}
          type="textarea"
          error={errors.condicionesSalud}
          inputRef={condicionesSaludRef}
              tabIndex={9}
              placeholder="El campo es obligatorio, detalle su respuesta."
        />
        <InputField
              label="¿El niño(a) tiene algún tipo de alergia - nasal, digestiva, respiratoria?"
          name="alergias"
          value={formData.alergias}
          onChange={handleChange}
          type="textarea"
          error={errors.alergias}
          inputRef={alergiasRef}
              tabIndex={10}
              placeholder="El campo es obligatorio, detalle su respuesta."
        />
        <InputField
          label="¿Toma remedios? En caso de ser afirmativo, deberá presentar receta y/o informe del pediatra o profesional afín."
          name="medicacion"
          value={formData.medicacion}
          onChange={handleChange}
          type="textarea"
          error={errors.medicacion}
          inputRef={medicacionRef}
              tabIndex={11}
              placeholder="El campo es obligatorio, detalle su respuesta."
        />
        <InputField
          label="Otra información complementaria que desee agregar:"
          name="otraInformacionSalud"
          value={formData.otraInformacionSalud}
          onChange={handleChange}
          type="textarea"
              tabIndex={12}
            />
          </div>
        </div>

        {/* Sección 3 y 4: Información en caso de urgencias y Domicilio */}
        <div id="section-3-4" className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">3.- Contactos en caso de urgencias</h3>
          <div className="grid-row">
            <div className="grid-header">Nombre</div>
            <div className="grid-header">Apellido</div>
            <div className="grid-header">Móvil</div>
            <div className="grid-header">Parentesco</div>
          </div>
          <div className="space-y-4">
            <div className="grid-row">
                <InputField label="" name="contactoEmergenciaUnoNombre" value={formData.contactoEmergenciaUnoNombre} onChange={handleChange} placeholder="Nombre" error={errors.contactoEmergenciaUnoNombre} tabIndex={13} />
                <InputField label="" name="contactoEmergenciaUnoApellido" value={formData.contactoEmergenciaUnoApellido} onChange={handleChange} placeholder="Apellido" error={errors.contactoEmergenciaUnoApellido} tabIndex={14} />
                <InputField label="" name="contactoEmergenciaUnoMovil" value={formData.contactoEmergenciaUnoMovil} onChange={handleChange} placeholder="+56 9" error={errors.contactoEmergenciaUnoMovil} tabIndex={15} />
                <InputField label="" name="contactoEmergenciaUnoParentesco" value={formData.contactoEmergenciaUnoParentesco} onChange={handleChange} placeholder="Parentesco" error={errors.contactoEmergenciaUnoParentesco} tabIndex={16} />
            </div>
            <div className="grid-row">
                <InputField label="" name="contactoEmergenciaDosNombre" value={formData.contactoEmergenciaDosNombre} onChange={handleChange} placeholder="Nombre" error={errors.contactoEmergenciaDosNombre} tabIndex={17} />
                <InputField label="" name="contactoEmergenciaDosApellido" value={formData.contactoEmergenciaDosApellido} onChange={handleChange} placeholder="Apellido" error={errors.contactoEmergenciaDosApellido} tabIndex={18} />
                <InputField label="" name="contactoEmergenciaDosMovil" value={formData.contactoEmergenciaDosMovil} onChange={handleChange} placeholder="+56 9" error={errors.contactoEmergenciaDosMovil} tabIndex={19} />
                <InputField label="" name="contactoEmergenciaDosParentesco" value={formData.contactoEmergenciaDosParentesco} onChange={handleChange} placeholder="Parentesco" error={errors.contactoEmergenciaDosParentesco} tabIndex={20} />
            </div>
            <div className="grid-row">
                <InputField label="" name="contactoEmergenciaTresNombre" value={formData.contactoEmergenciaTresNombre} onChange={handleChange} placeholder="Nombre" error={errors.contactoEmergenciaTresNombre} tabIndex={21} />
                <InputField label="" name="contactoEmergenciaTresApellido" value={formData.contactoEmergenciaTresApellido} onChange={handleChange} placeholder="Apellido" error={errors.contactoEmergenciaTresApellido} tabIndex={22} />
                <InputField label="" name="contactoEmergenciaTresMovil" value={formData.contactoEmergenciaTresMovil} onChange={handleChange} placeholder="+56 9" error={errors.contactoEmergenciaTresMovil} tabIndex={23} />
                <InputField label="" name="contactoEmergenciaTresParentesco" value={formData.contactoEmergenciaTresParentesco} onChange={handleChange} placeholder="Parentesco" error={errors.contactoEmergenciaTresParentesco} tabIndex={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <InputField
            label="En caso de accidente grave, autorizo al Jardín a trasladar a mi hijo a:"
            name="lugarTraslado"
            value={formData.lugarTraslado}
            onChange={handleChange}
            placeholder="Detallar el lugar de su preferencia y dirección."
            type="textarea"
              tabIndex={25}
          />
          <InputField
            label="¿Posee seguro de salud?"
            name="seguroSalud"
            value={formData.seguroSalud}
            onChange={handleChange}
            placeholder="Detallar datos completos del seguro, N° de poliza, telefonos de contacto."
              type="textarea"
              tabIndex={26}
          />
        </div>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">4.- Domicilio del niño(a)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Columna izquierda */}
            <div className="flex flex-col space-y-4">
              <InputField
                label="Calle"
                name="calleDomicilio"
                value={formData.calleDomicilio}
                onChange={handleChange}
                placeholder="Ingrese calle del domicilio"
                error={errors.calleDomicilio}
                inputRef={calleDomicilioRef}
                tabIndex={27}
              />
              <InputField
                label="Casa/Depto"
                name="casaDeptoDomicilio"
                value={formData.casaDeptoDomicilio}
                onChange={handleChange}
                placeholder="Ingrese casa/depto del domicilio"
                error={errors.casaDeptoDomicilio}
                inputRef={casaDeptoDomicilioRef}
                tabIndex={30}
              />
            </div>
            {/* Columna central */}
            <div className="flex flex-col space-y-4">
              <InputField
                label="N°"
                name="nDomicilio"
                value={formData.nDomicilio}
                onChange={handleChange}
                placeholder="Ingrese N° del domicilio"
                error={errors.nDomicilio}
                inputRef={nDomicilioRef}
                tabIndex={28}
              />
              <InputField
                label="Block/Torre"
                name="blockTorreDomicilio"
                value={formData.blockTorreDomicilio}
                onChange={handleChange}
                placeholder="Ingrese block/torre del domicilio"
                tabIndex={31}
              />
            </div>
            {/* Columna derecha */}
            <div className="flex flex-col space-y-4">
              <InputField
                label="Comuna"
                name="comunaDomicilio"
                value={formData.comunaDomicilio}
                onChange={handleChange}
                placeholder="Ingrese comuna del domicilio"
                error={errors.comunaDomicilio}
                inputRef={comunaDomicilioRef}
                tabIndex={29}
              />
              <InputField
                label="Otro"
                name="otroDomicilio"
                value={formData.otroDomicilio}
                onChange={handleChange}
                placeholder="Especifique"
                tabIndex={32}
              />
            </div>
          </div>

          {/* Domicilio de la madre */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Domicilio de la madre (si es el mismo del menor, no llenar)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Columna izquierda */}
              <div className="flex flex-col space-y-4">
                <InputField
                  label="Calle"
                  name="calleDomicilioMama"
                  value={formData.calleDomicilioMama}
                  onChange={handleChange}
                  placeholder="Ingrese calle del domicilio"
                  tabIndex={33}
                />
                <InputField
                  label="Casa/Depto"
                  name="casaDeptoDomicilioMama"
                  value={formData.casaDeptoDomicilioMama}
                  onChange={handleChange}
                  placeholder="Ingrese casa/depto del domicilio"
                  tabIndex={36}
                />
              </div>
              {/* Columna central */}
              <div className="flex flex-col space-y-4">
                <InputField
                  label="N°"
                  name="nDomicilioMama"
                  value={formData.nDomicilioMama}
                  onChange={handleChange}
                  placeholder="Ingrese N° del domicilio"
                  tabIndex={34}
                />
                <InputField
                  label="Block/Torre"
                  name="blockTorreDomicilioMama"
                  value={formData.blockTorreDomicilioMama}
                  onChange={handleChange}
                  placeholder="Ingrese block/torre del domicilio"
                  tabIndex={37}
                />
              </div>
              {/* Columna derecha */}
              <div className="flex flex-col space-y-4">
                <InputField
                  label="Comuna"
                  name="comunaDomicilioMama"
                  value={formData.comunaDomicilioMama}
                  onChange={handleChange}
                  placeholder="Ingrese comuna del domicilio"
                  tabIndex={35}
                />
                <InputField
                  label="Otro"
                  name="otroDomicilioMama"
                  value={formData.otroDomicilioMama}
                  onChange={handleChange}
                  placeholder="Especifique"
                  tabIndex={38}
                />
              </div>
            </div>
          </div>

          {/* Domicilio del padre */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Domicilio del padre (si es el mismo del menor, no llenar)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Columna izquierda */}
              <div className="flex flex-col space-y-4">
                <InputField
                  label="Calle"
                  name="calleDomicilioPapa"
                  value={formData.calleDomicilioPapa}
                  onChange={handleChange}
                  placeholder="Ingrese calle del domicilio"
                  tabIndex={39}
                />
                <InputField
                  label="Casa/Depto"
                  name="casaDeptoDomicilioPapa"
                  value={formData.casaDeptoDomicilioPapa}
                  onChange={handleChange}
                  placeholder="Ingrese casa/depto del domicilio"
                  tabIndex={42}
                />
              </div>
              {/* Columna central */}
              <div className="flex flex-col space-y-4">
                <InputField
                  label="N°"
                  name="nDomicilioPapa"
                  value={formData.nDomicilioPapa}
                  onChange={handleChange}
                  placeholder="Ingrese N° del domicilio"
                  tabIndex={40}
                />
                <InputField
                  label="Block/Torre"
                  name="blockTorreDomicilioPapa"
                  value={formData.blockTorreDomicilioPapa}
                  onChange={handleChange}
                  placeholder="Ingrese block/torre del domicilio"
                  tabIndex={43}
                />
              </div>
              {/* Columna derecha */}
              <div className="flex flex-col space-y-4">
                <InputField
                  label="Comuna"
                  name="comunaDomicilioPapa"
                  value={formData.comunaDomicilioPapa}
                  onChange={handleChange}
                  placeholder="Ingrese comuna del domicilio"
                  tabIndex={41}
                />
                <InputField
                  label="Otro"
                  name="otroDomicilioPapa"
                  value={formData.otroDomicilioPapa}
                  onChange={handleChange}
                  placeholder="Especifique"
                  tabIndex={44}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección 5 y 6: Apoderado e Identificación de familiar */}
        <div id="section-5-6" className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">5.- Apoderado</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Columna izquierda */}
            <div className="flex flex-col space-y-4">
              <InputField
                label="Apellidos (ambos)"
                name="apoderadoApellidos"
                value={formData.apoderadoApellidos}
                onChange={handleChange}
                placeholder="Ingrese los apellidos"
                error={errors.apoderadoApellidos}
                inputRef={apoderadoApellidosRef}
                tabIndex={45}
              />
              <InputField
                label="Ocupación"
                name="apoderadoOcupacion"
                value={formData.apoderadoOcupacion}
                onChange={handleChange}
                placeholder="Ingrese la ocupación"
                tabIndex={48}
              />
              <InputField
                label="Teléfono trabajo"
                name="apoderadoTelefonoTrabajo"
                value={formData.apoderadoTelefonoTrabajo}
                onChange={handleChange}
                placeholder="Ingrese el teléfono del trabajo"
                tabIndex={51}
              />
            </div>
            {/* Columna central */}
            <div className="flex flex-col space-y-4">
              <InputField
                label="Nombre completo"
                name="apoderadoNombres"
                value={formData.apoderadoNombres}
                onChange={handleChange}
                placeholder="Ingrese los nombres"
                error={errors.apoderadoNombres}
                inputRef={apoderadoNombresRef}
                tabIndex={46}
              />
              <InputField
                label="Correo electrónico"
                name="apoderadoEmail"
                value={formData.apoderadoEmail}
                onChange={handleChange}
                type="email"
                placeholder="Ingrese el correo"
                error={errors.apoderadoEmail}
                inputRef={apoderadoEmailRef}
                tabIndex={49}
              />
              <InputField
                label="Otro"
                name="otroApoderado"
                value={formData.otroApoderado}
                onChange={handleChange}
                placeholder="Ingrese otra información"
                tabIndex={52}
              />
            </div>
            {/* Columna derecha */}
            <div className="flex flex-col space-y-4">
              <InputField
                label="Cédula de Identidad"
                name="apoderadoCedula"
                value={formData.apoderadoCedula}
                onChange={handleChange}
                placeholder="Ejemplo: 12.345.678-9"
                error={errors.apoderadoCedula}
                inputRef={apoderadoCedulaRef}
                tabIndex={47}
              />
              <InputField
                label="Móvil"
                name="apoderadoMovil"
                value={formData.apoderadoMovil}
                onChange={handleChange}
                placeholder="+56 9"
                error={errors.apoderadoMovil}
                inputRef={apoderadoMovilRef}
                tabIndex={50}
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">6.- Identificación de familiar</h3>
          
          {/* Mamá */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Mamá</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Columna izquierda */}
              <div className="flex flex-col space-y-4">
                <InputField
                  label="Apellidos (ambos)"
                  name="apellidosMama"
                  value={formData.apellidosMama}
                  onChange={handleChange}
                  placeholder="Ingrese los apellidos"
                  tabIndex={53}
                />
                <InputField
                  label="Correo electrónico"
                  name="correoMama"
                  value={formData.correoMama}
                  onChange={handleChange}
                  type="email"
                  placeholder="Ingrese su correo"
                  tabIndex={56}
                />
              </div>
              {/* Columna central */}
              <div className="flex flex-col space-y-4">
                <InputField
                  label="Nombre completo"
                  name="nombresMama"
                  value={formData.nombresMama}
                  onChange={handleChange}
                  placeholder="Ingrese los nombres"
                  tabIndex={54}
                />
                <InputField
                  label="Móvil"
                  name="movilMama"
                  value={formData.movilMama}
                  onChange={handleChange}
                  placeholder="+56 9"
                  tabIndex={57}
                />
              </div>
              {/* Columna derecha */}
              <div className="flex flex-col space-y-4">
                <InputField
                  label="Cédula de Identidad"
                  name="cedulaMama"
                  value={formData.cedulaMama}
                  onChange={handleChange}
                  placeholder="Ejemplo: 12.345.678-9"
                  tabIndex={55}
                />
                <InputField
                  label="Ocupación"
                  name="ocupacionMama"
                  value={formData.ocupacionMama}
                  onChange={handleChange}
                  placeholder="Ingrese la ocupación"
                  tabIndex={58}
                />
              </div>
            </div>
          </div>
          
          {/* Papá */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Papá</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Columna izquierda */}
              <div className="flex flex-col space-y-4">
                <InputField
                  label="Apellidos (ambos)"
                  name="apellidosPapa"
                  value={formData.apellidosPapa}
                  onChange={handleChange}
                  placeholder="Ingrese los apellidos"
                  tabIndex={59}
                />
                <InputField
                  label="Correo electrónico"
                  name="correoPapa"
                  value={formData.correoPapa}
                  onChange={handleChange}
                  type="email"
                  placeholder="Ingrese su correo"
                  tabIndex={62}
                />
              </div>
              {/* Columna central */}
              <div className="flex flex-col space-y-4">
                <InputField
                  label="Nombre completo"
                  name="nombresPapa"
                  value={formData.nombresPapa}
                  onChange={handleChange}
                  placeholder="Ingrese los nombres"
                  tabIndex={60}
                />
                <InputField
                  label="Móvil"
                  name="movilPapa"
                  value={formData.movilPapa}
                  onChange={handleChange}
                  placeholder="+56 9"
                  tabIndex={63}
                />
              </div>
              {/* Columna derecha */}
              <div className="flex flex-col space-y-4">
                <InputField
                  label="Cédula de Identidad"
                  name="cedulaPapa"
                  value={formData.cedulaPapa}
                  onChange={handleChange}
                  placeholder="Ejemplo: 12.345.678-9"
                  tabIndex={61}
                />
                <InputField
                  label="Ocupación"
                  name="ocupacionPapa"
                  value={formData.ocupacionPapa}
                  onChange={handleChange}
                  placeholder="Ingrese la ocupación"
                  tabIndex={64}
                />
              </div>
            </div>
          </div>

          {/* Sección de Personas autorizadas */}
          <div id="section-autorizadas" className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">7.- Personas autorizadas a retirar al menor del Jardín</h3>
            <div className="grid-row">
              <div className="grid-header">Nombre</div>
              <div className="grid-header">Apellido</div>
              <div className="grid-header">C.I</div>
              <div className="grid-header">Parentesco</div>
            </div>
            <div className="space-y-4">
              <div className="grid-row">
                <InputField label="" name="personaAutorizadaUnoNombre" value={formData.personaAutorizadaUnoNombre} onChange={handleChange} placeholder="Nombre" tabIndex={77} />
                <InputField label="" name="personaAutorizadaUnoApellido" value={formData.personaAutorizadaUnoApellido} onChange={handleChange} placeholder="Apellido" tabIndex={78} />
                <InputField label="" name="personaAutorizadaUnoCI" value={formData.personaAutorizadaUnoCI} onChange={handleChange} placeholder="Cédula de Identidad" tabIndex={79} />
                <InputField label="" name="personaAutorizadaUnoParentesco" value={formData.personaAutorizadaUnoParentesco} onChange={handleChange} placeholder="Parentesco" tabIndex={80} />
              </div>
              <div className="grid-row">
                <InputField label="" name="personaAutorizadaDosNombre" value={formData.personaAutorizadaDosNombre} onChange={handleChange} placeholder="Nombre" tabIndex={81} />
                <InputField label="" name="personaAutorizadaDosApellido" value={formData.personaAutorizadaDosApellido} onChange={handleChange} placeholder="Apellido" tabIndex={82} />
                <InputField label="" name="personaAutorizadaDosCI" value={formData.personaAutorizadaDosCI} onChange={handleChange} placeholder="Cédula de Identidad" tabIndex={83} />
                <InputField label="" name="personaAutorizadaDosParentesco" value={formData.personaAutorizadaDosParentesco} onChange={handleChange} placeholder="Parentesco" tabIndex={84} />
              </div>
              <div className="grid-row">
                <InputField label="" name="personaAutorizadaTresNombre" value={formData.personaAutorizadaTresNombre} onChange={handleChange} placeholder="Nombre" tabIndex={85} />
                <InputField label="" name="personaAutorizadaTresApellido" value={formData.personaAutorizadaTresApellido} onChange={handleChange} placeholder="Apellido" tabIndex={86} />
                <InputField label="" name="personaAutorizadaTresCI" value={formData.personaAutorizadaTresCI} onChange={handleChange} placeholder="Cédula de Identidad" tabIndex={87} />
                <InputField label="" name="personaAutorizadaTresParentesco" value={formData.personaAutorizadaTresParentesco} onChange={handleChange} placeholder="Parentesco" tabIndex={88} />
              </div>
            </div>
          </div>
        </div>

        {/* Sección 7: Autorización de imágenes y firmas */}
        <div id="section-7" className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">7.- Autorización para el uso de imágenes</h3>
          <div className="border border-gray-400 bg-gray-100 p-4 rounded-md text-gray-700 shadow-md mb-4">
          <p className="mb-4">
            Yo, en mi calidad de (progenitor, tutor o responsable legal) del menor, ambos
            individualizados al final de este documento, autorizo voluntariamente el uso de su
            imagen en fotografías, videos y grabaciones de los talleres que realiza el jardín.
            En razón de lo anterior (marcar una alternativa):
          </p>
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`checkbox-container ${formData.aceptaUsoImagen ? 'checked' : ''}`}
                onClick={() =>
                  setFormData((prevData) => ({
                    ...prevData,
                    aceptaUsoImagen: !prevData.aceptaUsoImagen,
                      noAceptaUsoImagen: false,
                  }))
                }
              >
                {formData.aceptaUsoImagen && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <label className="text-gray-700">
                ACEPTO y accedo a que mi representado sea fotografiado y/o grabado en video.
              </label>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`checkbox-container ${formData.noAceptaUsoImagen ? 'checked' : ''}`}
                onClick={() =>
                  setFormData((prevData) => ({
                    ...prevData,
                    noAceptaUsoImagen: !prevData.noAceptaUsoImagen,
                      aceptaUsoImagen: false,
                  }))
                }
              >
                {formData.noAceptaUsoImagen && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <label className="text-gray-700">NO ACEPTO</label>
            </div>
            {errors.autorizacionImagenes && (
              <p className="text-red-500 text-sm mt-2">{errors.autorizacionImagenes}</p>
            )}
          </div>
        </div>
          <div className="border border-gray-400 bg-gray-100 p-4 rounded-md text-gray-700 shadow-md mb-4">
          <p className="mb-4">
            En caso de aceptar, nos comprometemos a que este material será de uso exclusivo
            de Jardin Infantil Vuelta Canela Co SpA, RUT: 76.443.772-1, para los &quot;post&quot; o similares
            publicaciones en las redes sociales; Instagram; Facebook; WhatsApp; TikTok.
          </p>
        </div>
          <div className="border border-gray-400 bg-gray-100 p-4 rounded-md text-gray-700 shadow-md">
          <p className="mb-4">
              Autorizo la creación de contenido que considere el Jardín de forma sana,
            recreacional e informativa donde participe mi representado. Entiendo que los usos
            que se hagan de la imagen de mi representado, en ningún caso significarán uso
            indebido de la misma, ni invasión de su intimidad toda vez que accedo
            voluntariamente a otorgar las autorizaciones que constan en este instrumento. Del
            mismo modo, reconozco que el Jardín puede decidir no usar el material que obtenga
            y eliminarlo.
          </p>
        </div>

          {/* Líneas para firmas */}
          <div className="firma-container mt-8">
            <div className="firma-box">
              <div className="firma-line"></div>
              <p className="firma-text">Firma del Apoderado</p>
              <p className="firma-subtext">Nombre y RUT</p>
            </div>
            <div className="firma-box">
              <div className="firma-line"></div>
              <p className="firma-text">Firma del Jardín</p>
              <p className="firma-subtext">Nombre y RUT</p>
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="col-span-1 md:col-span-2 mt-6 no-print" style={{ display: 'block' }}>
          <button
            type="submit"
            className="w-full bg-[#D92D89] text-white py-2 px-4 rounded-md hover:bg-[#C2257A] transition-colors"
            style={{ display: 'block' }}
          >
            Enviar Formulario
          </button>
        </div>
      </form>
    </div>
  );
};

FormularioContrato.displayName = "FormularioContrato"; // Agregar displayName al componente FormularioContrato

export default FormularioContrato;