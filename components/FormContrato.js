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
          autoComplete="off"
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
          autoComplete="off"
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
          autoComplete="off"
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
    // Crear PDF en formato carta
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });

    // Definir las secciones del formulario
    const sections = [
      'section-1-2',
      'section-3-4',
      'section-5-6',
      'section-7-8'
    ];

    // Función para capturar una sección
    const captureSection = async (sectionId) => {
      const section = document.getElementById(sectionId);
      if (!section) {
        console.error(`No se encontró la sección ${sectionId}`);
        return null;
      }

      // Asegurar que la sección tenga suficiente espacio
      section.style.height = 'auto';
      section.style.overflow = 'visible';
      section.style.position = 'relative';
      section.style.padding = '20px';
      section.style.margin = '0';
      section.style.width = '190mm'; // Ancho máximo para tamaño carta

      // Calcular la altura necesaria para la sección
      const sectionHeight = section.scrollHeight;
      const minHeight = 800; // Altura mínima para asegurar que todo el contenido sea visible
      section.style.minHeight = `${Math.max(sectionHeight, minHeight)}px`;

      // Preparar los campos de entrada para la captura
      const inputs = section.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        // Ocultar placeholder
        input.placeholder = '';
        
        // Asegurar que el valor sea visible
        input.style.color = '#000';
        input.style.backgroundColor = '#fff';
        input.style.border = '1px solid #ccc';
        input.style.padding = '6px 4px';
        input.style.height = 'auto';
        input.style.minHeight = '30px';
        input.style.lineHeight = '1.4';
        input.style.overflow = 'visible';
        input.style.webkitTextFillColor = '#000';
        input.style.boxSizing = 'border-box';
        input.style.position = 'relative';
        input.style.display = 'block';
        input.style.whiteSpace = 'pre-wrap';
        input.style.verticalAlign = 'middle';
        input.style.textAlign = 'left';
        input.style.transform = 'translateZ(0)';
        input.style.webkitTransform = 'translateZ(0)';
        input.style.backfaceVisibility = 'hidden';
        input.style.webkitBackfaceVisibility = 'hidden';
      });

      try {
        const canvas = await html2canvas(section, {
          scale: 1.2,
          useCORS: true,
          logging: true,
          letterRendering: true,
          backgroundColor: '#ffffff',
          height: section.scrollHeight,
          windowHeight: section.scrollHeight,
          onclone: (clonedDoc) => {
            const style = clonedDoc.createElement('style');
            style.textContent = `
              * {
                font-family: Arial, sans-serif !important;
                font-size: 11pt !important;
              }
              input, textarea {
                border: 1px solid #ccc !important;
                background: white !important;
                font-size: 11pt !important;
                padding: 6px 4px !important;
                height: auto !important;
                min-height: 30px !important;
                width: 100% !important;
                color: #000 !important;
                -webkit-text-fill-color: #000 !important;
                line-height: 1.4 !important;
                overflow: visible !important;
                box-sizing: border-box !important;
                position: relative !important;
                display: block !important;
                white-space: pre-wrap !important;
                vertical-align: middle !important;
                text-align: left !important;
                transform: translateZ(0) !important;
                -webkit-transform: translateZ(0) !important;
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
              }
              input::placeholder,
              textarea::placeholder {
                color: transparent !important;
                opacity: 0 !important;
              }
              .section-title {
                font-weight: bold !important;
                font-size: 1.3rem !important;
                color: #000 !important;
                margin-bottom: 0.8rem !important;
                page-break-after: avoid !important;
              }
              h4.text-lg.font-semibold {
                font-weight: bold !important;
                font-size: 1.1rem !important;
                color: #000 !important;
                margin-bottom: 0.6rem !important;
                page-break-after: avoid !important;
              }
              .logo-container {
                display: none !important;
              }
              .title-container {
                width: 100% !important;
                text-align: center !important;
                margin-bottom: 1.5rem !important;
                padding-top: 20px !important;
                page-break-after: avoid !important;
              }
              .title-container h2 {
                font-size: 2.2rem !important;
                font-family: Arial !important;
                margin: 0 !important;
                padding: 0.8rem 0 !important;
                color: #000 !important;
                text-transform: uppercase !important;
              }
              .grid-row {
                margin-bottom: 0.8rem !important;
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
                gap: 10px !important;
                page-break-inside: avoid !important;
              }
              .input-container {
                margin-bottom: 0.8rem !important;
                page-break-inside: avoid !important;
              }
              .firma-container {
                margin-top: 1.5rem !important;
                padding: 1.2rem !important;
                page-break-before: always !important;
              }
              #section-7-8 {
                min-height: 800px !important;
              }
              ::placeholder {
                color: transparent !important;
                opacity: 0 !important;
              }
              label {
                font-size: 11pt !important;
                margin-bottom: 0.4rem !important;
                display: block !important;
                color: #000 !important;
              }
              .grid {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
                gap: 10px !important;
                page-break-inside: avoid !important;
              }
              #section-1-2 {
                padding-top: 0 !important;
              }
              #section-3-4 {
                min-height: 800px !important;
              }
              #section-5-6 {
                min-height: 800px !important;
              }
            `;
            clonedDoc.head.appendChild(style);

            // Asegurar que el título esté presente en la primera sección
            if (sectionId === 'section-1-2') {
              const titleContainer = clonedDoc.querySelector('.title-container');
              if (!titleContainer) {
                const newTitleContainer = clonedDoc.createElement('div');
                newTitleContainer.className = 'title-container';
                newTitleContainer.innerHTML = '<h2>Ficha de Ingreso - Vuelta Canela</h2>';
                section.insertBefore(newTitleContainer, section.firstChild);
              }
            }
          }
        });

        return canvas;
      } catch (error) {
        console.error(`Error al capturar la sección ${sectionId}:`, error);
        return null;
      }
    };

    // Procesar cada sección
    const processSections = async () => {
      for (let i = 0; i < sections.length; i++) {
        const sectionId = sections[i];
        const canvas = await captureSection(sectionId);
        
        if (canvas) {
          const imgData = canvas.toDataURL("image/png", 1.0);
          
          // Dimensiones de página carta
          const pageWidth = 215.9; // mm
          const pageHeight = 279.4; // mm
          const margin = 10; // Márgenes optimizados para impresión

          // Calcular dimensiones manteniendo la proporción
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Agregar nueva página si no es la primera sección
          if (i > 0) {
            pdf.addPage();
          }

          // Ajustar la altura de la imagen si es necesario
          let adjustedHeight = imgHeight;
          const maxHeight = pageHeight - (margin * 2);
          
          if (adjustedHeight > maxHeight) {
            // Si la altura excede el máximo, ajustar la escala
            const scale = maxHeight / adjustedHeight;
            adjustedHeight = maxHeight;
            const adjustedWidth = imgWidth * scale;
            
            // Centrar la imagen en la página
            const xOffset = (pageWidth - adjustedWidth) / 2;
            
            pdf.addImage(
              imgData,
              "PNG",
              xOffset,
              margin,
              adjustedWidth,
              adjustedHeight,
              undefined,
              'FAST'
            );
          } else {
            // Si la altura es menor que el máximo, centrar verticalmente
            const yOffset = (pageHeight - adjustedHeight) / 2;
            
            pdf.addImage(
              imgData,
              "PNG",
              margin,
              yOffset,
              imgWidth,
              adjustedHeight,
              undefined,
              'FAST'
            );
          }
        }
      }

      // Guardar el PDF
      const nombreArchivo = `Ficha de Ingreso Vuelta Canela - ${formData.nombres} ${formData.apellidos}.pdf`;
      pdf.save(nombreArchivo);
    };

    // Iniciar el proceso
    processSections().catch(error => {
      console.error("Error al generar el PDF:", error);
    });
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
    };

    // Validar al menos un contacto de emergencia completo
    if (!formData.contactoEmergenciaUnoNombre || 
        !formData.contactoEmergenciaUnoApellido || 
        !formData.contactoEmergenciaUnoMovil || 
        !formData.contactoEmergenciaUnoParentesco) {
      newErrors.contactoEmergenciaUno = "Debe ingresar todos los datos del primer contacto de emergencia";
    }

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
      <form onSubmit={handleSubmit} className="w-full" style={{ position: 'relative', zIndex: 2 }}>
        {/* Sección 1 y 2: Identificación del niño/a e Información de salud */}
        <div id="section-1-2" className="mb-8">
          <div className="logo-container">
            <img 
              src="/logo2.jpg" 
              alt="Logo Vuelta Canela" 
            />
          </div>
          <div className="title-container">
            <h2>Ficha de Ingreso - Vuelta Canela</h2>
          </div>
          <h3 className="section-title bg-salmon-pastel">1.- Identificación del niño(a)</h3>
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
          <h3 className="section-title bg-verde-pastel">2.- Información de salud</h3>
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
          <h3 className="section-title bg-naranjo-pastel">3.- Contactos en caso de urgencias</h3>
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
            label="En caso de accidente grave, autorizo al Jardín a trasladar a mi hijo:"
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

          <h3 className="section-title bg-celeste-pastel">4.- Domicilio del niño(a)</h3>
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
          <h3 className="section-title bg-azul-pastel">5.- Apoderado</h3>
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

          <h3 className="section-title bg-azul-pastel">6.- Identificación de familiar</h3>
          
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
        </div>

        {/* Sección 7 y 8: Apoderado e Identificación de familiar */}
        <div id="section-7-8" className="mb-8" style={{ minHeight: '500px', position: 'relative' }}>
          <h3 className="section-title bg-gris-pastel">7.- Personas autorizadas a retirar al menor del Jardín</h3>
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

          <h3 className="section-title bg-salmon-pastel">8.- Autorización para el uso de imágenes</h3>
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
              de Jardin Infantil Vuelta Canela Co SpA, RUT: 76.443.772-1, para los "post" o similares
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
          <div className="firma-container" style={{ marginTop: '40px', width: '100%', padding: '0 20px' }}>
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