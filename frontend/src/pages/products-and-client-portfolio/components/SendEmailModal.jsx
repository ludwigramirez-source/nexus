import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { generateQuotationPDF } from '../../../utils/pdfGenerator';

const SendEmailModal = ({ isOpen, onClose, quotation, onSend, companyConfig }) => {
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && quotation) {
      // Pre-fill email data (but leave "to" field empty for user to fill)
      const quotationNumber = quotation.quotationNumber || '';

      setFormData({
        to: '',
        cc: '',
        bcc: '',
        subject: `Cotización ${quotationNumber} - IPTEGRA SAS`,
        body: `Estimado/a ${quotation.client?.name || quotation.clientName || 'cliente'},\n\nEs un placer enviarle nuestra cotización ${quotationNumber}.\n\nAdjunto encontrará el detalle de los productos y servicios cotizados.\n\nQuedamos atentos a cualquier consulta.\n\nCordialmente,\nIPTEGRA SAS`
      });
    }
  }, [isOpen, quotation]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.to) {
      alert('Debe ingresar al menos un destinatario');
      return;
    }

    if (!formData.subject) {
      alert('Debe ingresar un asunto');
      return;
    }

    try {
      setLoading(true);

      console.log('Generating PDF for quotation:', quotation.quotationNumber);
      console.log('Quotation data:', quotation);
      console.log('Quotation items:', quotation.quotationItems);
      console.log('Company config:', companyConfig);

      // Generate PDF
      const pdfDoc = await generateQuotationPDF(quotation, companyConfig);
      const pdfBlob = pdfDoc.output('blob');

      console.log('PDF Blob generated:', {
        size: pdfBlob.size,
        type: pdfBlob.type
      });

      // Convert PDF to base64
      const reader = new FileReader();
      const pdfBase64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
          console.log('PDF converted to base64, length:', base64data?.length);
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      const pdfBase64 = await pdfBase64Promise;

      const pdfAttachment = {
        filename: `${quotation.quotationNumber}.pdf`,
        content: pdfBase64
      };

      console.log('Sending email with PDF attachment:', {
        filename: pdfAttachment.filename,
        contentLength: pdfAttachment.content?.length
      });

      // Send email with PDF attachment
      await onSend({
        quotationId: quotation.id,
        ...formData,
        pdfAttachment
      });
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error al enviar el correo. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border shadow-elevation-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
            Enviar Cotización por Correo
          </h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
            className="h-8 w-8"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Cotización: {quotation?.quotationNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  El PDF de la cotización se adjuntará automáticamente al correo
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Para"
            type="email"
            value={formData.to}
            onChange={(e) => handleChange('to', e.target.value)}
            placeholder="cliente@ejemplo.com"
            required
            description="Email del destinatario principal"
          />

          <Input
            label="CC (Con Copia)"
            type="text"
            value={formData.cc}
            onChange={(e) => handleChange('cc', e.target.value)}
            placeholder="persona1@ejemplo.com, persona2@ejemplo.com"
            description="Emails separados por coma (opcional)"
          />

          <Input
            label="CCO (Con Copia Oculta)"
            type="text"
            value={formData.bcc}
            onChange={(e) => handleChange('bcc', e.target.value)}
            placeholder="oculto@ejemplo.com"
            description="Emails separados por coma (opcional)"
          />

          <Input
            label="Asunto"
            type="text"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Asunto del correo"
            required
          />

          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Mensaje <span className="text-destructive">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none"
              value={formData.body}
              onChange={(e) => handleChange('body', e.target.value)}
              placeholder="Escribe el mensaje del correo..."
              rows={10}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Send"
              iconPosition="left"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Cotización'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendEmailModal;
