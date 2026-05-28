const medicosPorEspecialidad = {
    "clinica_general": ["Dr. Gomez, Carlos", "Dra. Lopez, Maria"],
    "cardiologia": ["Dr. Perez, Juan", "Dra. Torres, Ana"],
    "pediatria": ["Dra. Diaz, Laura", "Dr. Soto, Pablo"],
    "ginecologia": ["Dra. Romero, Valeria", "Dra. Castro, Elena"],
    "traumatologia": ["Dr. Ramos, Sergio", "Dr. Herrera, Diego"],
    "neurologia": ["Dr. Molina, Andres", "Dra. Vargas, Cecilia"]
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("turnoForm");
    
    // Campos condicionales e inputs
    const especialidadSelect = document.getElementById("especialidad");
    const medicoSelect = document.getElementById("medico");
    
    const modalidadSelect = document.getElementById("modalidad");
    const groupPlataforma = document.getElementById("groupPlataforma");
    const plataformaSelect = document.getElementById("plataforma");
    
    const coberturaSelect = document.getElementById("cobertura");
    const groupCredencialPlan = document.getElementById("groupCredencialPlan");
    const credencialInput = document.getElementById("credencial");
    const planInput = document.getElementById("plan");
    
    const primeraVisitaCheck = document.getElementById("primeraVisita");
    const groupComoNosConocio = document.getElementById("groupComoNosConocio");
    const comoNosConocioSelect = document.getElementById("comoNosConocio");
    
    const estudiosPreviosCheck = document.getElementById("estudiosPrevios");
    const groupDescripcionEstudios = document.getElementById("groupDescripcionEstudios");
    const descripcionEstudiosInput = document.getElementById("descripcionEstudios");

    // ===== LÓGICA DE CAMPOS CONDICIONALES =====

    especialidadSelect.addEventListener("change", (e) => {
        const especialidad = e.target.value;
        medicoSelect.innerHTML = '<option value="">Seleccione un médico...</option>';
        
        if (especialidad && medicosPorEspecialidad[especialidad]) {
            medicoSelect.disabled = false;
            medicosPorEspecialidad[especialidad].forEach(medico => {
                const option = document.createElement("option");
                option.value = medico;
                option.textContent = medico;
                medicoSelect.appendChild(option);
            });
        } else {
            medicoSelect.disabled = true;
            medicoSelect.innerHTML = '<option value="">Seleccione primero una especialidad...</option>';
        }
    });

    modalidadSelect.addEventListener("change", (e) => {
        if (e.target.value === "videoconsulta") {
            groupPlataforma.classList.remove("hidden");
        } else {
            groupPlataforma.classList.add("hidden");
            plataformaSelect.value = ""; // reset
        }
    });

    coberturaSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val && val !== "particular") {
            groupCredencialPlan.classList.remove("hidden");
        } else {
            groupCredencialPlan.classList.add("hidden");
            credencialInput.value = "";
            planInput.value = "";
        }
    });

    primeraVisitaCheck.addEventListener("change", (e) => {
        if (e.target.checked) {
            groupComoNosConocio.classList.remove("hidden");
        } else {
            groupComoNosConocio.classList.add("hidden");
            comoNosConocioSelect.value = "";
        }
    });

    estudiosPreviosCheck.addEventListener("change", (e) => {
        if (e.target.checked) {
            groupDescripcionEstudios.classList.remove("hidden");
        } else {
            groupDescripcionEstudios.classList.add("hidden");
            descripcionEstudiosInput.value = "";
        }
    });

    // ===== LÓGICA DE VALIDACIÓN =====

    const showError = (input, message) => {
        input.classList.remove("campo-ok");
        input.classList.add("campo-error");
        
        let errorSpan = input.parentNode.querySelector('.mensaje-error');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'mensaje-error';
            input.parentNode.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
    };

    const showSuccess = (input) => {
        input.classList.remove("campo-error");
        input.classList.add("campo-ok");
        
        const errorSpan = input.parentNode.querySelector('.mensaje-error');
        if (errorSpan) {
            errorSpan.remove();
        }
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let esValido = true;
        let primerErrorInput = null;

        const checkValidity = (input, condition, errorMsg) => {
            if (!condition) {
                showError(input, errorMsg);
                esValido = false;
                if (!primerErrorInput) primerErrorInput = input;
            } else {
                showSuccess(input);
            }
        };

        // 1. Nombre y Apellido
        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const nombreInput = document.getElementById("nombre");
        checkValidity(nombreInput, nombreInput.value.trim() !== "" && nombreRegex.test(nombreInput.value), "Ingrese un nombre válido (solo letras).");
        
        const apellidoInput = document.getElementById("apellido");
        checkValidity(apellidoInput, apellidoInput.value.trim() !== "" && nombreRegex.test(apellidoInput.value), "Ingrese un apellido válido (solo letras).");

        // 2. DNI
        const dniRegex = /^\d{7,8}$/;
        const dniInput = document.getElementById("dni");
        checkValidity(dniInput, dniRegex.test(dniInput.value.trim()), "El DNI debe tener entre 7 y 8 números.");

        // 3. Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInput = document.getElementById("email");
        checkValidity(emailInput, emailRegex.test(emailInput.value.trim()), "Ingrese un correo electrónico válido.");

        // 4. Teléfono
        const telefonoRegex = /^[\d\+\-\s]{8,}$/;
        const telefonoInput = document.getElementById("telefono");
        checkValidity(telefonoInput, telefonoRegex.test(telefonoInput.value.trim()), "Ingrese un teléfono válido (min. 8 dígitos).");

        // 5. Fecha de Nacimiento
        const fechaNacInput = document.getElementById("fechaNacimiento");
        let validEdad = false;
        if (fechaNacInput.value) {
            const nacDate = new Date(fechaNacInput.value);
            const today = new Date();
            let age = today.getFullYear() - nacDate.getFullYear();
            const m = today.getMonth() - nacDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < nacDate.getDate())) {
                age--;
            }
            if (nacDate <= today && age >= 0 && age <= 120) {
                validEdad = true;
            }
        }
        checkValidity(fechaNacInput, validEdad, "Ingrese una fecha válida (edad entre 0 y 120 años).");

        // 6. Especialidad y Médico
        checkValidity(especialidadSelect, especialidadSelect.value !== "", "Seleccione una especialidad.");
        if (especialidadSelect.value !== "") {
            checkValidity(medicoSelect, medicoSelect.value !== "", "Seleccione un médico.");
        } else {
            // Remueve errores si especialidad está vacia para no encimar
            showSuccess(medicoSelect); 
        }

        // Tipo de Consulta
        const tipoConsultaInput = document.getElementById("tipoConsulta");
        checkValidity(tipoConsultaInput, tipoConsultaInput.value !== "", "Seleccione el tipo de consulta.");

        // 7. Fecha y Hora Turno
        const fechaTurnoInput = document.getElementById("fechaTurno");
        let validFechaTurno = false;
        if (fechaTurnoInput.value) {
            const turnoDate = new Date(fechaTurnoInput.value + "T00:00:00"); // Avoid timezone shift
            const today = new Date();
            const minDate = new Date(today.getTime() + (24 * 60 * 60 * 1000)); // 24hs anticipación
            const dayOfWeek = turnoDate.getDay(); // 0(Dom) a 6(Sab)
            
            if (turnoDate.getTime() >= minDate.getTime() && dayOfWeek !== 0 && dayOfWeek !== 6) {
                validFechaTurno = true;
            }
        }
        checkValidity(fechaTurnoInput, validFechaTurno, "Debe ser de lunes a viernes con al menos 24hs de anticipación.");

        const horaTurnoInput = document.getElementById("horaTurno");
        let validHoraTurno = false;
        if (horaTurnoInput.value) {
            const [hours, minutes] = horaTurnoInput.value.split(":").map(Number);
            if (hours >= 8 && (hours < 20 || (hours === 20 && minutes === 0))) {
                validHoraTurno = true;
            }
        }
        checkValidity(horaTurnoInput, validHoraTurno, "El horario de atención es de 08:00 a 20:00 hs.");

        // 8. Modalidad y Plataforma
        checkValidity(modalidadSelect, modalidadSelect.value !== "", "Seleccione una modalidad.");
        if (modalidadSelect.value === "videoconsulta") {
            checkValidity(plataformaSelect, plataformaSelect.value !== "", "Seleccione una plataforma preferida.");
        } else {
            showSuccess(plataformaSelect); 
        }

        // 9. Cobertura
        checkValidity(coberturaSelect, coberturaSelect.value !== "", "Seleccione una cobertura médica.");
        if (coberturaSelect.value !== "" && coberturaSelect.value !== "particular") {
            checkValidity(credencialInput, credencialInput.value.trim().length >= 5, "El número de credencial debe tener al menos 5 caracteres.");
            checkValidity(planInput, planInput.value.trim() !== "", "Ingrese el plan de su cobertura.");
        } else {
            showSuccess(credencialInput);
            showSuccess(planInput);
        }

        // 10. Información Adicional
        if (primeraVisitaCheck.checked) {
            checkValidity(comoNosConocioSelect, comoNosConocioSelect.value !== "", "Seleccione una opción.");
        } else {
            showSuccess(comoNosConocioSelect);
        }

        const motivoConsultaInput = document.getElementById("motivoConsulta");
        checkValidity(motivoConsultaInput, motivoConsultaInput.value.trim().length >= 20, "El motivo debe tener al menos 20 caracteres.");

        if (estudiosPreviosCheck.checked) {
            checkValidity(descripcionEstudiosInput, descripcionEstudiosInput.value.trim().length >= 20, "La descripción debe tener al menos 20 caracteres.");
        } else {
            showSuccess(descripcionEstudiosInput);
        }

        // RESULTADO FINAL
        if (!esValido && primerErrorInput) {
            primerErrorInput.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (esValido) {
            const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digits
            const turnoID = `TURN-${randomNum}`;
            const nombreCompleto = `${nombreInput.value} ${apellidoInput.value}`;
            
            const mainContainer = document.querySelector(".form-container");
            mainContainer.innerHTML = `
                <div class="success-message">
                    <h2>¡Turno Solicitado con Éxito!</h2>
                    <p><strong>Paciente:</strong> ${nombreCompleto}</p>
                    <p><strong>Especialidad:</strong> ${especialidadSelect.options[especialidadSelect.selectedIndex].text}</p>
                    <p><strong>Médico:</strong> ${medicoSelect.value}</p>
                    <p><strong>Fecha:</strong> ${fechaTurnoInput.value}</p>
                    <p><strong>Hora:</strong> ${horaTurnoInput.value} hs</p>
                    <h3 style="margin-top: 15px; color: var(--primary-color);">Nro de Turno: ${turnoID}</h3>
                    <br>
                    <a href="turnos.html" class="btn-primary" style="display:inline-block;">Solicitar otro turno</a>
                </div>
            `;
        }
    });
});
