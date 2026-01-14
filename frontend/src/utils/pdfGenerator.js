import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Formatea una fecha a formato español
 */
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formatea un número como moneda
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Genera el PDF de una cotización
 */
export const generateQuotationPDF = async (quotation, companyConfig) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let currentY = 20;

  // Datos de la empresa desde configuración
  const companyName = companyConfig?.companyName || 'IPTEGRA SAS';
  const companyType = companyConfig?.companyType || 'PERSONA JURIDICA';
  const companyNit = companyConfig?.companyNit || 'NIT: 900586103-1';
  const companyAddress = companyConfig?.companyAddress || 'Calle 70 A # 7-30';
  const companyCity = companyConfig?.companyCity || 'Bogotá D.C., Colombia';
  const companyPhone = companyConfig?.companyPhone || 'Tel: +57 (1) 234-5678';
  const companyWebsite = companyConfig?.companyWebsite || 'www.iptegra.com';

  // ============================================
  // HEADER - Logo y Datos de Empresa
  // ============================================

  // Logo (si existe) - parte superior derecha con aspect ratio correcto
  if (companyConfig?.logo?.url) {
    try {
      // Obtener propiedades de la imagen desde jsPDF
      const imgProps = doc.getImageProperties(companyConfig.logo.url);

      // Calcular dimensiones manteniendo aspect ratio
      const maxWidth = 50;
      const maxHeight = 28;
      const aspectRatio = imgProps.width / imgProps.height;

      let imgWidth, imgHeight;

      if (aspectRatio > maxWidth / maxHeight) {
        // Imagen más ancha - limitar por ancho
        imgWidth = maxWidth;
        imgHeight = maxWidth / aspectRatio;
      } else {
        // Imagen más alta - limitar por altura
        imgHeight = maxHeight;
        imgWidth = maxHeight * aspectRatio;
      }

      const imgX = pageWidth - margin - imgWidth;
      doc.addImage(companyConfig.logo.url, 'PNG', imgX, currentY, imgWidth, imgHeight);
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  }

  // Datos de la empresa (izquierda)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, margin, currentY);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  currentY += 5;
  doc.text(companyType, margin, currentY);
  currentY += 5;
  doc.text(companyNit, margin, currentY);
  currentY += 5;
  doc.text(companyAddress, margin, currentY);
  currentY += 5;
  doc.text(companyCity, margin, currentY);
  currentY += 5;
  doc.text(companyPhone, margin, currentY);
  currentY += 5;
  doc.text(companyWebsite, margin, currentY);

  currentY += 15;

  // ============================================
  // TÍTULO - COTIZACIÓN
  // ============================================

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const title = `COTIZACION ${quotation.quotationNumber}`;
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, currentY);

  currentY += 10;

  // Línea separadora
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 10;

  // ============================================
  // INFORMACIÓN DEL CLIENTE Y COTIZACIÓN
  // ============================================

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');

  // Columna izquierda - Cliente
  let leftColX = margin;
  let rightColX = pageWidth / 2 + 10;
  let infoY = currentY;

  doc.text('FECHA:', leftColX, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(quotation.createdAt), leftColX + 25, infoY);
  infoY += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('CLIENTE:', leftColX, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(quotation.client?.name || quotation.clientName || '', leftColX + 25, infoY);
  infoY += 6;

  if (quotation.client?.nit) {
    doc.setFont('helvetica', 'bold');
    doc.text('NIT:', leftColX, infoY);
    doc.setFont('helvetica', 'normal');
    doc.text(quotation.client.nit, leftColX + 25, infoY);
    infoY += 6;
  }

  if (quotation.client?.contactPerson) {
    doc.setFont('helvetica', 'bold');
    doc.text('CONTACTO:', leftColX, infoY);
    doc.setFont('helvetica', 'normal');
    doc.text(quotation.client.contactPerson, leftColX + 25, infoY);
    infoY += 6;
  }

  // Columna derecha - Datos de cotización
  infoY = currentY;

  doc.setFont('helvetica', 'bold');
  doc.text('VALIDEZ:', rightColX, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(quotation.validUntil ? formatDate(quotation.validUntil) : 'N/A', rightColX + 25, infoY);
  infoY += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('MONEDA:', rightColX, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(quotation.currency, rightColX + 25, infoY);
  infoY += 6;

  if (quotation.deliveryTime) {
    doc.setFont('helvetica', 'bold');
    doc.text('ENTREGA:', rightColX, infoY);
    doc.setFont('helvetica', 'normal');
    doc.text(quotation.deliveryTime, rightColX + 25, infoY);
    infoY += 6;
  }

  if (quotation.warranty) {
    doc.setFont('helvetica', 'bold');
    doc.text('GARANTÍA:', rightColX, infoY);
    doc.setFont('helvetica', 'normal');
    doc.text(quotation.warranty, rightColX + 25, infoY);
  }

  currentY = Math.max(currentY, infoY) + 10;

  // ============================================
  // TABLA DE ITEMS
  // ============================================

  const tableHeaders = [
    'ÍTEM',
    'DESCRIPCIÓN',
    'RECURRENCIA',
    'CANT.',
    'VALOR UNIT.',
    'DESC.',
    'TOTAL'
  ];

  const tableData = quotation.quotationItems?.map((item, index) => {
    const productName = item.product?.name || item.productName || 'N/A';
    const description = item.description || productName;
    const recurrence = item.recurrence || 'ÚNICA';
    const quantity = item.quantity || 1;
    const unitPrice = formatCurrency(item.unitPrice, quotation.currency);
    const discount = item.discount ? `${item.discount}%` : '0%';
    const total = formatCurrency(item.total, quotation.currency);

    return [
      (index + 1).toString(),
      description,
      recurrence,
      quantity.toString(),
      unitPrice,
      discount,
      total
    ];
  }) || [];

  autoTable(doc, {
    startY: currentY,
    head: [tableHeaders],
    body: tableData,
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [200, 200, 200],
      lineWidth: 0.5,
      font: 'helvetica'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 7.5,
      cellPadding: { top: 4, right: 2, bottom: 4, left: 2 }
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 'auto' },  // ÍTEM
      1: { halign: 'left', cellWidth: 'auto' },    // DESCRIPCIÓN
      2: { halign: 'center', cellWidth: 'auto' },  // RECURRENCIA
      3: { halign: 'center', cellWidth: 'auto' },  // CANT.
      4: { halign: 'right', cellWidth: 'auto' },   // VALOR UNIT.
      5: { halign: 'center', cellWidth: 'auto' },  // DESC.
      6: { halign: 'right', cellWidth: 'auto' }    // TOTAL
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    },
    margin: { left: margin, right: margin },
    tableWidth: 'auto',
    didDrawCell: (data) => {
      // Dibujar solo líneas horizontales
      if (data.section === 'body' && data.row.index === data.table.body.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(
          data.cell.x,
          data.cell.y + data.cell.height,
          data.cell.x + data.cell.width,
          data.cell.y + data.cell.height
        );
      }
    },
    didParseCell: (data) => {
      // Remover bordes verticales
      if (data.section === 'body' || data.section === 'head') {
        data.cell.styles.lineWidth = { top: 0.5, right: 0, bottom: 0.5, left: 0 };
      }
    }
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // ============================================
  // TOTALES
  // ============================================

  // Alinear totales con columna TOTAL de la tabla
  const totalColumnX = pageWidth - margin; // Borde derecho de la tabla
  const labelColumnX = totalColumnX - 50; // Labels a la izquierda de los valores

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Subtotal
  doc.text('SUBTOTAL:', labelColumnX, currentY, { align: 'right' });
  doc.text(formatCurrency(quotation.subtotal, quotation.currency), totalColumnX, currentY, { align: 'right' });
  currentY += 6;

  // Descuento (si existe)
  if (quotation.discountAmount && quotation.discountAmount > 0) {
    doc.text('DESCUENTO:', labelColumnX, currentY, { align: 'right' });
    doc.text(`-${formatCurrency(quotation.discountAmount, quotation.currency)}`, totalColumnX, currentY, { align: 'right' });
    currentY += 6;
  }

  // IVA
  if (quotation.taxAmount && quotation.taxAmount > 0) {
    doc.text('IVA:', labelColumnX, currentY, { align: 'right' });
    doc.text(formatCurrency(quotation.taxAmount, quotation.currency), totalColumnX, currentY, { align: 'right' });
    currentY += 6;
  }

  // Línea separadora
  doc.setDrawColor(41, 128, 185);
  doc.setLineWidth(0.5);
  doc.line(labelColumnX - 10, currentY, totalColumnX, currentY);
  currentY += 5;

  // Total final
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', labelColumnX, currentY, { align: 'right' });
  doc.text(formatCurrency(quotation.totalAmount, quotation.currency), totalColumnX, currentY, { align: 'right' });

  currentY += 15;

  // ============================================
  // CONDICIONES COMERCIALES
  // ============================================

  if (quotation.paymentTerms) {
    // Verificar si hay espacio suficiente, si no, agregar nueva página
    if (currentY > pageHeight - 80) {
      doc.addPage();
      currentY = margin;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CONDICIONES COMERCIALES', margin, currentY);
    currentY += 7;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const terms = doc.splitTextToSize(quotation.paymentTerms, pageWidth - 2 * margin);
    doc.text(terms, margin, currentY);
    currentY += (terms.length * 4) + 5;
  }

  // ============================================
  // OBSERVACIONES
  // ============================================

  if (quotation.observations) {
    // Verificar espacio
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = margin;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVACIONES', margin, currentY);
    currentY += 7;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const observations = doc.splitTextToSize(quotation.observations, pageWidth - 2 * margin);
    doc.text(observations, margin, currentY);
    currentY += (observations.length * 4) + 5;
  }

  // ============================================
  // FIRMA
  // ============================================

  // Asegurar espacio para firma al final de la página
  const footerY = pageHeight - 40;

  if (currentY > footerY - 20) {
    doc.addPage();
    currentY = pageHeight - 60;
  } else {
    currentY = footerY;
  }

  // Nombre del firmante
  const signatureX = margin;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const signerName = companyConfig?.quotationSigner?.name || 'IPTEGRA SAS';
  doc.text(signerName, signatureX, currentY);
  currentY += 5;

  // Cargo del firmante
  doc.setFont('helvetica', 'normal');
  const signerPosition = companyConfig?.quotationSigner?.position || 'Gerente General';
  doc.text(signerPosition, signatureX, currentY);

  // Footer con información adicional
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    'Este documento fue generado y firmado electrónicamente por Nexus - IPTEGRA SAS',
    pageWidth / 2,
    pageHeight - 15,
    { align: 'center' }
  );

  return doc;
};

/**
 * Descarga el PDF de una cotización
 */
export const downloadQuotationPDF = async (quotation, companyConfig) => {
  try {
    const doc = await generateQuotationPDF(quotation, companyConfig);
    const fileName = `${quotation.quotationNumber}.pdf`;
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
