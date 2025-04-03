import React, { useState, useCallback, memo, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Componente InputField memoizado
const InputField = memo(({ label, name, value, onChange, placeholder, type = "text", error, inputRef }) => {
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
        />
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
    contactoEmergenciaUno: "",
    contactoEmergenciaDos: "",
    contactoEmergenciaTres: "",
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
        backgroundImage: 'url("/fondo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
          <h3 className="text-xl font-semibold text-gray-700 mb-4">1.- Identificación del niño/a</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-4">
              <InputField
                label="Apellidos (ambos)"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Ingrese los apellidos"
                error={errors.apellidos}
                inputRef={apellidosRef}
              />
              <InputField
                label="Cédula de Identidad"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="Ejemplo: 12.345.678-9"
                error={errors.cedula}
                inputRef={cedulaRef}
              />
              <InputField
                label="Sala"
                name="sala"
                value={formData.sala}
                onChange={handleChange}
                placeholder="Nombre de sala"
                error={errors.sala}
                inputRef={salaRef}
              />
              <InputField
                label="Fecha de Nacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                type="date"
                error={errors.fechaNacimiento}
                inputRef={fechaNacimientoRef}
              />
            </div>
            <div className="flex flex-col space-y-4">
              <InputField
                label="Nombre completo"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Ingrese los nombres"
                error={errors.nombres}
                inputRef={nombresRef}
              />
              <InputField
                label="País"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                error={errors.pais}
                inputRef={paisRef}
                placeholder="Ingrese país de nacimiento del niño"
              />
              <InputField
                label="Nivel al que postula"
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                placeholder="Nivel al que postula"
                error={errors.nivel}
                inputRef={nivelRef}
              />
              <InputField
                label="Fecha de ingreso"
                name="fechaIngreso"
                value={formData.fechaIngreso}
                onChange={handleChange}
                type="date"
                error={errors.fechaIngreso}
                inputRef={fechaIngresoRef}
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">2.- Información de salud</h3>
          <div className="border border-gray-400 bg-gray-100 p-4 rounded-md text-gray-700 shadow-md mb-4">
            <p className="mb-4">
              En caso de que no presente algún tipo de condición de salud, alergias o uso de remedios, RESPONDER NO en los campos &apos;obligatorios&apos;
            </p>
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
            />
            <InputField
              label="¿El niño/a tiene algún tipo de alergia - nasal, digestiva, respiratoria?"
              name="alergias"
              value={formData.alergias}
              onChange={handleChange}
              type="textarea"
              error={errors.alergias}
              inputRef={alergiasRef}
            />
            <InputField
              label="¿Toma remedios? En caso de ser afirmativo, deberá presentar receta y/o informe del pediatra o profesional afín."
              name="medicacion"
              value={formData.medicacion}
              onChange={handleChange}
              type="textarea"
              error={errors.medicacion}
              inputRef={medicacionRef}
            />
            <InputField
              label="Otra información complementaria que desee agregar:"
              name="otraInformacionSalud"
              value={formData.otraInformacionSalud}
              onChange={handleChange}
              type="textarea"
            />
          </div>
        </div>

        {/* Sección 3 y 4: Información en caso de urgencias y Domicilio */}
        <div id="section-3-4" className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">3.- Información en caso de urgencias</h3>
          <label className="block text-gray-700 font-semibold mb-2">Contactos de Emergencia - Por favor, ingresar minimo un contacto de emergencia</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Contacto de Emergencia 1"
              name="contactoEmergenciaUno"
              value={formData.contactoEmergenciaUno}
              onChange={handleChange}
              placeholder="+56 9"
              error={errors.contactoEmergenciaUno}
              inputRef={contactoEmergenciaUnoRef}
            />
            <InputField
              label="Contacto de Emergencia 2"
              name="contactoEmergenciaDos"
              value={formData.contactoEmergenciaDos}
              onChange={handleChange}
              placeholder="+56 9"
              error={errors.contactoEmergenciaDos}
              inputRef={contactoEmergenciaDosRef}
            />
            <InputField
              label="Contacto de Emergencia 3"
              name="contactoEmergenciaTres"
              value={formData.contactoEmergenciaTres}
              onChange={handleChange}
              placeholder="+56 9"
              error={errors.contactoEmergenciaTres}
              inputRef={contactoEmergenciaTresRef}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InputField
              label="En caso de accidente grave, autorizo al Jardín a trasladar a mi hijo a:"
              name="lugarTraslado"
              value={formData.lugarTraslado}
              onChange={handleChange}
              placeholder="Detallar el lugar de su preferencia y dirección."
              type="textarea"
            />
            <InputField
              label="Seguro de salud"
              name="seguroSalud"
              value={formData.seguroSalud}
              onChange={handleChange}
              placeholder="Nombre y detalles del seguro"
              type="textarea"
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">4.- Domicilio del niño/a</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <InputField
                label="Calle"
                name="calleDomicilio"
                value={formData.calleDomicilio}
                onChange={handleChange}
                placeholder="Ingrese calle del domicilio"
                error={errors.calleDomicilio}
                inputRef={calleDomicilioRef}
              />
              <InputField
                label="N°"
                name="nDomicilio"
                value={formData.nDomicilio}
                onChange={handleChange}
                placeholder="Ingrese N° del domicilio"
                error={errors.nDomicilio}
                inputRef={nDomicilioRef}
              />
              <InputField
                label="Casa/Depto"
                name="casaDeptoDomicilio"
                value={formData.casaDeptoDomicilio}
                onChange={handleChange}
                placeholder="Ingrese casa/depto del domicilio"
                error={errors.casaDeptoDomicilio}
                inputRef={casaDeptoDomicilioRef}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <InputField
                label="Block/Torre"
                name="blockTorreDomicilio"
                value={formData.blockTorreDomicilio}
                onChange={handleChange}
                placeholder="Ingrese block/torre del domicilio"
              />
              <InputField
                label="Comuna"
                name="comunaDomicilio"
                value={formData.comunaDomicilio}
                onChange={handleChange}
                placeholder="Ingrese comuna del domicilio"
                error={errors.comunaDomicilio}
                inputRef={comunaDomicilioRef}
              />
              <InputField
                label="Otro"
                name="otroDomicilio"
                value={formData.otroDomicilio}
                onChange={handleChange}
                placeholder="Especifique"
              />
            </div>
          </div>
        </div>

        {/* Sección 5 y 6: Apoderado e Identificación de familiar */}
        <div id="section-5-6" className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">5.- Apoderado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField
              label="Apellidos (ambos)"
              name="apoderadoApellidos"
              value={formData.apoderadoApellidos}
              onChange={handleChange}
              placeholder="Ingrese los apellidos"
              error={errors.apoderadoApellidos}
              inputRef={apoderadoApellidosRef}
            />
            <InputField
              label="Nombre completo"
              name="apoderadoNombres"
              value={formData.apoderadoNombres}
              onChange={handleChange}
              placeholder="Ingrese los nombres"
              error={errors.apoderadoNombres}
              inputRef={apoderadoNombresRef}
            />
            <InputField
              label="Cédula de Identidad"
              name="apoderadoCedula"
              value={formData.apoderadoCedula}
              onChange={handleChange}
              placeholder="Ejemplo: 12.345.678-9"
              error={errors.apoderadoCedula}
              inputRef={apoderadoCedulaRef}
            />
            <InputField
              label="Ocupación"
              name="apoderadoOcupacion"
              value={formData.apoderadoOcupacion}
              onChange={handleChange}
              placeholder="Ingrese la ocupación"
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
            />
            <InputField
              label="Móvil"
              name="apoderadoMovil"
              value={formData.apoderadoMovil}
              onChange={handleChange}
              placeholder="+56 9"
              error={errors.apoderadoMovil}
              inputRef={apoderadoMovilRef}
            />
            <InputField
              label="Teléfono trabajo"
              name="apoderadoTelefonoTrabajo"
              value={formData.apoderadoTelefonoTrabajo}
              onChange={handleChange}
              placeholder="Ingrese el teléfono del trabajo"
            />
            <InputField
              label="Otro"
              name="otroApoderado"
              value={formData.otroApoderado}
              onChange={handleChange}
              placeholder="Ingrese otra información"
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">6.- Identificación de familiar</h3>
          
          {/* Mamá */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Mamá</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField
                label="Apellidos (ambos)"
                name="apellidosMama"
                value={formData.apellidosMama}
                onChange={handleChange}
                placeholder="Ingrese los apellidos"
              />
              <InputField
                label="Nombre completo"
                name="nombresMama"
                value={formData.nombresMama}
                onChange={handleChange}
                placeholder="Ingrese los nombres"
              />
              <InputField
                label="Cédula de Identidad"
                name="cedulaMama"
                value={formData.cedulaMama}
                onChange={handleChange}
                placeholder="Ejemplo: 12.345.678-9"
              />
              <InputField
                label="Ocupación"
                name="ocupacionMama"
                value={formData.ocupacionMama}
                onChange={handleChange}
                placeholder="Ingrese la ocupación"
              />
              <InputField
                label="Correo electrónico"
                name="correoMama"
                value={formData.correoMama}
                onChange={handleChange}
                type="email"
                placeholder="Ingrese su correo"
              />
              <InputField
                label="Móvil"
                name="movilMama"
                value={formData.movilMama}
                onChange={handleChange}
                placeholder="+56 9"
              />
            </div>
          </div>

          {/* Papá */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Papá</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField
                label="Apellidos (ambos)"
                name="apellidosPapa"
                value={formData.apellidosPapa}
                onChange={handleChange}
                placeholder="Ingrese los apellidos"
              />
              <InputField
                label="Nombre completo"
                name="nombresPapa"
                value={formData.nombresPapa}
                onChange={handleChange}
                placeholder="Ingrese los nombres"
              />
              <InputField
                label="Cédula de Identidad"
                name="cedulaPapa"
                value={formData.cedulaPapa}
                onChange={handleChange}
                placeholder="Ejemplo: 12.345.678-9"
              />
              <InputField
                label="Ocupación"
                name="ocupacionPapa"
                value={formData.ocupacionPapa}
                onChange={handleChange}
                placeholder="Ingrese la ocupación"
              />
              <InputField
                label="Correo electrónico"
                name="correoPapa"
                value={formData.correoPapa}
                onChange={handleChange}
                type="email"
                placeholder="Ingrese su correo"
              />
              <InputField
                label="Móvil"
                name="movilPapa"
                value={formData.movilPapa}
                onChange={handleChange}
                placeholder="+56 9"
              />
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