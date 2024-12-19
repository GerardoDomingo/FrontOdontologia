import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQ = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState(false);

  // System Theme Detection
  useEffect(() => {
    const matchDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkTheme(matchDarkTheme.matches);

    const handleThemeChange = (e) => {
      setIsDarkTheme(e.matches);
    };

    matchDarkTheme.addEventListener("change", handleThemeChange);

    return () => {
      matchDarkTheme.removeEventListener("change", handleThemeChange);
    };
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const faqs = [
    {
      question: "¿Qué tipos de tratamientos dentales ofrecen?",
      answer:
        "Ofrecemos una amplia gama de tratamientos que incluyen limpieza dental, blanqueamiento, ortodoncia, implantes dentales, tratamientos de conducto, coronas y puentes dentales.",
    },
    {
      question: "¿Cuánto tiempo dura una limpieza dental profesional?",
      answer:
        "Una limpieza dental profesional típicamente dura entre 45 minutos y una hora, dependiendo del estado de tu salud bucal y la cantidad de sarro acumulado.",
    },
    {
      question: "¿Con qué frecuencia debo visitar al dentista?",
      answer:
        "Recomendamos visitas de control y limpieza cada 6 meses. Sin embargo, si tienes problemas específicos, podríamos sugerir visitas más frecuentes.",
    },
    {
      question: "¿Atienden emergencias dentales?",
      answer:
        "Sí, ofrecemos servicio de emergencias dentales. Contamos con horarios flexibles y disponibilidad para atender casos urgentes como dolor severo, traumatismos o infecciones.",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos efectivo, tarjetas de crédito/débito, transferencias bancarias y ofrecemos planes de financiamiento para tratamientos extensos.",
    },
    {
      question: "¿Cuánto tiempo dura un tratamiento de ortodoncia?",
      answer:
        "La duración del tratamiento de ortodoncia varía según cada caso, pero generalmente puede durar entre 18 y 24 meses. Durante la consulta inicial, podemos darte un estimado más preciso.",
    },
  ];

  const backgroundStyle = {
    background: isDarkTheme
      ? "linear-gradient(135deg, #1a2a3a, #2A3A4A)"
      : "linear-gradient(135deg, #e6f2ff, #ffffff)",
    minHeight: "55vh",
    color: isDarkTheme ? "#ffffff" : "#333333",
    transition: "all 0.3s ease",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  };

  const cardStyle = {
    background: "lightblue",
    borderRadius: "12px",
    boxShadow: isDarkTheme
      ? "0 4px 6px rgba(0,0,0,0.5)"
      : "0 4px 6px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    margin: "0.5rem 0",
    width: "100%",
    maxWidth: "800px", // Ajusta el ancho máximo para que sea más ancho
  };

  const titleStyle = {
    marginBottom: "1.5rem",
    color: isDarkTheme ? "#90CAF9" : "#0077CC",
    fontSize: "1.75rem",
    fontWeight: "bold",
    textAlign: "center",
  };

  const accordionSummaryStyle = {
    fontSize: "1rem",
    fontWeight: 500,
  };

  const accordionDetailsStyle = {
    fontSize: "0.95rem",
    color: isDarkTheme ? "#333333" : "#555555", // Contraste para detalles
    lineHeight: 1.5,
  };

  return (
    <Box sx={backgroundStyle}>
      <Typography variant="h5" component="h1" sx={titleStyle}>
        Preguntas Frecuentes
      </Typography>

      {faqs.map((faq, index) => (
        <Accordion
          key={index}
          expanded={expandedPanel === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
          sx={cardStyle}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: isDarkTheme ? "#90CAF9" : "#0077CC" }} />}
            sx={accordionSummaryStyle}
          >
            {faq.question}
          </AccordionSummary>
          <AccordionDetails sx={accordionDetailsStyle}>
            {faq.answer}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQ;
